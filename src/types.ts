export interface Card {
  id: number;
  category: string;
  source: string;
  furi?: string;
  jp: string;
  romaji: string;
  id_text: string;
  desc: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: Record<string, string>;
  answer?: string;
  explanation?: string;
}

export interface QuizSet {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

export interface StudyProgress {
  cardId: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  lastReviewed: string;
  nextReview: string;
  streak: number;
  totalReviews: number;
  correctCount: number;
}

export interface UserStats {
  totalStudyTime: number;
  cardsMastered: number;
  quizzesCompleted: number;
  averageScore: number;
  streakDays: number;
  lastStudyDate: string;
  dailyGoal: number;
}

export type ViewMode = 'home' | 'flashcards' | 'quiz' | 'matching' | 'fillblank' | 'stats' | 'search' | 'settings';
export type QuizMode = 'multiple-choice' | 'true-false' | 'fill-blank';
