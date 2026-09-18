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
import StudentCreateModal from "@/components/student-create-modal";
import { PinChangeCard, StudentPinResetModal } from "@/components/pin-security";
import StudentTaskStrip from "@/components/student-task-strip";
import LearningMaterialPanel from "@/components/learning-material-panel";
import { SPEAKING_RUBRIC, RUBRIC_NAME, rubricOverall, rubricPerformanceLabel } from "@/lib/speaking-rubric";
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
type StudentView = "home" | "tasks" | "progress" | "profile";
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
  task_fulfilment?: number | null;
  grammar?: number | null;
  overall_score?: number | null;
  positive_feedback: string;
  improvement_feedback: string;
  rubric_name?: string | null;
  created_at?: string;
  updated_at?: string;
};

type StudentReviewItem = {
  response: ResponseRow;
  speaking?: SpeakingRow;
  feedback?: FeedbackRow;
  activity?: ActivityItem;
  content?: ContentItem;
};

type AssignmentRow = {
  id: string;
  activity_id: string;
  class_id?: string | null;
  student_id?: string | null;
  start_at?: string | null;
  deadline?: string | null;
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
      <img
        src="/brand/english-loop-logo-512.png"
        alt="English Loop"
        className="brand-image"
        draggable={false}
      />
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
          <button className="btn btn-dark landing-signin" onClick={onLogin}>Sign in <ArrowRight size={16} /></button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Built for real English expression</div>
          <h1>Learn from English.<br /><span>Speak with English.</span></h1>
          <p>English Loop turns authentic input into short, repeatable speaking practice — so students do more than understand English. They use it.</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={onLogin}>Sign in to English Loop <ArrowRight size={18} /></button>
            <button className="btn btn-soft btn-lg" onClick={() => onDemo("student")}>Preview Student</button>
            <button className="btn btn-ghost btn-lg" onClick={() => onDemo("teacher")}>Preview Teacher</button>
          </div>
          <div className="hero-proof">
            <div><strong>01</strong><span>Task</span></div>
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
            ["01", "Task", "Open one structured task that combines material, understanding, and output.", ListChecks],
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
        <div className="login-copy"><h2>Welcome back.</h2><p>Sign in with your English Loop username and 6-digit PIN.</p></div>
        <form onSubmit={submit} className="stack-form">
          <label><span>Username</span><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. naila" required autoFocus /></label>
          <label><span>PIN</span><input value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 6))} type="password" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} placeholder="6-digit PIN" required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary btn-lg full" disabled={busy}>{busy ? <Loader2 className="spin" size={17} /> : <ArrowRight size={17} />} {busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <div className="demo-hint"><CheckCircle2 size={16} /><span>Students and PIN access are managed by the English Loop admin.</span></div>
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
  const [submitError, setSubmitError] = useState("");
  const meta = typeMeta[content.content_type];
  const Icon = meta.icon;
  const steps = ["Learn", "Understand", "Speak", "Reflect"];

  async function finish() {
    if (!audioBlob) return;
    setBusy(true);
    setSubmitError("");
    try {
      await onSubmit({ answers, confidence, difficulty, note, audioBlob, audioSeconds });
      setStep(4);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed. Please try again.");
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
          <LearningMaterialPanel content={content} />
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
          {submitError&&<p role="alert" className="form-error">Could not submit: {submitError}. Your recording is still here; please try again.</p>}
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
  const [assignments, setAssignments] = useState<AssignmentRow[]>(isDemo ? demoActivities.filter((a)=>a.pathway_order&&demoContents.find((c)=>c.id===a.content_id)?.cefr_level==="Pre-A1").sort((a,b)=>(a.pathway_order||0)-(b.pathway_order||0)).slice(0,3).map((activity, index) => ({
    id: `demo-assignment-${index + 1}`,
    activity_id: activity.id,
    class_id: "c1",
    start_at: new Date().toISOString(),
    deadline: new Date(Date.now() + (index + 2) * 86400000).toISOString(),
  })) : []);
  const [vocabulary, setVocabulary] = useState<Array<{ id?: string; word: string; meaning?: string | null }>>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [selectedReview, setSelectedReview] = useState<StudentReviewItem | null>(null);
  const [loading, setLoading] = useState(!isDemo);

  const loadData = useCallback(async () => {
    if (isDemo) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setLoading(true);
    const [contentRes, activityRes, questionRes, responseRes, speakRes, feedbackRes, vocabRes, assignmentRes] = await Promise.all([
      supabase.from("contents").select("*").eq("is_published", true).order("created_at"),
      supabase.from("activities").select("*").eq("is_published", true).order("created_at"),
      supabase.from("activity_questions").select("*").order("sort_order"),
      supabase.from("responses").select("*").eq("student_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("speaking_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("feedback").select("*").order("created_at", { ascending: false }),
      supabase.from("vocabulary").select("*").eq("student_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("assignments").select("*").order("created_at", { ascending: false }),
    ]);
    if (contentRes.data) setContents(contentRes.data as ContentItem[]);
    if (activityRes.data) setActivities(activityRes.data as ActivityItem[]);
    if (questionRes.data) setQuestions(questionRes.data as QuestionItem[]);
    if (responseRes.data) setResponses(responseRes.data as ResponseRow[]);
    if (speakRes.data) setSpeaking(speakRes.data as SpeakingRow[]);
    if (feedbackRes.data) setFeedback(feedbackRes.data as FeedbackRow[]);
    if (vocabRes.data) setVocabulary(vocabRes.data as typeof vocabulary);
    if (assignmentRes.data) setAssignments(assignmentRes.data as AssignmentRow[]);
    setLoading(false);
  }, [isDemo, profile.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const completed = responses.filter((r) => r.status === "submitted").length;
  const speakingSeconds = speaking.reduce((sum, row) => sum + row.duration_seconds, 0);
  const stats = [
    { label: "Activities", value: completed, icon: CheckCircle2 },
    { label: "Speaking", value: speaking.length, icon: Mic },
    { label: "Minutes", value: Math.round(speakingSeconds / 60), icon: Clock3 },
    { label: "Vocabulary", value: vocabulary.length, icon: BookOpen },
  ];
  const assignedActivityIds = useMemo(() => new Set(assignments.map((item) => item.activity_id)), [assignments]);
  const taskActivities = activities
    .filter((activity) => {
      const content = contents.find((item) => item.id === activity.content_id);
      return assignedActivityIds.has(activity.id) || content?.cefr_level === profile.cefr_level;
    })
    .sort((a, b) => {
    const aAssigned = assignedActivityIds.has(a.id) ? 0 : 1;
    const bAssigned = assignedActivityIds.has(b.id) ? 0 : 1;
    if (aAssigned !== bAssigned) return aAssigned - bAssigned;
    return (a.pathway_order ?? 999) - (b.pathway_order ?? 999);
    });
  const incomplete = taskActivities.find((a) => !responses.some((r) => r.activity_id === a.id && r.status === "submitted"))
    || taskActivities[0];
  const speakingByResponse = useMemo(() => Object.fromEntries(speaking.map((item) => [item.response_id, item])), [speaking]);
  const feedbackBySpeaking = useMemo(() => Object.fromEntries(feedback.map((item) => [item.speaking_id, item])), [feedback]);
  const activityById = useMemo(() => Object.fromEntries(activities.map((item) => [item.id, item])), [activities]);
  const contentById = useMemo(() => Object.fromEntries(contents.map((item) => [item.id, item])), [contents]);
  const reviewItems = useMemo<StudentReviewItem[]>(() => responses
    .filter((response) => response.status === "submitted")
    .map((response) => {
      const speakingItem = speakingByResponse[response.id] as SpeakingRow | undefined;
      const activityItem = activityById[response.activity_id] as ActivityItem | undefined;
      return {
        response,
        speaking: speakingItem,
        feedback: speakingItem ? feedbackBySpeaking[speakingItem.id] as FeedbackRow | undefined : undefined,
        activity: activityItem,
        content: activityItem ? contentById[activityItem.content_id] as ContentItem | undefined : undefined,
      };
    })
    .sort((a,b) => new Date(b.response.submitted_at || 0).getTime() - new Date(a.response.submitted_at || 0).getTime()),
  [responses, speakingByResponse, feedbackBySpeaking, activityById, contentById]);
  const reviewedItems = reviewItems.filter((item) => Boolean(item.feedback));
  const averageReviewScore = reviewedItems.length
    ? Math.round(reviewedItems.reduce((sum,item)=>sum+(item.feedback?.overall_score ?? 0),0)/reviewedItems.length)
    : null;
  const latestReviewed = reviewedItems[0];

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
              <div className="focus-content"><div className="focus-label"><Sparkles size={14} /> YOUR NEXT TASK</div><h2>{incomplete?.title || "Choose your next task"}</h2><p>{incomplete?.speaking_prompt || "Open your task pathway and turn the material into real English practice."}</p><button className="btn btn-light" onClick={() => incomplete ? setSelectedActivity(incomplete) : setView("tasks")}>{incomplete ? "Continue today’s task" : "Open tasks"} <ArrowRight size={17} /></button></div>
              <div className="focus-loop"><div className="focus-ring"><Mic size={28} /></div><span>INPUT</span><i>→</i><span>OUTPUT</span></div>
            </section>
            <div className="stat-grid">{stats.map(({label,value,icon: Icon}) => <div className="stat-card" key={label}><div className="stat-icon"><Icon size={18} /></div><strong>{value}</strong><span>{label}</span></div>)}</div>
            <StudentTaskStrip assignments={assignments} activities={taskActivities} contents={contents} responses={responses} onOpen={setSelectedActivity} />
            <button className="text-btn" onClick={() => setView("tasks")}>See the full pathway <ArrowRight size={15} /></button>
          </div>}

          {view === "tasks" && <div className="student-page">
            <div className="page-intro"><div><div className="eyebrow">MY TASK PATHWAY</div><h1>Learn it. Use it. Complete it.</h1><p>Each task keeps the material and practice together, so you always know what to do next.</p></div><div className="streak-pill"><GraduationCap size={17} /> {profile.cefr_level} pathway</div></div>
            <div className="journey-hero">
              <div><small>CURRENT LEARNING PATH</small><strong>{profile.cefr_level === "Pre-A1" ? "Foundations" : profile.cefr_level}</strong><span>{profile.cefr_level === "Pre-A1" ? "Alphabet, numbers, greetings, basic vocabulary, and core grammar before A1." : "Tasks matched to your current learning level."}</span></div>
              <div className="review-journey-summary"><div><strong>{completed}</strong><span>complete</span></div><div><strong>{Math.max(taskActivities.length-completed,0)}</strong><span>to go</span></div></div>
            </div>
            <div className="section-row"><div><h2>Day-by-day tasks</h2><p>Open the material first, understand it, then speak and submit in one flow.</p></div></div>
            <div className="speak-list">{taskActivities.map((activity, index) => {
              const content=contents.find((c)=>c.id===activity.content_id); if(!content) return null;
              const done=responses.some((r)=>r.activity_id===activity.id&&r.status==="submitted");
              const assigned=assignedActivityIds.has(activity.id);
              const meta=typeMeta[content.content_type]; const InputIcon=meta.icon;
              const day=activity.pathway_order ?? index+1;
              return <article className="speak-row" key={activity.id}>
                <div className={classNames("speak-row-icon",meta.className)}><span style={{fontWeight:800,fontSize:12}}>D{day}</span></div>
                <div className="speak-row-main">
                  <div className="content-tags"><span>{content.cefr_level}</span><span><InputIcon size={12}/> {meta.label}</span><span>{content.duration_minutes} min</span>{assigned&&<span className="assigned-tag">Assigned</span>}{done&&<span className="done-tag">Done</span>}</div>
                  <h3>{activity.title}</h3>
                  <p>{content.description || content.topic}</p>
                  <div className="content-tags"><span>1 {content.content_type === "listen" ? "Listen & learn" : "Material"}</span><span>2 Read & understand</span><span>3 Speak</span><span>4 Submit</span></div>
                </div>
                <button className="btn btn-soft" onClick={()=>setSelectedActivity(activity)}>{done?"Practice again":"Start task"}<ArrowRight size={15}/></button>
              </article>;
            })}</div>
            {!taskActivities.length&&<div className="student-review-empty"><ListChecks size={26}/><h3>No tasks yet</h3><p>Your teacher&apos;s learning tasks will appear here.</p></div>}
          </div>}

          {view === "progress" && <div className="student-page">
            <div className="page-intro"><div><div className="eyebrow">MY ENGLISH JOURNEY</div><h1>Your progress, reviews, and next steps.</h1><p>See what you submitted, what your teacher reviewed, and exactly what to improve next.</p></div></div>

            <div className="journey-hero review-journey-hero">
              <div><small>TEACHER-REVIEWED SPEAKING</small><strong>{averageReviewScore!==null?`${averageReviewScore}/100`:"—"}</strong><span>{reviewedItems.length ? `average from ${reviewedItems.length} review${reviewedItems.length===1?"":"s"}` : "Your score appears after your first teacher review."}</span></div>
              <div className="review-journey-summary">
                <div><strong>{completed}</strong><span>submitted</span></div>
                <div><strong>{reviewedItems.length}</strong><span>reviewed</span></div>
                <div><strong>{Math.max(completed-reviewedItems.length,0)}</strong><span>waiting</span></div>
              </div>
            </div>

            <div className="stat-grid">{stats.map(({label,value,icon:Icon})=><div className="stat-card" key={label}><div className="stat-icon"><Icon size={18}/></div><strong>{value}</strong><span>{label}</span></div>)}</div>

            <section className="student-results-section">
              <div className="section-row results-section-head"><div><h2>Speaking reviews</h2><p>Your teacher&apos;s scores and feedback for every submitted speaking activity.</p></div>{reviewedItems.length>0&&<span className="reviewed-count"><Trophy size={14}/>{reviewedItems.length} reviewed</span>}</div>
              <div className="student-review-list">
                {reviewItems.map((item) => {
                  const reviewed=Boolean(item.feedback);
                  const score=item.feedback?.overall_score;
                  return <article className={classNames("student-review-card",reviewed&&"is-reviewed")} key={item.response.id}>
                    <div className="student-review-score">
                      {reviewed?<><strong>{score ?? "—"}</strong><span>/100</span></>:<Clock3 size={22}/>}
                    </div>
                    <div className="student-review-main">
                      <div className="student-review-topline">
                        <span className={classNames("review-status",reviewed?"reviewed":"waiting")}>{reviewed?"Reviewed":"Waiting for teacher review"}</span>
                        <small>{item.response.submitted_at ? new Date(item.response.submitted_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "Submitted"}</small>
                      </div>
                      <h3>{item.activity?.title || item.content?.title || "Speaking activity"}</h3>
                      <p>{reviewed
                        ? item.feedback?.improvement_feedback || "Open your result to see the full rubric."
                        : "Your recording has been submitted. Your teacher will listen and publish a review."}</p>
                      {reviewed&&<div className="review-mini-scores">
                        <span>Task {item.feedback?.task_fulfilment ?? item.feedback?.comprehension}/5</span>
                        <span>Fluency {item.feedback?.fluency}/5</span>
                        <span>Grammar {item.feedback?.grammar ?? item.feedback?.confidence}/5</span>
                        <span>Vocabulary {item.feedback?.vocabulary}/5</span>
                        <span>Pronunciation {item.feedback?.pronunciation}/5</span>
                      </div>}
                    </div>
                    <button className="btn btn-soft student-review-open" onClick={()=>setSelectedReview(item)}>{reviewed?"View result":"View submission"}<ChevronRight size={15}/></button>
                  </article>
                })}
                {!reviewItems.length&&<div className="student-review-empty"><Mic size={26}/><h3>No speaking submissions yet</h3><p>Complete a speaking activity first. Your teacher review will appear here afterward.</p></div>}
              </div>
            </section>

            <div className="progress-columns">
              <section className="panel-card"><div className="panel-title"><div><h3>Vocabulary collected</h3><p>Words you met inside real context.</p></div><BookOpen size={20}/></div>{vocabulary.length?<div className="word-cloud">{vocabulary.slice(0,12).map((item,i)=><span key={`${item.word}-${i}`}>{item.word}</span>)}</div>:<div className="empty-mini"><BookOpen size={22}/><p>Useful words you collect from activities will appear here.</p></div>}</section>
              <section className="panel-card"><div className="panel-title"><div><h3>Latest teacher feedback</h3><p>Focus on one improvement at a time.</p></div><MessageSquareText size={20}/></div>{latestReviewed?.feedback?<div className="feedback-snippet"><strong>You did well</strong><p>{latestReviewed.feedback.positive_feedback}</p><strong>Try this next</strong><p>{latestReviewed.feedback.improvement_feedback}</p><button className="text-btn" onClick={()=>setSelectedReview(latestReviewed)}>Open full review <ArrowRight size={14}/></button></div>:<div className="empty-mini"><Sparkles size={22}/><p>Your teacher feedback will appear here after a speaking submission is reviewed.</p></div>}</section>
            </div>
          </div>}

          {view === "profile" && <div className="student-page">
            <div className="profile-card">
              <div className="big-avatar">{profile.name.charAt(0)}</div>
              <div><div className="eyebrow">STUDENT PROFILE</div><h1>{profile.name}</h1><p>@{profile.username || "student"}</p></div>
              <div className="profile-chips"><span>{profile.cefr_level}</span><span>{isDemo?"Class 10A":"English Loop"}</span></div>
              <button className="btn btn-soft" onClick={onLogout}><LogOut size={16}/> Leave {isDemo?"demo":"account"}</button>
            </div>
            <div className="profile-message"><Sparkles size={22}/><div><strong>Your goal is not to sound perfect.</strong><p>Your goal is to have more things to say, and more courage to say them.</p></div></div>
            <PinChangeCard isDemo={isDemo} />
          </div>}
        </>}
      </main>

      <nav className="student-bottom-nav">
        {[
          ["home","Home",Home],["tasks","Tasks",ListChecks],["progress","Progress",BarChart3],["profile","Profile",User]
        ].map(([key,label,Icon])=>{const IconComp=Icon as typeof Home; return <button key={key as string} className={classNames(view===key&&"active")} onClick={()=>{setView(key as StudentView);if(key==="progress"&&!isDemo)void loadData()}}><IconComp size={20}/><span>{label as string}</span></button>})}
      </nav>

      {selectedActivity && selectedContent && <ActivityExperience activity={selectedActivity} content={selectedContent} questions={selectedQuestions} onClose={()=>setSelectedActivity(null)} onSubmit={submitActivity}/>}
      {selectedReview && <StudentResultModal item={selectedReview} questions={questions} isDemo={isDemo} onClose={()=>setSelectedReview(null)} />}
    </div>
  );
}

function StudentResultModal({item,questions,isDemo,onClose}:{item:StudentReviewItem;questions:QuestionItem[];isDemo:boolean;onClose:()=>void}){
  const reviewed=Boolean(item.feedback);
  const feedback=item.feedback;
  const responseQuestions=questions.filter((q)=>q.activity_id===item.response.activity_id).sort((a,b)=>a.sort_order-b.sort_order);
  const criteria=[
    ["Task Fulfilment",feedback?.task_fulfilment ?? feedback?.comprehension],
    ["Fluency & Coherence",feedback?.fluency],
    ["Grammar",feedback?.grammar ?? feedback?.confidence],
    ["Vocabulary",feedback?.vocabulary],
    ["Pronunciation & Intelligibility",feedback?.pronunciation],
  ] as Array<[string,number|undefined|null]>;
  const score=feedback?.overall_score ?? null;

  return <div className="student-result-backdrop" onMouseDown={onClose}>
    <aside className="student-result-drawer" onMouseDown={(e)=>e.stopPropagation()}>
      <div className="student-result-head">
        <button className="icon-btn" onClick={onClose}><X size={18}/></button>
        <div><span>{reviewed?"TEACHER REVIEW":"SUBMISSION"}</span><h2>{item.activity?.title || item.content?.title || "Speaking activity"}</h2><p>{item.response.submitted_at?new Date(item.response.submitted_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):"Submitted"}</p></div>
        <div className={classNames("result-status-pill",reviewed?"reviewed":"waiting")}>{reviewed?"Reviewed":"Waiting"}</div>
      </div>

      <div className="student-result-scroll">
        {reviewed&&<section className="result-score-hero">
          <div><span>OVERALL SCORE</span><strong>{score ?? "—"}<small>/100</small></strong><p>{score!==null?rubricPerformanceLabel(score):"Teacher-reviewed result"}</p></div>
          <Trophy size={30}/>
        </section>}

        {item.speaking&&<section className="result-section">
          <div className="result-section-title"><div><span>MY RECORDING</span><strong>Listen back to your speaking</strong></div><small>{formatDuration(item.speaking.duration_seconds)}</small></div>
          <PrivateAudioPlayer storagePath={item.speaking.storage_path} isDemo={isDemo}/>
        </section>}

        {reviewed&&<section className="result-section">
          <div className="result-section-title"><div><span>RUBRIC BREAKDOWN</span><strong>{feedback?.rubric_name || RUBRIC_NAME}</strong></div></div>
          <div className="result-rubric-list">{criteria.map(([label,value])=><div className="result-rubric-row" key={label}><span>{label}</span><div className="result-score-dots">{[1,2,3,4,5].map(n=><i key={n} className={n<=(value||0)?"filled":""}/>)}</div><strong>{value ?? "—"}/5</strong></div>)}</div>
        </section>}

        {reviewed&&<section className="result-feedback-grid">
          <div className="result-feedback-card strength"><CheckCircle2 size={18}/><span>YOU DID WELL</span><p>{feedback?.positive_feedback}</p></div>
          <div className="result-feedback-card next"><ArrowRight size={18}/><span>NEXT STEP</span><p>{feedback?.improvement_feedback}</p></div>
        </section>}

        <section className="result-section">
          <div className="result-section-title"><div><span>MY RESPONSES</span><strong>What you submitted</strong></div></div>
          <div className="result-answer-list">
            {responseQuestions.map((q)=><div className="result-answer" key={q.id}><span>{q.prompt}</span><p>{item.response.answers?.[q.id] || "No written answer"}</p></div>)}
            {item.response.reflection_note&&<div className="result-answer reflection"><span>Reflection</span><p>{item.response.reflection_note}</p></div>}
            {!responseQuestions.length&&!item.response.reflection_note&&<div className="answer-review-empty">No written responses were submitted with this activity.</div>}
          </div>
        </section>

        {!reviewed&&<section className="result-waiting-card"><Clock3 size={24}/><div><strong>Waiting for teacher review</strong><p>Your recording is submitted. Once your teacher listens and saves the assessment, your score, rubric breakdown, and feedback will appear here automatically.</p></div></section>}
      </div>
    </aside>
  </div>
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
  const [assignments, setAssignments] = useState<any[]>(isDemo ? demoActivities.slice(0,2).map((activity,index)=>({id:`demo-teacher-assignment-${index}`,activity_id:activity.id,class_id:"c1",deadline:new Date(Date.now()+(index+2)*86400000).toISOString()})) : []);
  const [questions, setQuestions] = useState<any[]>(isDemo ? demoQuestions : []);
  const [newClassName, setNewClassName] = useState("");
  const [newSchoolYear, setNewSchoolYear] = useState("2026/2027");
  const [systemBusy, setSystemBusy] = useState(false);
  const [selectedSpeaking, setSelectedSpeaking] = useState<any | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isDemo);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [studentCreatorOpen, setStudentCreatorOpen] = useState(false);
  const [pinStudent, setPinStudent] = useState<any | null>(null);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<any | null>(null);
  const [builder, setBuilder] = useState({ title:"", type:"read", level:"A2", topic:"", duration:"4", body:"", prompt:"", min:"45", max:"90", classId:"", deadline:"", materialType:"text", youtubeUrl:"" });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [builderBusy, setBuilderBusy] = useState(false);

  const loadTeacher = useCallback(async()=>{
    if(isDemo) return;
    const supabase=getSupabase(); if(!supabase) return;
    setLoading(true);
    const [profilesRes, contentRes, activityRes, classRes, responseRes, speakingRes, feedbackRes, assignmentRes, questionRes]=await Promise.all([
      supabase.from("profiles").select("*").eq("role","student").order("name"),
      supabase.from("contents").select("*").order("created_at",{ascending:false}),
      supabase.from("activities").select("*").order("created_at",{ascending:false}),
      supabase.from("classes").select("*").order("name"),
      supabase.from("responses").select("*").order("submitted_at",{ascending:false}),
      supabase.from("speaking_submissions").select("*").order("created_at",{ascending:false}),
      supabase.from("feedback").select("*").order("created_at",{ascending:false}),
      supabase.from("assignments").select("*").order("created_at",{ascending:false}),
      supabase.from("activity_questions").select("*").order("sort_order"),
    ]);
    if(profilesRes.data) setStudents(profilesRes.data);
    if(contentRes.data) setContents(contentRes.data);
    if(activityRes.data) setActivities(activityRes.data);
    if(classRes.data) setClasses(classRes.data);
    if(responseRes.data) setResponses(responseRes.data);
    if(speakingRes.data) setSpeaking(speakingRes.data);
    if(feedbackRes.data) setFeedback(feedbackRes.data);
    if(assignmentRes.data) setAssignments(assignmentRes.data);
    if(questionRes.data) setQuestions(questionRes.data);
    setLoading(false);
  },[isDemo]);
  useEffect(()=>{loadTeacher()},[loadTeacher]);

  const pending = isDemo ? speaking.filter((s:any)=>!s.feedback).length : speaking.filter((s:any)=>!feedback.some((f:any)=>f.speaking_id===s.id)).length;
  const responseMap=useMemo(()=>Object.fromEntries(responses.map((r:any)=>[r.id,r])),[responses]);
  const studentMap=useMemo(()=>Object.fromEntries(students.map((s:any)=>[s.id,s])),[students]);
  const activityMap=useMemo(()=>Object.fromEntries(activities.map((a:any)=>[a.id,a])),[activities]);
  const questionMap=useMemo(()=>Object.fromEntries(questions.map((q:any)=>[q.id,q])),[questions]);

  function submissionMeta(item:any){
    if(isDemo) return item;
    const response=responseMap[item.response_id];
    const answerItems=Object.entries(response?.answers||{}).map(([questionId,value])=>({
      id:questionId,
      prompt:questionMap[questionId]?.prompt || "Student response",
      value:String(value||"")
    })).filter((row:any)=>row.value.trim());
    return {
      ...item,
      student: studentMap[response?.student_id]?.name || "Student",
      activity: activityMap[response?.activity_id]?.title || "Activity",
      feedback: feedback.some((f:any)=>f.speaking_id===item.id),
      answers: answerItems,
      reflection_note: response?.reflection_note || "",
      confidence: response?.confidence || null,
      difficulty: response?.difficulty || null,
    };
  }

  async function openSubmission(item:any){
    const meta=submissionMeta(item); setSelectedSpeaking(meta); setAudioUrl(null);
    if(isDemo) return;
    const supabase=getSupabase(); if(!supabase) return;
    const {data}=await supabase.storage.from("speaking-audio").createSignedUrl(item.storage_path,600);
    if(data?.signedUrl) setAudioUrl(data.signedUrl);
  }

  function openMaterialBuilder(materialType:"text"|"youtube"|"pdf"){
    setBuilder((current)=>({
      ...current,
      materialType,
      type: materialType==="youtube" ? "watch" : materialType==="pdf" ? "read" : current.type,
      youtubeUrl: materialType==="youtube" ? current.youtubeUrl : "",
    }));
    setPdfFile(null);
    setBuilderOpen(true);
  }

  async function createActivity(e:React.FormEvent){
    e.preventDefault();
    if(builder.materialType==="youtube" && !builder.youtubeUrl.trim()){window.alert("Paste a YouTube link first.");return;}
    if(builder.materialType==="pdf" && !pdfFile){window.alert("Choose a PDF file first.");return;}
    if(pdfFile && (pdfFile.type!=="application/pdf" || pdfFile.size>25*1024*1024)){window.alert("PDF must be a PDF file no larger than 25 MB.");return;}

    const resetBuilder=()=>{
      setBuilder({title:"",type:"read",level:"A2",topic:"",duration:"4",body:"",prompt:"",min:"45",max:"90",classId:"",deadline:"",materialType:"text",youtubeUrl:""});
      setPdfFile(null);
    };

    if(isDemo){
      const contentId=`demo-content-${Date.now()}`, activityId=`demo-act-${Date.now()}`;
      const demoPdfUrl=builder.materialType==="pdf"&&pdfFile?URL.createObjectURL(pdfFile):null;
      setContents((old:any[])=>[{
        id:contentId,title:builder.title,description:`Teacher-created ${builder.type} content`,
        content_type:builder.type,
        format:builder.materialType==="youtube"?"YouTube":builder.materialType==="pdf"?"PDF":builder.type==="read"?"Article":builder.type==="watch"?"Short video":"Mini podcast",
        cefr_level:builder.level,topic:builder.topic,duration_minutes:Number(builder.duration),
        content_body:builder.body,content_url:builder.materialType==="youtube"?builder.youtubeUrl:demoPdfUrl,
        material_type:builder.materialType,storage_path:null,source:"Teacher material",vocabulary_focus:[]
      },...old]);
      setActivities((old:any[])=>[{id:activityId,content_id:contentId,title:builder.title,speaking_prompt:builder.prompt,instructions:"Consume the input, capture the main idea, then speak in your own words.",min_duration_seconds:Number(builder.min),max_duration_seconds:Number(builder.max)},...old]);
      if(builder.classId)setAssignments((old:any[])=>[{id:`demo-assignment-${Date.now()}`,activity_id:activityId,class_id:builder.classId,deadline:builder.deadline?new Date(`${builder.deadline}T23:59:59`).toISOString():null},...old]);
      resetBuilder();setBuilderOpen(false);return;
    }

    const supabase=getSupabase();if(!supabase)return;
    setBuilderBusy(true);
    let storagePath:string|null=null;

    if(builder.materialType==="pdf"&&pdfFile){
      const safeName=pdfFile.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
      storagePath=`materials/${Date.now()}-${safeName}`;
      const {error:uploadError}=await supabase.storage.from("learning-materials").upload(storagePath,pdfFile,{contentType:"application/pdf",upsert:false});
      if(uploadError){setBuilderBusy(false);window.alert(uploadError.message);return;}
    }

    const {data:content,error:contentError}=await supabase.from("contents").insert({
      title:builder.title,
      description:`${builder.topic} · ${builder.level}`,
      content_type:builder.type,
      format:builder.materialType==="youtube"?"YouTube":builder.materialType==="pdf"?"PDF":builder.type==="read"?"article":builder.type==="watch"?"short video":"mini podcast",
      cefr_level:builder.level,
      topic:builder.topic,
      duration_minutes:Number(builder.duration),
      content_body:builder.body||null,
      content_url:builder.materialType==="youtube"?builder.youtubeUrl.trim():null,
      material_type:builder.materialType,
      storage_path:storagePath,
      source:builder.materialType==="youtube"?"YouTube":builder.materialType==="pdf"?"Uploaded PDF":"English Loop",
      vocabulary_focus:[],
      is_published:true,
      created_by:profile.id
    }).select("id").single();

    if(contentError||!content){
      if(storagePath)await supabase.storage.from("learning-materials").remove([storagePath]);
      setBuilderBusy(false);window.alert(contentError?.message||"Could not create content");return;
    }

    const {data:activity,error:activityError}=await supabase.from("activities").insert({
      content_id:content.id,title:builder.title,
      instructions:"Consume the input, capture the main idea, then speak in your own words.",
      speaking_prompt:builder.prompt,
      min_duration_seconds:Number(builder.min),
      max_duration_seconds:Number(builder.max),
      created_by:profile.id,is_published:true
    }).select("id").single();

    if(activityError||!activity){
      await supabase.from("contents").delete().eq("id",content.id);
      if(storagePath)await supabase.storage.from("learning-materials").remove([storagePath]);
      setBuilderBusy(false);window.alert(activityError?.message||"Could not create activity");return;
    }

    await supabase.from("activity_questions").insert([
      {activity_id:activity.id,kind:"short_answer",prompt:"What is the main idea?",sort_order:1},
      {activity_id:activity.id,kind:"vocabulary",prompt:"Write three useful words from this content.",sort_order:2},
      {activity_id:activity.id,kind:"reflection",prompt:"What did you find interesting?",sort_order:3},
    ]);
    if(builder.classId)await supabase.from("assignments").insert({activity_id:activity.id,class_id:builder.classId,created_by:profile.id,deadline:builder.deadline?new Date(`${builder.deadline}T23:59:59`).toISOString():null});
    resetBuilder();setBuilderBusy(false);setBuilderOpen(false);await loadTeacher();
  }

  async function deleteContent(id:string){
    if(!window.confirm("Delete this content and its linked activity?"))return;
    const item=contents.find((x:any)=>x.id===id);
    if(isDemo){setContents((old:any[])=>old.filter((x:any)=>x.id!==id));setActivities((old:any[])=>old.filter((x:any)=>x.content_id!==id));return;}
    const supabase=getSupabase();if(!supabase)return;
    if(item?.storage_path)await supabase.storage.from("learning-materials").remove([item.storage_path]);
    await supabase.from("contents").delete().eq("id",id);
    await loadTeacher();
  }

  async function deleteStudent(student:any){
    if(!window.confirm(`Remove ${student.name} from English Loop? This also removes their submissions and account data.`))return;
    if(isDemo){setStudents((old:any[])=>old.filter((x:any)=>x.id!==student.id));return;}
    const supabase=getSupabase();if(!supabase)return;
    const {data,error}=await supabase.functions.invoke("admin-create-student",{body:{action:"delete_student",student_id:student.id}});
    if(error||!data?.ok){window.alert(data?.error||error?.message||"Could not remove student.");return;}
    await loadTeacher();
  }

  async function createClass(e:React.FormEvent){
    e.preventDefault();
    const name=newClassName.trim();
    if(!name)return;
    if(isDemo){
      setClasses((old:any[])=>[...old,{id:`demo-class-${Date.now()}`,name,school_year:newSchoolYear.trim()||null}].sort((a,b)=>a.name.localeCompare(b.name)));
      setNewClassName("");
      return;
    }
    const supabase=getSupabase();if(!supabase)return;
    setSystemBusy(true);
    const {error}=await supabase.from("classes").insert({name,school_year:newSchoolYear.trim()||null});
    setSystemBusy(false);
    if(error){window.alert(error.message);return;}
    setNewClassName("");await loadTeacher();
  }

  async function deleteClass(item:any){
    if(!window.confirm(`Delete class ${item.name}? Students assigned to it should be moved first.`))return;
    if(isDemo){setClasses((old:any[])=>old.filter((c:any)=>c.id!==item.id));return;}
    const supabase=getSupabase();if(!supabase)return;
    const {error}=await supabase.from("classes").delete().eq("id",item.id);
    if(error){window.alert("Class cannot be deleted while it is still used by students or assignments.");return;}
    await loadTeacher();
  }

  async function clearStudentTrialData(){
    if(!window.confirm("Clear ALL student accounts, responses, recordings, vocabulary, and feedback? Materials and classes will be kept."))return;
    if(isDemo){
      setStudents([]);setResponses([]);setSpeaking([]);setFeedback([]);
      return;
    }
    const supabase=getSupabase();if(!supabase)return;
    setSystemBusy(true);
    const {data,error}=await supabase.functions.invoke("admin-create-student",{body:{action:"clear_trial_data"}});
    setSystemBusy(false);
    if(error||!data?.ok){window.alert(data?.error||error?.message||"Could not clear trial data.");return;}
    await loadTeacher();
  }

  const navItems:[TeacherView,string,typeof Home][]=[
    ["dashboard","Dashboard",Home],["students","Students",Users],["content","Content",Library],["activities","Activities",ListChecks],["submissions","Submissions",Mic],["progress","Progress",BarChart3],["settings","Admin Settings",Settings]
  ];

  return <div className="teacher-app">
    <aside className={classNames("teacher-sidebar",mobileMenu&&"open")}>
      <div className="teacher-brand-row"><Brand/><button className="icon-btn sidebar-close" onClick={()=>setMobileMenu(false)}><X size={18}/></button></div>
      <div className="teacher-school"><div className="school-icon"><GraduationCap size={20}/></div><div><strong>English Loop Admin</strong><span>Teacher & system management</span></div></div>
      <nav className="teacher-nav">{navItems.map(([key,label,Icon])=><button key={key} className={classNames(view===key&&"active")} onClick={()=>{setView(key);setMobileMenu(false)}}><Icon size={18}/><span>{label}</span>{key==="submissions"&&pending>0&&<b>{pending}</b>}</button>)}</nav>
      <div className="teacher-sidebar-foot"><div className="teacher-profile"><div className="small-avatar">{profile.name.charAt(0)}</div><div><strong>{profile.name}</strong><span>{isDemo?"Teacher Demo":"Teacher"}</span></div></div><button className="icon-btn" onClick={onLogout}><LogOut size={18}/></button></div>
    </aside>
    {mobileMenu&&<div className="sidebar-scrim" onClick={()=>setMobileMenu(false)}/>} 
    <main className="teacher-main">
      <header className="teacher-mobile-head"><button className="icon-btn" onClick={()=>setMobileMenu(true)}><Menu size={20}/></button><Brand compact/><span/></header>
      {loading?<div className="loading-screen"><Loader2 className="spin"/><span>Preparing teacher workspace…</span></div>:<>
        {view==="dashboard"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">TEACHER DASHBOARD</div><h1>{greeting()}, {profile.name.split(" ")[0]}.</h1><p>See where students are in the loop and what needs your attention.</p></div><button className="btn btn-primary" onClick={()=>setBuilderOpen(true)}><Plus size={17}/> New activity</button></div><div className="teacher-stats"><div><span><Users size={18}/></span><strong>{students.length}</strong><small>Students</small></div><div><span><ListChecks size={18}/></span><strong>{activities.length}</strong><small>Activities</small></div><div><span><Mic size={18}/></span><strong>{speaking.length}</strong><small>Submissions</small></div><div className="attention"><span><MessageSquareText size={18}/></span><strong>{pending}</strong><small>Pending feedback</small></div></div><div className="teacher-grid"><section className="teacher-panel wide"><div className="panel-title"><div><h3>Recent speaking</h3><p>Latest student output waiting in the loop.</p></div><button className="text-btn" onClick={()=>setView("submissions")}>View all <ArrowRight size={15}/></button></div><div className="submission-table"><div className="table-head"><span>Student</span><span>Activity</span><span>Duration</span><span>Feedback</span><span/></div>{speaking.slice(0,5).map((row:any)=>{const meta=submissionMeta(row);return <button className="table-row" key={row.id} onClick={()=>openSubmission(row)}><span><b className="table-avatar">{meta.student.charAt(0)}</b>{meta.student}</span><span>{meta.activity}</span><span>{formatDuration(meta.duration_seconds)}</span><span className={meta.feedback?"status-done":"status-pending"}>{meta.feedback?"Done":"Pending"}</span><span><ChevronRight size={16}/></span></button>})}{!speaking.length&&<div className="empty-table">No speaking submissions yet.</div>}</div></section><section className="teacher-panel"><div className="panel-title"><div><h3>Loop health</h3><p>Simple signals, not noisy analytics.</p></div><BarChart3 size={20}/></div><div className="health-list"><div><span>Speaking completion</span><strong>{isDemo?"82%":speaking.length?"Active":"—"}</strong><i><b style={{width:isDemo?"82%":speaking.length?"64%":"0%"}}/></i></div><div><span>Feedback complete</span><strong>{speaking.length?`${Math.round(((speaking.length-pending)/speaking.length)*100)}%`:"—"}</strong><i><b style={{width:speaking.length?`${((speaking.length-pending)/speaking.length)*100}%`:"0%"}}/></i></div><div><span>Weekly practice</span><strong>{isDemo?"18 min":"Live"}</strong><i><b style={{width:isDemo?"74%":"48%"}}/></i></div></div></section></div></div>}

        {view==="students"&&<div className="teacher-page">
          <div className="teacher-page-head"><div><div className="eyebrow">STUDENTS</div><h1>Know the learner behind the score.</h1><p>Open each student profile to monitor scores, speaking practice, rubric development, feedback history, and submissions.</p></div><button className="btn btn-primary" onClick={()=>setStudentCreatorOpen(true)}><Plus size={17}/> Add student</button></div>
          <div className="student-table-card">
            <div className="student-table-head student-monitor-head"><span>Student</span><span>Level</span><span>Class</span><span>Activities</span><span>Speaking</span><span>Avg. score</span><span>Access</span></div>
            {students.map((s:any)=>{
              const className=isDemo?s.class_name:classes.find((c:any)=>c.id===s.class_id)?.name||"—";
              const studentResponseRows=responses.filter((r:any)=>r.student_id===s.id&&r.status==="submitted");
              const studentResponses=isDemo?s.completed:studentResponseRows.length;
              const studentSpeakRows=speaking.filter((sp:any)=>responseMap[sp.response_id]?.student_id===s.id);
              const studentSpeak=isDemo?s.speakingMinutes:studentSpeakRows.reduce((sum:number,sp:any)=>sum+sp.duration_seconds,0)/60;
              const studentFeedback=studentSpeakRows.map((sp:any)=>feedback.find((f:any)=>f.speaking_id===sp.id)).filter(Boolean);
              const avgScore=studentFeedback.length?Math.round(studentFeedback.reduce((sum:number,f:any)=>sum+(f.overall_score||0),0)/studentFeedback.length):null;
              return <div
                className="student-table-row student-monitor-row"
                key={s.id}
                role="button"
                tabIndex={0}
                onClick={()=>setSelectedStudentProfile(s)}
                onKeyDown={(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelectedStudentProfile(s)}}}
              >
                <span><b className="table-avatar">{s.name.charAt(0)}</b><div><strong>{s.name}</strong><small>@{s.username||"student"}</small></div></span>
                <span><b className="level-badge">{s.cefr_level}</b></span>
                <span>{className}</span>
                <span>{studentResponses}</span>
                <span>{Number(studentSpeak).toFixed(1)} min</span>
                <span>{avgScore!==null?<b className="student-score-pill">{avgScore}</b>:<small className="muted-score">Not reviewed</small>}</span>
                <div className="student-access-actions">
                  <button className="student-profile-btn" onClick={(e)=>{e.stopPropagation();setSelectedStudentProfile(s)}}><BarChart3 size={13}/> Profile</button>
                  <button className="student-reset-btn" onClick={(e)=>{e.stopPropagation();setPinStudent(s)}}>Reset PIN</button>
                  <button className="student-delete-btn" title="Remove student" onClick={(e)=>{e.stopPropagation();deleteStudent(s)}}><Trash2 size={14}/></button>
                </div>
              </div>
            })}
            {!students.length&&<div className="empty-table">No students yet. Use <strong>Add student</strong> to create the first learner account.</div>}
          </div>
        </div>}

        {view==="content"&&<div className="teacher-page">
          <div className="teacher-page-head"><div><div className="eyebrow">CONTENT MANAGEMENT</div><h1>Manage every learning input.</h1><p>Text, private PDF materials, and YouTube links all live in one library.</p></div><button className="btn btn-primary" onClick={()=>setBuilderOpen(true)}><Plus size={17}/> Add material</button></div>
          <div className="content-admin-summary"><div><strong>{contents.length}</strong><span>Total materials</span></div><div><strong>{contents.filter((c:any)=>c.material_type==="youtube").length}</strong><span>YouTube</span></div><div><strong>{contents.filter((c:any)=>c.material_type==="pdf").length}</strong><span>PDF</span></div><div><strong>{contents.filter((c:any)=>(c.material_type||"text")==="text").length}</strong><span>Text</span></div></div>
          <div className="teacher-content-grid">{contents.map((c:any)=>{const meta=typeMeta[c.content_type as keyof typeof typeMeta]||typeMeta.read;const Icon=meta.icon;const material=(c.material_type||"text").toUpperCase();return <article className="teacher-content-card" key={c.id}><div className={classNames("teacher-content-icon",meta.className)}><Icon size={21}/></div><div><div className="content-tags"><span>{c.cefr_level}</span><span>{material}</span><span>{c.duration_minutes||0} min</span></div><h3>{c.title}</h3><p>{c.topic} · {c.source||"English Loop"}</p>{c.material_type==="youtube"&&c.content_url&&<a className="material-mini-link" href={c.content_url} target="_blank" rel="noreferrer">Open YouTube <ArrowRight size={12}/></a>}{c.material_type==="pdf"&&<span className="material-mini-note">Private PDF · signed student access</span>}</div><button className="icon-btn danger" onClick={()=>deleteContent(c.id)}><Trash2 size={16}/></button></article>})}</div>
        </div>}

        {view==="activities"&&<div className="teacher-page">
          <div className="teacher-page-head"><div><div className="eyebrow">ACTIVITY BUILDER</div><h1>Pair every input with an output.</h1><p>Publish a challenge, assign it to a class, and give students a clear deadline.</p></div><button className="btn btn-primary" onClick={()=>setBuilderOpen(true)}><Plus size={17}/> Build activity</button></div>
          <div className="activity-admin-list">{activities.map((a:any)=>{const c=contents.find((x:any)=>x.id===a.content_id); const assignment=assignments.find((item:any)=>item.activity_id===a.id); const assignedClass=assignment?.class_id?classes.find((item:any)=>item.id===assignment.class_id)?.name:null; return <article key={a.id}><div className="activity-admin-index">{String(activities.indexOf(a)+1).padStart(2,"0")}</div><div><div className="content-tags"><span>{c?.cefr_level||"—"}</span><span>{c?.content_type||"input"}</span><span>{formatDuration(a.min_duration_seconds)}–{formatDuration(a.max_duration_seconds)}</span></div><h3>{a.title}</h3><p>“{a.speaking_prompt}”</p></div><div className="activity-admin-right"><div className="pair-badge"><span>INPUT</span><ArrowRight size={14}/><span>OUTPUT</span></div><small>{assignedClass?`Assigned · ${assignedClass}`:"Open practice"}</small>{assignment?.deadline&&<small>Due {new Date(assignment.deadline).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</small>}</div></article>})}{!activities.length&&<div className="empty-state"><ListChecks size={28}/><h3>No activities yet</h3><p>Build the first input-to-output loop for your class.</p></div>}</div>
        </div>}

        {view==="submissions"&&<div className="teacher-page">
          <div className="teacher-page-head"><div><div className="eyebrow">SUBMISSIONS & RECORDINGS</div><h1>Listen first. Then assess.</h1><p>Every real student recording can be played here. Open Review to see their written answers and score the speaking manually.</p></div><div className="pending-pill">{pending} need feedback</div></div>
          <div className="submission-review-list">
            {speaking.map((row:any)=>{const meta=submissionMeta(row);return <article key={row.id} className="submission-review-card">
              <div className="submission-review-head"><div className="submission-avatar">{meta.student.charAt(0)}</div><div><strong>{meta.student}</strong><span>{meta.activity}</span></div><div className="submission-review-meta"><span>{formatDuration(meta.duration_seconds)}</span><b className={meta.feedback?"status-done":"status-pending"}>{meta.feedback?"Feedback saved":"Needs review"}</b></div></div>
              <PrivateAudioPlayer storagePath={row.storage_path} isDemo={isDemo}/>
              <div className="submission-preview-line"><span>{meta.answers?.length||0} written answers</span>{meta.reflection_note&&<span>Reflection included</span>}</div>
              <button className="btn btn-dark submission-review-btn" onClick={()=>openSubmission(row)}>Open answers & assessment <ChevronRight size={15}/></button>
            </article>})}
            {!speaking.length&&<div className="empty-state"><Mic size={28}/><h3>No student recordings</h3><p>The old demo recordings have been removed. Real submissions will appear here after a student records and submits an activity.</p></div>}
          </div>
        </div>}

        {view==="progress"&&<div className="teacher-page"><div className="teacher-page-head"><div><div className="eyebrow">CLASS PROGRESS</div><h1>Is the class using English?</h1><p>The main metric is weekly speaking practice — not login count.</p></div></div><div className="metric-hero"><div><small>MAIN PRODUCT METRIC</small><h2>Weekly Speaking Practice</h2><p>How much active English expression is happening across the class?</p></div><div><strong>{isDemo?"54.4":(speaking.reduce((n:number,s:any)=>n+s.duration_seconds,0)/60).toFixed(1)}</strong><span>total minutes</span></div></div><div className="progress-bars-card"><div className="panel-title"><div><h3>Speaking practice by student</h3><p>Minutes submitted in English Loop.</p></div></div>{students.slice(0,8).map((s:any)=>{const mins=isDemo?s.speakingMinutes:speaking.filter((sp:any)=>responseMap[sp.response_id]?.student_id===s.id).reduce((sum:number,sp:any)=>sum+sp.duration_seconds,0)/60;const max=isDemo?20:Math.max(10,...students.map((st:any)=>speaking.filter((sp:any)=>responseMap[sp.response_id]?.student_id===st.id).reduce((sum:number,sp:any)=>sum+sp.duration_seconds,0)/60));return <div className="student-progress-row" key={s.id}><span>{s.name}</span><i><b style={{width:`${Math.min(100,(mins/max)*100)}%`}}/></i><strong>{Number(mins).toFixed(1)}m</strong></div>})}</div></div>}

        {view==="settings"&&<div className="teacher-page system-management-page">
          <div className="teacher-page-head"><div><div className="eyebrow">ADMIN · SYSTEM MANAGEMENT</div><h1>Control English Loop from one place.</h1><p>Materials, YouTube, PDF, students, PINs, classes, recordings, and trial data are managed here.</p></div></div>

          <section className="system-section">
            <div className="system-section-head"><div><span>01</span><div><h2>Learning materials</h2><p>Choose exactly what you want to add. YouTube and PDF are no longer hidden inside the generic builder.</p></div></div><button className="text-btn" onClick={()=>setView("content")}>Open full library <ArrowRight size={14}/></button></div>
            <div className="material-action-grid">
              <button className="material-action youtube" onClick={()=>openMaterialBuilder("youtube")}><Video size={24}/><strong>Add YouTube material</strong><span>Paste a YouTube URL. Students get an embedded preview plus Open on YouTube.</span><b>Paste YouTube link <ArrowRight size={14}/></b></button>
              <button className="material-action pdf" onClick={()=>openMaterialBuilder("pdf")}><BookOpen size={24}/><strong>Upload PDF material</strong><span>Upload a PDF up to 25 MB. It stays private and students receive signed access.</span><b>Choose PDF file <ArrowRight size={14}/></b></button>
              <button className="material-action text" onClick={()=>openMaterialBuilder("text")}><Library size={24}/><strong>Create text material</strong><span>Write or paste a reading, transcript, teacher notes, or short learning input.</span><b>Create text input <ArrowRight size={14}/></b></button>
            </div>
            <div className="system-mini-list">{contents.slice(0,5).map((c:any)=><div key={c.id}><div><strong>{c.title}</strong><span>{(c.material_type||"text").toUpperCase()} · {c.cefr_level} · {c.topic}</span></div><button className="icon-btn danger" onClick={()=>deleteContent(c.id)}><Trash2 size={14}/></button></div>)}{!contents.length&&<div className="system-empty">No materials yet.</div>}</div>
          </section>

          <section className="system-section">
            <div className="system-section-head"><div><span>02</span><div><h2>Students & PIN access</h2><p>Add students, reset their 6-digit PIN, or remove trial accounts.</p></div></div><button className="btn btn-primary" onClick={()=>setStudentCreatorOpen(true)}><Plus size={16}/> Add student</button></div>
            <div className="system-student-list">
              {students.map((s:any)=><div className="system-student-row" key={s.id}><div className="table-avatar">{s.name.charAt(0)}</div><div><strong>{s.name}</strong><span>@{s.username||"student"} · {classes.find((c:any)=>c.id===s.class_id)?.name||s.class_name||"No class"} · {s.cefr_level}</span></div><button className="student-reset-btn" onClick={()=>setPinStudent(s)}>Reset PIN</button><button className="student-delete-btn" onClick={()=>deleteStudent(s)}><Trash2 size={14}/></button></div>)}
              {!students.length&&<div className="system-empty">No students. Add your own trial student when you are ready.</div>}
            </div>
          </section>

          <section className="system-section">
            <div className="system-section-head"><div><span>03</span><div><h2>Classes</h2><p>Create and remove the classes used for student grouping and assignments.</p></div></div></div>
            <form className="class-create-form" onSubmit={createClass}><input value={newClassName} onChange={(e)=>setNewClassName(e.target.value)} placeholder="Class name, e.g. 10A" required/><input value={newSchoolYear} onChange={(e)=>setNewSchoolYear(e.target.value)} placeholder="School year"/><button className="btn btn-dark" disabled={systemBusy}><Plus size={15}/> Add class</button></form>
            <div className="class-chip-list">{classes.map((c:any)=><div className="class-manage-chip" key={c.id}><span><strong>{c.name}</strong><small>{c.school_year||"No school year"}</small></span><button onClick={()=>deleteClass(c)}><Trash2 size={13}/></button></div>)}{!classes.length&&<div className="system-empty">No classes yet.</div>}</div>
          </section>

          <section className="system-section">
            <div className="system-section-head"><div><span>04</span><div><h2>Recordings & assessment</h2><p>Recordings are private. Teacher listens manually, sees student answers, then scores the CEFR-informed classroom rubric.</p></div></div><button className="btn btn-soft" onClick={()=>setView("submissions")}><Mic size={15}/> Open {speaking.length} recordings</button></div>
            <div className="system-stats-row"><div><strong>{speaking.length}</strong><span>recordings</span></div><div><strong>{pending}</strong><span>need feedback</span></div><div><strong>{feedback.length}</strong><span>scored</span></div></div>
          </section>

          <section className="system-section danger-zone">
            <div className="system-section-head"><div><span>05</span><div><h2>Trial data reset</h2><p>Deletes all student accounts, responses, recordings, vocabulary, and feedback. Materials and classes stay intact.</p></div></div><button className="btn danger-button" disabled={systemBusy} onClick={clearStudentTrialData}><Trash2 size={15}/> Clear student trial data</button></div>
          </section>
        </div>}
      </>}
    </main>

    {builderOpen&&<div className="modal-backdrop" onMouseDown={()=>setBuilderOpen(false)}><div className="builder-modal" onMouseDown={(e)=>e.stopPropagation()}>
      <div className="builder-head"><div><div className="eyebrow">MATERIAL + ACTIVITY BUILDER</div><h2>Create the full learning loop.</h2></div><button className="icon-btn" onClick={()=>setBuilderOpen(false)}><X size={18}/></button></div>
      <form className="builder-form" onSubmit={createActivity}>
        <div className="form-grid two"><label><span>Activity / material title</span><input required value={builder.title} onChange={(e)=>setBuilder({...builder,title:e.target.value})} placeholder="Exercise Reflection"/></label><label><span>Topic</span><input required value={builder.topic} onChange={(e)=>setBuilder({...builder,topic:e.target.value})} placeholder="Health & Lifestyle"/></label></div>
        <div className="form-grid three"><label><span>Input mode</span><select value={builder.type} onChange={(e)=>setBuilder({...builder,type:e.target.value})}><option value="read">Read</option><option value="watch">Watch</option><option value="listen">Listen</option></select></label><label><span>Material source</span><select value={builder.materialType} onChange={(e)=>{setBuilder({...builder,materialType:e.target.value});setPdfFile(null)}}><option value="text">Text / transcript</option><option value="youtube">YouTube link</option><option value="pdf">Upload PDF</option></select></label><label><span>CEFR target</span><select value={builder.level} onChange={(e)=>setBuilder({...builder,level:e.target.value})}><option>Pre-A1</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option></select></label></div>
        {builder.materialType==="youtube"&&<label><span>YouTube URL</span><input required type="url" value={builder.youtubeUrl} onChange={(e)=>setBuilder({...builder,youtubeUrl:e.target.value})} placeholder="https://www.youtube.com/watch?v=..."/></label>}
        {builder.materialType==="pdf"&&<label className="file-field"><span>PDF material <em>max 25 MB</em></span><input required type="file" accept="application/pdf,.pdf" onChange={(e)=>setPdfFile(e.target.files?.[0]||null)}/>{pdfFile&&<small>{pdfFile.name} · {(pdfFile.size/1024/1024).toFixed(1)} MB</small>}</label>}
        <div className="form-grid two"><label><span>Estimated minutes</span><input type="number" min="1" value={builder.duration} onChange={(e)=>setBuilder({...builder,duration:e.target.value})}/></label><label><span>Speaking target</span><div className="inline-number-fields"><input type="number" min="15" value={builder.min} onChange={(e)=>setBuilder({...builder,min:e.target.value})}/><span>to</span><input type="number" min="30" value={builder.max} onChange={(e)=>setBuilder({...builder,max:e.target.value})}/><span>sec</span></div></label></div>
        <label><span>Teacher notes / transcript <em>optional</em></span><textarea rows={4} value={builder.body} onChange={(e)=>setBuilder({...builder,body:e.target.value})} placeholder="Paste a transcript, reading text, or guidance for students…"/></label>
        <label><span>Speaking prompt</span><textarea required rows={3} value={builder.prompt} onChange={(e)=>setBuilder({...builder,prompt:e.target.value})} placeholder="Summarize the material in your own words and give your opinion."/></label>
        <div className="form-grid two"><label><span>Assign to class</span><select value={builder.classId} onChange={(e)=>setBuilder({...builder,classId:e.target.value})}><option value="">Open practice</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label><span>Deadline <em>optional</em></span><input type="date" value={builder.deadline} onChange={(e)=>setBuilder({...builder,deadline:e.target.value})}/></label></div>
        <div className="builder-actions"><button type="button" className="btn btn-soft" onClick={()=>setBuilderOpen(false)}>Cancel</button><button className="btn btn-primary" disabled={builderBusy}>{builderBusy?<Loader2 className="spin" size={17}/>:<Plus size={17}/>} Publish material & activity</button></div>
      </form>
    </div></div>}

    {studentCreatorOpen&&<StudentCreateModal
      classes={classes.map((item:any)=>({id:item.id,name:item.name}))}
      isDemo={isDemo}
      onClose={()=>setStudentCreatorOpen(false)}
      onCreated={async(student)=>{
        if(isDemo){
          setStudents((old:any[])=>[{...student,class_name:classes.find((item:any)=>item.id===student.class_id)?.name||"—",completed:0,speakingMinutes:0,vocabulary:0,streak:0},...old]);
        }else{
          await loadTeacher();
        }
      }}
    />}

    {pinStudent&&<StudentPinResetModal student={pinStudent} isDemo={isDemo} onClose={()=>setPinStudent(null)} />}

    {selectedStudentProfile&&<TeacherStudentProfile
      student={selectedStudentProfile}
      classes={classes}
      responses={responses}
      speaking={speaking}
      feedback={feedback}
      activities={activities}
      responseMap={responseMap}
      isDemo={isDemo}
      onClose={()=>setSelectedStudentProfile(null)}
      onOpenSubmission={(row:any)=>{setSelectedStudentProfile(null);openSubmission(row)}}
    />}

    {selectedSpeaking&&<FeedbackDrawer submission={selectedSpeaking} audioUrl={audioUrl} isDemo={isDemo} teacherId={profile.id} existing={feedback.find((f:any)=>f.speaking_id===selectedSpeaking.id)} onClose={()=>{setSelectedSpeaking(null);setAudioUrl(null)}} onSaved={async(row)=>{if(isDemo){setFeedback((old:any[])=>[{...row,speaking_id:selectedSpeaking.id},...old.filter((f:any)=>f.speaking_id!==selectedSpeaking.id)]);setSpeaking((old:any[])=>old.map((s:any)=>s.id===selectedSpeaking.id?{...s,feedback:true}:s));}else await loadTeacher();setSelectedSpeaking(null)}}/>}
  </div>
}

function TeacherStudentProfile({
  student,classes,responses,speaking,feedback,activities,responseMap,isDemo,onClose,onOpenSubmission
}:{
  student:any;classes:any[];responses:any[];speaking:any[];feedback:any[];activities:any[];responseMap:Record<string,any>;isDemo:boolean;onClose:()=>void;onOpenSubmission:(row:any)=>void
}){
  const studentResponses=responses.filter((r:any)=>r.student_id===student.id&&r.status==="submitted");
  const studentSpeaking=speaking.filter((sp:any)=>responseMap[sp.response_id]?.student_id===student.id);
  const className=isDemo?student.class_name:classes.find((c:any)=>c.id===student.class_id)?.name||"No class";
  const reviewed=studentSpeaking.map((sp:any)=>{
    const response=responseMap[sp.response_id];
    const review=feedback.find((f:any)=>f.speaking_id===sp.id);
    const activity=activities.find((a:any)=>a.id===response?.activity_id);
    return {speaking:sp,response,feedback:review,activity};
  }).sort((a:any,b:any)=>new Date(b.response?.submitted_at||b.speaking.created_at||0).getTime()-new Date(a.response?.submitted_at||a.speaking.created_at||0).getTime());
  const scored=reviewed.filter((item:any)=>item.feedback?.overall_score!=null);
  const totalMinutes=studentSpeaking.reduce((sum:number,item:any)=>sum+item.duration_seconds,0)/60;
  const avgScore=scored.length?Math.round(scored.reduce((sum:number,item:any)=>sum+item.feedback.overall_score,0)/scored.length):null;
  const latestScore=scored[0]?.feedback?.overall_score??null;
  const pending=reviewed.filter((item:any)=>!item.feedback).length;
  const rubricKeys=[
    ["Task Fulfilment","task_fulfilment","comprehension"],
    ["Fluency","fluency",null],
    ["Grammar","grammar","confidence"],
    ["Vocabulary","vocabulary",null],
    ["Pronunciation","pronunciation",null],
  ] as Array<[string,string,string|null]>;
  const rubricAverages=rubricKeys.map(([label,key,fallback])=>{
    const vals=scored.map((item:any)=>item.feedback?.[key]??(fallback?item.feedback?.[fallback]:null)).filter((v:any)=>typeof v==="number");
    return {label,value:vals.length?Math.round((vals.reduce((a:number,b:number)=>a+b,0)/vals.length)*10)/10:null};
  });
  const maxScore=Math.max(100,...scored.map((item:any)=>item.feedback?.overall_score||0));

  return <div className="student-profile-backdrop" onMouseDown={onClose}>
    <aside className="teacher-student-profile" onMouseDown={(e)=>e.stopPropagation()}>
      <div className="student-profile-head">
        <button className="icon-btn" onClick={onClose}><X size={18}/></button>
        <div className="student-profile-identity"><div className="student-profile-avatar">{student.name?.charAt(0)||"S"}</div><div><span>STUDENT PROGRESS PROFILE</span><h2>{student.name}</h2><p>@{student.username||"student"} · {className} · {student.cefr_level}</p></div></div>
      </div>
      <div className="student-profile-scroll">
        <section className="student-profile-kpis">
          <div className="primary"><small>AVERAGE SCORE</small><strong>{avgScore!==null?avgScore:"—"}<span>{avgScore!==null?"/100":""}</span></strong><p>{avgScore!==null?rubricPerformanceLabel(avgScore):"No teacher-reviewed score yet"}</p></div>
          <div><small>Latest score</small><strong>{latestScore??"—"}</strong></div>
          <div><small>Activities</small><strong>{studentResponses.length}</strong></div>
          <div><small>Speaking</small><strong>{totalMinutes.toFixed(1)}m</strong></div>
          <div><small>Reviewed</small><strong>{scored.length}</strong></div>
          <div><small>Pending</small><strong>{pending}</strong></div>
        </section>

        <section className="student-profile-panel">
          <div className="student-profile-panel-title"><div><span>RUBRIC DEVELOPMENT</span><h3>Average speaking indicators</h3></div><BarChart3 size={19}/></div>
          <div className="student-rubric-progress">
            {rubricAverages.map(item=><div key={item.label}><div><span>{item.label}</span><strong>{item.value!==null?`${item.value}/5`:"—"}</strong></div><i><b style={{width:item.value!==null?`${(item.value/5)*100}%`:"0%"}}/></i></div>)}
          </div>
        </section>

        <section className="student-profile-panel">
          <div className="student-profile-panel-title"><div><span>SCORE HISTORY</span><h3>Development across reviewed activities</h3></div><Trophy size={19}/></div>
          {scored.length?<div className="student-score-history">
            {scored.slice().reverse().map((item:any,index:number)=><div key={item.speaking.id} className="score-history-item">
              <div className="score-history-bar"><i style={{height:`${Math.max(10,((item.feedback.overall_score||0)/maxScore)*100)}%`}}/></div>
              <strong>{item.feedback.overall_score}</strong>
              <span>{index+1}</span>
            </div>)}
          </div>:<div className="student-profile-empty">Score development will appear after the first teacher review.</div>}
        </section>

        <section className="student-profile-panel">
          <div className="student-profile-panel-title"><div><span>ACTIVITY HISTORY</span><h3>Submissions, scores, and feedback</h3></div><ListChecks size={19}/></div>
          <div className="student-history-list">
            {reviewed.map((item:any)=>{
              const score=item.feedback?.overall_score;
              const submitted=item.response?.submitted_at||item.speaking?.created_at;
              return <article key={item.speaking.id} className="student-history-card">
                <div className={classNames("history-score",score!=null?"reviewed":"pending")}>{score!=null?<><strong>{score}</strong><span>/100</span></>:<Clock3 size={18}/>}</div>
                <div><div className="history-topline"><b>{score!=null?"Reviewed":"Waiting review"}</b>{submitted&&<span>{new Date(submitted).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>}</div><h4>{item.activity?.title||"Speaking activity"}</h4>{item.feedback?<p>{item.feedback.improvement_feedback}</p>:<p>Teacher review has not been saved yet.</p>}</div>
                <button className="btn btn-soft" onClick={()=>onOpenSubmission(item.speaking)}>{score!=null?"Open review":"Review"}<ChevronRight size={14}/></button>
              </article>
            })}
            {!reviewed.length&&<div className="student-profile-empty">This student has not submitted a speaking activity yet.</div>}
          </div>
        </section>

        {scored[0]?.feedback&&<section className="student-latest-feedback">
          <div><CheckCircle2 size={18}/><span>LATEST STRENGTH</span><p>{scored[0].feedback.positive_feedback}</p></div>
          <div><ArrowRight size={18}/><span>NEXT STEP</span><p>{scored[0].feedback.improvement_feedback}</p></div>
        </section>}
      </div>
    </aside>
  </div>
}

function PrivateAudioPlayer({storagePath,isDemo}:{storagePath:string;isDemo:boolean}){
  const [url,setUrl]=useState<string|null>(null);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(isDemo){setError("Demo recordings were removed. Use a real student submission to test playback.");return;}
    if(!storagePath)return;
    const supabase=getSupabase();if(!supabase)return;
    let active=true;
    supabase.storage.from("speaking-audio").createSignedUrl(storagePath,900).then(({data,error})=>{
      if(!active)return;
      if(error||!data?.signedUrl)setError(error?.message||"Audio unavailable.");
      else setUrl(data.signedUrl);
    });
    return()=>{active=false};
  },[storagePath,isDemo]);
  if(error)return <div className="inline-audio-error">{error}</div>;
  if(!url)return <div className="inline-audio-loading"><Loader2 className="spin" size={15}/> Preparing recording…</div>;
  return <audio className="inline-audio-player" controls preload="metadata" src={url}/>;
}

function FeedbackDrawer({submission,audioUrl,isDemo,teacherId,existing,onClose,onSaved}:{submission:any;audioUrl:string|null;isDemo:boolean;teacherId:string;existing:any;onClose:()=>void;onSaved:(row:any)=>Promise<void>}){
  const [scores,setScores]=useState<Record<string,number>>({task_fulfilment:existing?.task_fulfilment||existing?.comprehension||4,fluency:existing?.fluency||3,grammar:existing?.grammar||existing?.confidence||3,vocabulary:existing?.vocabulary||3,pronunciation:existing?.pronunciation||3});
  const [positive,setPositive]=useState(existing?.positive_feedback||"");
  const [improve,setImprove]=useState(existing?.improvement_feedback||"");
  const [busy,setBusy]=useState(false);
  const overall=rubricOverall(scores), performance=rubricPerformanceLabel(overall);

  async function save(){
    if(!positive.trim()||!improve.trim())return;
    setBusy(true);
    const payload={speaking_id:submission.id,task_fulfilment:scores.task_fulfilment,fluency:scores.fluency,grammar:scores.grammar,vocabulary:scores.vocabulary,pronunciation:scores.pronunciation,overall_score:overall,rubric_name:RUBRIC_NAME,rubric_snapshot:SPEAKING_RUBRIC,comprehension:scores.task_fulfilment,confidence:scores.grammar,positive_feedback:positive,improvement_feedback:improve,teacher_id:teacherId};
    if(!isDemo){const supabase=getSupabase();if(supabase){const {error}=await supabase.from("feedback").upsert(payload,{onConflict:"speaking_id"});if(error){setBusy(false);window.alert(error.message);return;}}}
    await onSaved(payload);setBusy(false);
  }

  return <div className="drawer-backdrop"><aside className="feedback-drawer">
    <div className="drawer-head"><div><div className="eyebrow">MANUAL SPEAKING ASSESSMENT</div><h2>{submission.student}</h2><p>{submission.activity} · {formatDuration(submission.duration_seconds)}</p></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>
    <div className="drawer-scroll">
      <section className="listen-card"><div><div className="listen-icon"><Volume2 size={22}/></div><div><strong>Listen before scoring</strong><span>{isDemo?"Demo mode · sample playback area":"Private audio · teacher-only signed access"}</span></div></div>{audioUrl?<audio controls src={audioUrl}/>:isDemo?<div className="demo-audio"><Play size={16}/><span>Real student audio plays here before you score it.</span></div>:<div className="demo-audio"><Loader2 className="spin" size={16}/><span>Preparing private audio…</span></div>}</section>
      <section className="student-answer-review">
        <div className="answer-review-head"><div><span>STUDENT RESPONSES</span><strong>What the student submitted</strong></div><small>{submission.answers?.length||0} answers</small></div>
        {submission.answers?.length?submission.answers.map((item:any)=><div className="answer-review-item" key={item.id}><span>{item.prompt}</span><p>{item.value}</p></div>):<div className="answer-review-empty">No written comprehension answers were submitted with this recording.</div>}
        {submission.reflection_note&&<div className="answer-review-item reflection"><span>Student reflection</span><p>{submission.reflection_note}</p></div>}
        <div className="answer-review-meta">{submission.confidence&&<span>Confidence: {submission.confidence}/5</span>}{submission.difficulty&&<span>Difficulty: {submission.difficulty}</span>}</div>
      </section>
      <section className="rubric-overview"><div><span>CLASSROOM SCORE</span><strong>{overall}</strong><small>/ 100 · {performance}</small></div><p>{RUBRIC_NAME}. Teacher judgement only; this is not an automated or certified CEFR result.</p></section>
      <section className="assessment"><h3>Speaking rubric</h3><p>Choose 1–5 for each criterion after listening.</p>{SPEAKING_RUBRIC.map((criterion)=><div className="rubric-row" key={criterion.key}><div className="rubric-label"><strong>{criterion.label}</strong><span>{criterion.description}</span></div><div className="rubric-score-buttons">{[1,2,3,4,5].map((n)=><button key={n} className={scores[criterion.key]===n?"selected":""} onClick={()=>setScores({...scores,[criterion.key]:n})}>{n}</button>)}</div><p className="rubric-descriptor">{criterion.descriptors[scores[criterion.key] as 1|2|3|4|5]}</p></div>)}</section>
      <section className="feedback-writing"><label><span>What the student did well</span><textarea value={positive} onChange={(e)=>setPositive(e.target.value)} placeholder="Point to one clear strength you heard."/></label><label><span>One next step</span><textarea value={improve} onChange={(e)=>setImprove(e.target.value)} placeholder="Give one concrete improvement for the next recording."/></label></section>
    </div>
    <div className="drawer-actions"><button className="btn btn-soft" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={busy||!positive.trim()||!improve.trim()} onClick={save}>{busy?<Loader2 className="spin" size={17}/>:<Send size={17}/>} Save manual score</button></div>
  </aside></div>
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
    const p: Profile = role === "student" ? { id: "demo-student", name: "Naila Putri", username: "naila", role: "student", cefr_level: "Pre-A1" } : { id: "demo-teacher", name: "Yusril Maulana", username: "yusril", role: "teacher", cefr_level: "B2" };
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
