export default function Scoreboard({ score }) {
    return (
      <div className="text-center mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Current Score: <span className="text-blue-500">{score}</span>
        </h2>
      </div>
    );
  }