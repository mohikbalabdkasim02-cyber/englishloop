"use client";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Flame,
  GraduationCap,
  Headphones,
  Home,
  Library,
  ListChecks,
  Loader2,
  LogOut,
  Menu,
  MessageSquareText,
  Mic,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Sparkles,
  Square,
  Trash2,
  Trophy,
  User,
  Users,
  Video,
  Volume2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import {
  demoActivities,
  demoContents,
  demoQuestions,
  demoStudents,
  demoSubmissions,
  type ActivityItem,
  type ContentItem,
  type QuestionItem,
} from "@/lib/demo-data";

type Profile = {
  id: string;
  name: string;
  username?: string | null;
  role: "student" | "teacher" | "admin";
  class_id?: string | null;
  cefr_level: string;
};

type AppMode = "landing" | "student" | "teacher";
type StudentView = "home" | "explore" | "speak" | "progress" | "profile";
type TeacherView = "dashboard" | "students" | "content" | "activities" | "submissions" | "progress" | "settings";

type ResponseRow = {
  id: string;
  student_id: string;
  activity_id: string;
  answers?: Record<string, string>;
  confidence?: number | null;
  difficulty?: string | null;
  reflection_note?: string | null;
  status: string;
  submitted_at?: string | null;
};

type SpeakingRow = {
  id: string;
  response_id: string;
  storage_path: string;
  duration_seconds: number;
  created_at?: string;
};

type FeedbackRow = {
  id: string;
  speaking_id: string;
  comprehension: number;
  fluency: number;
  vocabulary: number;
  pronunciation: number;
  confidence: number;
  positive_feedback: string;
  improvement_feedback: string;
};

const typeMeta = {
  watch: { label: "Watch", icon: Video, className: "type-watch" },
  listen: { label: "Listen", icon: Headphones, className: "type-listen" },
  read: { label: "Read", icon: BookOpen, className: "type-read" },
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Good morning";
  if (hour < 15) return "Good afternoon";
  return "Good evening";
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={classNames("brand", compact && "brand-compact")}>
      <div className="brand-mark" aria-hidden="true">
        <span />
        <span />
      </div>
      <div>
        <strong>English Loop</strong>
        {!compact && <small>Input → Output → Growth</small>}
      </div>
    </div>
  );
}

function Landing({ onDemo, onLogin }: { onDemo: (role: "student" | "teacher") => void; onLogin: () => void }) {
  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <Brand />
        <div className="landing-nav-actions">
          <button className="btn btn-ghost" onClick={onLogin}>Sign in</button>
          <button className="btn btn-dark" onClick={() => onDemo("student")}>Try the demo <ArrowRight size={16} /></button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Built for real English expression</div>
          <h1>Learn from English.<br /><span>Speak with English.</span></h1>
          <p>English Loop turns authentic input into short, repeatable speaking practice — so students do more than understand English. They use it.</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onDemo("student")}>Try Student Demo <ArrowRight size={18} /></button>
            <button className="btn btn-soft btn-lg" onClick={() => onDemo("teacher")}>Try Teacher Demo</button>
          </div>
          <div className="hero-proof">
            <div><strong>01</strong><span>Explore</span></div>
            <i />
            <div><strong>02</strong><span>Understand</span></div>
            <i />
            <div><strong>03</strong><span>Speak</span></div>
            <i />
            <div><strong>04</strong><span>Grow</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="English Loop product preview">
          <div className="preview-glow" />
          <div className="phone-frame">
            <div className="phone-top"><span>9:41</span><span>•••</span></div>
            <div className="phone-content">
              <div className="mini-greeting"><span>Today</span><strong>Good morning, Naila!</strong></div>
              <div className="mini-hero-card">
                <div className="mini-chip">A2 · Speaking</div>
                <h3>Your voice gets stronger every time you use it.</h3>
                <div className="mini-wave"><span /><span /><span /><span /><span /><span /><span /></div>
                <button><Mic size={15} /> Continue activity</button>
              </div>
              <div className="mini-stats">
                <div><Flame size={17} /><strong>5</strong><span>day streak</span></div>
                <div><Volume2 size={17} /><strong>12m</strong><span>spoken</span></div>
              </div>
              <div className="mini-next">
                <div className="mini-next-icon"><BookOpen size={18} /></div>
                <div><small>UP NEXT</small><strong>The Lost Wallet</strong><span>3 min · A1</span></div>
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
          <div className="floating-card floating-card-one"><CheckCircle2 size={20} /><div><strong>Input complete</strong><span>Now turn it into your own words.</span></div></div>
          <div className="floating-card floating-card-two"><Trophy size={20} /><div><strong>+1 speaking</strong><span>Consistency beats perfection.</span></div></div>
        </div>
      </section>

      <section className="loop-section">
        <div className="section-kicker">THE LEARNING LOOP</div>
        <h2>Input gives students something to say.<br />Output trains them to say it.</h2>
        <div className="loop-grid">
          {[
            ["01", "Explore", "Choose level-appropriate content that feels worth consuming.", Compass],
            ["02", "Understand", "Capture the main idea, useful words, and personal response.", BookOpen],
            ["03", "Speak", "Turn comprehension into a 1–2 minute speaking challenge.", Mic],
            ["04", "Feedback", "Receive focused, constructive teacher feedback.", MessageSquareText],
            ["05", "Grow", "See speaking minutes, vocabulary, consistency, and progress.", BarChart3],
          ].map(([num, title, text, Icon]) => {
            const IconComp = Icon as typeof Compass;
            return <article className="loop-card" key={title as string}><span>{num as string}</span><IconComp size={23} /><h3>{title as string}</h3><p>{text as string}</p></article>;
          })}
        </div>
      </section>

      <section className="portfolio-strip">
        <div><small>DESIGNED & DEVELOPED BY</small><strong>Yusril Maulana</strong><span>English Teacher · Learning Experience Builder</span></div>
        <div className="portfolio-quote">“Speak first.<br />Improve continuously.”</div>
      </section>
      <footer className="landing-footer"><Brand compact /><span>Watch. Listen. Read. Speak. Grow.</span><span>English Loop © 2026</span></footer>
    </main>
  );
}

function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (profile: Profile) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase environment is not configured yet. Use a demo account for now.");
      return;
    }
    setBusy(true);
    const email = username.includes("@") ? username : `${username.trim().toLowerCase()}@englishloop.local`;
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError || !data.user) {
      setBusy(false);
      setError(loginError?.message || "Unable to sign in.");
      return;
    }
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("id,name,username,role,class_id,cefr_level").eq("id", data.user.id).single();
    setBusy(false);
    if (profileError || !profileData) {
      setError("Your account is signed in, but the English Loop profile is missing.");
      return;
    }
    onSuccess(profileData as Profile);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="login-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose}><X size={18} /></button>
        <Brand />
        <div className="login-copy"><h2>Welcome back.</h2><p>Sign in with your English Loop username and password.</p></div>
        <form onSubmit={submit} className="stack-form">
          <label><span>Username</span><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. naila" required autoFocus /></label>
          <label><span>Password</span><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Your password" required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary btn-lg full" disabled={busy}>{busy ? <Loader2 className="spin" size={17} /> : <ArrowRight size={17} />} {busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <div className="demo-hint"><Sparkles size={16} /><span>No account yet? Close this window and use Student or Teacher Demo.</span></div>
      </div>
    </div>
  );
}

