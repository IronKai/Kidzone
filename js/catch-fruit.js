let score = 0;
let missed = 0;
let gameActive = false;
let basketPos = 250;
let gameTimer;
let fruitInterval;
let timeLeft = 60;

const fruits = ['🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🍑', '🍒'];

function startFruitGame() {
    score = 0;
    missed = 0;
    timeLeft = 60;
    gameActive = true;
    
    document.getElementById('score').textContent = score;
    document.getElementById('missed').textContent = missed;
    document.getElementById('timer').textContent = timeLeft;
    
    // Clear existing fruits
    document.querySelectorAll('.fruit').forEach(f => f.remove());
    
    // Start spawning fruits
    fruitInterval = setInterval(spawnFruit, 1500);
    
    // Start timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endFruitGame();
        }
    }, 1000);
    
    // Initial fruits
    setTimeout(spawnFruit, 500);
}

function spawnFruit() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('gameArea');
    const fruit = document.createElement('div');
    fruit.className = 'fruit';
    fruit.textContent = fruits[Math.floor(Math.random() * fruits.length)];
    
    // Random position
    const xPos = Math.random() * (gameArea.offsetWidth - 40);
    fruit.style.left = xPos + 'px';
    
    // Random fall speed
    const fallTime = Math.random() * 2 + 3;
    fruit.style.animationDuration = fallTime + 's';
    
    gameArea.appendChild(fruit);
    
    // Check collision continuously
    const checkInterval = setInterval(() => {
        if (checkCatch(fruit)) {
            clearInterval(checkInterval);
            catchFruit(fruit);
        } else if (fruit.offsetTop > gameArea.offsetHeight - 50) {
            clearInterval(checkInterval);
            missFruit(fruit);
        }
    }, 50);
}

function checkCatch(fruit) {
    const basket = document.getElementById('basket');
    const fruitRect = fruit.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    
    return fruitRect.bottom > basketRect.top &&
           fruitRect.bottom < basketRect.bottom &&
           fruitRect.left < basketRect.right &&
           fruitRect.right > basketRect.left;
}

function catchFruit(fruit) {
    score += 10;
    document.getElementById('score').textContent = score;
    
    // Show score popup
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = '+10';
    popup.style.left = fruit.style.left;
    popup.style.top = (fruit.offsetTop - 20) + 'px';
    
    document.getElementById('gameArea').appendChild(popup);
    
    fruit.remove();
    
    setTimeout(() => popup.remove(), 1000);
}

function missFruit(fruit) {
    if (fruit.offsetTop > 350) {
        missed++;
        document.getElementById('missed').textContent = missed;
        fruit.remove();
    }
}

function endFruitGame() {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(fruitInterval);
    
    alert(`Game Over!\nScore: ${score}\nMissed: ${missed}`);
}

// Mouse control
document.getElementById('gameArea').addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('gameArea');
    const basket = document.getElementById('basket');
    const rect = gameArea.getBoundingClientRect();
    
    basketPos = e.clientX - rect.left - 40;
    basketPos = Math.max(0, Math.min(basketPos, gameArea.offsetWidth - 80));
    
    basket.style.left = basketPos + 'px';
});

// Touch control
document.getElementById('gameArea').addEventListener('touchmove', (e) => {
    if (!gameActive) return;
    e.preventDefault();
    
    const gameArea = document.getElementById('gameArea');
    const basket = document.getElementById('basket');
    const rect = gameArea.getBoundingClientRect();
    const touch = e.touches[0];
    
    basketPos = touch.clientX - rect.left - 40;
    basketPos = Math.max(0, Math.min(basketPos, gameArea.offsetWidth - 80));
    
    basket.style.left = basketPos + 'px';
});
