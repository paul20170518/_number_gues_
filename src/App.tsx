import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play, CircleArrowUp, CircleArrowDown, Trophy, PartyPopper } from 'lucide-react';

interface GameStatus {
  msg: string;
  count: number;
  isGameOver: boolean;
  type: 'hint' | 'success' | 'error' | 'neutral';
}

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [range, setRange] = useState({ min: 1, max: 100 });
  const [status, setStatus] = useState<GameStatus>({
    msg: '請輸入 1-100 之間的數字',
    count: 0,
    isGameOver: false,
    type: 'neutral',
  });
  const [shake, setShake] = useState(false);

  // Initialize game
  const initGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setUserInput('');
    setRange({ min: 1, max: 100 });
    setStatus({
      msg: '新遊戲開始！猜一個 1-100 的數字',
      count: 0,
      isGameOver: false,
      type: 'neutral',
    });
    setShake(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = () => {
    const guess = parseInt(userInput);

    if (isNaN(guess) || guess < 1 || guess > 100) {
      setStatus(prev => ({ ...prev, msg: '請輸入有效的 1-100 數字！', type: 'error' }));
      triggerShake();
      return;
    }

    const newCount = status.count + 1;

    if (guess === targetNumber) {
      setRange({ min: targetNumber, max: targetNumber });
      setStatus({
        msg: `🎉 恭喜答對！答案就是 ${targetNumber}`,
        count: newCount,
        isGameOver: true,
        type: 'success',
      });
    } else if (guess > targetNumber) {
      setRange(prev => ({ ...prev, max: Math.min(prev.max, guess - 1) }));
      setStatus({
        msg: '太大了！往小一點猜 👇',
        count: newCount,
        isGameOver: false,
        type: 'hint',
      });
      triggerShake();
    } else {
      setRange(prev => ({ ...prev, min: Math.max(prev.min, guess + 1) }));
      setStatus({
        msg: '太小了！往大一點猜 👆',
        count: newCount,
        isGameOver: false,
        type: 'hint',
      });
      triggerShake();
    }
    setUserInput('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 relative overflow-hidden text-center">
          {/* Header */}
          <div className="mb-8 overflow-hidden">
             <motion.div
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
                <Trophy className="mx-auto text-blue-500 mb-4" size={48} />
             </motion.div>
             <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
               猜數字遊戲
             </h1>
             <motion.div 
               key={`${range.min}-${range.max}`}
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-100 rounded-full text-neutral-600 font-bold"
             >
               <span className="text-blue-600">{range.min}</span>
               <span className="text-neutral-300">~</span>
               <span className="text-blue-600">{range.max}</span>
             </motion.div>
          </div>

          {/* Game Body */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={status.msg}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors ${
                  status.type === 'success' ? 'bg-green-50 text-green-700' :
                  status.type === 'error' ? 'bg-red-50 text-red-600' :
                  status.type === 'hint' ? 'bg-blue-50 text-blue-700' :
                  'bg-neutral-50 text-neutral-600'
                }`}
              >
                {status.type === 'hint' && (
                  parseInt(userInput) > targetNumber ? <CircleArrowDown size={20} /> : <CircleArrowUp size={20} />
                )}
                {status.type === 'success' && <PartyPopper size={24} className="text-green-600" />}
                <span className="font-semibold text-lg">{status.msg}</span>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col items-center">
               <p className="text-sm font-mono uppercase tracking-widest text-neutral-400 mb-6">
                 猜測次數: <span className="text-neutral-900 font-bold">{status.count}</span>
               </p>

               {!status.isGameOver ? (
                 <motion.div
                   animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                   className="w-full space-y-4"
                 >
                   <input
                     id="guess-input"
                     type="number"
                     value={userInput}
                     autoFocus
                     onChange={(e) => setUserInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                     placeholder="輸入數字..."
                     className="w-full text-center text-4xl font-bold p-6 rounded-3xl border-2 border-neutral-100 focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-200"
                   />
                   <button
                     onClick={handleGuess}
                     disabled={!userInput}
                     className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-2 group"
                   >
                     <Play size={20} className="fill-current" />
                     下一步
                   </button>
                 </motion.div>
               ) : (
                 <motion.button
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={initGame}
                   className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(22,163,74,0.2)] transition-all flex items-center justify-center gap-2"
                 >
                   <RefreshCw size={20} />
                   重新開始
                 </motion.button>
               )}
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-purple-50 rounded-full blur-3xl -z-10" />
        </div>

        <p className="mt-8 text-center text-neutral-400 text-sm">
          你能用最少次數猜到答案嗎？
        </p>
      </motion.div>
    </div>
  );
}
