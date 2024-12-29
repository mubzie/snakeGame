"use strict";

// Elements
const gameBoard: HTMLElement | null = document.querySelector("#gameBoard");
let context: CanvasRenderingContext2D | null = null;
if (gameBoard instanceof HTMLCanvasElement) {
  context = gameBoard.getContext("2d");
}
console.log(context);
const gameScore: HTMLElement | null = document.getElementById("gameScore");

const startBtn: HTMLElement | null = document.getElementById("startBtn");
const restartBtn: HTMLElement | null = document.getElementById("restartBtn");

const topButton: HTMLElement | null = document.getElementById("up-button");
const downButton: HTMLElement | null = document.getElementById("down-button");
const leftButton: HTMLElement | null = document.getElementById("left-button");
const rightButton: HTMLElement | null = document.getElementById("right-button");

const gameBoardWidth: number = gameBoard
  ? parseInt(window.getComputedStyle(gameBoard).width)
  : 0;

const gameBoardHeight: number = gameBoard
  ? parseInt(window.getComputedStyle(gameBoard).height)
  : 0;

const boardBackground: string = "white";
const snakeColor: string = "lightgreen";
const snakeBorder: string = "black";
const foodColor: string = "black";

// Grid Sizes
const gridUnit: number = 30;
let isRunning: boolean = false;
let xVelocity: number = gridUnit;
let yVelocity: number = 0;
let xFood: number;
let yFood: number;
let score: number = 0;
let gameSpeed: number = window.innerWidth <= 768 ? 130 : 150; // Slower on mobile (higher number = slower)
let gameInterval: any = null; // Declare gameInterval

const resizeCanvas = (): void => {
  if (gameBoard instanceof HTMLCanvasElement) {
    gameBoard.width = gameBoard.clientWidth;
    gameBoard.height = gameBoard.clientHeight;
  }
};
window.addEventListener("resize", resizeCanvas); // To handle resizing
resizeCanvas();

// Get start prompt element
const startPrompt: HTMLElement | null = document.getElementById("startPrompt");

// Hide buttons initially
if (startBtn && restartBtn) {
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
}

// Defining the snake Body
let snake: { x: number; y: number }[] = [
  { x: gridUnit * 4, y: 0 },
  { x: gridUnit * 3, y: 0 },
  { x: gridUnit * 2, y: 0 },
  { x: gridUnit, y: 0 },
  { x: 0, y: 0 },
];

// arrow functions
const gameStart = (): void => {
  isRunning = true;
  if (gameScore) gameScore.textContent = score.toString();
  if (startBtn) startBtn.style.display = "none"; // Hide start button during game
  if (restartBtn) restartBtn.style.display = "block"; // Show restart button during game
  createFood();
  drawFood();
  gameLoop();
};

const gameLoop = (): void => {
  if (isRunning) {
    clearTimeout(gameInterval); // Clear previous interval
    gameInterval = setTimeout(() => {
      clearBoard();
      drawFood();
      drawSnake();
      moveSnake();
      checkGameOver();
      gameLoop();
    }, gameSpeed);
  } else {
    if (gameInterval) {
      clearTimeout(gameInterval);
      gameInterval = null;
    }
    displayGameOver();
  }
};

const clearBoard = (): void => {
  if (context) context.fillStyle = boardBackground;
  if (context) context.fillRect(0, 0, gameBoardWidth, gameBoardHeight);
};

function createFood(): void {
  function randomFood(min: number, max: number) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / gridUnit) * gridUnit;
    return randNum;
  }
  // Add a margin of one grid unit from the edges
  xFood = randomFood(gridUnit, gameBoardWidth - gridUnit * 2);
  yFood = randomFood(gridUnit, gameBoardHeight - gridUnit * 2);
}

const drawFood = (): void => {
  if (context) context.fillStyle = foodColor;
  if (context) context.fillRect(xFood, yFood, gridUnit, gridUnit);
};

const updateGameSpeed = (): void => {
  const baseSpeed = window.innerWidth <= 768 ? 130 : 150;
  const speedIncrease = Math.floor(score / 5) * 3; // Reduced speed increase to 3ms per 5 points
  gameSpeed = Math.max(baseSpeed - speedIncrease, 80); // Minimum speed increased to 80ms for better control
};

const moveSnake = (): void => {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);

  if (head.x === xFood && head.y === yFood) {
    score += 1;
    if (gameScore) gameScore.textContent = score.toString();
    updateGameSpeed(); // Update speed when score changes
    createFood();
  } else {
    snake.pop();
  }
};

const drawSnake = (): void => {
  if (context) context.fillStyle = snakeColor;
  if (context) context.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    if (context) context.fillRect(snakePart.x, snakePart.y, gridUnit, gridUnit);
    if (context)
      context.strokeRect(snakePart.x, snakePart.y, gridUnit, gridUnit);
  });
};

