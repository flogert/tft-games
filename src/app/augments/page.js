'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function AugmentsGame() {
  const [augmentData, setAugmentData] = useState([]);
  const [randomAugment, setRandomAugment] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const fetchAugments = async () => {
      try {
        const response = await fetch('/data/augments.json');
        const data = await response.json();
        setAugmentData(data);
      } catch (error) {
        console.error('Error fetching augment data:', error);
      }
    };
    fetchAugments();
  }, []);

  useEffect(() => {
    if (augmentData.length) pickRandomAugment();
  }, [augmentData]);

  useEffect(() => {
    if (!timerStarted || timeRemaining <= 0) return;
    const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timerStarted, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setGameOver(true);
      setTimerStarted(false);
      setHighScores((prevScores) => [...prevScores, score].sort((a, b) => b - a).slice(0, 6));
    }
  }, [timeRemaining]);

  const pickRandomAugment = () => {
    if (!augmentData.length) return;

    const tryNextAugment = () => {
      const randomIndex = Math.floor(Math.random() * augmentData.length);
      const randomAugment = augmentData[randomIndex];

      if (!randomAugment?.image) return tryNextAugment();

      const imgURL = `https://raw.communitydragon.org/pbe/game/assets/maps/tft/icons/augments/choiceui/${randomAugment.image}`;
      const img = new Image();
      img.src = imgURL;

      img.onload = () => {
        setRandomAugment(randomAugment);
        setUserGuess('');
        setIsCorrect(null);
      };
      img.onerror = () => tryNextAugment();
    };

    tryNextAugment();
  };

  const playSound = (correct) => {
    if (typeof window !== 'undefined') {
      const sound = new Audio(correct ? '/sounds/correct.mp4' : '/sounds/incorrect.mp4');
      sound.volume = 0.6;
      sound.play();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!timerStarted) setTimerStarted(true);

    const correctGuess = randomAugment.name.toLowerCase().split(' ').slice(0, -1).join(' ');
    const isCorrectGuess = userGuess.toLowerCase() === correctGuess;

    setIsCorrect(isCorrectGuess);
    if (isCorrectGuess) {
      setScore((prev) => prev + correctGuess.split(' ').length);
      playSound(true);
      setTimeout(pickRandomAugment, 500);
    } else {
      playSound(false);
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setTimeRemaining(60);
    setTimerStarted(false);
    pickRandomAugment();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 font-custom relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
        style={{ backgroundImage: `url('/images/tacticians.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/80 to-blue-950/90 z-0" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-center pt-12 lg:pt-24 gap-6 px-4 pb-12">
        {/* Left Panel */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-64 h-min p-6 bg-slate-900/60 backdrop-blur-md border border-purple-500/30 text-white text-center rounded-xl shadow-lg order-2 lg:order-1"
        >
          <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-purple-300">Other Games</h2>
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <Link href="/tacticians" className="flex-1 min-w-[120px]">
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                className="text-center rounded-lg text-blue-100 p-3 border border-blue-500/30 bg-slate-800/50 font-semibold cursor-pointer transition-colors h-full flex items-center justify-center"
              >
                Tacticians
              </motion.div>
            </Link>
            <Link href="/traits" className="flex-1 min-w-[120px]">
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                className="text-center rounded-lg text-purple-100 p-3 border border-purple-500/30 bg-slate-800/50 font-semibold cursor-pointer transition-colors h-full flex items-center justify-center"
              >
                Traits
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Main Game Area */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex flex-col items-center bg-slate-900/70 backdrop-blur-md border border-blue-500/20 p-4 md:p-8 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] w-full max-w-[600px] min-h-[500px] order-1 lg:order-2"
        >
          {/* Header Elements */}
          <div className="w-full flex justify-between items-center mb-8 gap-2">
            <div className="px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full bg-slate-800/80 border border-blue-500/30 text-blue-300 font-bold shadow-inner">
              Score: {score}
            </div>
            
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-400 cursor-pointer filter drop-shadow-lg"
              >
                TFTdle
              </motion.div>
            </Link>

            <div className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full border font-bold shadow-inner transition-colors duration-300 ${
              timeRemaining <= 15 
                ? 'bg-red-900/50 border-red-500 text-red-300 animate-pulse' 
                : 'bg-slate-800/80 border-yellow-500/30 text-yellow-300'
            }`}>
              Timer: {timeRemaining}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-8 text-white drop-shadow-md">Guess The Augment!</h1>

          {randomAugment ? (
            <div className="flex flex-col items-center w-full relative">
              <motion.div
                key={randomAugment.image}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-500" />
                <NextImage
                  src={`https://raw.communitydragon.org/pbe/game/assets/maps/tft/icons/augments/choiceui/${randomAugment.image}`}
                  alt="Augment"
                  width={128}
                  height={128}
                  className="relative w-32 h-32 mb-8 rounded-xl shadow-2xl z-10"
                />
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pickRandomAugment} 
                className="absolute top-0 right-0 text-xs bg-slate-700/50 hover:bg-slate-600 text-gray-300 px-3 py-1 rounded-full border border-slate-600 transition-colors"
              >
                Skip
              </motion.button>

              <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Enter augment name..."
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
          className="w-full lg:w-64 h-min p-6 bg-slate-900/60 backdrop-blur-md border border-blue-500/30 text-white text-center rounded-xl shadow-lg order-3"
        >
          <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">High Scores</h2>
          <ul className="space-y-2 flex flex-col items-center lg:items-stretch">
            {highScores.length === 0 && <li className="text-gray-500 italic text-sm">No scores yet</li>}
            {highScores.map((score, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 w-full max-w-[200px] lg:max-w-none"
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
