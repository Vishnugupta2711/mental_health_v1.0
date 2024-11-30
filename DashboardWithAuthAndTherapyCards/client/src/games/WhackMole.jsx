import React, { useState, useEffect } from "react";
import moleImage from "../img/mole.png"; // Update path as needed

const WhackMole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gridSize, setGridSize] = useState(3); // 3x3 grid by default
  const [molePosition, setMolePosition] = useState({ row: 0, col: 0 });
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isGameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        randomizeMolePosition();
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
    }
    return () => clearInterval(interval);
  }, [isGameActive, timeLeft]);

  const randomizeMolePosition = () => {
    setMolePosition({
      row: Math.floor(Math.random() * gridSize),
      col: Math.floor(Math.random() * gridSize),
    });
  };

  const handleSquareClick = (row, col) => {
    if (row === molePosition.row && col === molePosition.col) {
      setScore(score + 1);
      randomizeMolePosition();
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsGameActive(true);
    randomizeMolePosition();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-300 to-yellow-200 flex flex-col items-center">
      <h1 className="text-blue-600 text-4xl font-bold mt-8">WHACK MOLES!</h1>

      <div className="mt-4 flex space-x-4">
        <div className="text-xl text-blue-500">Score: {score}</div>
        <div className="text-xl text-blue-500">Seconds Left: {timeLeft}</div>
      </div>

      <div className="mt-4">
        <select
          className="custom-select px-4 py-2 border rounded text-center"
          onChange={(e) => setGridSize(parseInt(e.target.value))}
          value={gridSize}
        >
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
        </select>
      </div>

      <div
        className={`grid grid-cols-${gridSize} gap-2 mt-6`}
        style={{ width: `${gridSize * 100}px`, height: `${gridSize * 100}px` }}
      >
        {[...Array(gridSize)].map((_, row) =>
          [...Array(gridSize)].map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`square w-24 h-24 flex items-center justify-center border border-black rounded cursor-pointer ${
                row === molePosition.row && col === molePosition.col
                  ? "bg-cover bg-center"
                  : "bg-green-600"
              }`}
              style={
                row === molePosition.row && col === molePosition.col
                  ? { backgroundImage: `url(${moleImage})` }
                  : {}
              }
              onClick={() => handleSquareClick(row, col)}
            />
          ))
        )}
      </div>

      <div className="mt-4">
        <button
          className="btn bg-blue-500 text-white px-6 py-2 rounded shadow-lg"
          onClick={startGame}
        >
          New Game
        </button>
      </div>

      
    </div>
  );
};

export default WhackMole;
