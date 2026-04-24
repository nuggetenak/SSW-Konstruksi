import { useState, useMemo } from 'react';
import { Search, X, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Card } from '../types';
import { categoryLabels } from '../utils/helpers';
import { toggleBookmark, isBookmarked } from '../utils/storage';

export default function SearchMode({ cards, onBack }: { cards: Card[]; onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return cards.filter(c =>
      c.jp.toLowerCase().includes(q) ||
      c.romaji.toLowerCase().includes(q) ||
      c.id_text.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [query, cards]);

  const handleBookmark = (id: number) => {
    const added = toggleBookmark(id);
    setBookmarks(prev => {
      const next = new Set(prev);
      if (added) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="btn-secondary text-sm">Kembali</button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kata, romaji, atau arti..."
              className="input-field pl-10"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {filtered.length} hasil ditemukan
        </div>

        <div className="space-y-3 pb-20">
          {filtered.map(card => {
            const info = categoryLabels[card.category] || { label: card.category, color: 'bg-slate-500' };
            return (
              <div key={card.id} className="card-shadow bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${info.color}`}>
                        {info.label}
                      </span>
                      <span className="text-[10px] text-slate-400">#{card.id}</span>
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">{card.jp}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">{card.romaji}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">{card.id_text}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
                  </div>
                  <button
                    onClick={() => handleBookmark(card.id)}
                    className="shrink-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {bookmarks.has(card.id) || isBookmarked(card.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-primary-500" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
