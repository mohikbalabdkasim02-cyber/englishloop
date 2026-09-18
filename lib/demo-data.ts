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
    id: "20000000-0000-0000-0000-000000000001",
    title: "The Lost Wallet",
    description: "A short everyday story about honesty and helping a stranger.",
    content_type: "read",
    format: "Short story",
    cefr_level: "A1",
    topic: "Daily Life",
    duration_minutes: 3,
    source: "English Loop Original",
    content_body: "Rina was walking home after school when she saw a small brown wallet near a bus stop. She opened it carefully and found an ID card, some money, and a family photo. The address on the ID card was only two streets away. Rina walked to the house and returned the wallet to Mr. Adi. He looked surprised and very happy. He thanked Rina and offered her a reward, but Rina smiled and said, ‘I am just happy you got it back.’",
    vocabulary_focus: ["wallet", "stranger", "return", "reward", "honest"],
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    title: "A Better Morning Routine",
    description: "A mini podcast about simple habits that make mornings calmer.",
    content_type: "listen",
    format: "Mini podcast",
    cefr_level: "A2",
    topic: "Habits",
    duration_minutes: 4,
    source: "English Loop Original",
    content_body: "Good morning. Today I want to share three small habits that can make your morning easier. First, prepare your school bag and clothes at night. Second, drink a glass of water after you wake up. Third, do not check social media immediately. Give yourself ten quiet minutes to stretch, breathe, or plan your day. You do not need a perfect routine. Start with one habit and repeat it for a week.",
    vocabulary_focus: ["routine", "prepare", "immediately", "stretch", "repeat"],
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    title: "Are You Getting Enough Exercise?",
    description: "A BBC Learning English video used as a trial example of external YouTube input.",
    content_type: "watch",
    format: "YouTube",
    cefr_level: "A2",
    topic: "Health & Lifestyle",
    duration_minutes: 6,
    source: "BBC Learning English",
    content_body: "Watch for the main idea and useful vocabulary. You do not need to catch every word before speaking.",
    vocabulary_focus: ["vigorous", "brisk", "sedentary", "exercise", "routine"],
    material_type: "youtube",
    content_url: "https://www.youtube.com/watch?v=iKzpnVWdZ70",
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    title: "Why Stories Stay With Us",
    description: "How stories help people remember ideas and understand other perspectives.",
    content_type: "read",
    format: "Article",
    cefr_level: "B1",
    topic: "Stories & Empathy",
    duration_minutes: 6,
    source: "English Loop Original",
    content_body: "People have shared stories for thousands of years because stories organize information around people, choices, problems, and consequences. A list of facts can be useful, but a story often gives those facts a human context. When readers follow a character through a difficult situation, they may imagine feelings or viewpoints that are different from their own. This does not mean every story teaches the same lesson. Instead, stories can become a starting point for discussion: What happened? Why did it happen? What would you have done differently? These questions turn reading into reflection and reflection into expression.",
    vocabulary_focus: ["consequence", "context", "perspective", "reflection", "expression"],
  },
];

export const demoActivities: ActivityItem[] = [
  { id: "30000000-0000-0000-0000-000000000001", content_id: demoContents[0].id, title: "Retell: The Lost Wallet", instructions: "Read once for meaning, then again for the sequence of events.", speaking_prompt: "Retell the story in your own words. What did Rina find, what did she do, and what do you think about her decision?", min_duration_seconds: 30, max_duration_seconds: 60 },
  { id: "30000000-0000-0000-0000-000000000002", content_id: demoContents[1].id, title: "Explain Your Morning", instructions: "Notice the three suggested habits.", speaking_prompt: "Explain the three habits, then tell us which habit you want to try and why.", min_duration_seconds: 45, max_duration_seconds: 90 },
  { id: "30000000-0000-0000-0000-000000000003", content_id: demoContents[2].id, title: "Exercise Reflection", instructions: "Watch for the main idea and useful lifestyle vocabulary.", speaking_prompt: "Summarize the video in your own words. Are you getting enough exercise? Give one habit you could improve.", min_duration_seconds: 45, max_duration_seconds: 120 },
  { id: "30000000-0000-0000-0000-000000000004", content_id: demoContents[3].id, title: "Stories & Perspective", instructions: "Identify the main idea and one supporting idea.", speaking_prompt: "Summarize the article, then give your opinion: can stories help us understand other people better?", min_duration_seconds: 60, max_duration_seconds: 120 },
];

export const demoQuestions: QuestionItem[] = [
  { id: "q1", activity_id: demoActivities[0].id, kind: "short_answer", prompt: "What did Rina find near the bus stop?", sort_order: 1 },
  { id: "q2", activity_id: demoActivities[0].id, kind: "vocabulary", prompt: "Write three new or useful words from the story.", sort_order: 2 },
  { id: "q3", activity_id: demoActivities[0].id, kind: "reflection", prompt: "What would you do if you found a wallet?", sort_order: 3 },
  { id: "q4", activity_id: demoActivities[1].id, kind: "multiple_choice", prompt: "Which habit was NOT mentioned?", options: ["Prepare your bag at night", "Drink water", "Check social media immediately", "Take ten quiet minutes"], sort_order: 1 },
  { id: "q5", activity_id: demoActivities[1].id, kind: "short_answer", prompt: "Which habit would be easiest for you to try?", sort_order: 2 },
  { id: "q6", activity_id: demoActivities[1].id, kind: "vocabulary", prompt: "Write three useful words from the content.", sort_order: 3 },
  { id: "q7", activity_id: demoActivities[2].id, kind: "short_answer", prompt: "What should you do when you make a mistake while speaking?", sort_order: 1 },
  { id: "q8", activity_id: demoActivities[2].id, kind: "reflection", prompt: "What topic could you speak about for two minutes?", sort_order: 2 },
  { id: "q9", activity_id: demoActivities[3].id, kind: "short_answer", prompt: "What is the main idea of the article?", sort_order: 1 },
  { id: "q10", activity_id: demoActivities[3].id, kind: "vocabulary", prompt: "Choose three words you want to remember.", sort_order: 2 },
  { id: "q11", activity_id: demoActivities[3].id, kind: "reflection", prompt: "Do stories help people understand different perspectives? Why?", sort_order: 3 },
];

export const demoStudents: Array<{ id:string; name:string; username:string; cefr_level:string; class_name:string; completed:number; speakingMinutes:number; vocabulary:number; streak:number }> = [];

export const demoSubmissions: Array<{ id:string; student_id?:string; student:string; activity:string; duration_seconds:number; created_at:string; feedback:boolean }> = [];
