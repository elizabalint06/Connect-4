const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const rows = 6;
const columns = 7;
let currentPlayer = 'red';
let gameActive = true;
const gameState = [];
const cells = [];

for (let i = 0; i < rows; ++i) {
    gameState[i] = [];
    cells[i] = [];
    for (let j = 0; j < columns; ++j) {
        gameState[i][j] = null;
    }
}

function createBoard() {
    for (let r = 0; r < rows; ++r) {
        for ( let c = 0; c < columns; ++c) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.column = c;
            board.appendChild(cell)
            cells[r][c] = cell;
        }
    }
}

function dropPiece(column) {
    for (let r = rows - 1; r >= 0; --r) {
        if (!gameState[r][column]) {
            gameState[r][column] = currentPlayer;
            return { row : r, column : column }  
        }
    }
}

function checkDirection(row, column, deltaRow, deltaColumn) {
    let count = 0;
    for (let i = -3; i <= 3; ++i) {
        const r = row + i * deltaRow;
        const c = column + i * deltaColumn;
        if (r < rows && r >= 0 && c < columns && c >= 0 && gameState[r][c] === currentPlayer) {
            ++count;
            if (count == 4) {
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

function checkWin (row, column) {
    return (
        checkDirection(row, column, 1, 0) ||
        checkDirection(row, column, 0, 1) ||
        checkDirection(row, column, 1, 1) ||
        checkDirection(row, column, 1, -1)
    );
}
function handleClick(event) {
    if (!gameActive) return;
    if (!event.target.classList.contains('cell')) return;

    const column = parseInt(event.target.dataset.column);
    const position = dropPiece(column);
    if (position) {
        const targetCell = cells[position.row][position.column];
        if (targetCell) {
            targetCell.classList.add(currentPlayer);
        }
        if (checkWin(position.row, position.column)) {
            statusDisplay.innerHTML = `${currentPlayer === 'red' ? 'Red' : 'Yellow'} wins!`;
            launchConfetti();
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            statusDisplay.innerHTML = `${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s turn`;
        }
        
    }
}

function launchConfetti() {
    confetti({
        particleCount: 500,
        spread: 70,
        origin: { y: 0.9 }
    });
}

board.addEventListener('click', handleClick);
createBoard();
statusDisplay.innerHTML = `Red's turn`;