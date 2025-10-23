import React, { useState, useEffect } from "react";

const BOARD_SIZE = 10;
const CELL_SIZE = 20;

export default function SnakeGame() {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Arrow key input
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  });

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    const newHead = [...head];

    switch (direction) {
      case "UP": newHead[1] -= 1; break;
      case "DOWN": newHead[1] += 1; break;
      case "LEFT": newHead[0] -= 1; break;
      case "RIGHT": newHead[0] += 1; break;
      default: break;
    }

    // Collision detection
    if (
      newHead[0] < 0 || newHead[1] < 0 ||
      newHead[0] >= BOARD_SIZE || newHead[1] >= BOARD_SIZE ||
      snake.some(([x, y]) => x === newHead[0] && y === newHead[1])
    ) {
      setGameOver(true);
      return;
    }

    newSnake.push(newHead);

    // Check if food eaten
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(score + 1);
      setFood([
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ]);
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  const restartGame = () => {
    setSnake([[0, 0]]);
    setFood([5, 5]);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="snake-game">
      <h1>🐍 Snake Game</h1>
      <div className="snake-header">
        <div className="score">Score: {score}</div>
        <button onClick={restartGame}>Restart Game</button>
      </div>
      {gameOver && <p className="game-over">Game Over! Press Restart to play again.</p>}
      <div
        className="snake-board"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)` }}
      >
        {Array.from({ length: BOARD_SIZE }).map((_, y) =>
          Array.from({ length: BOARD_SIZE }).map((_, x) => {
            const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
            const isFood = food[0] === x && food[1] === y;
            const cellClass = isSnake
              ? "snake-cell snake"
              : isFood
              ? "snake-cell food"
              : "snake-cell empty";
            return <div key={`${x}-${y}`} className={cellClass} />;
          })
        )}
      </div>
      <div className="snake-instructions">
        <h2>How to Play</h2>
        <p>Use the arrow keys to move the snake. Eat the red food to grow. Don't hit the walls or yourself!</p>
      </div>
    </div>
  );
}
