'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    <div className="flex justify-center pt-24 min-h-screen bg-slate-950 text-gray-100 bg-cover bg-center font-custom"
      style={{ backgroundImage: `url('/images/tacticians.png')` }}>
      <div className="float-left w-64 h-min p-6 mr-6 bg-slate-900 bg-opacity-60 text-white text-center rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Other Games</h2>
        <Link href="/tacticians">
          <div className="text-center rounded-full text-white p-[6px] mb-6 bg-slate-950 font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            Tacticians
          </div>
        </Link>
        <Link href="/traits">
          <div className="text-center rounded-full text-white p-[6px] bg-slate-950 font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            Traits
          </div>
        </Link>
      </div>

      <div className="relative flex flex-col items-center bg-slate-900 p-24 bg-opacity-60 rounded-lg h-[600px] overflow-auto">
        <div className="absolute top-4 left-4 p-3 rounded-lg text-lg font-semibold bg-slate-900">
          Score: {score}
        </div>
        <Link href="/">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 p-3 rounded-full text-white text-5xl font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            TFTdle
          </div>
        </Link>
        <div className={`absolute top-4 right-4 p-3 rounded-lg text-lg font-semibold ${timeRemaining <= 15 ? 'bg-amber-600 animate-pulse' : 'bg-slate-900'}`}>
          Timer: {timeRemaining}
        </div>
        <h1 className="text-xl font-bold mb-4">Guess The Augment!</h1>
        {randomAugment ? (
          <div className="flex flex-col items-center relative">
            <img
              src={`https://raw.communitydragon.org/pbe/game/assets/maps/tft/icons/augments/choiceui/${randomAugment.image}`}
              alt={randomAugment.name}
              className="w-24 h-24 mb-4 rounded-lg hover:scale-105"
            />
            <button onClick={pickRandomAugment} className="absolute top-1/4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Skip
            </button>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Enter your guess"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-900"
              />
              <button type="submit" className="w-full bg-cyan-500 text-white p-2 rounded-lg">
                Submit
              </button>
            </form>
            {isCorrect !== null && (
              <p className={`mt-4 text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect, try again!'}
              </p>
            )}
          </div>
        ) : (
          <p>Loading augment...</p>
        )}
        {gameOver && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-900 bg-opacity-25 text-2xl font-bold">
            <div className="p-6 bg-slate-950 rounded-lg shadow-lg text-center">
              <p>Game Over!</p>
              <p>Your score: {score}!</p>
              <button onClick={restartGame} className="mt-6 px-6 py-6 bg-blue-500 rounded-lg text-white hover:bg-blue-700">
                Restart Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
