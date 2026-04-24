import { useState } from 'react';
import { ArrowLeft, Moon, Sun, Volume2, VolumeX, Info } from 'lucide-react';
import type { ViewMode } from '../types';
import { isDarkMode, setDarkMode } from '../utils/storage';

export default function SettingsMode({ onBack }: { onBack: () => void }) {
  const [dark, setDark] = useState(isDarkMode());
  const [sound, setSound] = useState(true);

  const toggleDark = () => {
    setDarkMode(!dark);
    setDark(!dark);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="btn-secondary text-sm"><ArrowLeft className="w-4 h-4 inline mr-1" />Kembali</button>
          <h1 className="text-xl font-bold dark:text-white">Pengaturan</h1>
        </div>

        <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 mb-6">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {dark ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <div className="font-medium dark:text-white text-sm">Mode Gelap</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Tampilan gelap untuk belajar malam</div>
              </div>
            </div>
            <button onClick={toggleDark} className={`w-12 h-6 rounded-full transition-colors relative ${dark ? 'bg-primary-500' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${dark ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {sound ? <Volume2 className="w-5 h-5 text-primary-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              <div>
                <div className="font-medium dark:text-white text-sm">Suara</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Efek suara saat belajar</div>
              </div>
            </div>
            <button onClick={() => setSound(!sound)} className={`w-12 h-6 rounded-full transition-colors relative ${sound ? 'bg-primary-500' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${sound ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold dark:text-white">Tentang Aplikasi</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            SSW Konstruksi Study App adalah aplikasi pembelajaran mandiri untuk persiapan ujian SSW (Specified Skilled Worker) konstruksi Jepang. Aplikasi ini berisi 1247 flashcards dan 136 soal quiz dari materi SSW Konstruksi.
          </p>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
            Versi 2.0 • Built with React + Vite • PWA Ready
          </div>
        </div>
      </div>
    </div>
  );
}
