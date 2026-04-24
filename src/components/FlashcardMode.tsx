import { useState, useEffect } from 'react';
import type { Card } from '../types';
import { categoryLabels } from '../utils/helpers';

export default function FlashcardMode({ cards, onBack }: { cards: Card[]; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [shuffled, setShuffled] = useState<Card[]>(cards);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());

  const filtered = filter === 'all' ? shuffled : shuffled.filter(c => c.category === filter);
  const current = filtered[index];

  useEffect(() => {
    setShuffled([...cards].sort(() => Math.random() - 0.5));
  }, [cards]);

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % filtered.length);
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  };

  const markKnown = () => {
    if (!current) return;
    setKnown((k) => new Set([...k, current.id]));
    next();
  };

  const markUnknown = () => {
    if (!current) return;
    setUnknown((u) => new Set([...u, current.id]));
    next();
  };

  const categories = [...new Set(cards.map(c => c.category))];

  if (!current) return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <p className="text-slate-500 dark:text-slate-400">Tidak ada kartu dalam kategori ini</p>
      <button onClick={onBack} className="btn-primary mt-4">Kembali</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="btn-secondary text-sm">Kembali</button>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {index + 1} / {filtered.length}
        </span>
      </div>

      {/* Filter */}
      <select
        value={filter}
        onChange={(e) => { setFilter(e.target.value); setIndex(0); setFlipped(false); }}
        className="input-field mb-4 text-sm"
      >
        <option value="all">Semua Kategori ({cards.length})</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {categoryLabels[cat]?.label || cat} ({cards.filter(c => c.category === cat).length})
          </option>
        ))}
      </select>

      {/* Progress */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="bg-primary-500 h-full transition-all duration-300"
          style={{ width: `${((index + 1) / filtered.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div
          className="perspective-1000 w-full max-w-md cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative preserve-3d transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}
            style={{ minHeight: '320px' }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden">
              <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-8 h-full flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-500 mb-4">
                  {categoryLabels[current.category]?.label || current.category}
                </span>
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-3">
                  {current.jp}
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 italic text-center">
                  {current.romaji}
                </p>
                <p className="text-xs text-slate-400 mt-6">Ketuk untuk membalik</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="card-shadow bg-primary-50 dark:bg-slate-850 rounded-2xl p-8 h-full flex flex-col items-center justify-center border border-primary-200 dark:border-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-4">
                  Bahasa Indonesia
                </span>
                <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-3">
                  {current.id_text}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                  {current.desc}
                </p>
                <div className="mt-4 text-xs text-slate-400">
                  Sumber: {current.source}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button onClick={prev} className="btn-secondary">Prev</button>
        <button onClick={() => setFlipped(!flipped)} className="btn-primary">
          {flipped ? 'Tutup' : 'Buka'}
        </button>
        <button onClick={next} className="btn-secondary">Next</button>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={markUnknown}
          className="px-4 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-medium transition-all"
        >
          Belum Hafal ({unknown.size})
        </button>
        <button
          onClick={markKnown}
          className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium transition-all"
        >
          Sudah Hafal ({known.size})
        </button>
      </div>
    </div>
  );
}
