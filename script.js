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
let gameSpeed = 150;

const resizeCanvas = () => {
  const canvasWidth = gameBoard.offsetWidth;
  const canvasHeight = gameBoard.offsetHeight;
  gameBoard.width = canvasWidth; // Set internal width
  gameBoard.height = canvasHeight; // Set internal height
};
window.addEventListener("resize", resizeCanvas); // To handle resizing
resizeCanvas();
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
  createFood();
  drawFood();
  gameLoop();
};

const gameLoop = () => {
  if (isRunning) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      gameLoop();
    }, gameSpeed);
  } else {
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
  xFood = randomFood(0, gameBoardWidth - gridUnit);
  yFood = randomFood(0, gameBoardHeight - gridUnit); // Use gameBoardHeight for y-axis
}

const drawFood = () => {
  context.fillStyle = foodColor;
  context.fillRect(xFood, yFood, gridUnit, gridUnit);
};

const moveSnake = () => {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  // If food is eaten
  if (snake[0].x == xFood && snake[0].y == yFood) {
    score += 1;
    gameSpeed += 0.8; // Increase speed
    gameScore.textContent = score;
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
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yVelocity == -gridUnit;
  const goingDown = yVelocity == gridUnit;
  const goingRight = xVelocity == gridUnit;
  const goingLeft = xVelocity == -gridUnit;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -gridUnit;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -gridUnit;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = gridUnit;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
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
};

const resetGame = () => {
  score = 0;
  xVelocity = gridUnit;
  yVelocity = 0;
  snake = [
    { x: gridUnit * 4, y: 0 },
    { x: gridUnit * 3, y: 0 },
    { x: gridUnit * 2, y: 0 },
    { x: gridUnit, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
};

// Add event listeners for arrow keys and button clicks
window.addEventListener("keydown", changeDirection);
topButton.addEventListener("click", () => changeDirection({ keyCode: 38 })); // Up
downButton.addEventListener("click", () => changeDirection({ keyCode: 40 })); // Down
leftButton.addEventListener("click", () => changeDirection({ keyCode: 37 })); // Left
rightButton.addEventListener("click", () => changeDirection({ keyCode: 39 })); // Right

restartBtn.addEventListener("click", resetGame);

window.addEventListener("load", () => {
  startBtn.style.display = "block";
});
// Add event listener to the Start button
startBtn.addEventListener("click", gameStart);
