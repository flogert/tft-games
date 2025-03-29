"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  // Example leaderboard data (replace with API call or dynamic data fetching)
  useEffect(() => {
    const mockLeaderboard = [
      { id: 1, name: "PlayerOne", score: 15 },
      { id: 2, name: "ChampionMaster", score: 12 },
      { id: 3, name: "TFTPro", score: 10 },
    ];
    setLeaderboard(mockLeaderboard);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Leaderboard</h1>
        <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Rank</th>
                <th className="py-2">Player</th>
                <th className="py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr
                  key={player.id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{player.name}</td>
                  <td className="py-2 px-4">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
