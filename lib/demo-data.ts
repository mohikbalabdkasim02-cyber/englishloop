export type ContentItem = {
  id: string;
  title: string;
  description: string;
  content_type: "watch" | "listen" | "read";
  format: string;
  cefr_level: "A1" | "A2" | "B1" | "B2";
  topic: string;
  duration_minutes: number;
  source: string;
  content_body: string;
  vocabulary_focus: string[];
  content_url?: string | null;
  thumbnail_url?: string | null;
  material_type?: "text" | "youtube" | "pdf";
  storage_path?: string | null;
};

export type ActivityItem = {
  id: string;
  content_id: string;
  title: string;
  instructions: string;
  speaking_prompt: string;
  min_duration_seconds: number;
  max_duration_seconds: number;
  is_published?: boolean;
};

export type QuestionItem = {
  id: string;
  activity_id: string;
  kind: "short_answer" | "vocabulary" | "reflection" | "multiple_choice";
  prompt: string;
  options?: string[] | null;
  sort_order: number;
};

export const demoContents: ContentItem[] = [
  {
    id: "demo-yusss-content",
    title: "Yusss",
    description: "Health · A2",
    content_type: "watch",
    format: "YouTube",
    cefr_level: "A2",
    topic: "Health",
    duration_minutes: 4,
    source: "YouTube",
    content_body: "",
    vocabulary_focus: [],
    material_type: "youtube",
    content_url: "https://youtu.be/e4K9NH7-6I4",
  },
];

export const demoActivities: ActivityItem[] = [
  {
    id: "demo-yusss-activity",
    content_id: "demo-yusss-content",
    title: "Yusss",
    instructions: "Consume the input, capture the main idea, then speak in your own words.",
    speaking_prompt: "materi",
    min_duration_seconds: 45,
    max_duration_seconds: 90,
    is_published: true,
  },
];

export const demoQuestions: QuestionItem[] = [
  { id: "demo-yusss-q1", activity_id: "demo-yusss-activity", kind: "short_answer", prompt: "What is the main idea?", sort_order: 1 },
  { id: "demo-yusss-q2", activity_id: "demo-yusss-activity", kind: "vocabulary", prompt: "Write three useful words from this content.", sort_order: 2 },
  { id: "demo-yusss-q3", activity_id: "demo-yusss-activity", kind: "reflection", prompt: "What did you find interesting?", sort_order: 3 },
];

export const demoStudents: Array<{ id:string; name:string; username:string; cefr_level:string; class_name:string; completed:number; speakingMinutes:number; vocabulary:number; streak:number }> = [];

export const demoSubmissions: Array<{ id:string; student_id?:string; student:string; activity:string; duration_seconds:number; created_at:string; feedback:boolean }> = [];
