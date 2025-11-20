import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { playSound, speak } from '../utils/sound';

interface GameProps {
  questions: Question[];
  onFinish: (score: number, total: number) => void;
}

const Game: React.FC<GameProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // UI States
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0); // Track attempts for current question
  const [isImageLoading, setIsImageLoading] = useState(true);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setIsCorrect(null);
    setAttempts(0);
    setShake(false);
    setIsImageLoading(true);
  }, [currentIndex]);

  const handleAnswer = (option: string) => {
    // If already correctly answered or image is loading, ignore clicks
    if (isCorrect === true || isImageLoading) return;

    setSelectedOption(option);

    if (option === currentQuestion.word) {
      // Correct
      playSound('correct');
      speak(currentQuestion.word); // Pronounce word on correct answer
      
      setIsCorrect(true);
      // Only award point if it was the first attempt
      if (attempts === 0) {
        setScore((prev) => prev + 1);
      }
      
      // Auto advance after delay
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      // Wrong
      playSound('wrong');
      setIsCorrect(false);
      setAttempts((prev) => prev + 1);
      setShake(true);
      // Remove shake animation after it plays so it can be triggered again
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate score based on logic
      onFinish(score + (attempts === 0 && selectedOption === currentQuestion.word ? 1 : 0), questions.length);
    }
  };
  
  const handleManualSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    speak(currentQuestion.word);
  };

  // Image Generation URL (Dynamic Cartoon)
  const imageUrl = `https://image.pollinations.ai/prompt/cute%20cartoon%20vector%20${currentQuestion.word}%20animal%20minimalist%20white%20background?width=500&height=500&nologo=true&seed=${currentIndex}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-4 px-4 pb-12 max-w-2xl mx-auto">
      {/* Header / Progress */}
      <div className="w-full flex justify-between items-center mb-4 bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100">
        <div>
            <span className="text-slate-400 text-sm font-bold">QUESTION</span>
            <div className="text-2xl font-display font-bold text-slate-700">
                {currentIndex + 1} <span className="text-slate-400 text-lg">/ {questions.length}</span>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-slate-400 text-sm font-bold">SCORE</span>
            <div className="text-2xl font-display font-bold text-green-500">
                {score}
            </div>
        </div>
      </div>
      
      <div className="w-full bg-white rounded-full h-4 mb-6 overflow-hidden border-2 border-slate-100">
        <div 
            className="bg-yellow-400 h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Card Area */}
      <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border-b-8 border-sky-200">
        {/* Image Area */}
        <div className="bg-sky-50 relative flex justify-center items-center p-8 h-64 sm:h-80">
           {isImageLoading && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
               <div className="w-16 h-16 border-4 border-sky-300 border-t-sky-600 rounded-full animate-spin mb-4"></div>
               <p className="text-sky-600 font-display font-bold text-lg animate-pulse">กำลังวาดรูป... (Creating Image)</p>
             </div>
           )}

           <img 
             src={imageUrl} 
             alt={currentQuestion.word}
             className={`h-full w-auto object-contain drop-shadow-xl transition-all duration-500 ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
             loading="eager"
             onLoad={() => setIsImageLoading(false)}
           />
           
           {!isImageLoading && (
             <>
               {/* Thai Hint */}
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl font-bold text-slate-700 shadow-sm border border-white animate-bounce-short z-10">
                 แปลว่า: <span className="text-sky-600 text-xl">{currentQuestion.thai}</span>
               </div>
               
               {/* Audio Button */}
               <button 
                 onClick={handleManualSpeak}
                 className="absolute top-4 left-4 bg-white/90 hover:bg-sky-100 backdrop-blur p-3 rounded-full shadow-sm border border-white z-10 transition-transform active:scale-90 group"
                 title="Listen"
               >
                 <span className="text-2xl group-hover:scale-110 block transition-transform">🔊</span>
               </button>
             </>
           )}
        </div>

        {/* Feedback Area */}
        <div className={`h-16 flex items-center justify-center transition-colors duration-300 ${
            isCorrect === true ? 'bg-green-100' : isCorrect === false ? 'bg-red-100' : 'bg-white'
        }`}>
            {isCorrect === true && (
                <div className="flex items-center text-green-600 font-bold text-xl animate-bounce-short">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    Correct! ถูกต้องเก่งมาก
                </div>
            )}
            {isCorrect === false && (
                <div className="flex items-center text-red-500 font-bold text-xl animate-pulse">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Wrong! ลองใหม่อีกทีนะ
                </div>
            )}
            {isCorrect === null && !isImageLoading && (
                <p className="text-slate-400 font-semibold">เลือกคำศัพท์ภาษาอังกฤษที่ถูกต้อง</p>
            )}
             {isCorrect === null && isImageLoading && (
                <p className="text-slate-400 font-semibold">รอรูปภาพสักครู่...</p>
            )}
        </div>

        {/* Options Grid */}
        <div className={`p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 ${shake ? 'animate-shake' : ''}`}>
            {currentQuestion.options.map((option, idx) => {
                let btnClass = "bg-white text-slate-600 border-slate-200 hover:border-sky-400 hover:bg-sky-50"; // Default
                
                if (selectedOption === option) {
                    if (option === currentQuestion.word) {
                         btnClass = "bg-green-500 text-white border-green-600 shadow-[0_4px_0_rgb(22,163,74)] transform translate-y-[2px]";
                    } else {
                         btnClass = "bg-red-500 text-white border-red-600 shadow-[0_4px_0_rgb(220,38,38)]";
                    }
                } else if (isCorrect === true && option === currentQuestion.word) {
                     // Optional: Highlight correct answer if they got it right (already handled by selectedOption logic for success case)
                }

                const disabled = isCorrect === true || isImageLoading;

                return (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        disabled={disabled}
                        className={`
                            relative py-4 px-6 rounded-2xl border-b-4 text-xl font-display font-bold transition-all duration-200
                            flex items-center justify-center
                            ${btnClass}
                            ${(!selectedOption && !disabled) ? 'shadow-sm active:translate-y-[2px] active:border-b-0' : ''}
                            ${disabled && !selectedOption ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Game;
