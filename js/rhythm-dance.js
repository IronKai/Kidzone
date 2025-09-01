let score = 0;
let combo = 0;
let maxCombo = 0;
let isPlaying = false;
let bpm = 120;
let arrowInterval = null;
let danceInterval = null;

const arrows = ['⬅️', '⬆️', '⬇️', '➡️'];
const danceEmojis = ['🕺', '💃', '🤸', '🏃', '🚶'];
const directions = ['left', 'up', 'down', 'right'];

function startDance() {
    if (isPlaying) return;
    
    isPlaying = true;
    score = 0;
    combo = 0;
    
    document.getElementById('score').textContent = score;
    document.getElementById('combo').textContent = combo;
    document.getElementById('comboDisplay').textContent = 'Let\'s Dance!';
    
    // Start spawning arrows based on BPM
    const interval = 60000 / bpm; // Convert BPM to milliseconds
    arrowInterval = setInterval(spawnArrow, interval);
    
    // Animate dancer
    danceInterval = setInterval(() => {
        const dancer = document.getElementById('dancer');
        dancer.textContent = danceEmojis[Math.floor(Math.random() * danceEmojis.length)];
        dancer.style.transform = `scale(${1 + Math.random() * 0.2}) rotate(${Math.random() * 20 - 10}deg)`;
    }, 500);
}

function stopDance() {
    isPlaying = false;
    clearInterval(arrowInterval);
    clearInterval(danceInterval);
    
    document.getElementById('dancer').style.transform = 'scale(1) rotate(0)';
    document.getElementById('comboDisplay').textContent = `Final Score: ${score}`;
}

function spawnArrow() {
    if (!isPlaying) return;
    
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const track = document.querySelector(`.arrow-track[data-direction="${direction}"]`);
    
    const arrow = document.createElement('div');
    arrow.className = 'falling-arrow';
    arrow.textContent = arrows[directions.indexOf(direction)];
    arrow.dataset.direction = direction;
    
    track.appendChild(arrow);
    
    // Check for hit at the right time
    setTimeout(() => {
        checkHit(arrow);
    }, 1800); // Slightly before animation ends
    
    // Remove arrow after animation
    setTimeout(() => {
        if (arrow.parentNode) {
            arrow.remove();
            if (!arrow.dataset.hit) {
                missArrow();
            }
        }
    }, 2000);
}

function checkHit(arrow) {
    const rect = arrow.getBoundingClientRect();
    const targetRect = arrow.parentElement.querySelector('.arrow-target').getBoundingClientRect();
    
    const distance = Math.abs(rect.top - targetRect.top);
    
    if (distance < 30) {
        // Perfect or good hit will be handled by keypress
        arrow.dataset.inRange = 'true';
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    
    let direction = null;
    
    switch(e.key) {
        case 'ArrowLeft': direction = 'left'; break;
        case 'ArrowUp': direction = 'up'; break;
        case 'ArrowDown': direction = 'down'; break;
        case 'ArrowRight': direction = 'right'; break;
    }
    
    if (direction) {
        hitArrow(direction);
    }
});

function hitArrow(direction) {
    const track = document.querySelector(`.arrow-track[data-direction="${direction}"]`);
    const arrows = track.querySelectorAll('.falling-arrow[data-inRange="true"]:not([data-hit="true"])');
    
    if (arrows.length > 0) {
        const arrow = arrows[0];
        arrow.dataset.hit = 'true';
        
        const rect = arrow.getBoundingClientRect();
        const targetRect = track.querySelector('.arrow-target').getBoundingClientRect();
        const distance = Math.abs(rect.top - targetRect.top);
        
        let points = 0;
        let message = '';
        
        if (distance < 10) {
            // Perfect
            arrow.classList.add('perfect');
            points = 100;
            message = 'PERFECT!';
            combo++;
        } else if (distance < 30) {
            // Good
            arrow.classList.add('good');
            points = 50;
            message = 'GOOD!';
            combo++;
        }
        
        if (points > 0) {
            score += points * (1 + combo * 0.1);
            document.getElementById('score').textContent = Math.floor(score);
            document.getElementById('combo').textContent = combo;
            
            showPopup(track, message, points);
            updateComboDisplay();
        }
        
        setTimeout(() => arrow.remove(), 200);
    }
}

function missArrow() {
    combo = 0;
    document.getElementById('combo').textContent = combo;
    document.getElementById('comboDisplay').textContent = 'Miss! Try again!';
}

function showPopup(track, message, points) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = message;
    popup.style.color = points === 100 ? '#28a745' : '#ffc107';
    popup.style.left = track.offsetLeft + 'px';
    popup.style.top = '100px';
    
    track.parentElement.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
}

function updateComboDisplay() {
    const display = document.getElementById('comboDisplay');
    
    if (combo >= 20) {
        display.textContent = '🔥 ON FIRE! 🔥';
    } else if (combo >= 10) {
        display.textContent = '⭐ Amazing! ⭐';
    } else if (combo >= 5) {
        display.textContent = '✨ Great Combo! ✨';
    } else {
        display.textContent = 'Keep Dancing!';
    }
}

function changeSong() {
    const songs = [
        { name: 'Slow', bpm: 80 },
        { name: 'Medium', bpm: 120 },
        { name: 'Fast', bpm: 160 }
    ];
    
    const currentIndex = songs.findIndex(s => s.bpm === bpm);
    const nextSong = songs[(currentIndex + 1) % songs.length];
    
    bpm = nextSong.bpm;
    document.getElementById('bpm').textContent = bpm;
    
    if (isPlaying) {
        stopDance();
        startDance();
    }
}
