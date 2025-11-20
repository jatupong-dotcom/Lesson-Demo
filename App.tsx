import React, { useState, useCallback } from 'react';
import { GameStatus, Question } from './types';
import { generateQuiz } from './services/geminiService';
import Setup from './components/Setup';
import Game from './components/Game';
import Result from './components/Result';
import Loading from './components/Loading';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState('');

  const startQuiz = useCallback(async (count: number) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const data = await generateQuiz(count);
      if (data && data.length > 0) {
        setQuestions(data);
        setStatus('playing');
      } else {
        throw new Error("No questions generated.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("เกิดข้อผิดพลาดในการโหลดข้อมูล (Error loading quiz). กรุณาลองใหม่");
      setStatus('error');
    }
  }, []);

  const handleGameFinish = (score: number, total: number) => {
    setFinalScore({ score, total });
    setStatus('finished');
  };

  const restartGame = () => {
    setStatus('setup');
    setQuestions([]);
    setFinalScore({ score: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-800">
      {status === 'setup' && <Setup onStart={startQuiz} />}
      
      {status === 'loading' && <Loading />}
      
      {status === 'playing' && (
        <Game questions={questions} onFinish={handleGameFinish} />
      )}
      
      {status === 'finished' && (
        <Result 
          score={finalScore.score} 
          total={finalScore.total} 
          onRestart={restartGame} 
        />
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-red-500 mb-4">{errorMsg}</h2>
          <button 
            onClick={restartGame}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg font-bold shadow hover:bg-sky-600"
          >
            กลับไปหน้าแรก
          </button>
        </div>
      )}
    </div>
  );
};

export default App;