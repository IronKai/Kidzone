const puzzles = [
    {
        base: ['🌻', '🌳', '☁️', '🦋', '🏠', '☀️', '🌈', '🐦', '🌺'],
        differences: [
            { index: 1, different: '🌲' },
            { index: 3, different: '🐝' },
            { index: 5, different: '🌙' },
            { index: 7, different: '🦅' },
            { index: 8, different: '🌸' }
        ]
    },
    {
        base: ['🚗', '🚕', '🚙', '🚌', '🏢', '🚦', '🌳', '👨', '🏪'],
        differences: [
            { index: 0, different: '🚓' },
            { index: 2, different: '🚐' },
            { index: 4, different: '🏠' },
            { index: 6, different: '🌲' },
            { index: 7, different: '👩' }
        ]
    }
];

let currentPuzzle = null;
let foundDifferences = [];
let startTime = null;
let timerInterval = null;

function newPuzzle() {
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    foundDifferences = [];
    startTime = Date.now();
    
    // Reset display
    document.getElementById('found').textContent = '0';
    document.getElementById('total').textContent = currentPuzzle.differences.length;
    updateProgress();
    
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Create picture 1 (original)
    const picture1 = document.getElementById('picture1');
    picture1.innerHTML = '';
    currentPuzzle.base.forEach((item, index) => {
        const cell = document.createElement('div');
        cell.className = 'grid-item';
        cell.textContent = item;
        picture1.appendChild(cell);
    });
    
    // Create picture 2 (with differences)
    const picture2 = document.getElementById('picture2');
    picture2.innerHTML = '';
    currentPuzzle.base.forEach((item, index) => {
        const cell = document.createElement('div');
        cell.className = 'grid-item';
        
        const diff = currentPuzzle.differences.find(d => d.index === index);
        cell.textContent = diff ? diff.different : item;
        cell.dataset.index = index;
        
        if (diff) {
            cell.onclick = () => foundDifference(index, cell);
        }
        
        picture2.appendChild(cell);
    });
}

function foundDifference(index, element) {
    if (foundDifferences.includes(index)) return;
    
    foundDifferences.push(index);
    element.classList.add('difference-found');
    element.onclick = null;
    
    // Update score
    document.getElementById('found').textContent = foundDifferences.length;
    updateProgress();
    
    // Check if all found
    if (foundDifferences.length === currentPuzzle.differences.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Great job! You found all differences in ${document.getElementById('timer').textContent}!`);
        }, 500);
    }
}

function updateProgress() {
    const percent = (foundDifferences.length / currentPuzzle.differences.length) * 100;
    const progressBar = document.getElementById('progress');
    progressBar.style.width = percent + '%';
    progressBar.textContent = Math.round(percent) + '%';
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showHint() {
    const remaining = currentPuzzle.differences.filter(d => !foundDifferences.includes(d.index));
    if (remaining.length > 0) {
        const hint = remaining[0];
        const cells = document.querySelectorAll('#picture2 .grid-item');
        cells[hint.index].style.animation = 'pulse 1s ease 3';
        setTimeout(() => {
            cells[hint.index].style.animation = '';
        }, 3000);
    }
}

window.addEventListener('load', newPuzzle);
