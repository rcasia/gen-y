import { useState, useEffect, useRef } from 'react';
import './Games.css';

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'snake', name: '🐍 Snake Neon', component: <SnakeGame /> },
    { id: 'memory', name: '🧠 Memory Game', component: <MemoryGame /> },
    { id: 'clicker', name: '⚡ Clicker Neon', component: <ClickerGame /> },
    { id: 'quiz', name: '❓ Quiz Trivia', component: <QuizGame /> }
  ];

  return (
    <div className="games-container">
      <h2 className="games-title">🎮 Arcade Neon</h2>
      <p className="games-subtitle">Elige un juego y diviértete</p>

      {!activeGame ? (
        <div className="games-grid">
          {games.map(game => (
            <button
              key={game.id}
              className="game-card"
              onClick={() => setActiveGame(game.id)}
            >
              <div className="game-card-content">
                <h3>{game.name}</h3>
                <p>Haz clic para jugar</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="game-view">
          <button className="back-to-games" onClick={() => setActiveGame(null)}>
            ← Volver a Juegos
          </button>
          {games.find(g => g.id === activeGame)?.component}
        </div>
      )}
    </div>
  );
};

// Snake Game
const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const gameStartedRef = useRef(gameStarted);
  const gameOverRef = useRef(gameOver);

  const gridSize = 20;
  const cellSize = 20;

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    gameStartedRef.current = gameStarted;
  }, [gameStarted]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  };

  const handleKeyPress = (e) => {
    if (!gameStartedRef.current) return;
    
    const key = e.key;
    const currentDir = directionRef.current;
    if (key === 'ArrowUp' && currentDir.y === 0) {
      setDirection({ x: 0, y: -1 });
    } else if (key === 'ArrowDown' && currentDir.y === 0) {
      setDirection({ x: 0, y: 1 });
    } else if (key === 'ArrowLeft' && currentDir.x === 0) {
      setDirection({ x: -1, y: 0 });
    } else if (key === 'ArrowRight' && currentDir.x === 0) {
      setDirection({ x: 1, y: 0 });
    }
  };

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    const newFood = generateFood();
    setFood(newFood);
    foodRef.current = newFood;
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        if (!gameStartedRef.current || gameOverRef.current) return;

        setSnake(prevSnake => {
          const head = prevSnake[0];
          const dir = directionRef.current;
          const newHead = {
            x: head.x + dir.x,
            y: head.y + dir.y
          };

          // Check boundaries
          if (
            newHead.x < 0 || newHead.x >= gridSize ||
            newHead.y < 0 || newHead.y >= gridSize
          ) {
            setGameOver(true);
            setGameStarted(false);
            return prevSnake;
          }

          // Check collision with self
          if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            setGameOver(true);
            setGameStarted(false);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];
          const currentFood = foodRef.current;

          // Check food collision
          if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
            const newFood = generateFood();
            setFood(newFood);
            foodRef.current = newFood;
            setScore(prev => prev + 10);
            return newSnake;
          }

          // Remove tail
          newSnake.pop();
          return newSnake;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver]);

  return (
    <div className="snake-game" tabIndex="0" onKeyDown={handleKeyPress}>
      <div className="game-header">
        <h3>🐍 Snake Neon</h3>
        <div className="score">Puntos: {score}</div>
      </div>
      {!gameStarted ? (
        <div className="game-start">
          <button onClick={startGame} className="start-btn">▶️ Iniciar Juego</button>
          <p>Usa las flechas del teclado para moverte</p>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Puntuación: {score}</p>
          <button onClick={startGame} className="restart-btn">🔄 Jugar de Nuevo</button>
        </div>
      ) : (
        <div className="snake-board">
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            const isSnake = snake.some(seg => seg.x === x && seg.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`cell ${isHead ? 'head' : ''} ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                style={{ width: cellSize, height: cellSize }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Memory Game
const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const symbols = ['💿', '📀', '🎮', '📚', '🎧', '🎸', '🎹', '🎺'];

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, flipped: false }));
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setMoves(prev => prev + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="memory-game">
        <h3>🧠 Memory Game</h3>
        <button onClick={initializeGame} className="start-btn">▶️ Iniciar Juego</button>
        <p>Encuentra las parejas de símbolos</p>
      </div>
    );
  }

  const allMatched = matched.length === cards.length;

  return (
    <div className="memory-game">
      <div className="game-header">
        <h3>🧠 Memory Game</h3>
        <div className="score">Movimientos: {moves}</div>
      </div>
      {allMatched ? (
        <div className="game-won">
          <h3>🎉 ¡Ganaste!</h3>
          <p>Completaste el juego en {moves} movimientos</p>
          <button onClick={initializeGame} className="restart-btn">🔄 Jugar de Nuevo</button>
        </div>
      ) : (
        <div className="memory-board">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`memory-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? card.symbol : '?'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Clicker Game
const ClickerGame = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [autoClick, setAutoClick] = useState(0);

  const handleClick = () => {
    setScore(prev => {
      const newScore = prev + level;
      if (newScore >= level * 100) {
        setLevel(prev => prev + 1);
      }
      return newScore;
    });
  };

  const buyAutoClick = () => {
    if (score >= 50) {
      setScore(prev => prev - 50);
      setAutoClick(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (autoClick > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + autoClick);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClick]);

  return (
    <div className="clicker-game">
      <h3>⚡ Clicker Neon</h3>
      <div className="clicker-stats">
        <div className="stat">
          <span>Puntos:</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="stat">
          <span>Nivel:</span>
          <span className="level-value">{level}</span>
        </div>
        <div className="stat">
          <span>Auto-Clicks:</span>
          <span className="auto-value">{autoClick}</span>
        </div>
      </div>
      <button className="clicker-btn" onClick={handleClick}>
        ⚡ CLICK ⚡
      </button>
      <div className="upgrades">
        <button 
          className="upgrade-btn" 
          onClick={buyAutoClick}
          disabled={score < 50}
        >
          Comprar Auto-Click (50 pts)
        </button>
      </div>
    </div>
  );
};

// Quiz Game
const QuizGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: '¿Cuál es el color neon más común en cyberpunk?',
      answers: ['Cyan', 'Rosa', 'Verde', 'Amarillo'],
      correct: 0
    },
    {
      question: '¿Qué consola lanzó Nintendo en 2017?',
      answers: ['Wii U', 'Switch', '3DS', 'GameCube'],
      correct: 1
    },
    {
      question: '¿Qué formato de música es analógico?',
      answers: ['MP3', 'Vinilo', 'FLAC', 'AAC'],
      correct: 1
    },
    {
      question: '¿Cuántos volúmenes tiene One Piece actualmente?',
      answers: ['Más de 100', 'Más de 50', 'Más de 200', 'Más de 150'],
      correct: 0
    }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="quiz-game">
        <div className="quiz-result">
          <h3>🎯 Resultado Final</h3>
          <p>Puntuación: {score} / {questions.length}</p>
          <p>{score === questions.length ? '¡Perfecto! 🌟' : score >= questions.length / 2 ? '¡Bien hecho! 👍' : 'Sigue intentando 💪'}</p>
          <button onClick={resetGame} className="restart-btn">🔄 Jugar de Nuevo</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-game">
      <div className="game-header">
        <h3>❓ Quiz Trivia</h3>
        <div className="score">Pregunta {currentQuestion + 1} / {questions.length}</div>
      </div>
      <div className="quiz-content">
        <h4>{questions[currentQuestion].question}</h4>
        <div className="quiz-answers">
          {questions[currentQuestion].answers.map((answer, index) => (
            <button
              key={index}
              className={`quiz-answer ${
                selectedAnswer === index
                  ? index === questions[currentQuestion].correct
                    ? 'correct'
                    : 'wrong'
                  : ''
              }`}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
