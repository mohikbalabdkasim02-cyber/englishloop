import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function readNamedKey(envName: string, fallbackName: string) {
  const raw = Deno.env.get(envName);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, string>;
      if (parsed.default) return parsed.default;
      const first = Object.values(parsed)[0];
      if (first) return first;
    } catch {}
  }
  return Deno.env.get(fallbackName) ?? "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const publishableKey = readNamedKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  const secretKey = readNamedKey("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
  const authorization = req.headers.get("Authorization");

  if (!supabaseUrl || !publishableKey || !secretKey || !authorization) {
    return json({ error: "Server authentication is not configured." }, 500);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return json({ error: "Unauthorized" }, 401);

  const { data: caller } = await userClient.from("profiles").select("role").eq("id", user.id).single();
  if (!caller || !["teacher", "admin"].includes(caller.role)) {
    return json({ error: "Only teachers or admins can create student accounts." }, 403);
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid JSON body." }, 400); }

  const name = String(body.name ?? "").trim();
  const username = String(body.username ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const classId = body.class_id ? String(body.class_id) : null;
  const level = String(body.cefr_level ?? "A1").toUpperCase();

  if (name.length < 2) return json({ error: "Student name is required." }, 400);
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) return json({ error: "Invalid username." }, 400);
  if (!/^\\d{6}$/.test(password)) return json({ error: "PIN must contain exactly 6 digits." }, 400);
  if (!["A1", "A2", "B1", "B2"].includes(level)) return json({ error: "Invalid CEFR level." }, 400);

  if (classId) {
    const { data: classRow } = await userClient.from("classes").select("id").eq("id", classId).maybeSingle();
    if (!classRow) return json({ error: "Class not found." }, 400);
  }

  const admin = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: `${username}@englishloop.local`,
    password,
    email_confirm: true,
    user_metadata: { name, username, cefr_level: level },
    app_metadata: { role: "student" },
  });

  if (createError || !created.user) {
    return json({ error: createError?.message ?? "Could not create student." }, 400);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ class_id: classId, cefr_level: level, name, username })
    .eq("id", created.user.id);

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return json({ error: "Student account could not be linked to the class." }, 500);
  }

  return json({
    ok: true,
    student: { id: created.user.id, name, username, cefr_level: level, class_id: classId },
  }, 201);
});
