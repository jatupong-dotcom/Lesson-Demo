import React from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sound';

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ score, total, onRestart }) => {
  React.useEffect(() => {
    playSound('win'); // Play win sound
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleRestart = () => {
    playSound('click');
    onRestart();
  };

  const percentage = (score / total) * 100;
  let message = "";
  let emoji = "";

  if (percentage === 100) {
    message = "Perfect! สุดยอดไปเลย!";
    emoji = "🏆";
  } else if (percentage >= 80) {
    message = "Great Job! เก่งมาก!";
    emoji = "🌟";
  } else if (percentage >= 50) {
    message = "Good Try! พยายามได้ดี!";
    emoji = "👍";
  } else {
    message = "Keep Practicing! สู้ๆ นะ!";
    emoji = "📚";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-sky-100">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-300 text-center p-8">
        
        <div className="text-6xl mb-4 animate-bounce">
          {emoji}
        </div>

        <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">
          Lesson Completed!
        </h1>
        <p className="text-slate-500 font-medium mb-8">การเรียนเสร็จสิ้น</p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border-2 border-slate-100">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Your Score</p>
            <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-display font-bold text-sky-500">{score}</span>
                <span className="text-2xl text-slate-400 font-bold">/ {total}</span>
            </div>
            <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
                <div 
                    className={`h-full rounded-full ${percentage >= 80 ? 'bg-green-400' : percentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="mt-4 text-lg font-bold text-slate-700">{message}</p>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-display font-bold text-xl rounded-xl shadow-[0_4px_0_rgb(3,105,161)] active:shadow-none active:translate-y-[4px] transition-all"
        >
          Play Again (เล่นอีกครั้ง)
        </button>
      </div>
    </div>
  );
};

export default Result;
