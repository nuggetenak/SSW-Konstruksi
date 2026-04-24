import { useState } from 'react';
import { BookOpen, Zap, BarChart3, Settings, Search, Brain, Layers } from 'lucide-react';
import type { Card, QuizSet, ViewMode } from '../types';
import { categoryLabels } from '../utils/helpers';
import { getStats } from '../utils/storage';

export default function Home({ cards, quizzes, onNavigate }: { cards: Card[]; quizzes: QuizSet[]; onNavigate: (v: ViewMode) => void }) {
  const [search, setSearch] = useState('');
  const stats = getStats();

  const categories = [...new Set(cards.map(c => c.category))];
  const totalCards = cards.length;
  const totalQuizzes = quizzes.reduce((a, q) => a + q.questions.length, 0);

  const quickAccess = [
    { mode: 'flashcards' as ViewMode, label: 'Flashcards', icon: BookOpen, color: 'bg-emerald-500', desc: `${totalCards} kartu` },
    { mode: 'quiz' as ViewMode, label: 'Quiz', icon: Zap, color: 'bg-amber-500', desc: `${totalQuizzes} soal` },
    { mode: 'matching' as ViewMode, label: 'Matching', icon: Layers, color: 'bg-violet-500', desc: 'Cocokkan kata' },
    { mode: 'fillblank' as ViewMode, label: 'Isian', icon: Brain, color: 'bg-rose-500', desc: 'Lengkapi kalimat' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="bg-primary-600 dark:bg-primary-800 text-white p-6 pb-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">SSW Konstruksi</h1>
          <p className="text-primary-100 text-sm mb-4">Aplikasi belajar mandiri untuk ujian SSW</p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => onNavigate('search')}
              placeholder="Cari kata, romaji, atau arti..."
              className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder:text-primary-200 focus:outline-none focus:bg-white/30 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6">
        {/* Stats summary */}
        <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.streakDays}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Hari Berturut</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.cardsMastered}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Dikuasai</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.quizzesCompleted}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Quiz Selesai</div>
          </div>
        </div>

        {/* Quick Access */}
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3 px-1">Mode Belajar</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickAccess.map(item => (
            <button
              key={item.mode}
              onClick={() => onNavigate(item.mode)}
              className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-left hover:scale-[1.02] transition-transform"
            >
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">{item.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Categories */}
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3 px-1">Kategori</h2>
        <div className="grid gap-2 mb-6">
          {categories.map(cat => {
            const info = categoryLabels[cat] || { label: cat, color: 'bg-slate-500', icon: '📦' };
            const count = cards.filter(c => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => onNavigate('flashcards')}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-slate-600 transition-all text-left"
              >
                <div className={`w-8 h-8 ${info.color} rounded-lg flex items-center justify-center text-sm`}>
                  {info.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm dark:text-white">{info.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{count} kartu</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quiz sets */}
        <h2 className="font-semibold text-slate-900 dark:text-white mb-3 px-1">Quiz PDF</h2>
        <div className="grid gap-2 mb-24">
          {quizzes.map(q => (
            <button
              key={q.id}
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-slate-600 transition-all text-left"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm dark:text-white">{q.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{q.questions.length} soal</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-around z-50">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 text-primary-600 dark:text-primary-400">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">Belajar</span>
        </button>
        <button onClick={() => onNavigate('stats')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Statistik</span>
        </button>
        <button onClick={() => onNavigate('settings')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Pengaturan</span>
        </button>
      </div>
    </div>
  );
}