const changeDirection = (event: { keyCode: number; key?: string }) => {
  const keyPressed = event.keyCode;
  const key = event.key?.toLowerCase();

  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yVelocity === -gridUnit;
  const goingDown = yVelocity === gridUnit;
  const goingRight = xVelocity === gridUnit;
  const goingLeft = xVelocity === -gridUnit;

  // Handle both arrow keys and WASD
  switch (true) {
    // Left movement
    case (keyPressed === LEFT || key === "a") && !goingRight:
      xVelocity = -gridUnit;
      yVelocity = 0;
      break;
    // Up movement
    case (keyPressed === UP || key === "w") && !goingDown:
      xVelocity = 0;
      yVelocity = -gridUnit;
      break;
    // Right movement
    case (keyPressed === RIGHT || key === "d") && !goingLeft:
      xVelocity = gridUnit;
      yVelocity = 0;
      break;
    // Down movement
    case (keyPressed === DOWN || key === "s") && !goingUp:
      xVelocity = 0;
      yVelocity = gridUnit;
      break;
  }
};

const checkGameOver = (): void => {
  // Check if snake hits the walls
  if (snake[0].x < 0 || snake[0].x >= gameBoardWidth) {
    isRunning = false;
  }

  if (snake[0].y < 0 || snake[0].y >= gameBoardHeight) {
    isRunning = false;
  }

  // Check if snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      isRunning = false;
    }
  }
};

const displayGameOver = (): void => {
  if (context) context.font = "50px MV Boli";
  if (context) context.fillStyle = "black";
  if (context) context.textAlign = "center";
  if (context)
    context.fillText("GAME OVER!", gameBoardWidth / 2, gameBoardHeight / 2);
  isRunning = false;
  if (startBtn) startBtn.style.display = "none"; // Hide start button when game is over
  if (restartBtn) restartBtn.style.display = "block"; // Ensure restart button is visible
};

// Function to start game
function startGame(): void {
  if (!isRunning) {
    if (startPrompt) startPrompt.classList.add("hidden");
    gameStart();
  }
}

// Handle Enter key press on desktop
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isRunning) {
    startGame();
  }
});

// Handle tap/click on mobile and desktop
if (startPrompt)
  startPrompt.addEventListener("click", (e) => {
    e.preventDefault();
    if (!isRunning) {
      startGame();
    }
  });

// Handle touch events for mobile
if (startPrompt)
  startPrompt.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (!isRunning) {
      startGame();
    }
  });

// Reset game modifications
const resetGame = (): void => {
  // Clear the game interval
  if (gameInterval) {
    clearTimeout(gameInterval);
    gameInterval = null;
  }

  // Reset game state
  isRunning = false;
  score = 0;
  if (gameScore) gameScore.textContent = score.toString();
  gameSpeed = window.innerWidth <= 768 ? 130 : 150;
  xVelocity = gridUnit;
  yVelocity = 0;

  // Reset snake position
  snake = [
    { x: gridUnit * 4, y: 0 },
    { x: gridUnit * 3, y: 0 },
    { x: gridUnit * 2, y: 0 },
    { x: gridUnit, y: 0 },
    { x: 0, y: 0 },
  ];

  // Reset UI
  if (startPrompt) startPrompt.style.display = "flex";
  if (startPrompt) startPrompt.classList.remove("hidden");
  if (restartBtn) restartBtn.style.display = "none";
  if (startBtn) startBtn.style.display = "none";

  // Reset board
  clearBoard();
  createFood();
  drawSnake();
};

// Add event listeners for restart button
if (restartBtn) restartBtn.addEventListener("click", resetGame);
if (restartBtn)
  restartBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    resetGame();
  });

// Touch handling variables
let touchStartX: number = 0;
let touchStartY: number = 0;
let touchEndX: number = 0;
let touchEndY: number = 0;

// Add touch event listeners
if (gameBoard)
  gameBoard.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    false
  );

if (gameBoard)
  gameBoard.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    false
  );

// Handle swipe gestures
function handleSwipe(): void {
  const minSwipeDistance = 30; // Minimum distance for a swipe

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Check if the swipe was long enough
  if (
    Math.abs(deltaX) < minSwipeDistance &&
    Math.abs(deltaY) < minSwipeDistance
  ) {
    return; // Too short swipe
  }

  // Check if the swipe was more horizontal or vertical
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && xVelocity === 0) {
      // Right swipe
      yVelocity = 0;
      xVelocity = gridUnit;
    } else if (deltaX < 0 && xVelocity === 0) {
      // Left swipe
      yVelocity = 0;
      xVelocity = -gridUnit;
    }
  } else {
    // Vertical swipe
    if (deltaY > 0 && yVelocity === 0) {
      // Down swipe
      xVelocity = 0;
      yVelocity = gridUnit;
    } else if (deltaY < 0 && yVelocity === 0) {
      // Up swipe
      xVelocity = 0;
      yVelocity = -gridUnit;
    }
  }
}

// Prevent default touch behaviors (like scrolling)
if (gameBoard)
  gameBoard.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );

// Add event listeners for arrow keys and button clicks
window.addEventListener("keydown", changeDirection);
if (topButton)
  topButton.addEventListener("click", () => changeDirection({ keyCode: 38 })); // Up
if (downButton)
  downButton.addEventListener("click", () => changeDirection({ keyCode: 40 })); // Down
if (leftButton)
  leftButton.addEventListener("click", () => changeDirection({ keyCode: 37 })); // Left
if (rightButton)
  rightButton.addEventListener("click", () => changeDirection({ keyCode: 39 })); // Right

// Add event listener to the Start button
if (startBtn) startBtn.addEventListener("click", gameStart);

window.addEventListener("load", () => {
  if (startBtn) startBtn.style.display = "none";
  if (restartBtn) restartBtn.style.display = "none"; // Hide restart button initially
});
