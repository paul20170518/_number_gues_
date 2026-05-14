import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play, CircleArrowUp, CircleArrowDown, Trophy, PartyPopper, Sun, Moon } from 'lucide-react';

interface GameStatus {
  msg: string;
  count: number;
  isGameOver: boolean;
  type: 'hint' | 'success' | 'error' | 'neutral';
}

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [range, setRange] = useState({ min: 51, max: 100 });
  const [status, setStatus] = useState<GameStatus>({
    msg: '請輸入 51-100 之間的數字',
    count: 0,
    isGameOver: false,
    type: 'neutral',
  });
  const [shake, setShake] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize game
  const initGame = () => {
    const randomNum = Math.floor(Math.random() * 50) + 51;
    setTargetNumber(randomNum);
    setUserInput('');
    setRange({ min: 51, max: 100 });
    setStatus({
      msg: '新遊戲開始！猜一個 51-100 的數字',
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

    if (isNaN(guess) || guess < 51 || guess > 100) {
      setStatus(prev => ({ ...prev, msg: '請輸入有效的 51-100 數字！', type: 'error' }));
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4 font-sans selection:bg-blue-100 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute -top-16 right-0 p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-sm border border-neutral-100 dark:border-neutral-700"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="bg-white dark:bg-neutral-800 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-neutral-100 dark:border-neutral-700 relative overflow-hidden text-center transition-colors duration-300">
          {/* Header */}
          <div className="mb-8 overflow-hidden">
             <motion.div
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
                <Trophy className="mx-auto text-blue-500 mb-4" size={48} />
             </motion.div>
             <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2 transition-colors">
               猜數字遊戲
             </h1>
             <motion.div 
               key={`${range.min}-${range.max}`}
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full text-neutral-600 dark:text-neutral-300 font-bold transition-colors"
             >
               <span className="text-blue-600 dark:text-blue-400">{range.min}</span>
               <span className="text-neutral-300 dark:text-neutral-500">~</span>
               <span className="text-blue-600 dark:text-blue-400">{range.max}</span>
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
                  status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  status.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                  status.type === 'hint' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-neutral-50 text-neutral-600 dark:bg-neutral-700/50 dark:text-neutral-300'
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
               <p className="text-sm font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 transition-colors">
                 猜測次數: <span className="text-neutral-900 dark:text-white font-bold">{status.count}</span>
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
                     className="w-full text-center text-4xl font-bold p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-200 dark:placeholder:text-neutral-600"
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
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-blue-50 dark:bg-blue-500/10 rounded-full blur-3xl -z-10 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-purple-50 dark:bg-purple-500/10 rounded-full blur-3xl -z-10 transition-colors duration-300" />
        </div>

        <p className="mt-8 text-center text-neutral-400 dark:text-neutral-500 text-sm transition-colors">
          你能用最少次數猜到答案嗎？
        </p>
      </motion.div>
    </div>
  );
}
