// Memory Match Game Logic
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = null;
let seconds = 0;

function initGame() {
    // Create pairs of cards
    cards = [...emojis, ...emojis];
    shuffleArray(cards);
    
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    
    // Update UI
    document.getElementById('moves').textContent = moves;
    document.getElementById('timer').textContent = '00:00';
    
    // Create game board
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.onclick = () => flipCard(card);
        gameBoard.appendChild(card);
    });
    
    // Start timer
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function flipCard(card) {
    if (card.classList.contains('flipped') || 
        card.classList.contains('matched') || 
        flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flippedCards.push(card);
    
    // Check for match when 2 cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        setTimeout(() => {
            checkMatch();
        }, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Match found!
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        // Play celebration sound (optional)
        playSound('match');
        
        // Check for victory
        if (matchedPairs === emojis.length) {
            victory();
        }
    } else {
        // No match, flip cards back
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    flippedCards = [];
}

function updateTimer() {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function victory() {
    clearInterval(timer);
    
    // Calculate stars based on moves
    let stars = 3;
    if (moves > 20) stars = 2;
    if (moves > 30) stars = 1;
    
    // Update modal
    document.getElementById('final-moves').textContent = moves;
    document.getElementById('final-time').textContent = document.getElementById('timer').textContent;
    
    // Show stars
    const starsHtml = '⭐'.repeat(stars);
    document.querySelector('.victory-stars').innerHTML = 
        starsHtml.split('').map(s => `<span class="big-star">${s}</span>`).join('');
    
    // Show modal
    document.getElementById('victory-modal').classList.add('show');
    
    // Play victory sound
    playSound('victory');
}

function startGame() {
    document.getElementById('victory-modal').classList.remove('show');
    initGame();
}

function showHint() {
    // Briefly flip an unmatched pair
    const unmatched = Array.from(document.querySelectorAll('.memory-card:not(.matched):not(.flipped)'));
    if (unmatched.length >= 2) {
        const card1 = unmatched[0];
        const card2 = unmatched.find(c => c.dataset.emoji === card1.dataset.emoji && c !== card1);
        
        if (card2) {
            card1.classList.add('flipped');
            card1.textContent = card1.dataset.emoji;
            card2.classList.add('flipped');
            card2.textContent = card2.dataset.emoji;
            
            setTimeout(() => {
                card1.classList.remove('flipped');
                card1.textContent = '';
                card2.classList.remove('flipped');
                card2.textContent = '';
            }, 1000);
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function playSound(type) {
    // Sound implementation (optional)
    // You can add sound effects here
}

// Initialize game when page loads
window.addEventListener('load', initGame);
