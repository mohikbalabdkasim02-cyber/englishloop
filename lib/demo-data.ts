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

const demoLegacyVideos = [
  { id: "bad-habit", title: "Examination sign", topic: "A Simple Way to Break a Bad Habit", url: "https://youtu.be/-moW9jvvMr4", prompt: "Explain one way to break a bad habit in your own words." },
  { id: "dreams", title: "Exercise", topic: "Dreams", url: "https://youtu.be/26PrgjTboVQ", prompt: "Tell us about a dream or goal and one step you can take toward it." },
  { id: "history", title: "Exercise", topic: "History", url: "https://youtu.be/KXTbxC4ulF4", prompt: "Summarize one part of Singapore's history from the video." },
  { id: "corruption", title: "Reflection", topic: "Corruption", url: "https://youtu.be/Fx4lLWcd5qg", prompt: "Explain the meaning of corruption using an example from the video." },
];

export const demoContents: ContentItem[] = [
  {
    id: "demo-foundation-greetings",
    title: "Hello, My Name Is…",
    description: "Listen to a short self-introduction, learn greeting words, then introduce yourself.",
    content_type: "listen",
    format: "Listening and reading",
    cefr_level: "Pre-A1",
    topic: "Greetings & Names",
    duration_minutes: 4,
    source: "English Loop",
    content_body: "Hello! My name is Naila. I am a student. Nice to meet you!\n\nGreetings: hello, hi, good morning.\nAsk: What is your name?\nAnswer: My name is Naila.\nUseful words: hello, hi, name, student, morning.",
    vocabulary_focus: ["hello", "hi", "name", "student", "morning"],
    material_type: "text",
    content_url: "/audio/greetings-self-introduction.mp3",
  },
  {
    id: "demo-foundation-alphabet",
    title: "The Alphabet & Spelling",
    description: "Recognize letters and spell your own name aloud.",
    content_type: "read",
    format: "Foundation lesson",
    cefr_level: "Pre-A1",
    topic: "Alphabet & Sounds",
    duration_minutes: 5,
    source: "English Loop",
    content_body: "A B C D E F G H I J K L M\nN O P Q R S T U V W X Y Z\n\nWhat is your name? How do you spell it?\nMy name is Naila. N-A-I-L-A.\n\nListen to each letter when your teacher says it, then spell your name aloud.",
    vocabulary_focus: ["letter", "alphabet", "spell", "name"],
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
    id: "demo-foundation-introduction",
    title: "Introduce Yourself",
    description: "Put greetings, spelling, numbers, and subject pronouns together.",
    content_type: "listen",
    format: "Listening and reading",
    cefr_level: "Pre-A1",
    topic: "Self-Introduction",
    duration_minutes: 6,
    source: "English Loop",
    content_body: "Hello! My name is Naila. I am fifteen years old. I am a student. I like music. Nice to meet you!\n\nReading pattern:\nHello! My name is ...\nI am ... years old.\nI am a student.\nI like ...\nNice to meet you!",
    vocabulary_focus: ["my name is", "years old", "student", "I like", "nice to meet you"],
    material_type: "text",
    content_url: "/audio/full-self-introduction.mp3",
  },
  {
    id: "demo-a1-routine",
    title: "A Day in My Life",
    description: "Move from introductions to simple daily routine sentences.",
    content_type: "read",
    format: "A1 lesson",
    cefr_level: "A1",
    topic: "Daily Routines",
    duration_minutes: 7,
    source: "English Loop",
    content_body: "I wake up at six. I eat breakfast and go to school. I study English. In the evening, I read a book.\n\nUseful verbs: wake up, eat, go, study, read.\nUse I + verb: I study. I read.",
    vocabulary_focus: ["wake up", "eat", "go", "study", "read"],
    material_type: "text",
  },
  {
    id: "demo-a1-family",
    title: "People in My Family",
    description: "Describe familiar people in short sentences after learning subject pronouns.",
    content_type: "read",
    format: "A1 lesson",
    cefr_level: "A1",
    topic: "Family & Simple Descriptions",
    duration_minutes: 7,
    source: "English Loop",
    content_body: "This is my sister. She is kind. This is my brother. He is funny. We are a family.\n\nRemember: I, you, he, she, we, they are subject pronouns.\nNow try my and your when you talk about people: my sister, your brother.",
    vocabulary_focus: ["family", "sister", "brother", "kind", "funny"],
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
  ...demoLegacyVideos.map((video) => ({
    id: `demo-video-${video.id}`,
    title: video.title,
    description: `${video.topic} · A2`,
    content_type: "watch" as const,
    format: "YouTube",
    cefr_level: "A2" as const,
    topic: video.topic,
    duration_minutes: 4,
    source: "YouTube",
    content_body: "",
    vocabulary_focus: [],
    material_type: "youtube" as const,
    content_url: video.url,
  })),
];

export const demoActivities: ActivityItem[] = [
  {
    id: "demo-foundation-greetings-activity",
    content_id: "demo-foundation-greetings",
    title: "Day 1 · Greetings & Names",
    instructions: "Listen to the self-introduction, read the transcript, collect greeting words, then introduce yourself.",
    speaking_prompt: "Say hello and introduce yourself. Say your name and one simple fact about yourself.",
    min_duration_seconds: 20,
    max_duration_seconds: 45,
    pathway_order: 1,
    is_published: true,
  },
  {
    id: "demo-foundation-alphabet-activity",
    content_id: "demo-foundation-alphabet",
    title: "Day 2 · Alphabet & Spelling",
    instructions: "Read the alphabet and practice spelling your name.",
    speaking_prompt: "Say your name and spell it letter by letter.",
    min_duration_seconds: 20,
    max_duration_seconds: 45,
    pathway_order: 2,
    is_published: true,
  },
  {
    id: "demo-foundation-pronouns-activity",
    content_id: "demo-foundation-pronouns",
    title: "Day 4 · Subject Pronouns",
    instructions: "Learn I, you, we, they, he, she, and it before moving to possessive adjectives.",
    speaking_prompt: "Make four short sentences using I, you, we, and they.",
    min_duration_seconds: 20,
    max_duration_seconds: 45,
    pathway_order: 4,
    is_published: true,
  },
  {
    id: "demo-foundation-introduction-activity",
    content_id: "demo-foundation-introduction",
    title: "Day 5 · Introduce Yourself",
    instructions: "Listen, read the model, answer simple questions, then record your own introduction.",
    speaking_prompt: "Introduce yourself: say hello, your name, your age, and one thing you like.",
    min_duration_seconds: 30,
    max_duration_seconds: 60,
    pathway_order: 5,
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
  ...demoLegacyVideos.map((video) => ({
    id: `demo-video-${video.id}-activity`,
    content_id: `demo-video-${video.id}`,
    title: video.title,
    instructions: "Watch the material, check your understanding, then speak in your own words.",
    speaking_prompt: video.prompt,
    min_duration_seconds: 45,
    max_duration_seconds: 90,
    is_published: true,
  })),
  {
    id: "demo-a1-routine-activity",
    content_id: "demo-a1-routine",
    title: "Day 1 · My Daily Routine",
    instructions: "Read the short model, check the verbs, write about your day, then speak.",
    speaking_prompt: "Describe three things you do every day.",
    min_duration_seconds: 30,
    max_duration_seconds: 60,
    pathway_order: 1,
    is_published: true,
  },
  {
    id: "demo-a1-family-activity",
    content_id: "demo-a1-family",
    title: "Day 2 · My Family",
    instructions: "Read the model, remember subject pronouns, then introduce family members.",
    speaking_prompt: "Introduce two people in your family using he, she, my, or your.",
    min_duration_seconds: 30,
    max_duration_seconds: 60,
    pathway_order: 2,
    is_published: true,
  },
];

export const demoQuestions: QuestionItem[] = [
  { id: "demo-foundation-greetings-q1", activity_id: "demo-foundation-greetings-activity", kind: "short_answer", prompt: "Listen first: what name did you hear?", sort_order: 1 },
  { id: "demo-foundation-greetings-q2", activity_id: "demo-foundation-greetings-activity", kind: "vocabulary", prompt: "Write three greeting or introduction words.", sort_order: 2 },
  { id: "demo-foundation-greetings-q3", activity_id: "demo-foundation-greetings-activity", kind: "reflection", prompt: "Which greeting will you use most often?", sort_order: 3 },

  { id: "demo-foundation-alphabet-q1", activity_id: "demo-foundation-alphabet-activity", kind: "short_answer", prompt: "Write the letters in your name, separated by hyphens.", sort_order: 1 },
  { id: "demo-foundation-alphabet-q2", activity_id: "demo-foundation-alphabet-activity", kind: "vocabulary", prompt: "Write two useful words from this lesson.", sort_order: 2 },
  { id: "demo-foundation-alphabet-q3", activity_id: "demo-foundation-alphabet-activity", kind: "reflection", prompt: "Which letter sounds are difficult for you?", sort_order: 3 },

  { id: "demo-foundation-pronouns-q1", activity_id: "demo-foundation-pronouns-activity", kind: "multiple_choice", prompt: "Which pronoun means the speaker?", options: ["I", "You", "They"], sort_order: 1 },
  { id: "demo-foundation-pronouns-q2", activity_id: "demo-foundation-pronouns-activity", kind: "vocabulary", prompt: "Write four subject pronouns.", sort_order: 2 },
  { id: "demo-foundation-pronouns-q3", activity_id: "demo-foundation-pronouns-activity", kind: "short_answer", prompt: "Write one sentence with 'we'.", sort_order: 3 },

  { id: "demo-foundation-numbers-q1", activity_id: "demo-foundation-numbers-activity", kind: "short_answer", prompt: "Write your age in English.", sort_order: 1 },
  { id: "demo-foundation-numbers-q2", activity_id: "demo-foundation-numbers-activity", kind: "vocabulary", prompt: "Write three number words.", sort_order: 2 },
  { id: "demo-foundation-numbers-q3", activity_id: "demo-foundation-numbers-activity", kind: "reflection", prompt: "Which numbers are still difficult to remember?", sort_order: 3 },

  { id: "demo-foundation-introduction-q1", activity_id: "demo-foundation-introduction-activity", kind: "short_answer", prompt: "Listen: how old is Naila?", sort_order: 1 },
  { id: "demo-foundation-introduction-q2", activity_id: "demo-foundation-introduction-activity", kind: "vocabulary", prompt: "Write three useful words or phrases for your introduction.", sort_order: 2 },
  { id: "demo-foundation-introduction-q3", activity_id: "demo-foundation-introduction-activity", kind: "short_answer", prompt: "Write one sentence about something you like.", sort_order: 3 },

  { id: "demo-a1-routine-q1", activity_id: "demo-a1-routine-activity", kind: "short_answer", prompt: "What does the learner do in the evening?", sort_order: 1 },
  { id: "demo-a1-routine-q2", activity_id: "demo-a1-routine-activity", kind: "vocabulary", prompt: "Write three useful daily routine verbs.", sort_order: 2 },
  { id: "demo-a1-routine-q3", activity_id: "demo-a1-routine-activity", kind: "short_answer", prompt: "Write one sentence about your daily routine.", sort_order: 3 },

  { id: "demo-a1-family-q1", activity_id: "demo-a1-family-activity", kind: "multiple_choice", prompt: "Which pronoun describes a sister?", options: ["He", "She", "They"], sort_order: 1 },
  { id: "demo-a1-family-q2", activity_id: "demo-a1-family-activity", kind: "vocabulary", prompt: "Write three words that describe your family.", sort_order: 2 },
  { id: "demo-a1-family-q3", activity_id: "demo-a1-family-activity", kind: "short_answer", prompt: "Write one sentence about a family member.", sort_order: 3 },

  { id: "demo-yusss-q1", activity_id: "demo-yusss-activity", kind: "short_answer", prompt: "What is the main idea?", sort_order: 1 },
  { id: "demo-yusss-q2", activity_id: "demo-yusss-activity", kind: "vocabulary", prompt: "Write three useful words from this content.", sort_order: 2 },
  { id: "demo-yusss-q3", activity_id: "demo-yusss-activity", kind: "reflection", prompt: "What did you find interesting?", sort_order: 3 },
  ...demoLegacyVideos.flatMap((video) => [
    { id: `demo-video-${video.id}-q1`, activity_id: `demo-video-${video.id}-activity`, kind: "short_answer" as const, prompt: "What is the main idea of this video?", sort_order: 1 },
    { id: `demo-video-${video.id}-q2`, activity_id: `demo-video-${video.id}-activity`, kind: "vocabulary" as const, prompt: "Write three useful words from the video.", sort_order: 2 },
    { id: `demo-video-${video.id}-q3`, activity_id: `demo-video-${video.id}-activity`, kind: "reflection" as const, prompt: "How could you use what you learned?", sort_order: 3 },
  ]),
];

export const demoStudents: Array<{ id:string; name:string; username:string; cefr_level:string; class_name:string; completed:number; speakingMinutes:number; vocabulary:number; streak:number }> = [];

export const demoSubmissions: Array<{ id:string; student_id?:string; student:string; activity:string; duration_seconds:number; created_at:string; feedback:boolean }> = [];
