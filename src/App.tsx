import { useState, useEffect, lazy, Suspense } from 'react';
import type { ViewMode, Card, QuizSet } from './types';
import { isDarkMode, setDarkMode, loadCards, loadQuizzes } from './utils/storage';

const Home = lazy(() => import('./components/Home'));
const FlashcardMode = lazy(() => import('./components/FlashcardMode'));
const QuizMode = lazy(() => import('./components/QuizMode'));
const SearchMode = lazy(() => import('./components/SearchMode'));
const StatsMode = lazy(() => import('./components/StatsMode'));
const SettingsMode = lazy(() => import('./components/SettingsMode'));
const MatchingMode = lazy(() => import('./components/MatchingMode'));
const FillBlankMode = lazy(() => import('./components/FillBlankMode'));

function App() {
  const [view, setView] = useState<ViewMode>('home');
  const [cards, setCards] = useState<Card[]>([]);
  const [quizzes, setQuizzes] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDarkMode(isDarkMode());
    Promise.all([loadCards(), loadQuizzes()]).then(([c, q]) => {
      setCards(c);
      setQuizzes(q);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 dark:border-slate-700 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Memuat data...</p>
        <p className="text-xs text-slate-400 mt-1">1247 kartu & 136 soal quiz</p>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    }>
      {view === 'home' && <Home cards={cards} quizzes={quizzes} onNavigate={setView} />}
      {view === 'flashcards' && <FlashcardMode cards={cards} onBack={() => setView('home')} />}
      {view === 'quiz' && <QuizMode quizzes={quizzes} onBack={() => setView('home')} />}
      {view === 'matching' && <MatchingMode cards={cards} onBack={() => setView('home')} />}
      {view === 'fillblank' && <FillBlankMode cards={cards} onBack={() => setView('home')} />}
      {view === 'search' && <SearchMode cards={cards} onBack={() => setView('home')} />}
      {view === 'stats' && <StatsMode onBack={() => setView('home')} />}
      {view === 'settings' && <SettingsMode onBack={() => setView('home')} />}
    </Suspense>
  );
}

export default App;
