import type { Card, QuizSet, StudyProgress, UserStats } from '../types';

const STORAGE_KEYS = {
  progress: 'ssw_progress',
  stats: 'ssw_stats',
  bookmarks: 'ssw_bookmarks',
  settings: 'ssw_settings',
  darkMode: 'ssw_dark_mode',
};

// Lazy load card data to avoid blocking
let cardsCache: Card[] | null = null;
let quizzesCache: QuizSet[] | null = null;

export async function loadCards(): Promise<Card[]> {
  if (cardsCache) return cardsCache;
  const res = await fetch('/SSW-Konstruksi/data/cards.json');
  cardsCache = await res.json();
  return cardsCache!;
}

export async function loadQuizzes(): Promise<QuizSet[]> {
  if (quizzesCache) return quizzesCache;
  const res = await fetch('/SSW-Konstruksi/data/quizzes.json');
  quizzesCache = await res.json();
  return quizzesCache!;
}

export function getProgress(): Record<number, StudyProgress> {
  const raw = localStorage.getItem(STORAGE_KEYS.progress);
  return raw ? JSON.parse(raw) : {};
}

export function saveProgress(progress: Record<number, StudyProgress>) {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}

export function getStats(): UserStats {
  const defaultStats: UserStats = {
    totalStudyTime: 0,
    cardsMastered: 0,
    quizzesCompleted: 0,
    averageScore: 0,
    streakDays: 0,
    lastStudyDate: '',
    dailyGoal: 20,
  };
  const raw = localStorage.getItem(STORAGE_KEYS.stats);
  return raw ? { ...defaultStats, ...JSON.parse(raw) } : defaultStats;
}

export function saveStats(stats: UserStats) {
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
}

export function getBookmarks(): number[] {
  const raw = localStorage.getItem(STORAGE_KEYS.bookmarks);
  return raw ? JSON.parse(raw) : [];
}

export function isBookmarked(cardId: number): boolean {
  return getBookmarks().includes(cardId);
}

export function toggleBookmark(cardId: number): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(cardId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.push(cardId);
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    return true;
  }
}

export function isDarkMode(): boolean {
  const stored = localStorage.getItem(STORAGE_KEYS.darkMode);
  if (stored !== null) return stored === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function setDarkMode(value: boolean) {
  localStorage.setItem(STORAGE_KEYS.darkMode, String(value));
  if (value) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

export function exportData(): string {
  const data = {
    progress: getProgress(),
    stats: getStats(),
    bookmarks: getBookmarks(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.progress) saveProgress(data.progress);
    if (data.stats) saveStats(data.stats);
    if (data.bookmarks) localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(data.bookmarks));
    return true;
  } catch {
    return false;
  }
}

export function updateStudyStats(correct: boolean, timeSeconds: number) {
  const stats = getStats();
  stats.totalStudyTime += timeSeconds;
  stats.lastStudyDate = new Date().toISOString().split('T')[0];
  
  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (stats.lastStudyDate === yesterday || stats.lastStudyDate === today) {
    if (stats.lastStudyDate === yesterday) stats.streakDays++;
  } else {
    stats.streakDays = 1;
  }
  
  saveStats(stats);
}
