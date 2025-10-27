export interface App {
  title: string;
  description: string;
  category: string;
  downloadLink: string;
  imageUrl?: string;
  tags: string[];
}

export const apps: App[] = [
  {
    title: "Productivity Pro",
    description: "A powerful task management app that helps you stay organized and boost your productivity. Features include smart reminders, project tracking, and team collaboration.",
    category: "Productivity",
    downloadLink: "https://example.com/download/productivity-pro",
    tags: ["iOS", "Android", "Task Management"],
  },
  {
    title: "Photo Editor Plus",
    description: "Professional-grade photo editing tools in your pocket. Transform your photos with filters, effects, and advanced editing features.",
    category: "Photo & Video",
    downloadLink: "https://example.com/download/photo-editor",
    tags: ["iOS", "Android", "Photo Editing"],
  },
  {
    title: "Finance Tracker",
    description: "Take control of your finances with an intuitive expense tracker. Monitor your spending, set budgets, and achieve your financial goals.",
    category: "Finance",
    downloadLink: "https://example.com/download/finance-tracker",
    tags: ["iOS", "Finance", "Analytics"],
  },
  {
    title: "Mindful Meditation",
    description: "Find peace and clarity with guided meditation sessions. Features relaxing sounds, breathing exercises, and personalized mindfulness programs.",
    category: "Health & Wellness",
    downloadLink: "https://example.com/download/mindful-meditation",
    tags: ["iOS", "Android", "Wellness"],
  },
  {
    title: "Language Learner",
    description: "Master new languages with interactive lessons, speech recognition, and spaced repetition. Learn at your own pace with personalized courses.",
    category: "Education",
    downloadLink: "https://example.com/download/language-learner",
    tags: ["iOS", "Android", "Education"],
  },
  {
    title: "Weather Forecast",
    description: "Get accurate weather forecasts with beautiful visuals. Track multiple locations, receive alerts, and plan your activities with confidence.",
    category: "Weather",
    downloadLink: "https://example.com/download/weather-forecast",
    tags: ["iOS", "Weather", "Forecasts"],
  },
];

