'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

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

  // Preload sound effects
  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp4');
    incorrectSound.current = new Audio('/sounds/incorrect.mp4');
    correctSound.current.volume = 0.6;
    incorrectSound.current.volume = 0.6;
  }, []);

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
        correctSound.current.play();
        setTimeout(pickRandomTrait, 500);
      } else {
        setIsCorrect(false);
        incorrectSound.current.play();
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
    <div
      className="flex justify-center pt-24 min-h-screen bg-slate-950 text-gray-100 bg-cover bg-center font-custom"
      style={{ backgroundImage: `url('/images/tacticians.png')` }} >
      <div className="float-left w-64 h-min p-6 mr-6 bg-slate-900 bg-opacity-60 text-white text-center rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Other Games</h2>
        <Link href="/tacticians">
          <div className="text-center rounded-full text-white p-[6px] mb-6 bg-slate-950 font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            Tacticians
          </div>
        </Link>
        <Link href="/augments">
          <div className="text-center rounded-full text-white p-[6px] bg-slate-950 font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            Augments
          </div>
        </Link>
      </div>

      <div className="relative flex flex-col items-center bg-slate-900 p-24 bg-opacity-60 rounded-lg h-[600px] overflow-auto">
        {/* Score */}
        <div
          className={`absolute top-4 left-4 p-3 rounded-lg text-white text-lg font-semibold 
            transition-all duration-500 ${isCorrect ? 'bg-amber-500' : 'bg-slate-900'}`}
        >
          Score: {score}
        </div>

        {/* Logo */}
        <Link href="/">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 p-3 rounded-full text-white text-5xl font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            TFTdle
          </div>
        </Link>

        {/* Timer */}
        <div
          className={`absolute top-4 right-4 p-3 rounded-lg text-white text-lg font-semibold transition-all duration-500 
            ${timeRemaining <= 15 ? 'bg-amber-600 animate-pulse' : 'bg-slate-900'}`}
        >
          Timer: {timeRemaining}
        </div>

        {/* Game content */}
        <h1 className="text-xl font-bold mb-4">Guess The Trait!</h1>
        {randomTrait ? (
          <div className="flex flex-col items-center relative">
            <img
              src={randomTrait.image}
              alt={randomTrait.name}
              className="w-24 h-24 mb-4 rounded-lg transition-transform transform hover:scale-105"
              onError={(e) => {
                console.warn(`Image not found for ${randomTrait.name}, picking next trait.`);
                e.target.onerror = null;
                pickRandomTrait();
              }}
            />

            {/* Skip Button */}
            <button
              onClick={pickRandomTrait}
              className="absolute top-1/4 right-1 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 mb-6 rounded-lg hover:bg-red-700"
              tabIndex="0"
            >
              Skip
            </button>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <input
                type="text"
                value={userGuess}
                onChange={handleInputChange}
                placeholder="Enter your guess"
                className="w-full text-gray-900 p-2 border border-gray-300 rounded-lg mb-4"
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
          <p>Loading trait...</p>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-900 bg-opacity-25 text-white text-2xl font-bold">
            <div className="p-6 bg-slate-950 rounded-lg shadow-lg text-center transition-transform duration-500 scale-105 hover:scale-100">
              <p>Game Over!</p>
              <p>Congrats, your score is {score}!</p>
              <button
                onClick={restartGame}
                className="mt-6 px-6 py-6 bg-blue-500 rounded-lg text-white hover:bg-blue-700"
              >
                Restart Game
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-64 h-min p-6 bg-slate-900 bg-opacity-60 text-white text-center rounded-lg shadow-lg ml-[24px]">
        <h2 className="text-xl font-semibold mb-4">High Scores</h2>
        <ul>
          {highScores.map((score, index) => (
            <li key={index} className="text-lg bg-slate-950 rounded-lg mb-2">
              {score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
