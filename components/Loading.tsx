import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sky-100">
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-white rounded-full opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full border-8 border-sky-500 rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          🦁
        </div>
      </div>
      <h2 className="text-2xl font-display font-bold text-sky-700 animate-pulse">
        กำลังเตรียมสัตว์น่ารักๆ...
      </h2>
      <p className="text-sky-600 mt-2">กรุณารอสักครู่ (Preparing Quiz...)</p>
    </div>
  );
};

export default Loading;