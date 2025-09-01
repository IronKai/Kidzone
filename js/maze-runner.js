const MAZE_SIZE = 10;
let maze = [];
let playerPos = { x: 0, y: 0 };
let goalPos = { x: 9, y: 9 };
let steps = 0;
let level = 1;

const mazes = [
    // Level 1 - Simple maze
    [
        "P.##....#.",
        "..##.##.#.",
        "#....##...",
        "#.######.#",
        "#........#",
        "####.#####",
        "....#.....",
        ".##.####.#",
        ".##......#",
        ".....###.G"
    ],
    // Level 2 - Medium maze
    [
        "P..#......",
        ".#.#.####.",
        ".#.#......",
        ".#.#####.#",
        ".#.......#",
        ".#######.#",
        "........#.",
        "######.##.",
        "......#...",
        ".####...#G"
    ]
];

function generateMaze() {
    const mazePattern = mazes[Math.floor(Math.random() * mazes.length)];
    maze = [];
    steps = 0;
    document.getElementById('steps').textContent = steps;
    
    for (let y = 0; y < MAZE_SIZE; y++) {
        maze[y] = [];
        for (let x = 0; x < MAZE_SIZE; x++) {
            const char = mazePattern[y][x];
            if (char === 'P') {
                playerPos = { x, y };
                maze[y][x] = 'path';
            } else if (char === 'G') {
                goalPos = { x, y };
                maze[y][x] = 'goal';
            } else if (char === '#') {
                maze[y][x] = 'wall';
            } else {
                maze[y][x] = 'path';
            }
        }
    }
    
    renderMaze();
}

function renderMaze() {
    const grid = document.getElementById('mazeGrid');
    grid.innerHTML = '';
    
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';
            
            if (x === playerPos.x && y === playerPos.y) {
                cell.classList.add('player');
                cell.textContent = '🏃';
            } else if (x === goalPos.x && y === goalPos.y) {
                cell.classList.add('goal');
                cell.textContent = '🏁';
            } else {
                cell.classList.add(maze[y][x]);
            }
            
            grid.appendChild(cell);
        }
    }
}

function movePlayer(direction) {
    let newPos = { ...playerPos };
    
    switch(direction) {
        case 'up': newPos.y--; break;
        case 'down': newPos.y++; break;
        case 'left': newPos.x--; break;
        case 'right': newPos.x++; break;
    }
    
    // Check boundaries
    if (newPos.x < 0 || newPos.x >= MAZE_SIZE || 
        newPos.y < 0 || newPos.y >= MAZE_SIZE) {
        return;
    }
    
    // Check walls
    if (maze[newPos.y][newPos.x] === 'wall') {
        return;
    }
    
    // Move player
    playerPos = newPos;
    steps++;
    document.getElementById('steps').textContent = steps;
    
    // Check if reached goal
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
        setTimeout(() => {
            alert(`Congratulations! You completed the maze in ${steps} steps!`);
            level++;
            document.getElementById('level').textContent = level;
            generateMaze();
        }, 100);
    }
    
    renderMaze();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': movePlayer('up'); break;
        case 'ArrowDown': movePlayer('down'); break;
        case 'ArrowLeft': movePlayer('left'); break;
        case 'ArrowRight': movePlayer('right'); break;
    }
});

window.addEventListener('load', generateMaze);
