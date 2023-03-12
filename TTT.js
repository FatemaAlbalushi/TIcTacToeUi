// Select all the cells of the game board
const cells = document.querySelectorAll('[data-cell]');
// Select the status element
const status = document.getElementById('status');
// Select the restart button
const restartBtn = document.getElementById('restart');

// Set the starting player as 'X'
let currentPlayer = 'X';
// Set the game to be live
let gameIsLive = true;

// Define the winning conditions for the game
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
  [0, 4, 8], [2, 4, 6] // diagonal
];

/**
 * Helper function to get the index of the cell from the list of cells
 * @param {Element} cell - The cell whose index needs to be determined
 * @returns {number} The index of the cell
 */
function getCellIndex(cell) {
  for (let i = 0; i < cells.length; i++) {
    if (cell === cells[i]) {
      return i;
    }
  }
}

/**
 * Function to check if the current player has won the game
 * @returns {array|null} The array of the winning combination of cells, or null if no winning combination exists
 */
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

/**
 * Function to check if the game has resulted in a draw
 * @returns {boolean} True if the game is a draw, false otherwise
 */
function checkForDraw() {
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].textContent) {
      return false;
    }
  }
  return true;
}

/**
 * Function to highlight the winning combination of cells
 * @param {array} winningCombo - The array of the winning combination of cells
 */
function highlightWinningCombo(winningCombo) {
  for (let i = 0; i < winningCombo.length; i++) {
    const cell = cells[winningCombo[i]];
    cell.classList.add('winning');
  }
}

/**
 * Function to handle the click event on a cell
 * @param {Event} e - The click event
 */
function handleCellClick(e) {
  const cell = e.target;
  const index = getCellIndex(cell);

  // If the cell is already occupied or the game is not live, return
  if (cell.textContent || !gameIsLive) {
    return;
  }

  // Mark the cell with the current player's symbol and class
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);
  
  // Check for a winning combination
  const winningCombo = checkForWin();
  if (winningCombo) {
    handleGameOver(false, winningCombo);
    return;
  }

  // Check for a draw
  if (checkForDraw()) {
    handleGameOver(true);
    return;
  }

  // If neither a winning combination nor a draw has occurred, switch to the other player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  // Update the status element to indicate the current player's turn
  status.textContent = `Player ${currentPlayer}'s turn`;
}

/**
 * Function to handle the end of the game
 * @param {boolean} isDraw - True if the game is a draw, false otherwise
 * @param {array|null} winningCombo - The array of the winning combination of cells, or null if no winning combination exists
*/

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

/**
 * Function to handle the click event on the restart button
*/
function handleRestart() {
    // Reset the game to be live and the starting player to be X
  gameIsLive = true;
  currentPlayer = 'X';
  // Update the status element to indicate the starting player's turn
  status.textContent = `Player ${currentPlayer}'s turn`;
  
  // Clear the board by removing all X/O symbols and classes
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('X', 'O', 'winning', 'winning-player');
    cell.addEventListener('click', handleCellClick);
  });
  
  restartBtn.classList.add('hidden');
}

// Add event listeners for clicking on each cell and the restart button
cells.forEach((cell) => {
  cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', handleRestart);
