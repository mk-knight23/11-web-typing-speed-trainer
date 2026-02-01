import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, RotateCcw, Zap, Target, History, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORDS = "the quick brown fox jumps over the lazy dog coding is fun speed typing trainer master your keyboard efficiency and accuracy are key to success in the digital age explore the possibilities of technology build amazing things share your knowledge with the world keep practicing every day to improve your skills".split(' ');

interface HighScore {
  wpm: number;
  accuracy: number;
  date: string;
}

function App() {
    const [targetWords, setTargetWords] = useState<string[]>([]);
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [correctWords, setCorrectWords] = useState<boolean[]>([]);
    const [highScore, setHighScore] = useState<HighScore | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // Load high score from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('typing-high-score');
            if (saved) {
                setHighScore(JSON.parse(saved));
            }
        } catch (e) {
            // localStorage not available or corrupted
        }
    }, []);

    useEffect(() => {
        resetTest();
    }, []);

    // Save high score when test completes
    useEffect(() => {
        if (endTime && startTime) {
            const currentWpm = Math.round((correctWords.filter(Boolean).length) / ((endTime - startTime) / 60000)) || 0;
            const currentAccuracy = Math.round((correctWords.filter(Boolean).length / correctWords.length) * 100);

            if (!highScore || currentWpm > highScore.wpm) {
                const newHighScore: HighScore = {
                    wpm: currentWpm,
                    accuracy: currentAccuracy,
                    date: new Date().toISOString()
                };
                setHighScore(newHighScore);
                try {
                    localStorage.setItem('typing-high-score', JSON.stringify(newHighScore));
                } catch (e) {
                    // localStorage not available
                }
            }
        }
    }, [endTime, startTime, correctWords, highScore]);

    const resetTest = () => {
        const shuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 25);
        setTargetWords(shuffled);
        setUserInput('');
        setStartTime(null);
        setEndTime(null);
        setActiveWordIndex(0);
        setCorrectWords([]);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const currentWpm = useMemo(() => {
        if (!startTime) return 0;
        const now = endTime || Date.now();
        const minutes = (now - startTime) / 60000;
        const wordsTyped = correctWords.filter(Boolean).length;
        return Math.round(wordsTyped / minutes) || 0;
    }, [startTime, endTime, correctWords]);

    const accuracy = useMemo(() => {
        if (correctWords.length === 0) return 0;
        const correctCount = correctWords.filter(Boolean).length;
        return Math.round((correctCount / correctWords.length) * 100);
    }, [correctWords]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!startTime) setStartTime(Date.now());

        if (value.endsWith(' ')) {
            const typedWord = value.trim();
            const isCorrect = typedWord === targetWords[activeWordIndex];

            setCorrectWords(prev => [...prev, isCorrect]);
            setActiveWordIndex(prev => prev + 1);
            setUserInput('');

            if (activeWordIndex === targetWords.length - 1) {
                setEndTime(Date.now());
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#eab308', '#ffffff']
                });
            }
        } else {
            setUserInput(value);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 selection:bg-yellow-500/30">
            <div className="w-full max-w-4xl space-y-20">

                {/* Premium Header Stats */}
                <div className="flex justify-between items-end px-4">
                    <div className="flex items-center gap-3 font-black text-3xl text-yellow-400 tracking-[-0.08em]">
                        <Keyboard className="w-10 h-10 drop-shadow-[0_0_20px_rgba(250,204,21,0.3)]" aria-hidden="true" />
                        <span>TYPO<span className="text-zinc-600">_MODERN</span></span>
                    </div>

                    <div className="flex gap-16">
                        <Stat label="wpm" value={currentWpm} icon={<Zap className="w-4 h-4" />} color="text-yellow-400" />
                        <Stat label="acc" value={`${accuracy}%`} icon={<Target className="w-4 h-4" />} color="text-zinc-500" />
                        {highScore && (
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-40">
                                    <Trophy className="w-4 h-4" aria-hidden="true" /> Best
                                </div>
                                <div className="text-2xl font-black text-yellow-500/50 tracking-tighter">
                                    {highScore.wpm} WPM
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Word Display */}
                <div
                    className="relative group p-8 rounded-3xl bg-zinc-800/20 border border-zinc-800/50 backdrop-blur-sm shadow-2xl"
                    role="application"
                    aria-label="Typing speed test"
                    aria-describedby="typing-instructions"
                >
                    <div
                        className={`flex flex-wrap gap-x-4 gap-y-4 text-2xl md:text-3xl font-medium leading-relaxed transition-opacity duration-300 ${endTime ? 'opacity-30' : 'opacity-100'}`}
                        onClick={() => inputRef.current?.focus()}
                        tabIndex={0}
                        role="textbox"
                        aria-multiline="true"
                        aria-readonly="true"
                    >
                        {targetWords.map((word, idx) => (
                            <span
                                key={idx}
                                className={`relative transition-colors duration-200 ${
                                    idx === activeWordIndex ? "text-zinc-100" : "text-zinc-600"
                                } ${
                                    idx < activeWordIndex && (correctWords[idx] ? "text-zinc-100" : "text-red-500 border-b-2 border-red-500/50")
                                }`}
                                aria-label={`Word ${idx + 1}: ${word}${idx < activeWordIndex ? (correctWords[idx] ? ' - correct' : ' - incorrect') : ' - current'}${
                                    idx === activeWordIndex ? ' - type this word' : ''
                                }`}
                            >
                                {word}
                                {idx === activeWordIndex && !endTime && (
                                    <motion.div
                                        layoutId="caret"
                                        className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-500 rounded-full"
                                        aria-hidden="true"
                                    />
                                )}
                            </span>
                        ))}
                    </div>

                    {!endTime && (
                        <input
                            ref={inputRef}
                            id="typing-input"
                            type="text"
                            className="absolute inset-0 opacity-0 cursor-default"
                            value={userInput}
                            onChange={handleInput}
                            autoFocus
                            aria-label="Type words here"
                        />
                    )}

                    <AnimatePresence>
                        {endTime && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md rounded-3xl"
                                role="alertdialog"
                                aria-labelledby="complete-title"
                                aria-describedby="complete-message"
                            >
                                <Trophy className="w-16 h-16 text-yellow-500 mb-6" aria-hidden="true" />
                                <h2 id="complete-title" className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Test Complete!</h2>
                                <p id="complete-message" className="text-zinc-400 mb-8 font-medium">
                                    You typed at <strong>{currentWpm} WPM</strong> with <strong>{accuracy}%</strong> accuracy.
                                    {!highScore || currentWpm > highScore.wpm ? " New high score!" : ""}
                                </p>
                                <button
                                    onClick={resetTest}
                                    className="flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-black rounded-2xl transition-all active:scale-95"
                                    aria-label="Restart typing test"
                                >
                                    <RotateCcw className="w-5 h-5" aria-hidden="true" /> RESTART
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tips / Footer */}
                <div className="flex justify-between items-center text-zinc-600 px-4">
                    <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-lg">Tab</span>
                        <span>+</span>
                        <span className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-lg">Enter</span>
                        <span className="ml-2">to restart</span>
                    </div>
                    <p id="typing-instructions" className="sr-only">
                        Type the words as they appear. Press space or enter after each word. Complete all 25 words as fast as possible.
                    </p>

                    <div className="flex items-center gap-6">
                        <button
                            className="hover:text-zinc-400 transition-colors"
                            aria-label="View history"
                            title="History"
                        >
                            <History className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <button
                            className="hover:text-zinc-400 transition-colors text-yellow-500/50"
                            onClick={resetTest}
                            aria-label="Reset test"
                            title="Reset"
                        >
                            <RotateCcw className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Stat({ label, value, icon, color }: { label: string; value: any; icon: React.ReactNode; color: string }) {
    return (
        <div className="text-right">
            <div className={`flex items-center justify-end gap-2 text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-40`}>
                <span className="sr-only">{label}</span>
                <span aria-hidden="true">{icon}</span>
            </div>
            <div className={`text-4xl md:text-5xl font-black ${color} tracking-tighter`} aria-label={`${label}: ${value}`}>
                {value}
            </div>
        </div>
    );
}

export default App;
