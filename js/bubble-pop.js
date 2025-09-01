let score = 0;
let bubbleCount = 0;
let gameInterval;
let timeLeft = 60;
let gameActive = false;

function startBubbleGame() {
    score = 0;
    bubbleCount = 0;
    timeLeft = 60;
    gameActive = true;
    
    document.getElementById('score').textContent = score;
    document.getElementById('bubbleCount').textContent = bubbleCount;
    document.getElementById('timer').textContent = timeLeft;
    
    // Clear existing bubbles
    document.getElementById('bubbleContainer').innerHTML = '';
    
    // Start spawning bubbles
    gameInterval = setInterval(() => {
        if (gameActive) {
            spawnBubble();
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
    
    // Spawn initial bubbles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => spawnBubble(), i * 200);
    }
}

function spawnBubble() {
    const container = document.getElementById('bubbleContainer');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size
    const size = Math.random() * 60 + 40;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    
    // Random position
    bubble.style.left = Math.random() * (container.offsetWidth - size) + 'px';
    
    // Random speed
    const duration = Math.random() * 5 + 5;
    bubble.style.animationDuration = duration + 's';
    
    // Random color
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${color})`;
    
    bubble.addEventListener('click', (e) => popBubble(e, bubble, size));
    
    container.appendChild(bubble);
    
    // Remove bubble after animation
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, duration * 1000);
}

function popBubble(e, bubble, size) {
    if (!gameActive) return;
    
    // Calculate points based on size (smaller = more points)
    const points = Math.floor(150 - size);
    score += points;
    bubbleCount++;
    
    document.getElementById('score').textContent = score;
    document.getElementById('bubbleCount').textContent = bubbleCount;
    
    // Show pop effect
    const popEffect = document.createElement('div');
    popEffect.className = 'pop-effect';
    popEffect.textContent = '💥';
    popEffect.style.left = bubble.style.left;
    popEffect.style.bottom = bubble.style.bottom;
    popEffect.style.fontSize = size + 'px';
    
    // Show score float
    const scoreFloat = document.createElement('div');
    scoreFloat.className = 'score-float';
    scoreFloat.textContent = '+' + points;
    scoreFloat.style.left = e.clientX - e.target.parentNode.offsetLeft + 'px';
    scoreFloat.style.top = e.clientY - e.target.parentNode.offsetTop + 'px';
    
    bubble.parentNode.appendChild(popEffect);
    bubble.parentNode.appendChild(scoreFloat);
    
    bubble.remove();
    
    setTimeout(() => {
        popEffect.remove();
        scoreFloat.remove();
    }, 1000);
}

function pauseGame() {
    gameActive = !gameActive;
    event.target.textContent = gameActive ? 'Pause' : 'Resume';
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    alert(`Game Over! Score: ${score}, Bubbles Popped: ${bubbleCount}`);
}
