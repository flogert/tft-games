'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function GamePage() {
  const [tacticianData, setTacticianData] = useState(null);
  const [randomTactician, setRandomTactician] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [correctSound, setCorrectSound] = useState(null);
  const [incorrectSound, setIncorrectSound] = useState(null);

  useEffect(() => {
    setCorrectSound(new Audio('/sounds/correct.mp4'));
    setIncorrectSound(new Audio('/sounds/incorrect.mp4'));
  }, []);

  useEffect(() => {
    if (correctSound) correctSound.volume = 0.6;
    if (incorrectSound) incorrectSound.volume = 0.6;
  }, [correctSound, incorrectSound]);

  useEffect(() => {
    const fetchTacticians = async () => {
      try {
        const response = await fetch(
          'https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-tactician.json'
        );
        const data = await response.json();
        setTacticianData(data.data);
      } catch (error) {
        console.error('Error fetching tactician data:', error);
      }
    };
    fetchTacticians();
  }, []);

  useEffect(() => {
    if (tacticianData) pickRandomTactician();
  }, [tacticianData]);

  useEffect(() => {
    if (!timerStarted || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === 1) setGameOver(true);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerStarted]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setGameOver(true);
      setTimerStarted(false);
      setHighScores((prevScores) =>
        [...prevScores, score].sort((a, b) => b - a).slice(0, 6)
      );
    }
  }, [timeRemaining]);

  const pickRandomTactician = useCallback(() => {
    if (!tacticianData) return;
    const tacticianIds = Object.keys(tacticianData);
    const randomId =
      tacticianIds[Math.floor(Math.random() * tacticianIds.length)];
    setRandomTactician(tacticianData[randomId]);
    console.log(tacticianData[randomId].name);
    setUserGuess('');
    setIsCorrect(null);
  }, [tacticianData]);

  const handleInputChange = useCallback((e) => {
    setUserGuess(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!timerStarted) setTimerStarted(true);

      const guess = userGuess.trim().toLowerCase();
      const fullName = randomTactician?.name?.toLowerCase() || '';

      let points = 0;
      if (guess === fullName) points = 3;
      else if (guess === fullName.split(' ').pop()) points = 1;

      if (points > 0) {
        setIsCorrect(true);
        setScore((prev) => prev + points);
        correctSound?.play();
        setTimeout(pickRandomTactician, 500);
      } else {
        setIsCorrect(false);
        incorrectSound?.play();
      }
    },
    [userGuess, randomTactician, pickRandomTactician, timerStarted, correctSound, incorrectSound]
  );

  const restartGame = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setTimeRemaining(60);
    setTimerStarted(false);
    pickRandomTactician();
  }, [pickRandomTactician]);

  return (
    <div
      className="flex justify-center pt-24 min-h-screen bg-slate-950 text-gray-100 bg-cover bg-center font-custom"
      style={{ backgroundImage: `url('/images/tacticians.png')` }}
    >
      <div className="float-left w-64 h-min p-6 mr-6 bg-slate-900 bg-opacity-60 text-white text-center rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Other Games</h2>
        <Link href="/traits">
          <div className="text-center rounded-full text-white p-[6px] mb-6 bg-slate-950 font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            Traits
          </div>
        </Link>
        <Link href="/augments">
          <div className="text-center rounded-full text-white p-[6px] bg-slate-950 font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            Augments
          </div>
        </Link>
      </div>

      <div className="relative flex flex-col items-center bg-slate-900 p-24 bg-opacity-60 rounded-lg h-[600px] overflow-auto">
        <div className={`absolute top-4 left-4 p-3 rounded-lg text-white text-lg font-semibold transition-all duration-500 ${isCorrect ? 'bg-amber-500' : 'bg-slate-900'}`}>
          Score: {score}
        </div>

        <Link href="/">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 p-3 rounded-full text-white text-5xl font-bold transition-transform transform hover:scale-105 hover:cursor-pointer">
            TFTdle
          </div>
        </Link>

        <div className={`absolute top-4 right-4 p-3 rounded-lg text-white text-lg font-semibold transition-all duration-500 ${timeRemaining <= 15 ? 'bg-amber-600 animate-pulse' : 'bg-slate-900'}`}>
          Timer: {timeRemaining}
        </div>

        <h1 className="text-xl font-bold mb-6">Guess The Tactician!</h1>

        {randomTactician ? (
          <div className="flex flex-col items-center relative">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/tft-tactician/${randomTactician.image.full}`}
              alt={randomTactician.name}
              className="w-72 h-48 mb-4 rounded-lg transition-transform transform hover:scale-105"
              onError={() => pickRandomTactician()}
            />

            <button onClick={pickRandomTactician} className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Skip
            </button>

            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <input type="text" value={userGuess} onChange={handleInputChange} placeholder="Enter your guess" className="w-full text-gray-900 p-2 border border-gray-300 rounded-lg mb-4 font-sans" />
              <button type="submit" className="w-full bg-cyan-500 text-white p-2 rounded-lg">
                Submit
              </button>
            </form>
            {isCorrect !== null && <p className={`mt-4 text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{isCorrect ? 'Correct!' : 'Incorrect, try again!'}</p>}
          </div>
        ) : (
          <p>Loading tactician...</p>
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
