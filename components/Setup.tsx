import React, { useState } from 'react';
import { playSound } from '../utils/sound';

interface SetupProps {
  onStart: (count: number) => void;
}

const Setup: React.FC<SetupProps> = ({ onStart }) => {
  const [customCount, setCustomCount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePreset = (count: number) => {
    playSound('click');
    onStart(count);
  };

  const handleCustomStart = () => {
    playSound('click');
    const count = parseInt(customCount, 10);
    if (isNaN(count) || count <= 0) {
      setError('กรุณากรอกจำนวนที่ถูกต้อง (Please enter a valid number)');
      return;
    }
    if (count > 50) {
      setError('เยอะไปไหม? ลองไม่เกิน 50 ข้อดีกว่า (Max 50)');
      return;
    }
    onStart(count);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-sky-200">
        <div className="bg-sky-400 p-6 text-center">
          <h1 className="text-4xl font-display font-bold text-white drop-shadow-md">
            Zoo Spell Quest
          </h1>
          <p className="text-sky-100 mt-2 font-bold">เกมทายศัพท์สัตว์หรรษา</p>
        </div>
        
        <div className="p-8">
          <div className="mb-8 text-center">
            <img 
              src="https://image.pollinations.ai/prompt/cute%203d%20cartoon%20zoo%20animals%20group%20white%20background?width=400&height=250&nologo=true" 
              alt="Zoo Animals" 
              className="w-full h-48 object-cover rounded-2xl mb-4 shadow-inner bg-slate-100"
            />
            <p className="text-lg text-slate-600 font-semibold">
              เลือกจำนวนข้อที่ต้องการทดสอบ
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[10, 20, 30].map((num) => (
              <button
                key={num}
                onClick={() => handlePreset(num)}
                className="py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-display font-bold rounded-xl shadow-[0_4px_0_rgb(161,98,7)] active:shadow-none active:translate-y-[4px] transition-all text-xl"
              >
                {num} ข้อ
              </button>
            ))}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือกำหนดเอง</span>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={customCount}
              onChange={(e) => {
                setCustomCount(e.target.value);
                setError('');
              }}
              placeholder="ใส่จำนวน..."
              className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-400 font-display text-lg text-center"
            />
            <button
              onClick={handleCustomStart}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-[0_4px_0_rgb(3,105,161)] active:shadow-none active:translate-y-[4px] transition-all"
            >
              เริ่มเลย!
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2 text-center font-bold">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Setup;
