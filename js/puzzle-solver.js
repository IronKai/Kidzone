let puzzleState = [];
let emptyIndex = 8;
let moves = 0;
let bestScore = localStorage.getItem('puzzleBest') || '-';

function initPuzzle() {
    moves = 0;
    document.getElementById('moves').textContent = moves;
    document.getElementById('best').textContent = bestScore;
    
    // Create shuffled puzzle
    puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, null];
    
    // Shuffle (ensure solvable)
    for (let i = 0; i < 100; i++) {
        const possibleMoves = getPossibleMoves();
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        swapPieces(randomMove, false);
    }
    
    renderPuzzle();
}

function renderPuzzle() {
    const container = document.getElementById('puzzleContainer');
    container.innerHTML = '';
    
    puzzleState.forEach((value, index) => {
        const piece = document.createElement('div');
        piece.className = value === null ? 'puzzle-piece empty' : 'puzzle-piece';
        piece.textContent = value || '';
        piece.onclick = () => handleClick(index);
        container.appendChild(piece);
    });
    
    // Check if solved
    if (isSolved()) {
        if (bestScore === '-' || moves < parseInt(bestScore)) {
            bestScore = moves;
            localStorage.setItem('puzzleBest', bestScore);
            document.getElementById('best').textContent = bestScore;
        }
        setTimeout(() => {
            alert(`Congratulations! Solved in ${moves} moves!`);
        }, 500);
    }
}

function handleClick(index) {
    if (canMove(index)) {
        swapPieces(index, true);
    }
}

function canMove(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    
    return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
           (Math.abs(col - emptyCol) === 1 && row === emptyRow);
}

function swapPieces(index, countMove) {
    if (!canMove(index)) return;
    
    [puzzleState[index], puzzleState[emptyIndex]] = [puzzleState[emptyIndex], puzzleState[index]];
    emptyIndex = index;
    
    if (countMove) {
        moves++;
        document.getElementById('moves').textContent = moves;
    }
    
    renderPuzzle();
}

function getPossibleMoves() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => canMove(i));
}

function isSolved() {
    for (let i = 0; i < 8; i++) {
        if (puzzleState[i] !== i + 1) return false;
    }
    return puzzleState[8] === null;
}

function showSolution() {
    puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, null];
    emptyIndex = 8;
    renderPuzzle();
}

window.addEventListener('load', initPuzzle);
