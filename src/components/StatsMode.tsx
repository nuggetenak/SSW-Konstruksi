import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Clock, Target, Flame, Download, Upload, Trash2 } from 'lucide-react';
import { getStats, saveStats, exportData, importData, getProgress, getBookmarks } from '../utils/storage';
import type { ViewMode } from '../types';

export default function StatsMode({ onBack }: { onBack: () => void }) {
  const [stats, setStats] = useState(getStats());
  const [progress] = useState(() => Object.values(getProgress()).length);
  const [bookmarks] = useState(() => getBookmarks().length);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const resetAll = () => {
    if (confirm('Yakin ingin menghapus semua progress?')) {
      localStorage.clear();
      setStats(getStats());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="btn-secondary text-sm"><ArrowLeft className="w-4 h-4 inline mr-1" />Kembali</button>
          <h1 className="text-xl font-bold dark:text-white">Statistik</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <Flame className="w-6 h-6 text-orange-500 mb-2" />
            <div className="text-2xl font-bold dark:text-white">{stats.streakDays}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Hari Berturut-turut</div>
          </div>
          <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <Trophy className="w-6 h-6 text-amber-500 mb-2" />
            <div className="text-2xl font-bold dark:text-white">{stats.quizzesCompleted}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Quiz Selesai</div>
          </div>
          <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <Target className="w-6 h-6 text-emerald-500 mb-2" />
            <div className="text-2xl font-bold dark:text-white">{stats.averageScore}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Nilai Rata-rata</div>
          </div>
          <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <Clock className="w-6 h-6 text-primary-500 mb-2" />
            <div className="text-2xl font-bold dark:text-white">{Math.floor(stats.totalStudyTime / 60)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Menit Belajar</div>
          </div>
        </div>

        <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 mb-6">
          <h3 className="font-semibold dark:text-white mb-3">Ringkasan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Kartu Dipelajari</span><span className="font-medium dark:text-white">{progress}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Bookmark</span><span className="font-medium dark:text-white">{bookmarks}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Target Harian</span><span className="font-medium dark:text-white">{stats.dailyGoal} kartu</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Terakhir Belajar</span><span className="font-medium dark:text-white">{stats.lastStudyDate || '-'}</span></div>
          </div>
        </div>

        <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 mb-6">
          <h3 className="font-semibold dark:text-white mb-3">Data</h3>
          <div className="flex gap-2 mb-3">
            <button onClick={() => { const blob = new Blob([exportData()], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ssw-backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); }} className="btn-secondary text-sm flex-1 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setShowImport(!showImport)} className="btn-secondary text-sm flex-1 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Import
            </button>
          </div>
          {showImport && (
            <div className="space-y-2">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON backup di sini..."
                className="input-field text-xs font-mono h-24"
              />
              <button onClick={() => { if (importData(importText)) { alert('Data berhasil diimport!'); setShowImport(false); } else { alert('Format JSON tidak valid'); } }} className="btn-primary text-sm w-full">Import Data</button>
            </div>
          )}
        </div>

        <button onClick={resetAll} className="w-full py-3 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
          <Trash2 className="w-4 h-4" /> Reset Semua Progress
        </button>
      </div>
    </div>
  );
}
