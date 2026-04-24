import { useState, useMemo } from 'react';
import { ArrowLeft, Check, X, Eye } from 'lucide-react';
import type { Card } from '../types';
import { shuffleArray } from '../utils/helpers';

export default function FillBlankMode({ cards, onBack }: { cards: Card[]; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [started, setStarted] = useState(false);

  const pool = useMemo(() => {
    const filtered = filter === 'all' ? cards : cards.filter(c => c.category === filter);
    return shuffleArray(filtered).slice(0, 20);
  }, [cards, filter, started]);

  const current = pool[index];

  const check = () => {
    if (!input.trim() || showAnswer) return;
    setAttempts(a => a + 1);
    const correct = input.trim().toLowerCase() === current.jp.toLowerCase() ||
      input.trim().toLowerCase() === current.romaji.toLowerCase() ||
      current.jp.includes(input.trim());
    if (correct) {
      setScore(s => s + 1);
      setShowAnswer(true);
    } else {
      setShowAnswer(true);
    }
  };

  const next = () => {
    setIndex(i => (i + 1) % pool.length);
    setInput('');
    setShowAnswer(false);
  };

  const categories = [...new Set(cards.map(c => c.category))];

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={onBack} className="btn-secondary text-sm mb-4"><ArrowLeft className="w-4 h-4 inline mr-1" />Kembali</button>
          <h1 className="text-2xl font-bold dark:text-white mb-2">Fill in the Blank</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Lengkapi kata Jepang berdasarkan arti yang diberikan</p>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field mb-4">
            <option value="all">Semua Kategori</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setStarted(true)} className="btn-primary w-full">Mulai</button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="btn-secondary text-sm">Keluar</button>
          <span className="text-sm text-slate-500 dark:text-slate-400">{index + 1}/{pool.length} | {score}/{attempts}</span>
        </div>

        <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Arti:</p>
          <p className="text-xl font-bold dark:text-white mb-4">{current.id_text}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Deskripsi:</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{current.desc}</p>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder="Ketik kata Jepang..."
            disabled={showAnswer}
            className="input-field text-center text-lg font-bold mb-3"
            autoFocus
          />

          {showAnswer && (
            <div className={`p-3 rounded-xl mb-3 ${
              input.trim().toLowerCase() === current.jp.toLowerCase() || current.jp.includes(input.trim())
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {input.trim().toLowerCase() === current.jp.toLowerCase() || current.jp.includes(input.trim()) ? (
                  <><Check className="w-4 h-4 text-emerald-500" /><span className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">Benar!</span></>
                ) : (
                  <><X className="w-4 h-4 text-rose-500" /><span className="text-rose-700 dark:text-rose-300 font-medium text-sm">Salah</span></>
                )}
              </div>
              <p className="text-lg font-bold dark:text-white">{current.jp}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{current.romaji}</p>
            </div>
          )}

          <div className="flex gap-2">
            {!showAnswer ? (
              <>
                <button onClick={() => setShowAnswer(true)} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" /> Lihat Jawaban
                </button>
                <button onClick={check} className="btn-primary flex-1 text-sm">Cek</button>
              </>
            ) : (
              <button onClick={next} className="btn-primary w-full">Lanjut</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