function Recorder({ maxSeconds, onChange }: { maxSeconds: number; onChange: (blob: Blob | null, seconds: number, url: string | null) => void }) {
  const [state, setState] = useState<"idle" | "recording" | "paused" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const secondsRef = useRef(0);

  useEffect(() => {
    if (state !== "recording") return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        const next = Math.min(value + 1, maxSeconds);
        secondsRef.current = next;
        if (next >= maxSeconds) window.setTimeout(() => recorderRef.current?.stop(), 0);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state, maxSeconds]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  async function start() {
    try {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setSeconds(0);
      secondsRef.current = 0;
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferred = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("done");
        stream.getTracks().forEach((track) => track.stop());
        onChange(blob, Math.max(secondsRef.current, 1), url);
      };
      recorder.start(250);
      setState("recording");
    } catch {
      onChange(null, 0, null);
      setState("idle");
      window.alert("Microphone access is needed to record your speaking practice.");
    }
  }

  function pauseResume() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (state === "recording") { recorder.pause(); setState("paused"); }
    else if (state === "paused") { recorder.resume(); setState("recording"); }
  }

  function stop() { recorderRef.current?.stop(); }
  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null); setSeconds(0); secondsRef.current = 0; setState("idle"); onChange(null, 0, null);
  }

  return (
    <div className="recorder-card">
      <div className={classNames("mic-orb", state === "recording" && "is-recording")}><Mic size={28} /></div>
      <div className="recorder-time">{formatDuration(seconds)} <span>/ {formatDuration(maxSeconds)}</span></div>
      <div className="waveform" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <span key={i} style={{ height: `${state === "recording" ? 12 + ((i * 13) % 36) : 8 + ((i * 7) % 18)}px` }} />)}</div>
      <div className="recorder-actions">
        {state === "idle" && <button className="btn btn-primary" onClick={start}><Mic size={17} /> Start Recording</button>}
        {(state === "recording" || state === "paused") && <>
          <button className="btn btn-soft" onClick={pauseResume}>{state === "recording" ? <Pause size={17} /> : <Play size={17} />} {state === "recording" ? "Pause" : "Resume"}</button>
          <button className="btn btn-dark" onClick={stop}><Square size={15} /> Stop</button>
        </>}
        {state === "done" && <button className="btn btn-soft" onClick={reset}><RotateCcw size={16} /> Record Again</button>}
      </div>
      {audioUrl && <audio className="audio-player" controls src={audioUrl} />}
    </div>
  );
}

