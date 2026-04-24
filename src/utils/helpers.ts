export const categoryLabels: Record<string, { label: string; color: string; icon: string }> = {
  salam: { label: 'Salam & Etika', color: 'bg-emerald-500', icon: '👋' },
  hukum: { label: 'Hukum & Regulasi', color: 'bg-rose-500', icon: '⚖️' },
  jenis_kerja: { label: 'Jenis Pekerjaan', color: 'bg-blue-500', icon: '🔧' },
  listrik: { label: 'Listrik', color: 'bg-amber-500', icon: '⚡' },
  telekomunikasi: { label: 'Telekomunikasi', color: 'bg-violet-500', icon: '📡' },
  pipa: { label: 'Pipa & Plumbing', color: 'bg-cyan-500', icon: '🔵' },
  isolasi: { label: 'Isolasi Termal', color: 'bg-orange-500', icon: '🌡️' },
  pemadam: { label: 'Pemadam Kebakaran', color: 'bg-red-500', icon: '🧯' },
  keselamatan: { label: 'Keselamatan Kerja', color: 'bg-lime-500', icon: '🦺' },
  karier: { label: 'Karier & Hak', color: 'bg-indigo-500', icon: '💼' },
  alat_umum: { label: 'Alat & Mesin', color: 'bg-slate-500', icon: '🛠️' },
};

export const quizAnswerKey: Record<string, Record<number, string>> = {
  'SSW Konstruksi 5': {
    1: 'b', 2: 'a', 3: 'a', 4: 'a', 5: 'a',
    6: 'b', 7: 'a', 8: 'a', 9: 'b', 10: 'a',
    11: 'a', 12: 'a', 13: 'a', 14: 'b', 15: 'a'
  },
  'SSW Konstruksi 6': {
    1: 'a', 2: 'a', 3: 'b', 4: 'c', 5: 'a',
    6: 'c', 7: 'b', 8: 'c', 9: 'c', 10: 'c',
    11: 'c', 12: 'b', 13: 'b', 14: 'b', 15: 'a',
    16: 'a', 17: 'b', 18: 'b', 19: 'c', 20: 'a',
    21: 'a', 22: 'b'
  },
  'SSW Konstruksi 7': {
    1: 'a', 2: 'a', 3: 'a', 4: 'a', 5: 'a',
    6: 'a', 7: 'a', 8: 'a', 9: 'a', 10: 'a',
    11: 'a', 12: 'a', 13: 'b', 14: 'a', 15: 'a',
    16: 'a', 17: 'a', 18: 'a', 19: 'a', 20: 'a',
    21: 'a', 22: 'a', 23: 'a', 24: 'a', 25: 'a',
    26: 'a', 27: 'a', 28: 'a', 29: 'a', 30: 'a',
    31: 'a', 32: 'a', 33: 'a', 34: 'a', 35: 'a',
    36: 'a', 37: 'a', 38: 'a', 39: 'a', 40: 'a',
    41: 'a', 42: 'a', 43: 'a', 44: 'a', 45: 'a',
    46: 'a', 47: 'a', 48: 'a', 49: 'a', 50: 'a'
  },
  'SSW Konstruksi 8': {
    1: 'a', 2: 'a', 3: 'a', 4: 'a', 5: 'a',
    6: 'a', 7: 'a', 8: 'a', 9: 'a', 10: 'a',
    11: 'a', 12: 'a', 13: 'a', 14: 'a', 15: 'a',
    16: 'a', 17: 'a', 18: 'a', 19: 'a', 20: 'a',
    21: 'a', 22: 'a', 23: 'a', 24: 'a', 25: 'a',
    26: 'a', 27: 'a', 28: 'a', 29: 'a', 30: 'a',
    31: 'a', 32: 'a', 33: 'a', 34: 'a', 35: 'a',
    36: 'a', 37: 'a', 38: 'a', 39: 'a', 40: 'a',
    41: 'a', 42: 'a', 43: 'a', 44: 'a', 45: 'a',
    46: 'a', 47: 'a', 48: 'a', 49: 'a'
  }
};

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
