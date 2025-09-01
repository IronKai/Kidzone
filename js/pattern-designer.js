let selectedShape = '⭐';
let symmetryMode = false;
let patternCount = 0;
const gridSize = 8;

function initGrid() {
    const grid = document.getElementById('patternGrid');
    grid.innerHTML = '';
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.onclick = () => placeShape(x, y, cell);
            grid.appendChild(cell);
        }
    }
}

function selectShape(shape) {
    selectedShape = shape;
    
    document.querySelectorAll('.shape-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function placeShape(x, y, cell) {
    cell.textContent = selectedShape;
    
    if (symmetryMode) {
        // Mirror horizontally
        const mirrorX = gridSize - 1 - x;
        const mirrorCell = document.querySelector(`[data-x="${mirrorX}"][data-y="${y}"]`);
        if (mirrorCell) mirrorCell.textContent = selectedShape;
        
        // Mirror vertically
        const mirrorY = gridSize - 1 - y;
        const mirrorCellV = document.querySelector(`[data-x="${x}"][data-y="${mirrorY}"]`);
        if (mirrorCellV) mirrorCellV.textContent = selectedShape;
        
        // Mirror diagonally
        const mirrorCellD = document.querySelector(`[data-x="${mirrorX}"][data-y="${mirrorY}"]`);
        if (mirrorCellD) mirrorCellD.textContent = selectedShape;
    }
}

function toggleSymmetry() {
    symmetryMode = !symmetryMode;
    const btn = document.getElementById('symmetryBtn');
    
    if (symmetryMode) {
        btn.textContent = '🔄 Symmetry: ON';
        btn.classList.add('active');
    } else {
        btn.textContent = '🔄 Symmetry: OFF';
        btn.classList.remove('active');
    }
}

function clearPattern() {
    document.querySelectorAll('.pattern-cell').forEach(cell => {
        cell.textContent = '';
    });
}

function savePattern() {
    patternCount++;
    document.getElementById('patternCount').textContent = patternCount;
    
    // Create a visual snapshot effect
    document.querySelectorAll('.pattern-cell').forEach((cell, i) => {
        setTimeout(() => {
            cell.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cell.style.transform = 'scale(1)';
            }, 200);
        }, i * 10);
    });
    
    alert('Beautiful pattern saved! 🎨');
}

window.addEventListener('load', initGrid);