function ActivityExperience({
  activity,
  content,
  questions,
  onClose,
  onSubmit,
}: {
  activity: ActivityItem;
  content: ContentItem;
  questions: QuestionItem[];
  onClose: () => void;
  onSubmit: (payload: { answers: Record<string, string>; confidence: number; difficulty: string; note: string; audioBlob: Blob; audioSeconds: number }) => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidence, setConfidence] = useState(3);
  const [difficulty, setDifficulty] = useState("medium");
  const [note, setNote] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const meta = typeMeta[content.content_type];
  const Icon = meta.icon;
  const steps = ["Consume", "Understand", "Speak", "Reflect"];

  async function finish() {
    if (!audioBlob) return;
    setBusy(true);
    try {
      await onSubmit({ answers, confidence, difficulty, note, audioBlob, audioSeconds });
      setStep(4);
    } finally { setBusy(false); }
  }

  return (
    <div className="activity-overlay">
      <div className="activity-topbar">
        <button className="icon-btn" onClick={onClose}><ChevronLeft size={20} /></button>
        <div className="activity-progress">{steps.map((label, i) => <div key={label} className={classNames("progress-step", i <= step && "active")}><span>{i < step ? <Check size={12} /> : i + 1}</span><small>{label}</small></div>)}</div>
        <div className="activity-level">{content.cefr_level}</div>
      </div>
      <div className="activity-body">
        {step === 0 && <div className="activity-panel">
          <div className={classNames("content-hero", meta.className)}><Icon size={25} /><span>{meta.label} · {content.format}</span><div className="content-duration"><Clock3 size={14} /> {content.duration_minutes} min</div></div>
          <div className="activity-heading"><div className="eyebrow">INPUT</div><h1>{content.title}</h1><p>{content.description}</p></div>
          <div className="content-reader">
            <div className="reader-meta"><span>{content.source}</span><span>{content.topic}</span></div>
            <p>{content.content_body}</p>
          </div>
          <div className="notice"><Sparkles size={17} /><span><strong>Before you continue:</strong> focus on the main idea first. You do not need to understand every word.</span></div>
          <button className="btn btn-primary btn-lg activity-next" onClick={() => setStep(1)}>I’m ready to check my understanding <ArrowRight size={18} /></button>
        </div>}

        {step === 1 && <div className="activity-panel narrow-panel">
          <div className="activity-heading"><div className="eyebrow">UNDERSTAND</div><h1>Make meaning before you speak.</h1><p>Short answers are enough. Capture what you understood in your own words.</p></div>
          <div className="question-list">
            {questions.map((question, index) => <div className="question-card" key={question.id}>
              <div className="question-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="question-main"><label>{question.prompt}</label>
                {question.kind === "multiple_choice" && question.options ? <div className="choice-list">{question.options.map((option) => <button key={option} onClick={() => setAnswers({ ...answers, [question.id]: option })} className={classNames("choice", answers[question.id] === option && "selected")}><span>{answers[question.id] === option ? <Check size={13} /> : ""}</span>{option}</button>)}</div> :
                  <textarea value={answers[question.id] || ""} onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })} placeholder={question.kind === "vocabulary" ? "e.g. challenge, improve, practice" : "Write a short answer…"} />}
              </div>
            </div>)}
          </div>
          <button className="btn btn-primary btn-lg activity-next" onClick={() => setStep(2)}>Continue to speaking <Mic size={18} /></button>
        </div>}

        {step === 2 && <div className="activity-panel narrow-panel">
          <div className="activity-heading centered"><div className="eyebrow">OUTPUT</div><h1>Your speaking challenge</h1><p className="speaking-prompt">“{activity.speaking_prompt}”</p><div className="duration-pill"><Clock3 size={14} /> Target {formatDuration(activity.min_duration_seconds)}–{formatDuration(activity.max_duration_seconds)}</div></div>
          <Recorder maxSeconds={activity.max_duration_seconds} onChange={(blob, seconds) => { setAudioBlob(blob); setAudioSeconds(seconds); }} />
          <p className="speak-note">Do not chase perfect grammar. Keep your idea moving.</p>
          <button className="btn btn-primary btn-lg activity-next" disabled={!audioBlob} onClick={() => setStep(3)}>Continue to reflection <ArrowRight size={18} /></button>
        </div>}

        {step === 3 && <div className="activity-panel narrow-panel">
          <div className="activity-heading"><div className="eyebrow">REFLECT</div><h1>How did that feel?</h1><p>Reflection helps you notice growth that test scores can miss.</p></div>
          <div className="reflection-card"><label>How confident were you?</label><div className="scale-row">{[1,2,3,4,5].map((n) => <button key={n} className={classNames(confidence === n && "selected")} onClick={() => setConfidence(n)}>{n}</button>)}</div><div className="scale-labels"><span>Not yet</span><span>Very confident</span></div></div>
          <div className="reflection-card"><label>How difficult was this activity?</label><div className="segmented">{["easy","medium","difficult"].map((item) => <button key={item} className={classNames(difficulty === item && "selected")} onClick={() => setDifficulty(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div></div>
          <div className="reflection-card"><label>What was difficult? <span>Optional</span></label><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="I paused when I tried to…" /></div>
          <button className="btn btn-primary btn-lg activity-next" disabled={busy} onClick={finish}>{busy ? <Loader2 className="spin" size={18} /> : <Send size={18} />} {busy ? "Submitting…" : "Submit speaking"}</button>
        </div>}

        {step === 4 && <div className="success-panel">
          <div className="success-orb"><CheckCircle2 size={42} /></div><div className="eyebrow">LOOP COMPLETE</div><h1>You turned input into expression.</h1><p>Your speaking practice has been added to your English journey. Keep the loop moving.</p>
          <div className="success-stats"><div><strong>{formatDuration(audioSeconds)}</strong><span>speaking time</span></div><div><strong>+1</strong><span>activity complete</span></div><div><strong>{confidence}/5</strong><span>confidence</span></div></div>
          <button className="btn btn-dark btn-lg" onClick={onClose}>Back to dashboard <ArrowRight size={18} /></button>
        </div>}
      </div>
    </div>
  );
}

function StudentShell({ profile, isDemo, onLogout }: { profile: Profile; isDemo: boolean; onLogout: () => void }) {
  const [view, setView] = useState<StudentView>("home");
  const [contents, setContents] = useState<ContentItem[]>(isDemo ? demoContents : []);
  const [activities, setActivities] = useState<ActivityItem[]>(isDemo ? demoActivities : []);
  const [questions, setQuestions] = useState<QuestionItem[]>(isDemo ? demoQuestions : []);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [speaking, setSpeaking] = useState<SpeakingRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [vocabulary, setVocabulary] = useState<Array<{ id?: string; word: string; meaning?: string | null }>>(isDemo ? [
    { word: "challenge", meaning: "tantangan" }, { word: "confident", meaning: "percaya diri" }, { word: "perspective", meaning: "sudut pandang" }, { word: "improve", meaning: "meningkatkan" },
  ] : []);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [filter, setFilter] = useState<"all" | "watch" | "listen" | "read">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(!isDemo);

  const loadData = useCallback(async () => {
    if (isDemo) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setLoading(true);
    const [contentRes, activityRes, questionRes, responseRes, speakRes, feedbackRes, vocabRes] = await Promise.all([
      supabase.from("contents").select("*").eq("is_published", true).order("created_at"),
      supabase.from("activities").select("*").eq("is_published", true).order("created_at"),
      supabase.from("activity_questions").select("*").order("sort_order"),
      supabase.from("responses").select("*").eq("student_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("speaking_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("feedback").select("*"),
      supabase.from("vocabulary").select("*").eq("student_id", profile.id).order("created_at", { ascending: false }),
    ]);
    if (contentRes.data) setContents(contentRes.data as ContentItem[]);
    if (activityRes.data) setActivities(activityRes.data as ActivityItem[]);
    if (questionRes.data) setQuestions(questionRes.data as QuestionItem[]);
    if (responseRes.data) setResponses(responseRes.data as ResponseRow[]);
    if (speakRes.data) setSpeaking(speakRes.data) setSpeaking(speakRes.data as SpeakingRow[]);
    if (feedbackRes.data) setFeedback(feedbackRes.data as FeedbackRow[]);
    if (vocabRes.data) setVocabulary(vocabRes.data as typeof vocabulary);
    setLoading(false);
  }, [isDemo, profile.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const completed = responses.filter((r) => r.status === "submitted").length + (isDemo ? 7 : 0);
  const speakingSeconds = speaking.reduce((sum, row) => sum + row.duration_seconds, 0) + (isDemo ? 684 : 0);
  const stats = [
    { label: "Activities", value: completed, icon: CheckCircle2 },
    { label: "Speaking", value: speaking.length + (isDemo ? 8 : 0), icon: Mic },
    { label: "Minutes", value: Math.round(speakingSeconds / 60), icon: Clock3 },
    { label: "Vocabulary", value: vocabulary.length + (isDemo ? 28 : 0), icon: BookOpen },
  ];
  const incomplete = activities.find((a) => !responses.some((r) => r.activity_id === a.id && r.status === "submitted")) || activities[0];
  const filteredContents = contents.filter((item) => (filter === "all" || item.content_type === filter) && `${item.title} ${item.topic}`.toLowerCase().includes(search.toLowerCase()));

  async function submitActivity(payload: { answers: Record<string, string>; confidence: number; difficulty: string; note: string; audioBlob: Blob; audioSeconds: number }) {
    if (!selectedActivity) return;
    if (isDemo) {
      const responseId = `demo-${Date.now()}`;
      setResponses((old) => [{ id: responseId, student_id: profile.id, activity_id: selectedActivity.id, answers: payload.answers, confidence: payload.confidence, difficulty: payload.difficulty, reflection_note: payload.note, status: "submitted", submitted_at: new Date().toISOString() }, ...old]);
      setSpeaking((old) => [{ id: `speak-${Date.now()}`, response_id: responseId, storage_path: "demo-session-only", duration_seconds: payload.audioSeconds, created_at: new Date().toISOString() }, ...old]);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const activityQuestions = questions.filter((q) => q.activity_id === selectedActivity.id);
    const vocabText = activityQuestions.filter((q) => q.kind === "vocabulary").map((q) => payload.answers[q.id] || "").join(",");
    const vocabWords = vocabText.split(/[,\n]/).map((word) => word.trim()).filter(Boolean).slice(0, 12);
    const { data: response, error: responseError } = await supabase.from("responses").upsert({
      student_id: profile.id,
      activity_id: selectedActivity.id,
      answers: payload.answers,
      vocabulary: vocabWords,
      confidence: payload.confidence,
      difficulty: payload.difficulty,
      reflection_note: payload.note || null,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    }, { onConflict: "student_id,activity_id" }).select("id").single();
    if (responseError || !response) throw responseError || new Error("Could not save response");
    const mime = (payload.audioBlob.type || "audio/webm").split(";")[0];
    const ext = mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : mime.includes("mpeg") ? "mp3" : mime.includes("wav") ? "wav" : "webm";
    const path = `${profile.id}/${response.id}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("speaking-audio").upload(path, payload.audioBlob, { contentType: mime, upsert: true });
    if (uploadError) throw uploadError;
    const { error: speakingError } = await supabase.from("speaking_submissions").upsert({ response_id: response.id, storage_path: path, duration_seconds: Math.max(payload.audioSeconds, 1), mime_type: mime }, { onConflict: "response_id" });
    if (speakingError) throw speakingError;
    const contentId = selectedActivity.content_id;
    if (vocabWords.length) await supabase.from("vocabulary").insert(vocabWords.map((word) => ({ student_id: profile.id, word, content_id: contentId })));
    await loadData();
  }

  const selectedContent = selectedActivity ? contents.find((c) => c.id === selectedActivity.content_id) : null;
  const selectedQuestions = selectedActivity ? questions.filter((q) => q.activity_id === selectedActivity.id).sort((a,b) => a.sort_order-b.sort_order) : [];

  return (
    <div className="student-app">
      <header className="student-header">
        <Brand compact />
        <div className="student-header-right"><span className="demo-badge">{isDemo ? "Student Demo" : profile.cefr_level}</span><button className="avatar-btn" onClick={() => setView("profile")}>{profile.name.charAt(0)}</button></div>
      </header>

      <main className="student-main">
        {loading ? <div className="loading-screen"><Loader2 className="spin" /><span>Loading your English journey…</span></div> : <>
          {view === "home" && <div className="student-page">
            <div className="page-intro"><div><div className="eyebrow">YOUR ENGLISH TODAY</div><h1>{greeting()}, {profile.name.split(" ")[0]}.</h1><p>One small loop today is enough to keep your English moving.</p></div><div className="streak-pill"><Flame size={17} /> {isDemo ? 5 : Math.min(completed, 7)} day streak</div></div>
            <section className="student-focus-card">
              <div className="focus-content"><div className="focus-label"><Sparkles size={14} /> READY WHEN YOU ARE</div><h2>{incomplete?.title || "Choose your next activity"}</h2><p>{incomplete?.speaking_prompt || "Explore the content library and turn your next input into spoken English."}</p><button className="btn btn-light" onClick={() => incomplete && setSelectedActivity(incomplete)}>{incomplete ? "Continue today’s activity" : "Explore content"} <ArrowRight size={17} /></button></div>
              <div className="focus-loop"><div className="focus-ring"><Mic size={28} /></div><span>INPUT</span><i>→</i><span>OUTPUT</span></div>
            </section>
            <div className="stat-grid">{stats.map(({label,value,icon: Icon}) => <div className="stat-card" key={label}><div className="stat-icon"><Icon size={18} /></div><strong>{value}</strong><span>{label}</span></div>)}</div>
            <div className="section-row"><div><h2>Pick up where you left off</h2><p>Short input. Real speaking.</p></div><button className="text-btn" onClick={() => setView("explore")}>See all <ArrowRight size={15} /></button></div>
            <div className="content-scroll">{contents.slice(0,3).map((content) => {
              const meta = typeMeta[content.content_type]; const Icon = meta.icon; const activity = activities.find((a) => a.content_id === content.id);
              return <article className="content-card" key={content.id} onClick={() => activity && setSelectedActivity(activity)}><div className={classNames("content-card-art",meta.className)}><Icon size={22} /><span>{content.content_type}</span></div><div className="content-card-body"><div className="content-tags"><span>{content.cefr_level}</span><span>{content.duration_minutes} min</span></div><h3>{content.title}</h3><p>{content.topic}</p></div><button className="round-arrow"><ChevronRight size={17} /></button></article>;
            })}</div>
          </div>}

          {view === "explore" && <div className="student-page">
            <div className="page-intro"><div><div className="eyebrow">CONTENT LIBRARY</div><h1>Find something worth talking about.</h1><p>Choose by mood, level, or the way you want to consume English.</p></div></div>
            <div className="explore-toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search topic or title" /></div><div className="filter-tabs">{["all","watch","listen","read"].map((item) => <button key={item} className={classNames(filter===item&&"selected")} onClick={()=>setFilter(item as typeof filter)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div></div>
            <div className="library-grid">{filteredContents.map((content) => { const meta=typeMeta[content.content_type]; const Icon=meta.icon; const activity=activities.find((a)=>a.content_id===content.id); return <article className="library-card" key={content.id}><div className={classNames("library-art",meta.className)}><div className="library-icon"><Icon size={26}/></div><div className="library-level">{content.cefr_level}</div><span>{meta.label}</span></div><div className="library-body"><div className="content-tags"><span>{content.format}</span><span>{content.duration_minutes} min</span></div><h3>{content.title}</h3><p>{content.description}</p><div className="library-footer"><span>{content.topic}</span><button onClick={()=>activity&&setSelectedActivity(activity)}><ArrowRight size={16}/></button></div></div></article>})}</div>
          </div>}

          {view === "speak" && <div className="student-page"><div className="page-intro"><div><div className="eyebrow">SPEAK</div><h1>Your voice is the output.</h1><p>Choose a challenge. You already have something to say.</p></div></div><div className="speak-list">{activities.map((activity) => { const content=contents.find((c)=>c.id===activity.content_id); if(!content) return null; const done=responses.some((r)=>r.activity_id===activity.id&&r.status==="submitted"); return <article className="speak-row" key={activity.id}><div className={classNames("speak-row-icon",typeMeta[content.content_type].className)}><Mic size={20}/></div><div className="speak-row-main"><div className="content-tags"><span>{content.cefr_level}</span><span>{formatDuration(activity.min_duration_seconds)}–{formatDuration(activity.max_duration_seconds)}</span>{done&&<span className="done-tag">Done</span>}</div><h3>{activity.title}</h3><p>{activity.speaking_prompt}</p></div><button className="btn btn-soft" onClick={()=>setSelectedActivity(activity)}>{done?"Practice again":"Start"}<ArrowRight size={15}/></button></article>})}</div></div>}

          {view === "progress" && <div className="student-page"><div className="page-intro"><div><div className="eyebrow">MY ENGLISH JOURNEY</div><h1>Progress you can actually see.</h1><p>Not perfection. More exposure, more expression, more confidence over time.</p></div></div><div className="journey-hero"><div><small>TOTAL ACTIVE ENGLISH</small><strong>{Math.max(Math.round(speakingSeconds/60), isDemo?12:0)} min</strong><span>of speaking practice</span></div><div className="journey-bars">{[38,51,70,94,112].map((n,i)=><div key={n}><span style={{height:`${25+i*14}%`}}/><small>W{i+1}</small></div>)}</div></div><div className="stat-grid">{stats.map(({label,value,icon:Icon})=><div className="stat-card" key={label}><div className="stat-icon"><Icon size={18}/></div><strong>{value}</strong><span>{label}</span></div>)}</div><div className="progress-columns"><section className="panel-card"><div className="panel-title"><div><h3>Vocabulary collected</h3><p>Words you met inside real context.</p></div><BookOpen size={20}/></div><div className="word-cloud">{vocabulary.slice(0,12).map((item,i)=><span key={`${item.word}-${i}`}>{item.word}</span>)}</div></section><section className="panel-card"><div className="panel-title"><div><h3>Latest teacher feedback</h3><p>Use one improvement at a time.</p></div><MessageSquareText size={20}/></div>{feedback.length?<div className="feedback-snippet"><strong>You did well</strong><p>{feedback[0].positive_feedback}</p><strong>Try this next</strong><p>{feedback[0].improvement_feedback}</p></div>:<div className="empty-mini"><Sparkles size={22}/><p>Your teacher feedback will appear here after a speaking submission is reviewed.</p></div>}</section></div></div>}

          {view === "profile" && <div className="student-page"><div className="profile-card"><div className="big-avatar">{profile.name.charAt(0)}</div><div><div className="eyebrow">STUDENT PROFILE</div><h1>{profile.name}</h1><p>@{profile.username || "student"}</p></div><div className="profile-chips"><span>{profile.cefr_level}</span><span>{isDemo?"Class 10A":"English Loop"}</span></div><button className="btn btn-soft" onClick={onLogout}><LogOut size={16}/> Leave {isDemo?"demo":"account"}</button></div><div className="profile-message"><Sparkles size={22}/><div><strong>Your goal is not to sound perfect.</strong><p>Your goal is to have more things to say, and more courage to say them.</p></div></div></div>}
        </>}
      </main>

      <nav className="student-bottom-nav">
        {[
          ["home","Home",Home],["explore","Explore",Compass],["speak","Speak",Mic],["progress","Progress",BarChart3],["profile","Profile",User]
        ].map(([key,label,Icon])=>{const IconComp=Icon as typeof Home; return <button key={key as string} className={classNames(view===key&&"active")} onClick={()=>setView(key as StudentView)}><IconComp size={20}/><span>{label as string}</span></button>})}
      </nav>

      {selectedActivity && selectedContent && <ActivityExperience activity={selectedActivity} content={selectedContent} questions={selectedQuestions} onClose={()=>setSelectedActivity(null)} onSubmit={submitActivity}/>} 
    </div>
  );
}

function TeacherShell({ profile, isDemo, onLogout }: { profile: Profile; isDemo: boolean; onLogout: () => void }) {
  const [view, setView] = useState<TeacherView>("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [students, setStudents] = useState<any[]>(isDemo ? demoStudents : []);
  const [contents, setContents] = useState<any[]>(isDemo ? demoContents : []);
  const [activities, setActivities] = useState<any[]>(isDemo ? demoActivities : []);
  const [classes, setClasses] = useState<any[]>(isDemo ? [{id:"c1",name:"10A"},{id:"c2",name:"10B"}] : []);
  const [responses, setResponses] = useState<any[]>([]);
  const [speaking, setSpeaking] = useState<any[]>(isDemo ? demoSubmissions : []);
  const [feedback, setFeedback] = useState<any[]>(isDemo ? [{ speaking_id: "sp1" }] : []);
  const [selectedSpeaking, setSelectedSpeaking] = useState<any | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isDemo);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builder, setBuilder] = useState({ title:"", type:"read", level:"A2", topic:"", duration:"4", body:"", prompt:"", min:"45", max:"90", classId:"" });
  const [builderBusy, setBuilderBusy] = useState(false);

  const loadTeacher = useCallback(async()=>{
    if(isDemo) return;
    const supabase=getSupabase(); if(!supabase) return;
    setLoading(true);
    const [profilesRes, contentRes, activityRes, classRes, responseRes, speakingRes, feedbackRes]=await Promise.all([
      supabase.from("profiles").select("*").eq("role","student").order("name"),
      supabase.from("contents").select("*").order("created_at",{ascending:false}),
      supabase.from("activities").select("*").order("created_at",{ascending:false}),
      supabase.from("classes").select("*").order("name"),
      supabase.from("responses").select("*").order("submitted_at",{ascending:false}),
      supabase.from("speaking_submissions").select("*").order("created_at",{ascending:false}),
      supabase.from("feedback").select("*").order("created_at",{ascending:false}),
    ]);
    if(profilesRes.data) setStudents(profilesRes.data);
    if(contentRes.data) setContents(contentRes.data);
    if(activityRes.data) setActivities(activityRes.data);
    if(classRes.data) setClasses(classRes.data);
    if(responseRes.data) setResponses(responseRes.data);
    if(speakingRes.data) setSpeaking(speakingRes.data);
    if(feedbackRes.data) setFeedback(feedbackRes.data);
    setLoading(false);
  },[isDemo]);
  useEffect(()=>{loadTeacher()},[loadTeacher]);

  const pending = isDemo ? speaking.filter((s:any)=>!s.feedback).length : speaking.filter((s:any)=>!feedback.some((f:any)=>f.speaking_id===s.id)).length;
  const responseMap=useMemo(()=>Object.fromEntries(responses.map((r:any)=>[r.id,r])),[responses]);
  const studentMap=useMemo(()=>Object.fromEntries(students.map((s:any)=>[s.id,s])),[students]);
  const activityMap=useMemo(()=>Object.fromEntries(activities.map((a:any)=>[a.id,a])),[activities]);

  function submissionMeta(item:any){
    if(isDemo) return item;
    const response=responseMap[item.response_id];
    return { ...item, student: studentMap[response?.student_id]?.name || "Student", activity: activityMap[response?.activity_id]?.title || "Activity", feedback: feedback.some((f:any)=>f.speaking_id===item.id) };
  }

  async function openSubmission(item:any){
    const meta=submissionMeta(item); setSelectedSpeaking(meta); setAudioUrl(null);
    if(isDemo) return;
    const supabase=getSupabase(); if(!supabase) return;
    const {data}=await supabase.storage.from("speaking-audio").createSignedUrl(item.storage_path,600);
    if(data?.signedUrl) setAudioUrl(data.signedUrl);
  }

  async function createActivity(e:React.FormEvent){
    e.preventDefault();
    if(isDemo){
      const contentId=`demo-content-${Date.now()}`; const activityId=`demo-act-${Date.now()}`;
      setContents((old:any[])=>[{id:contentId,title:builder.title,description:`Teacher-created ${builder.type} content`,content_type:builder.type,format:builder.type==="read"?"Article":builder.type==="watch"?"Short video":"Mini podcast",cefr_level:builder.level,topic:builder.topic,duration_minutes:Number(builder.duration),content_body:builder.body,vocabulary_focus:[]},...old]);
      setActivities((old:any[])=>[{id:activityId,content_id:contentId,title:builder.title,speaking_prompt:builder.prompt,instructions:"Consume the input, capture the main idea, then speak in your own words.",min_duration_seconds:Number(builder.min),max_duration_seconds:Number(builder.max)},...old]);
      setBuilderOpen(false); return;
    }
    const supabase=getSupabase(); if(!supabase) return;
    setBuilderBusy(true);
    const {data:content,error:contentError}=await supabase.from("contents").insert({title:builder.title,description:`${builder.topic} · ${builder.level}`,content_type:builder.type,format:builder.type==="read"?"article":builder.type==="watch"?"short video":"mini podcast",cefr_level:builder.level,topic:builder.topic,duration_minutes:Number(builder.duration),content_body:builder.body||null,vocabulary_focus:[],is_published:true,created_by:profile.id}).select("id").single();
    if(contentError||!content){setBuilderBusy(false);window.alert(contentError?.message||"Could not create content");return;}
    const {data:activity,error:activityError}=await supabase.from("activities").insert({content_id:content.id,title:builder.title,instructions:"Consume the input, capture the main idea, then speak in your own words.",speaking_prompt:builder.prompt,min_duration_seconds:Number(builder.min),max_duration_seconds:Number(builder.max),created_by:profile.id,is_published:true}).select("id").single();
    if(activityError||!activity){setBuilderBusy(false);window.alert(activityError?.message||"Could not create activity");return;}
    await supabase.from("activity_questions").insert([
      {activity_id:activity.id,kind:"short_answer",prompt:"What is the main idea?",sort_order:1},
      {activity_id:activity.id,kind:"vocabulary",prompt:"Write three useful words from this content.",sort_order:2},
      {activity_id:activity.id,kind:"reflection",prompt:"What did you find interesting?",sort_order:3},
    ]);
    if(builder.classId) await supabase.from("assignments").insert({activity_id:activity.id,class_id:builder.classId,created_by:profile.id});
    setBuilderBusy(false); setBuilderOpen(false); await loadTeacher();
  }

  async function deleteContent(id:string){
    if(!window.confirm("Delete this content and its linked activity?")) return;
    if(isDemo){setContents((old:any[])=>old.filter((x:any)=>x.id!==id));setActivities((old:any[])=>old.filter((x:any)=>x.content_id!==id));return;}
    const supabase=getSupabase(); if(!supabase) return; await supabase.from("contents").delete().eq("id",id); await loadTeacher();
  }

  const navItems:[TeacherView,string,typeof Home][]=[
    ["dashboard","Dashboard",Home],["students","Students",Users],["content","Content",Library],["activities","Activities",ListChecks],["submissions","Submissions",Mic],["progress","Progress",BarChart3],["settings","Settings",Settings]
  ];

  return <div className="teacher-app">
    <aside className={classNames("teacher-sidebar",mobileMenu&&"open")}>
      <div className="teacher-brand-row"><Brand/><button className="icon-btn sidebar-close" onClick={()=>setMobileMenu(false)}><X size={18}/></button></div>
      <div className="teacher-school"><div className="school-icon"><GraduationCap size={20}/></div><div><strong>English Loop Class</strong><span>Learning workspace</span></div></div>
      <nav className="teacher-nav">{navItems.map(([key,label,Icon])=><button key={key} className={classNames(view===key&&"active")} onClick={()=>{setView(key);setMobileMenu(false)}}><Icon size={18}/><span>{label}</span>{key==="submissions"&&pending>0&&<b>{pending}</b>}</button>)}</nav>
      <div className="teacher-sidebar-foot"><div className="teacher-profile"><div className="small-avatar">{profile.name.charAt(0)}</div><div><strong>{profile.name}</strong><span>{isDemo?"Teacher Demo":"Teacher"}</span></div></div><button className="icon-btn" onClick={onLogout}><LogOut size={18}/></button></div>
    </aside>
    {mobileMenu&&<div className="sidebar-scrim" onClick={()=>setMobileMenu(false)}/>} 
    <main className="teacher-main">
      <header className="teacher-mobile-head"><button className="icon-btn" onClick={()=>setMobileMenu(true)}><Menu size={20}/></button><Brand compact/><span/></header>
      {loading?<div className="loading-screen"><Loader2 className="spin"/><span>Preparing teacher workspace…</span></div>:<>
        {view==="dashboard"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">TEACHER DASHBOARD</div><h1>{greeting()}, {profile.name.split(" ")[0]}.</h1><p>See where students are in the loop and what needs your attention.</p></div><button className="btn btn-primary" onClick={()=>setBuilderOpen(true)}><Plus size={17}/> New activity</button></div><div className="teacher-stats"><div><span><Users size={18}/></span><strong>{students.length}</strong><small>Students</small></div><div><span><ListChecks size={18}/></span><strong>{activities.length}</strong><small>Activities</small></div><div><span><Mic size={18}/></span><strong>{speaking.length}</strong><small>Submissions</small></div><div className="attention"><span><MessageSquareText size={18}/></span><strong>{pending}</strong><small>Pending feedback</small></div></div><div className="teacher-grid"><section className="teacher-panel wide"><div className="panel-title"><div><h3>Recent speaking</h3><p>Latest student output waiting in the loop.</p></div><button className="text-btn" onClick={()=>setView("submissions")}>View all <ArrowRight size={15}/></button></div><div className="submission-table"><div className="table-head"><span>Student</span><span>Activity</span><span>Duration</span><span>Feedback</span><span/></div>{speaking.slice(0,5).map((row:any)=>{const meta=submissionMeta(row);return <button className="table-row" key={row.id} onClick={()=>openSubmission(row)}><span><b className="table-avatar">{meta.student.charAt(0)}</b>{meta.student}</span><span>{meta.activity}</span><span>{formatDuration(meta.duration_seconds)}</span><span className={meta.feedback?"status-done":"status-pending"}>{meta.feedback?"Done":"Pending"}</span><span><ChevronRight size={16}/></span></button>})}{!speaking.length&&<div className="empty-table">No speaking submissions yet.</div>}</div></section><section className="teacher-panel"><div className="panel-title"><div><h3>Loop health</h3><p>Simple signals, not noisy analytics.</p></div><BarChart3 size={20}/></div><div className="health-list"><div><span>Speaking completion</span><strong>{isDemo?"82%":speaking.length?"Active":"—"}</strong><i><b style={{width:isDemo?"82%":speaking.length?"64%":"0%"}}/></i></div><div><span>Feedback complete</span><strong>{speaking.length?`${Math.round(((speaking.length-pending)/speaking.length)*100)}%`:"—"}</strong><i><b style={{width:speaking.length?`${((speaking.length-pending)/speaking.length)*100}%`:"0%"}}/></i></div><div><span>Weekly practice</span><strong>{isDemo?"18 min":"Live"}</strong><i><b style={{width:isDemo?"74%":"48%"}}/></i></div></div></section></div></div>}

        {view==="students"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">STUDENTS</div><h1>Know the learner behind the score.</h1><p>Level, practice, and consistency in one clear view.</p></div></div><div className="student-table-card"><div className="student-table-head"><span>Student</span><span>Level</span><span>Class</span><span>Activities</span><span>Speaking</span><span>Streak</span></div>{students.map((s:any)=>{const className=isDemo?s.class_name:classes.find((c:any)=>c.id===s.class_id)?.name||"—"; const studentResponses=isDemo?s.completed:responses.filter((r:any)=>r.student_id===s.id&&r.status==="submitted").length; const studentSpeak=isDemo?s.speakingMinutes:speaking.filter((sp:any)=>responseMap[sp.response_id]?.student_id===s.id).reduce((sum:number,sp:any)=>sum+sp.duration_seconds,0)/60; return <div className="student-table-row" key={s.id}><span><b className="table-avatar">{s.name.charAt(0)}</b><div><strong>{s.name}</strong><small>@{s.username||"student"}</small></div></span><span><b className="level-badge">{s.cefr_level}</b></span><span>{className}</span><span>{studentResponses}</span><span>{Number(studentSpeak).toFixed(1)} min</span><span><Flame size={15}/>{isDemo?s.streak:Math.min(studentResponses,7)} days</span></div>})}{!students.length&&<div className="empty-table">No students yet. Add users in Supabase Auth, then assign their class in English Loop.</div>}</div></div>}

        {view==="content"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">CONTENT</div><h1>Your input library.</h1><p>Every input should give students something worth saying.</p></div><button className="btn btn-primary" onClick={()=>setBuilderOpen(true)}><Plus size={17}/> Add content</button></div><div className="teacher-content-grid">{contents.map((c:any)=>{const meta=typeMeta[c.content_type as keyof typeof typeMeta]||typeMeta.read;const Icon=meta.icon;return <article className="teacher-content-card" key={c.id}><div className={classNames("teacher-content-icon",meta.className)}><Icon size={21}/></div><div><div className="content-tags"><span>{c.cefr_level}</span><span>{c.duration_minutes} min</span></div><h3>{c.title}</h3><p>{c.topic}</p></div><button className="icon-btn danger" onClick={()=>deleteContent(c.id)}><Trash2 size={16}/></button></article>})}</div></div>}

        {view==="activities"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">ACTIVITY BUILDER</div><h1>Pair every input with an output.</h1><p>The speaking prompt is where passive understanding becomes active English.</p></div><button className="btn btn-primary" onClick={()=>setBuilderOpen(true)}><Plus size={17}/> Build activity</button></div><div className="activity-admin-list">{activities.map((a:any)=>{const c=contents.find((x:any)=>x.id===a.content_id);return <article key={a.id}><div className="activity-admin-index">{String(activities.indexOf(a)+1).padStart(2,"0")}</div><div><div className="content-tags"><span>{c?.cefr_level||"—"}</span><span>{c?.content_type||"input"}</span><span>{formatDuration(a.min_duration_seconds)}–{formatDuration(a.max_duration_seconds)}</span></div><h3>{a.title}</h3><p>“{a.speaking_prompt}”</p></div><div className="pair-badge"><span>INPUT</span><ArrowRight size={14}/><span>OUTPUT</span></div></article>})}</div></div>}

        {view==="submissions"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">SUBMISSIONS</div><h1>Listen for growth, not perfection.</h1><p>Give one clear strength and one useful next step.</p></div><div className="pending-pill">{pending} need feedback</div></div><div className="submission-card-list">{speaking.map((row:any)=>{const meta=submissionMeta(row);return <button key={row.id} className="submission-card" onClick={()=>openSubmission(row)}><div className="submission-avatar">{meta.student.charAt(0)}</div><div className="submission-main"><strong>{meta.student}</strong><span>{meta.activity}</span></div><div><small>DURATION</small><strong>{formatDuration(meta.duration_seconds)}</strong></div><div><small>FEEDBACK</small><span className={meta.feedback?"status-done":"status-pending"}>{meta.feedback?"Done":"Pending"}</span></div><ChevronRight size={18}/></button>})}{!speaking.length&&<div className="empty-state"><Mic size={28}/><h3>No speaking yet</h3><p>Student submissions will appear here after they complete a learning loop.</p></div>}</div></div>}

        {view==="progress"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">CLASS PROGRESS</div><h1>Is the class using English?</h1><p>The main metric is weekly speaking practice — not login count.</p></div></div><div className="metric-hero"><div><small>MAIN PRODUCT METRIC</small><h2>Weekly Speaking Practice</h2><p>How much active English expression is happening across the class?</p></div><div><strong>{isDemo?"54.4":(speaking.reduce((n:number,s:any)=>n+s.duration_seconds,0)/60).toFixed(1)}</strong><span>total minutes</span></div></div><div className="progress-bars-card"><div className="panel-title"><div><h3>Speaking practice by student</h3><p>Minutes submitted in English Loop.</p></div></div>{students.slice(0,8).map((s:any)=>{const mins=isDemo?s.speakingMinutes:speaking.filter((sp:any)=>responseMap[sp.response_id]?.student_id===s.id).reduce((sum:number,sp:any)=>sum+sp.duration_seconds,0)/60;const max=isDemo?20:Math.max(10,...students.map((st:any)=>speaking.filter((sp:any)=>responseMap[sp.response_id]?.student_id===st.id).reduce((sum:number,sp:any)=>sum+sp.duration_seconds,0)/60));return <div className="student-progress-row" key={s.id}><span>{s.name}</span><i><b style={{width:`${Math.min(100,(mins/max)*100)}%`}}/></i><strong>{Number(mins).toFixed(1)}m</strong></div>})}</div></div>}

        {view==="settings"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">SETTINGS</div><h1>English Loop workspace.</h1><p>Product status and learning principles.</p></div></div><div className="settings-grid"><section className="settings-card"><div className="settings-icon"><CheckCircle2 size={20}/></div><div><strong>Learning philosophy</strong><p>Speak first. Improve continuously. Feedback should make the next attempt easier, not make students afraid of mistakes.</p></div></section><section className="settings-card"><div className="settings-icon"><Mic size={20}/></div><div><strong>Private speaking storage</strong><p>Student audio is stored in a private Supabase bucket and protected with row-level access policies.</p></div></section><section className="settings-card"><div className="settings-icon"><BarChart3 size={20}/></div><div><strong>Primary metric</strong><p>Weekly Speaking Practice: how much students actively use English, not merely how often they open the app.</p></div></section></div></div>}
      </>}
    </main>

    {builderOpen&&<div className="modal-backdrop" onMouseDown={()=>setBuilderOpen(false)}><div className="builder-modal" onMouseDown={(e)=>e.stopPropagation()}><div className="builder-head"><div><div className="eyebrow">ACTIVITY BUILDER</div><h2>Turn input into output.</h2></div><button className="icon-btn" onClick={()=>setBuilderOpen(false)}><X size={18}/></button></div><form className="builder-form" onSubmit={createActivity}><div className="form-grid two"><label><span>Activity title</span><input required value={builder.title} onChange={(e)=>setBuilder({...builder,title:e.target.value})} placeholder="Anime Reflection #01"/></label><label><span>Topic</span><input required value={builder.topic} onChange={(e)=>setBuilder({...builder,topic:e.target.value})} placeholder="Friendship"/></label></div><div className="form-grid three"><label><span>Input type</span><select value={builder.type} onChange={(e)=>setBuilder({...builder,type:e.target.value})}><option value="read">Read</option><option value="watch">Watch</option><option value="listen">Listen</option></select></label><label><span>CEFR level</span><select value={builder.level} onChange={(e)=>setBuilder({...builder,level:e.target.value})}><option>A1</option><option>A2</option><option>B1</option><option>B2</option></select></label><label><span>Duration</span><input type="number" min="1" value={builder.duration} onChange={(e)=>setBuilder({...builder,duration:e.target.value})}/></label></div><label><span>Input text / transcript <em>optional</em></span><textarea rows={4} value={builder.body} onChange={(e)=>setBuilder({...builder,body:e.target.value})} placeholder="Paste an original short text, transcript, or content notes…"/></label><label><span>Speaking prompt</span><textarea required rows={3} value={builder.prompt} onChange={(e)=>setBuilder({...builder,prompt:e.target.value})} placeholder="Tell us what happened and which part you found most interesting."/></label><div className="form-grid three"><label><span>Min seconds</span><input type="number" min="15" value={builder.min} onChange={(e)=>setBuilder({...builder,min:e.target.value})}/></label><label><span>Max seconds</span><input type="number" min="30" value={builder.max} onChange={(e)=>setBuilder({...builder,max:e.target.value})}/></label><label><span>Assign to class</span><select value={builder.classId} onChange={(e)=>setBuilder({...builder,classId:e.target.value})}><option value="">Not yet</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><div className="builder-actions"><button type="button" className="btn btn-soft" onClick={()=>setBuilderOpen(false)}>Cancel</button><button className="btn btn-primary" disabled={builderBusy}>{builderBusy?<Loader2 className="spin" size={17}/>:<Plus size={17}/>} Publish activity</button></div></form></div></div>}

    {selectedSpeaking&&<FeedbackDrawer submission={selectedSpeaking} audioUrl={audioUrl} isDemo={isDemo} teacherId={profile.id} existing={feedback.find((f:any)=>f.speaking_id===selectedSpeaking.id)} onClose={()=>{setSelectedSpeaking(null);setAudioUrl(null)}} onSaved={async(row)=>{if(isDemo){setFeedback((old:any[])=>[{...row,speaking_id:selectedSpeaking.id},...old.filter((f:any)=>f.speaking_id!==selectedSpeaking.id)]);setSpeaking((old:any[])=>old.map((s:any)=>s.id===selectedSpeaking.id?{...s,feedback:true}:s));}else await loadTeacher();setSelectedSpeaking(null)}}/>}
  </div>
}

function FeedbackDrawer({submission,audioUrl,isDemo,teacherId,existing,onClose,onSaved}:{submission:any;audioUrl:string|null;isDemo:boolean;teacherId:string;existing:any;onClose:()=>void;onSaved:(row:any)=>Promise<void>}){
  const [scores,setScores]=useState<Record<string,number>>({comprehension:existing?.comprehension||4,fluency:existing?.fluency||3,vocabulary:existing?.vocabulary||3,pronunciation:existing?.pronunciation||3,confidence:existing?.confidence||4});
  const [positive,setPositive]=useState(existing?.positive_feedback||"");
  const [improve,setImprove]=useState(existing?.improvement_feedback||"");
  const [busy,setBusy]=useState(false);
  async function save(){if(!positive.trim()||!improve.trim())return;setBusy(true);const payload={speaking_id:submission.id,...scores,positive_feedback:positive,improvement_feedback:improve,teacher_id:teacherId};if(!isDemo){const supabase=getSupabase();if(supabase){const {error}=await supabase.from("feedback").upsert(payload,{onConflict:"speaking_id"});if(error){setBusy(false);window.alert(error.message);return;}}}await onSaved(payload);setBusy(false)}
  return <div className="drawer-backdrop"><aside className="feedback-drawer"><div className="drawer-head"><div><div className="eyebrow">SPEAKING SUBMISSION</div><h2>{submission.student}</h2><p>{submission.activity} · {formatDuration(submission.duration_seconds)}</p></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div><div className="drawer-scroll"><section className="listen-card"><div><div className="listen-icon"><Volume2 size={22}/></div><div><strong>Listen to speaking</strong><span>{isDemo?"Demo mode · sample metadata":"Private audio · signed access"}</span></div></div>{audioUrl?<audio controls src={audioUrl}/>:isDemo?<div className="demo-audio"><Play size={16}/><span>Audio playback appears here for real submissions</span></div>:<div className="demo-audio"><Loader2 className="spin" size={16}/><span>Preparing private audio…</span></div>}</section><section className="assessment"><h3>Simple assessment</h3><p>Score what helps the next attempt. 1 = needs support, 5 = very strong.</p>{Object.entries(scores).map(([key,value])=><div className="score-row" key={key}><span>{key[0].toUpperCase()+key.slice(1)}</span><div>{[1,2,3,4,5].map((n)=><button key={n} className={value===n?"selected":""} onClick={()=>setScores({...scores,[key]:n})}>{n}</button>)}</div></div>)}</section><section className="feedback-writing"><label><span>What you did well</span><textarea value={positive} onChange={(e)=>setPositive(e.target.value)} placeholder="You explained the main idea clearly and kept speaking even when you needed time to think."/></label><label><span>Try this next</span><textarea value={improve} onChange={(e)=>setImprove(e.target.value)} placeholder="Try connecting your ideas with because, then, and however."/></label></section></div><div className="drawer-actions"><button className="btn btn-soft" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={busy||!positive.trim()||!improve.trim()} onClick={save}>{busy?<Loader2 className="spin" size={17}/>:<Send size={17}/>} Save feedback</button></div></aside></div>
}

export default function EnglishLoopApp() {
  const [mode, setMode] = useState<AppMode>("landing");
  const [isDemo, setIsDemo] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) { setBooting(false); return; }
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user) { setBooting(false); return; }
      const { data: profileData } = await supabase.from("profiles").select("id,name,username,role,class_id,cefr_level").eq("id", data.session.user.id).single();
      if (profileData) {
        const p = profileData as Profile;
        setProfile(p); setMode(p.role === "student" ? "student" : "teacher");
      }
      setBooting(false);
    });
  }, []);

  function startDemo(role: "student" | "teacher") {
    setIsDemo(true);
    const p: Profile = role === "student" ? { id: "demo-student", name: "Naila Putri", username: "naila", role: "student", cefr_level: "A2" } : { id: "demo-teacher", name: "Yusril Maulana", username: "yusril", role: "teacher", cefr_level: "B2" };
    setProfile(p); setMode(role);
  }

  async function logout() {
    if (!isDemo) await getSupabase()?.auth.signOut();
    setProfile(null); setIsDemo(false); setMode("landing");
  }

  if (booting) return <div className="boot-screen"><div className="boot-logo"><Brand /></div><Loader2 className="spin" /></div>;
  return <>
    {mode === "landing" && <Landing onDemo={startDemo} onLogin={() => setShowLogin(true)} />}
    {mode === "student" && profile && <StudentShell profile={profile} isDemo={isDemo} onLogout={logout} />}
    {mode === "teacher" && profile && <TeacherShell profile={profile} isDemo={isDemo} onLogout={logout} />}
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={(p) => { setProfile(p); setIsDemo(false); setMode(p.role === "student" ? "student" : "teacher"); setShowLogin(false); }} />}
  </>;
}
