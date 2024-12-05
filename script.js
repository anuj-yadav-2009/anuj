// Select elements
const intro = document.getElementById('intro');
const game = document.getElementById('game');
const paddleLeft = document.getElementById('paddle-left');
const paddleRight = document.getElementById('paddle-right');
const ball = document.getElementById('ball');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const winnerEl = document.getElementById('winner');

const playerVsPlayerBtn = document.getElementById('player-vs-player');
const playerVsComputerBtn = document.getElementById('player-vs-computer');

// Game settings
const gameHeight = 400;
const gameWidth = 800;
const paddleSpeed = 10;
let ballSpeed = 4;

// Paddle positions
let paddleLeftY = 160;
let paddleRightY = 160;

// Ball properties
let ballX = 392.5;
let ballY = 192.5;
let ballDirectionX = ballSpeed;
let ballDirectionY = ballSpeed;

// Scores
let playerScore = 0;
let computerScore = 0;

// Game mode
let isPlayerVsComputer = false;

// Winner state
let isGameOver = false;

// Keyboard controls
const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false
};

// Show game
function startGame(vsComputer) {
  isPlayerVsComputer = vsComputer;
  intro.style.display = 'none';
  game.style.display = 'block';
  resetGame();
}
function home(){
  document.getElementById('home').style.display = 'none';
  window.location.reload();
}
function restartGame(){
  console.log("restart");
  document.getElementById('restart').style.display = 'none';
  document.getElementById('home').style.display = 'none';

  resetGame()
}


// Reset scores and game state
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  isGameOver = false;
  winnerEl.style.display = 'none';
  resetBall();
  updateScoreboard();
  gameLoop();
}

// Update scoreboard
function updateScoreboard() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

// Paddle movement
function movePaddles() {
  // Player 1 controls (left paddle)
  if (keys.w && paddleLeftY > 0) paddleLeftY -= paddleSpeed;
  if (keys.s && paddleLeftY < gameHeight - 80) paddleLeftY += paddleSpeed;

  // Player 2 or AI controls (right paddle)
  if (isPlayerVsComputer) {
    // Simple AI for computer
    if (ballY < paddleRightY + 40 && paddleRightY > 0) paddleRightY -= paddleSpeed - 2;
    if (ballY > paddleRightY + 40 && paddleRightY < gameHeight - 80) paddleRightY += paddleSpeed - 2;
  } else {
    // Player 2 controls
    if (keys.ArrowUp && paddleRightY > 0) paddleRightY -= paddleSpeed;
    if (keys.ArrowDown && paddleRightY < gameHeight - 80) paddleRightY += paddleSpeed;
  }

  paddleLeft.style.top = `${paddleLeftY}px`;
  paddleRight.style.top = `${paddleRightY}px`;
}

// Ball movement
function moveBall() {
  if (isGameOver) return;

  ballX += ballDirectionX;
  ballY += ballDirectionY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY >= gameHeight - 15) ballDirectionY *= -1;

  // Ball collision with paddles
  if (
    (ballX <= 10 && ballY >= paddleLeftY && ballY <= paddleLeftY + 80) ||
    (ballX >= gameWidth - 25 && ballY >= paddleRightY && ballY <= paddleRightY + 80)
  ) {
    ballDirectionX *= -1;
  }

  // Ball resets if it goes out of bounds
  if (ballX <= 0) {
    computerScore++;
    checkWinCondition();
    resetBall();
  } else if (ballX >= gameWidth - 15) {
    playerScore++;
    checkWinCondition();
    resetBall();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
}

// Check win condition
function checkWinCondition() {
  if (playerScore >= 5) {
    declareWinner('Player');
  } else if (computerScore >= 5) {
    declareWinner(isPlayerVsComputer ? 'Computer' : 'Player 2');
  }
}

// Declare the winner
function declareWinner(winner) {
  isGameOver = true;
  winnerEl.textContent = `${winner} Wins!`;
  winnerEl.style.display = 'block';
  document.getElementById('restart').style.display = 'block';
  document.getElementById('home').style.display = 'block'

}

// Reset ball
function resetBall() {
  ballX = gameWidth / 2 - 7.5;
  ballY = gameHeight / 2 - 7.5;
  ballDirectionX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
  ballDirectionY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
  updateScoreboard();
}

// Key event listeners
document.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Game loop
function gameLoop() {
  if (!isGameOver) {
    movePaddles();
    moveBall();
    requestAnimationFrame(gameLoop);
  }
}

// Button event listeners
playerVsPlayerBtn.addEventListener('click', () => startGame(false));
playerVsComputerBtn.addEventListener('click', () => startGame(true));
