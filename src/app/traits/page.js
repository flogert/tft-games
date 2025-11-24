'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function TraitsGame() {
  const [traitData, setTraitData] = useState([]);
  const [randomTrait, setRandomTrait] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScores, setHighScores] = useState([]);

  const correctSound = useRef(null);
  const incorrectSound = useRef(null);

  // Initialize audio only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      correctSound.current = new Audio('/sounds/correct.mp4');
      incorrectSound.current = new Audio('/sounds/incorrect.mp4');
      correctSound.current.volume = 0.6;
      incorrectSound.current.volume = 0.6;
    }
  }, []); // Runs only once after the component mounts, which avoids SSR issues

  // Fetch trait data once
  useEffect(() => {
    const fetchTraits = async () => {
      try {
        const response = await fetch('/data/traits.json');
        const data = await response.json();
        setTraitData(data.traits);
      } catch (error) {
        console.error('Error fetching trait data:', error);
      }
    };

    fetchTraits();
  }, []);

  // Pick a random trait when trait data is available
  useEffect(() => {
    if (traitData.length > 0) pickRandomTrait();
  }, [traitData]);

  // Timer logic
  useEffect(() => {
    if (!timerStarted || timeRemaining <= 0) {
      if (timeRemaining === 0) setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setGameOver(true);
      setTimerStarted(false);
      // Save score to high scores if the game is over
      setHighScores((prevScores) => [...prevScores, score].sort((a, b) => b - a).slice(0, 6));
    }
  }, [timeRemaining]);

  // Function to pick a new random trait
  const pickRandomTrait = useCallback(() => {
    if (traitData.length === 0) return;

    const randomIndex = Math.floor(Math.random() * traitData.length);
    const traitName = traitData[randomIndex];
    const formattedTraitName = traitName.replace(/\s+/g, '_');
    const traitImageUrl = `https://wiki.leagueoflegends.com/en-us/images/${formattedTraitName}_TFT_icon.svg?09338`;

    setRandomTrait({ name: traitName, image: traitImageUrl });
    console.log(traitData[randomIndex]);
    setUserGuess('');
    setIsCorrect(null);
  }, [traitData]);

  const handleInputChange = useCallback((e) => {
    setUserGuess(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!timerStarted) setTimerStarted(true);

      const guess = userGuess.trim().toLowerCase();
      const correctAnswer = randomTrait?.name.toLowerCase();

      if (guess === correctAnswer) {
        setScore((prev) => prev + 1);
        setIsCorrect(true);
        if (correctSound.current) correctSound.current.play();
        setTimeout(pickRandomTrait, 500);
      } else {
        setIsCorrect(false);
        if (incorrectSound.current) incorrectSound.current.play();
      }
    },
    [userGuess, randomTrait, pickRandomTrait, timerStarted]
  );

  const restartGame = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setTimeRemaining(60);
    setTimerStarted(false);
    pickRandomTrait();
  }, [pickRandomTrait]);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 font-custom relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
        style={{ backgroundImage: `url('/images/tacticians.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/80 to-blue-950/90 z-0" />

      <div className="relative z-10 flex justify-center pt-24 gap-6 px-4">
        {/* Left Panel */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 h-min p-6 bg-slate-900/60 backdrop-blur-md border border-purple-500/30 text-white text-center rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-purple-300">Other Games</h2>
          <Link href="/tacticians">
            <motion.div 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              className="text-center rounded-lg text-blue-100 p-3 mb-4 border border-blue-500/30 bg-slate-800/50 font-semibold cursor-pointer transition-colors"
            >
              Tacticians
            </motion.div>
          </Link>
          <Link href="/augments">
            <motion.div 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
              className="text-center rounded-lg text-purple-100 p-3 border border-purple-500/30 bg-slate-800/50 font-semibold cursor-pointer transition-colors"
            >
              Augments
            </motion.div>
          </Link>
        </motion.div>

        {/* Main Game Area */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex flex-col items-center bg-slate-900/70 backdrop-blur-md border border-blue-500/20 p-8 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] w-[600px] min-h-[600px]"
        >
          {/* Header Elements */}
          <div className="w-full flex justify-between items-center mb-8">
            <div className={`px-4 py-2 rounded-full border font-bold shadow-inner transition-colors duration-300 ${
              isCorrect 
                ? 'bg-green-900/50 border-green-500 text-green-300' 
                : 'bg-slate-800/80 border-blue-500/30 text-blue-300'
            }`}>
              Score: {score}
            </div>
            
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-400 cursor-pointer filter drop-shadow-lg"
              >
                TFTdle
              </motion.div>
            </Link>

            <div className={`px-4 py-2 rounded-full border font-bold shadow-inner transition-colors duration-300 ${
              timeRemaining <= 15 
                ? 'bg-red-900/50 border-red-500 text-red-300 animate-pulse' 
                : 'bg-slate-800/80 border-yellow-500/30 text-yellow-300'
            }`}>
              Timer: {timeRemaining}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-8 text-white drop-shadow-md">Guess The Trait!</h1>

          {randomTrait ? (
            <div className="flex flex-col items-center w-full relative">
              <motion.div
                key={randomTrait.image}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative group mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-500" />
                <Image
                  src={randomTrait.image}
                  alt="Trait"
                  width={128}
                  height={128}
                  className="relative w-32 h-32 rounded-xl shadow-2xl z-10 object-contain bg-slate-950/50 p-2"
                  onError={(e) => {
                    console.warn(`Image not found for ${randomTrait.name}, picking next trait.`);
                    // e.target.onerror = null; // Not needed for next/image usually, but logic is different
                    pickRandomTrait();
                  }}
                />
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pickRandomTrait} 
                className="absolute top-0 right-0 text-xs bg-slate-700/50 hover:bg-slate-600 text-gray-300 px-3 py-1 rounded-full border border-slate-600 transition-colors"
              >
                Skip
              </motion.button>

              <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
                <input
                  type="text"
                  value={userGuess}
                  onChange={handleInputChange}
                  placeholder="Enter trait name..."
                  className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center text-lg"
                  autoFocus
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-900/20 transition-all"
                >
                  Submit Guess
                </motion.button>
              </form>

              <AnimatePresence mode="wait">
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 px-6 py-2 rounded-full font-bold text-lg ${
                      isCorrect 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/50'
                    }`}
                  >
                    {isCorrect ? '✨ Correct! ✨' : '❌ Incorrect, try again!'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Game Over Modal */}
          <AnimatePresence>
            {gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl"
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-8 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4"
                >
                  <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Game Over!</h2>
                  <p className="text-gray-400 mb-6">Time's up!</p>
                  
                  <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Final Score</p>
                    <p className="text-4xl font-bold text-blue-400">{score}</p>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={restartGame} 
                    className="w-full py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-amber-900/20"
                  >
                    Play Again
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Panel - High Scores */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 h-min p-6 bg-slate-900/60 backdrop-blur-md border border-blue-500/30 text-white text-center rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">High Scores</h2>
          <ul className="space-y-2">
            {highScores.length === 0 && <li className="text-gray-500 italic text-sm">No scores yet</li>}
            {highScores.map((score, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50"
              >
                <span className="text-gray-400 text-sm">#{index + 1}</span>
                <span className="font-bold text-yellow-400">{score}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
