const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const rows = 6;
const columns = 7;
let currentPlayer = 'red';
let gameActive = true;
const gameState = [];
const cells = [];

function initializeBoard() {
    for (let i = 0; i < rows; ++i) {
        gameState[i] = [];
        cells[i] = [];
        for (let j = 0; j < columns; ++j) {
            gameState[i][j] = null;
        }
    }
}

function createBoard() {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.column = c;
            board.appendChild(cell);
            cells[r][c] = cell;
        }
    }
}

function dropPiece(column) {
    for (let r = rows - 1; r >= 0; --r) {
        if (!gameState[r][column]) {
            gameState[r][column] = currentPlayer;
            return { row : r, column : column };
        }
    }
}

function checkDirection(row, column, directionRow, directionColumn) {
    let count = 0;
    for (let i = -3; i <= 3; ++i) {
        const r = row + i * directionRow;
        const c = column + i * directionColumn;
        if (r < rows && r >= 0 && c < columns && c >= 0 && 
            gameState[r][c] === currentPlayer) {
            ++count;
        } else {
            count = 0;
        }
        if (count === 4) {
            return true;
        }
    }
    return false;
}

function checkWin(row, column) {
    const directions = [
        [1, 0], 
        [0, 1], 
        [1, 1], 
        [1, -1]
    ];
    for (let i = 0; i < directions.length; ++i) {
        const[directionRow, directionColumn] = directions[i];
        if (checkDirection(row, column, directionRow, directionColumn)) {
            return true;
        }
    }
    return false;
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
            if (currentPlayer === 'red') {
                statusDisplay.innerText = 'Red wins!';
            } else {
                statusDisplay.innerText = 'Yellow wins!';
            }
            launchConfetti();
            gameActive = false;
        } else {
            if (currentPlayer === 'red') {
                currentPlayer = 'yellow';
                statusDisplay.innerText = 'Yellow`s turn';
            } else {
                currentPlayer = 'red';
                statusDisplay.innerText = 'Red`s turn';
            }
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
initializeBoard();
createBoard();