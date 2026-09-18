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
    title: "The Two-Minute Challenge",
    description: "A mini video script about building confidence by starting small.",
    content_type: "watch",
    format: "Short video",
    cefr_level: "A2",
    topic: "Confidence",
    duration_minutes: 3,
    source: "English Loop Original",
    content_body: "Imagine you want to speak English confidently, but every long conversation feels scary. Try the two-minute challenge. Choose one simple topic: your favorite food, your weekend, or a movie you watched. Speak for only two minutes. Do not stop every time you make a mistake. Keep going. After you finish, listen to yourself and choose one thing to improve next time. Small practice becomes real confidence when you repeat it.",
    vocabulary_focus: ["confidently", "challenge", "mistake", "improve", "practice"],
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
  { id: "30000000-0000-0000-0000-000000000003", content_id: demoContents[2].id, title: "Two-Minute Confidence", instructions: "Think about how small practice can build confidence.", speaking_prompt: "Explain the two-minute challenge. Then choose one topic you could use for your own speaking practice.", min_duration_seconds: 45, max_duration_seconds: 120 },
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

export const demoStudents = [
  { id: "s1", name: "Naila Putri", username: "naila", cefr_level: "A2", class_name: "10A", completed: 8, speakingMinutes: 12.4, vocabulary: 34, streak: 5 },
  { id: "s2", name: "Ahmad Fikri", username: "ahmad", cefr_level: "A2", class_name: "10A", completed: 9, speakingMinutes: 15.2, vocabulary: 41, streak: 7 },
  { id: "s3", name: "Rafi Akbar", username: "rafi", cefr_level: "A1", class_name: "10A", completed: 6, speakingMinutes: 8.7, vocabulary: 26, streak: 3 },
  { id: "s4", name: "Salwa Rahma", username: "salwa", cefr_level: "B1", class_name: "10A", completed: 10, speakingMinutes: 18.1, vocabulary: 48, streak: 9 },
];

export const demoSubmissions = [
  { id: "sp1", student_id: "s2", student: "Ahmad Fikri", activity: "Two-Minute Confidence", duration_seconds: 103, created_at: "2026-09-18T00:30:00Z", feedback: true },
  { id: "sp2", student_id: "s1", student: "Naila Putri", activity: "Stories & Perspective", duration_seconds: 118, created_at: "2026-09-18T00:10:00Z", feedback: false },
  { id: "sp3", student_id: "s4", student: "Salwa Rahma", activity: "Explain Your Morning", duration_seconds: 87, created_at: "2026-09-17T23:40:00Z", feedback: false },
];
