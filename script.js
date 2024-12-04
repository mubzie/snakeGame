"use strict";

// Elements
const gameBoard = document.querySelector("#gameBoard");
const context = gameBoard.getContext("2d");
const gameScore = document.getElementById("gameScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const topButton = document.getElementById("up-button");
const downButton = document.getElementById("down-button");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");
const gameBoardWidth = parseInt(window.getComputedStyle(gameBoard).width);
console.log(gameBoardWidth);
const gameBoardHeight = parseInt(window.getComputedStyle(gameBoard).height);
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "black";

// Grid Sizes
const gridUnit = 30;
let isRunning = false;
let xVelocity = gridUnit;
let yVelocity = 0;
let xFood;
let yFood;
let score = 0;
let gameSpeed = window.innerWidth <= 768 ? 130 : 150; // Slower on mobile (higher number = slower)
let gameInterval = null; // Declare gameInterval

const resizeCanvas = () => {
  const canvasWidth = gameBoard.offsetWidth;
  const canvasHeight = gameBoard.offsetHeight;
  gameBoard.width = canvasWidth; // Set internal width
  gameBoard.height = canvasHeight; // Set internal height
};
window.addEventListener("resize", resizeCanvas); // To handle resizing
resizeCanvas();

// Get start prompt element
const startPrompt = document.getElementById('startPrompt');

// Hide buttons initially
startBtn.style.display = 'none';
restartBtn.style.display = 'none';

// Defining the snake Body
let snake = [
  { x: gridUnit * 4, y: 0 },
  { x: gridUnit * 3, y: 0 },
  { x: gridUnit * 2, y: 0 },
  { x: gridUnit, y: 0 },
  { x: 0, y: 0 },
];

// arrow functions
const gameStart = () => {
  isRunning = true;
  gameScore.textContent = score;
  startBtn.style.display = "none";     // Hide start button during game
  restartBtn.style.display = "block";  // Show restart button during game
  createFood();
  drawFood();
  gameLoop();
};

const gameLoop = () => {
    if (isRunning) {
        clearTimeout(gameInterval);  // Clear previous interval
        gameInterval = setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
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

const clearBoard = () => {
  context.fillStyle = boardBackground;
  context.fillRect(0, 0, gameBoardWidth, gameBoardHeight);
};

function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / gridUnit) * gridUnit;
    return randNum;
  }
  // Add a margin of one grid unit from the edges
  xFood = randomFood(gridUnit, gameBoardWidth - gridUnit * 2);
  yFood = randomFood(gridUnit, gameBoardHeight - gridUnit * 2);
}

const drawFood = () => {
  context.fillStyle = foodColor;
  context.fillRect(xFood, yFood, gridUnit, gridUnit);
};

const updateGameSpeed = () => {
  const baseSpeed = window.innerWidth <= 768 ? 130 : 150;
  const speedIncrease = Math.floor(score / 5) * 3; // Reduced speed increase to 3ms per 5 points
  gameSpeed = Math.max(baseSpeed - speedIncrease, 80); // Minimum speed increased to 80ms for better control
};

const moveSnake = () => {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  if (head.x === xFood && head.y === yFood) {
    score += 1;
    gameScore.textContent = score;
    updateGameSpeed(); // Update speed when score changes
    createFood();
  } else {
    snake.pop();
  }
};

const drawSnake = () => {
  context.fillStyle = snakeColor;
  context.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    context.fillRect(snakePart.x, snakePart.y, gridUnit, gridUnit);
    context.strokeRect(snakePart.x, snakePart.y, gridUnit, gridUnit);
  });
};

const changeDirection = (event) => {
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
    case (keyPressed === LEFT || key === 'a') && !goingRight:
      xVelocity = -gridUnit;
      yVelocity = 0;
      break;
    // Up movement
    case (keyPressed === UP || key === 'w') && !goingDown:
      xVelocity = 0;
      yVelocity = -gridUnit;
      break;
    // Right movement
    case (keyPressed === RIGHT || key === 'd') && !goingLeft:
      xVelocity = gridUnit;
      yVelocity = 0;
      break;
    // Down movement
    case (keyPressed === DOWN || key === 's') && !goingUp:
      xVelocity = 0;
      yVelocity = gridUnit;
      break;
  }
};

const checkGameOver = () => {
  // Check if snake hits the wall
  if (
    snake[0].x < 0 ||
    snake[0].x >= gameBoardWidth ||
    snake[0].y < 0 ||
    snake[0].y >= gameBoardHeight
  ) {
    isRunning = false;
  }

  // Check if snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      isRunning = false;
    }
  }
};

const displayGameOver = () => {
  context.font = "50px MV Boli";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText("GAME OVER!", gameBoardWidth / 2, gameBoardHeight / 2);
  isRunning = false;
  startBtn.style.display = "none";  // Hide start button when game is over
  restartBtn.style.display = "block"; // Ensure restart button is visible
};

// Function to start game
function startGame() {
    if (!isRunning) {
        startPrompt.classList.add('hidden');
        gameStart();
    }
}

// Handle Enter key press on desktop
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isRunning) {
        startGame();
    }
});

// Handle tap/click on mobile and desktop
startPrompt.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isRunning) {
        startGame();
    }
});

// Handle touch events for mobile
startPrompt.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!isRunning) {
        startGame();
    }
});

// Reset game modifications
const resetGame = () => {
    // Clear the game interval
    if (gameInterval) {
        clearTimeout(gameInterval);
        gameInterval = null;
    }
    
    // Reset game state
    isRunning = false;
    score = 0;
    gameScore.textContent = score;
    gameSpeed = window.innerWidth <= 768 ? 130 : 150;
    xVelocity = gridUnit;
    yVelocity = 0;
    
    // Reset snake position
    snake = [
        { x: gridUnit * 4, y: 0 },
        { x: gridUnit * 3, y: 0 },
        { x: gridUnit * 2, y: 0 },
        { x: gridUnit, y: 0 },
        { x: 0, y: 0 }
    ];
    
    // Reset UI
    startPrompt.style.display = 'flex';
    startPrompt.classList.remove('hidden');
    restartBtn.style.display = 'none';
    startBtn.style.display = 'none';
    
    // Reset board
    clearBoard();
    createFood();
    drawSnake();
};

// Add event listeners for restart button
restartBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    resetGame();
});

// Touch handling variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Add touch event listeners
gameBoard.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

gameBoard.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

// Handle swipe gestures
function handleSwipe() {
    const minSwipeDistance = 30;  // Minimum distance for a swipe
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if the swipe was long enough
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
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
gameBoard.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Add event listeners for arrow keys and button clicks
window.addEventListener("keydown", changeDirection);
topButton.addEventListener("click", () => changeDirection({ keyCode: 38 })); // Up
downButton.addEventListener("click", () => changeDirection({ keyCode: 40 })); // Down
leftButton.addEventListener("click", () => changeDirection({ keyCode: 37 })); // Left
rightButton.addEventListener("click", () => changeDirection({ keyCode: 39 })); // Right

// Add event listener to the Start button
startBtn.addEventListener("click", gameStart);

window.addEventListener("load", () => {
  startBtn.style.display = "none";
  restartBtn.style.display = "none"; // Hide restart button initially
});
