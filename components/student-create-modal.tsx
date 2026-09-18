"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

type ClassOption = { id: string; name: string };

export default function StudentCreateModal({
  classes,
  isDemo,
  onClose,
  onCreated,
}: {
  classes: ClassOption[];
  isDemo: boolean;
  onClose: () => void;
  onCreated: (student: {
    id: string;
    name: string;
    username: string;
    cefr_level: string;
    class_id: string | null;
  }) => Promise<void> | void;
}) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "254912",
    cefr_level: "A1",
    class_id: classes[0]?.id ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);

    if (isDemo) {
      await onCreated({
        id: `demo-student-${Date.now()}`,
        name: form.name,
        username: form.username.toLowerCase(),
        cefr_level: form.cefr_level,
        class_id: form.class_id || null,
      });
      setBusy(false);
      onClose();
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      setBusy(false);
      return;
    }

    const { data, error: invokeError } = await supabase.functions.invoke("admin-create-student", {
      body: {
        name: form.name,
        username: form.username,
        password: form.password,
        cefr_level: form.cefr_level,
        class_id: form.class_id || null,
      },
    });

    if (invokeError || !data?.student) {
      let message = invokeError?.message || data?.error || "Could not create student.";
      const context = (invokeError as { context?: Response } | null)?.context;
      if (context) {
        try {
          const payload = await context.clone().json();
          if (payload?.error) message = payload.error;
        } catch {}
      }
      setError(message);
      setBusy(false);
      return;
    }

    await onCreated(data.student);
    setBusy(false);
    onClose();
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="builder-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="builder-head">
          <div>
            <div className="eyebrow">STUDENT ACCOUNT</div>
            <h2>Add a learner to English Loop.</h2>
          </div>
          <button className="icon-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <form className="builder-form" onSubmit={submit}>
          <div className="form-grid two">
            <label>
              <span>Student name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Naila Putri"
              />
            </label>
            <label>
              <span>Username</span>
              <input
                required
                minLength={3}
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                placeholder="naila"
              />
            </label>
          </div>

          <div className="form-grid three">
            <label>
              <span>CEFR level</span>
              <select
                value={form.cefr_level}
                onChange={(event) => setForm({ ...form, cefr_level: event.target.value })}
              >
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
              </select>
            </label>

            <label>
              <span>Class</span>
              <select
                value={form.class_id}
                onChange={(event) => setForm({ ...form, class_id: event.target.value })}
              >
                <option value="">No class yet</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Initial PIN</span>
              <input
                required
                type="password"
                inputMode="numeric"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value.replace(/\D/g, "").slice(0, 6) })}
                placeholder="6 digit PIN"
              />
            </label>
          </div>

          <div className="demo-hint">
            Students sign in with Username + 6-digit PIN. The default initial PIN for new accounts is 254912 and can be changed later.
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="builder-actions">
            <button className="btn btn-soft" type="button" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? <Loader2 className="spin" size={17} /> : <Plus size={17} />}
              {busy ? "Creating…" : "Create student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
