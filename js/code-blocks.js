const levels = [
    {
        grid: [
            ['R', '.', '.', '.', 'G'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ],
        robot: { x: 0, y: 0, direction: 'right' },
        goal: { x: 4, y: 0 }
    },
    {
        grid: [
            ['R', '.', '.', '.', '.'],
            ['.', '.', 'W', '.', '.'],
            ['.', '.', 'W', '.', '.'],
            ['.', '.', 'W', '.', '.'],
            ['.', '.', 'G', '.', '.']
        ],
        robot: { x: 0, y: 0, direction: 'down' },
        goal: { x: 2, y: 4 }
    },
    {
        grid: [
            ['R', '.', 'W', '.', '.'],
            ['.', '.', 'W', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['W', 'W', '.', 'W', 'W'],
            ['.', '.', '.', '.', 'G']
        ],
        robot: { x: 0, y: 0, direction: 'right' },
        goal: { x: 4, y: 4 }
    }
];

let currentLevel = 0;
let robot = null;
let codeSequence = [];
let score = 0;
let running = false;

function initLevel() {
    const level = levels[currentLevel];
    robot = { ...level.robot };
    
    renderGrid();
}

function renderGrid() {
    const level = levels[currentLevel];
    const gridElement = document.getElementById('gridWorld');
    gridElement.innerHTML = '';
    
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            if (level.grid[y][x] === 'W') {
                cell.classList.add('wall');
            } else if (x === level.goal.x && y === level.goal.y) {
                cell.classList.add('goal');
                cell.textContent = '⭐';
            }
            
            if (x === robot.x && y === robot.y) {
                const robotEl = document.createElement('div');
                robotEl.className = 'robot';
                robotEl.id = 'robot';
                robotEl.textContent = getRobotEmoji();
                cell.appendChild(robotEl);
            }
            
            gridElement.appendChild(cell);
        }
    }
}

function getRobotEmoji() {
    switch(robot.direction) {
        case 'up': return '🔼';
        case 'down': return '🔽';
        case 'left': return '◀️';
        case 'right': return '▶️';
        default: return '🤖';
    }
}

// Drag and drop functionality
document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.code-block');
    const sequence = document.getElementById('codeSequence');
    
    blocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/plain', e.target.dataset.action);
            e.target.classList.add('dragging');
        });
        
        block.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });
    
    sequence.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });
    
    sequence.addEventListener('drop', (e) => {
        e.preventDefault();
        const action = e.dataTransfer.getData('text/plain');
        addCodeBlock(action);
    });
});

function addCodeBlock(action) {
    const sequence = document.getElementById('codeSequence');
    
    // Remove placeholder text
    if (sequence.querySelector('p')) {
        sequence.innerHTML = '';
    }
    
    const block = document.createElement('div');
    block.className = 'code-block';
    block.dataset.action = action;
    
    switch(action) {
        case 'move': block.textContent = 'Move Forward'; break;
        case 'turn-left': block.textContent = 'Turn Left'; break;
        case 'turn-right': block.textContent = 'Turn Right'; break;
        case 'jump': block.textContent = 'Jump'; break;
    }
    
    block.onclick = () => block.remove();
    sequence.appendChild(block);
    
    codeSequence.push(action);
}

async function runCode() {
    if (running) return;
    running = true;
    
    const sequence = document.getElementById('codeSequence');
    const blocks = sequence.querySelectorAll('.code-block');
    
    // Reset robot position
    const level = levels[currentLevel];
    robot = { ...level.robot };
    renderGrid();
    
    // Execute each command
    for (let block of blocks) {
        block.style.background = '#e74c3c';
        await executeCommand(block.dataset.action);
        block.style.background = '#3498db';
        
        // Check if goal reached
        if (robot.x === level.goal.x && robot.y === level.goal.y) {
            score += 100;
            document.getElementById('score').textContent = score;
            alert('🎉 Level Complete!');
            nextLevel();
            break;
        }
    }
    
    running = false;
}

function executeCommand(action) {
    return new Promise(resolve => {
        const level = levels[currentLevel];
        
        switch(action) {
            case 'move':
                let newX = robot.x;
                let newY = robot.y;
                
                switch(robot.direction) {
                    case 'up': newY--; break;
                    case 'down': newY++; break;
                    case 'left': newX--; break;
                    case 'right': newX++; break;
                }
                
                // Check boundaries and walls
                if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5) {
                    if (level.grid[newY][newX] !== 'W') {
                        robot.x = newX;
                        robot.y = newY;
                    }
                }
                break;
                
            case 'turn-left':
                const leftTurns = { 'up': 'left', 'left': 'down', 'down': 'right', 'right': 'up' };
                robot.direction = leftTurns[robot.direction];
                break;
                
            case 'turn-right':
                const rightTurns = { 'up': 'right', 'right': 'down', 'down': 'left', 'left': 'up' };
                robot.direction = rightTurns[robot.direction];
                break;
        }
        
        renderGrid();
        setTimeout(resolve, 500);
    });
}

function resetCode() {
    document.getElementById('codeSequence').innerHTML = '<p style="color: #95a5a6; text-align: center;">Drop commands here...</p>';
    codeSequence = [];
    initLevel();
}

function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
        currentLevel = 0;
    }
    
    document.getElementById('level').textContent = currentLevel + 1;
    resetCode();
    
    // Unlock new commands at higher levels
    if (currentLevel >= 2) {
        document.querySelector('[data-action="jump"]').style.display = 'block';
    }
}

window.addEventListener('load', initLevel);
