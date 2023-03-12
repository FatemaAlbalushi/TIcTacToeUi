const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let currentPlayer = 'X';
let gameIsLive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getCellIndex(cell) {
  for (let i = 0; i < cells.length; i++) {
    if (cell === cells[i]) {
      return i;
    }
  }
}

function checkForWin() {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (
      cells[a].textContent === currentPlayer &&
      cells[b].textContent === currentPlayer &&
      cells[c].textContent === currentPlayer
    ) {
      return [a, b, c];
    }
  }
  return null;
}

function checkForDraw() {
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].textContent) {
      return false;
    }
  }
  return true;
}

function highlightWinningCombo(winningCombo) {
  for (let i = 0; i < winningCombo.length; i++) {
    const cell = cells[winningCombo[i]];
    cell.classList.add('winning');
  }
}

function handleCellClick(e) {
  const cell = e.target;
  const index = getCellIndex(cell);

  if (cell.textContent || !gameIsLive) {
    return;
  }

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);
  
  const winningCombo = checkForWin();
  if (winningCombo) {
    handleGameOver(false, winningCombo);
    return;
  }

  if (checkForDraw()) {
    handleGameOver(true);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function handleGameOver(isDraw, winningCombo) {
  gameIsLive = false;
  const winningClass = winningCombo ? currentPlayer : null;

  if (isDraw) {
    status.textContent = "It's a draw!";
  } else {
    status.textContent = `Player ${currentPlayer} has won!`;
    highlightWinningCombo(winningCombo);
  }

  cells.forEach((cell) => {
    cell.removeEventListener('click', handleCellClick);
    if (winningClass) {
      cell.classList.remove('winning');
      if (cell.textContent === currentPlayer) {
        cell.classList.add('winning-player');
      }
    }
  });
  
  restartBtn.classList.remove('hidden');
}

function handleRestart() {
  gameIsLive = true;
  currentPlayer = 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
  
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('X', 'O', 'winning', 'winning-player');
    cell.addEventListener('click', handleCellClick);
  });
  
  restartBtn.classList.add('hidden');
}

cells.forEach((cell) => {
  cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', handleRestart);
