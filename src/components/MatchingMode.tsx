import { useState, useMemo } from 'react';
import { ArrowLeft, Shuffle, CheckCircle, XCircle } from 'lucide-react';
import type { Card } from '../types';
import { shuffleArray } from '../utils/helpers';

export default function MatchingMode({ cards, onBack }: { cards: Card[]; onBack: () => void }) {
  const [started, setStarted] = useState(false);
  const [matches, setMatches] = useState<{jp: string; id: string; id_num: number}[]>([]);
  const [selectedJp, setSelectedJp] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [filter, setFilter] = useState<string>('all');

  const pool = useMemo(() => {
    const filtered = filter === 'all' ? cards : cards.filter(c => c.category === filter);
    return shuffleArray(filtered).slice(0, 8);
  }, [cards, filter, started]);

  const start = () => {
    const gameCards = pool;
    const jpCards = shuffleArray(gameCards.map(c => ({ text: c.jp, key: c.id.toString() })));
    const idCards = shuffleArray(gameCards.map(c => ({ text: c.id_text, key: c.id.toString() })));
    setMatches(gameCards.map(c => ({ jp: c.jp, id: c.id_text, id_num: c.id })));
    setStarted(true);
    setMatched(new Set());
    setScore(0);
    setAttempts(0);
    setSelectedJp(null);
    setSelectedId(null);
  };

  const handleSelectJp = (key: string) => {
    if (matched.has(key)) return;
    setSelectedJp(key);
    if (selectedId) checkMatch(key, selectedId);
  };

  const handleSelectId = (key: string) => {
    if (matched.has(key)) return;
    setSelectedId(key);
    if (selectedJp) checkMatch(selectedJp, key);
  };

  const checkMatch = (jpKey: string, idKey: string) => {
    setAttempts(a => a + 1);
    if (jpKey === idKey) {
      setMatched(prev => new Set([...prev, jpKey]));
      setScore(s => s + 1);
      setSelectedJp(null);
      setSelectedId(null);
    } else {
      setWrong(true);
      setTimeout(() => { setWrong(false); setSelectedJp(null); setSelectedId(null); }, 800);
    }
  };

  const categories = [...new Set(cards.map(c => c.category))];
  const finished = matched.size === matches.length && matches.length > 0;

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={onBack} className="btn-secondary text-sm mb-4"><ArrowLeft className="w-4 h-4 inline mr-1" />Kembali</button>
          <h1 className="text-2xl font-bold dark:text-white mb-2">Matching Game</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Cocokkan kata Jepang dengan artinya</p>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field mb-4">
            <option value="all">Semua Kategori</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={start} className="btn-primary w-full flex items-center justify-center gap-2">
            <Shuffle className="w-4 h-4" /> Mulai Game
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center">
        <div className="max-w-md w-full card-shadow bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold dark:text-white mb-2">Selesai!</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Score: {score}/{matches.length} | Percobaan: {attempts}</p>
          <div className="flex gap-3">
            <button onClick={() => setStarted(false)} className="btn-secondary flex-1">Menu</button>
            <button onClick={start} className="btn-primary flex-1">Main Lagi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="btn-secondary text-sm">Keluar</button>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {matched.size}/{matches.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* JP Column */}
          <div className="space-y-2">
            {pool.map(c => {
              const isMatched = matched.has(c.id.toString());
              const isSelected = selectedJp === c.id.toString();
              return (
                <button
                  key={`jp-${c.id}`}
                  onClick={() => handleSelectJp(c.id.toString())}
                  disabled={isMatched}
                  className={`w-full p-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 opacity-50'
                      : isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                      : wrong && isSelected
                      ? 'bg-rose-50 border-rose-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-primary-300'
                  }`}
                >
                  {c.jp}
                </button>
              );
            })}
          </div>

          {/* ID Column */}
          <div className="space-y-2">
            {shuffleArray(pool).map(c => {
              const isMatched = matched.has(c.id.toString());
              const isSelected = selectedId === c.id.toString();
              return (
                <button
                  key={`id-${c.id}`}
                  onClick={() => handleSelectId(c.id.toString())}
                  disabled={isMatched}
                  className={`w-full p-3 rounded-xl text-sm border-2 transition-all ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 opacity-50'
                      : isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                      : wrong && isSelected
                      ? 'bg-rose-50 border-rose-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                  }`}
                >
                  {c.id_text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
