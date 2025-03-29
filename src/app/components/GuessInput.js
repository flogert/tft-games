import { useState } from 'react';

export default function GuessInput({ onGuess }) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuess(guess);
    setGuess(''); // Clear input after submission
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 mt-4"
    >
      <input
        type="text"
        placeholder="Enter your guess"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="px-4 py-2 border rounded-lg text-gray-700 w-64"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form>
  );
}
