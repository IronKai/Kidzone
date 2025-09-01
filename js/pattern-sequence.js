let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let isPlaying = false;
let isPlayerTurn = false;

function startPattern() {
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    isPlaying = true;
    
    document.getElementById('level').textContent = level;
    document.getElementById('score').textContent = score;
    
    nextRound();
}

function nextRound() {
    playerSequence = [];
    isPlayerTurn = false;
    document.getElementById('message').textContent = 'Watch the pattern!';
    
    // Add new color to sequence
    const colors = ['red', 'blue', 'green', 'yellow'];
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    
    // Disable buttons during demonstration
    document.querySelectorAll('.pattern-button').forEach(btn => {
        btn.disabled = true;
    });
    
    // Show sequence
    sequence.forEach((color, index) => {
        setTimeout(() => {
            flashButton(color);
            if (index === sequence.length - 1) {
                setTimeout(() => {
                    isPlayerTurn = true;
                    document.getElementById('message').textContent = 'Your turn!';
                    document.querySelectorAll('.pattern-button').forEach(btn => {
                        btn.disabled = false;
                    });
                }, 1000);
            }
        }, (index + 1) * 1000);
    });
}

function flashButton(color) {
    const button = document.querySelector(`[data-color="${color}"]`);
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 500);
}

function playerClick(color) {
    if (!isPlayerTurn || !isPlaying) return;
    
    flashButton(color);
    playerSequence.push(color);
    
    // Check if correct
    const index = playerSequence.length - 1;
    if (playerSequence[index] !== sequence[index]) {
        // Wrong!
        document.getElementById('message').textContent = 'Oops! Try again!';
        isPlaying = false;
        setTimeout(() => {
            startPattern();
        }, 2000);
        return;
    }
    
    // Check if sequence complete
    if (playerSequence.length === sequence.length) {
        // Correct!
        score += level * 10;
        level++;
        document.getElementById('level').textContent = level;
        document.getElementById('score').textContent = score;
        document.getElementById('message').textContent = 'Great job! Next level...';
        
        setTimeout(() => {
            nextRound();
        }, 1500);
    }
}
