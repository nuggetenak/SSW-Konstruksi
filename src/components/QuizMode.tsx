import { useState, useEffect, useCallback } from 'react';
import type { QuizSet, QuizQuestion } from '../types';
import { quizAnswerKey, shuffleArray } from '../utils/helpers';
import { getStats, saveStats, updateStudyStats } from '../utils/storage';

export default function QuizMode({ quizzes, onBack }: { quizzes: QuizSet[]; onBack: () => void }) {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startQuiz = (quiz: QuizSet, shuffle = true) => {
    const qs = shuffle ? shuffleArray(quiz.questions) : [...quiz.questions];
    // Assign answers from answer key
    const key = quizAnswerKey[quiz.title];
    if (key) {
      qs.forEach(q => {
        q.answer = key[q.id] || 'a';
      });
    }
    setSelectedQuiz(quiz);
    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswers({});
    setTimer(0);
    setIsActive(true);
  };

  const handleSelect = (opt: string) => {
    if (showResult || selected) return;
    setSelected(opt);
    const q = questions[currentIdx];
    const correct = q.answer === opt;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => ({ ...prev, [q.id]: { selected: opt, correct } }));
    setShowResult(true);
  };

  const next = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsActive(false);
    const stats = getStats();
    stats.quizzesCompleted += 1;
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    stats.averageScore = Math.round((stats.averageScore * (stats.quizzesCompleted - 1) + pct) / stats.quizzesCompleted);
    saveStats(stats);
    updateStudyStats(true, timer);
  };

  const reset = () => {
    setSelectedQuiz(null);
    setQuestions([]);
  };

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="btn-secondary text-sm">Kembali</button>
            <h1 className="text-xl font-bold dark:text-white">Quiz SSW</h1>
          </div>
          <div className="grid gap-4">
            {quizzes.map(q => (
              <div key={q.id} className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold dark:text-white">{q.title}</h3>
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                    {q.questions.length} soal
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {q.title.includes('50') ? 'Waktu: 4 menit' : q.title.includes('22') ? 'Waktu: 11 menit' : 'Waktu: 8 menit'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => startQuiz(q, false)} className="btn-secondary text-sm flex-1">Urut</button>
                  <button onClick={() => startQuiz(q, true)} className="btn-primary text-sm flex-1">Acak</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];
  const isFinished = currentIdx + 1 >= questions.length && showResult;

  if (isFinished && !isActive) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center">
        <div className="max-w-md w-full card-shadow bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-2xl font-bold dark:text-white mb-2">Quiz Selesai!</h2>
          <div className="text-5xl font-bold text-primary-500 my-6">{pct}%</div>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            Benar: {score} / {total}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Waktu: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </p>
          <div className="flex gap-3">
            <button onClick={reset} className="btn-secondary flex-1">Quiz Lain</button>
            <button onClick={() => startQuiz(selectedQuiz, true)} className="btn-primary flex-1">Ulangi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <button onClick={reset} className="btn-secondary text-sm">Keluar</button>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {currentIdx + 1} / {questions.length} | {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
          <div className="bg-primary-500 h-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="card-shadow bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-4">
          <p className="text-lg font-medium dark:text-white leading-relaxed mb-6">
            {current?.question}
          </p>
          <div className="space-y-3">
            {['a', 'b', 'c'].map(opt => {
              const optText = current?.options?.[opt];
              if (!optText) return null;
              const isSelected = selected === opt;
              const isCorrect = current?.answer === opt;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : showWrong
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                      : isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="font-semibold mr-2 dark:text-white">{opt.toUpperCase()}.</span>
                  <span className="dark:text-slate-200">{optText}</span>
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div className="flex justify-end">
            <button onClick={next} className="btn-primary">
              {currentIdx + 1 >= questions.length ? 'Selesai' : 'Lanjut'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
