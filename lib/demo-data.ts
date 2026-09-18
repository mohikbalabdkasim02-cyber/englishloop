export type ContentItem = {
  id: string;
  title: string;
  description: string;
  content_type: "watch" | "listen" | "read";
  format: string;
  cefr_level: "Pre-A1" | "A1" | "A2" | "B1" | "B2";
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
  pathway_order?: number | null;
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
    id: "demo-foundation-greetings",
    title: "Hello, My Name Is…",
    description: "Start with greetings, names, and useful first words.",
    content_type: "read",
    format: "Foundation lesson",
    cefr_level: "Pre-A1",
    topic: "Greetings & Names",
    duration_minutes: 4,
    source: "English Loop",
    content_body: "Hello! Hi! Good morning!\n\nMy name is Naila. What is your name?\nI am Naila. I am a student.\n\nUseful words: hello, hi, name, student, morning.",
    vocabulary_focus: ["hello", "hi", "name", "student", "morning"],
    material_type: "text",
  },
  {
    id: "demo-foundation-pronouns",
    title: "I, You, We, They",
    description: "Build the grammar foundation with subject pronouns before possessive adjectives.",
    content_type: "read",
    format: "Foundation lesson",
    cefr_level: "Pre-A1",
    topic: "Subject Pronouns",
    duration_minutes: 5,
    source: "English Loop",
    content_body: "I = the speaker\nYou = the person I speak to\nWe = I + another person\nThey = two or more people\nHe = one boy/man\nShe = one girl/woman\nIt = one thing/animal\n\nExamples: I am Naila. You are my friend. We are students.",
    vocabulary_focus: ["I", "you", "we", "they", "he", "she", "it"],
    material_type: "text",
  },
  {
    id: "demo-foundation-numbers",
    title: "Numbers & Age",
    description: "Learn numbers and use them in a simple self-introduction.",
    content_type: "read",
    format: "Foundation lesson",
    cefr_level: "Pre-A1",
    topic: "Numbers & Age",
    duration_minutes: 5,
    source: "English Loop",
    content_body: "1 one · 2 two · 3 three · 4 four · 5 five\n6 six · 7 seven · 8 eight · 9 nine · 10 ten\n\nHow old are you?\nI am fifteen years old.",
    vocabulary_focus: ["one", "two", "three", "age", "years old"],
    material_type: "text",
  },
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
    id: "demo-foundation-greetings-activity",
    content_id: "demo-foundation-greetings",
    title: "Day 1 · Greetings & Names",
    instructions: "Read the material, collect key words, then introduce yourself.",
    speaking_prompt: "Say hello and introduce yourself. Say your name and one simple fact about yourself.",
    min_duration_seconds: 20,
    max_duration_seconds: 45,
    pathway_order: 1,
    is_published: true,
  },
  {
    id: "demo-foundation-pronouns-activity",
    content_id: "demo-foundation-pronouns",
    title: "Day 2 · Subject Pronouns",
    instructions: "Learn I, you, we, they, he, she, and it before moving to possessive adjectives.",
    speaking_prompt: "Make four short sentences using I, you, we, and they.",
    min_duration_seconds: 20,
    max_duration_seconds: 45,
    pathway_order: 2,
    is_published: true,
  },
  {
    id: "demo-foundation-numbers-activity",
    content_id: "demo-foundation-numbers",
    title: "Day 3 · Numbers & Age",
    instructions: "Learn numbers and use them in a short personal introduction.",
    speaking_prompt: "Say your name, your age, and count from one to ten.",
    min_duration_seconds: 20,
    max_duration_seconds: 45,
    pathway_order: 3,
    is_published: true,
  },
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
  { id: "demo-foundation-greetings-q1", activity_id: "demo-foundation-greetings-activity", kind: "vocabulary", prompt: "Write three greeting or introduction words.", sort_order: 1 },
  { id: "demo-foundation-greetings-q2", activity_id: "demo-foundation-greetings-activity", kind: "short_answer", prompt: "How do you say your name in English?", sort_order: 2 },
  { id: "demo-foundation-greetings-q3", activity_id: "demo-foundation-greetings-activity", kind: "reflection", prompt: "Which greeting will you use most often?", sort_order: 3 },

  { id: "demo-foundation-pronouns-q1", activity_id: "demo-foundation-pronouns-activity", kind: "multiple_choice", prompt: "Which pronoun means the speaker?", options: ["I", "You", "They"], sort_order: 1 },
  { id: "demo-foundation-pronouns-q2", activity_id: "demo-foundation-pronouns-activity", kind: "vocabulary", prompt: "Write four subject pronouns.", sort_order: 2 },
  { id: "demo-foundation-pronouns-q3", activity_id: "demo-foundation-pronouns-activity", kind: "short_answer", prompt: "Write one sentence with 'we'.", sort_order: 3 },

  { id: "demo-foundation-numbers-q1", activity_id: "demo-foundation-numbers-activity", kind: "short_answer", prompt: "Write your age in English.", sort_order: 1 },
  { id: "demo-foundation-numbers-q2", activity_id: "demo-foundation-numbers-activity", kind: "vocabulary", prompt: "Write three number words.", sort_order: 2 },
  { id: "demo-foundation-numbers-q3", activity_id: "demo-foundation-numbers-activity", kind: "reflection", prompt: "Which numbers are still difficult to remember?", sort_order: 3 },

  { id: "demo-yusss-q1", activity_id: "demo-yusss-activity", kind: "short_answer", prompt: "What is the main idea?", sort_order: 1 },
  { id: "demo-yusss-q2", activity_id: "demo-yusss-activity", kind: "vocabulary", prompt: "Write three useful words from this content.", sort_order: 2 },
  { id: "demo-yusss-q3", activity_id: "demo-yusss-activity", kind: "reflection", prompt: "What did you find interesting?", sort_order: 3 },
];

export const demoStudents: Array<{ id:string; name:string; username:string; cefr_level:string; class_name:string; completed:number; speakingMinutes:number; vocabulary:number; streak:number }> = [];

export const demoSubmissions: Array<{ id:string; student_id?:string; student:string; activity:string; duration_seconds:number; created_at:string; feedback:boolean }> = [];
