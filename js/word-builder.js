const words = [
    { word: 'CAT', emoji: '🐱' },
    { word: 'DOG', emoji: '🐶' },
    { word: 'SUN', emoji: '☀️' },
    { word: 'MOON', emoji: '🌙' },
    { word: 'STAR', emoji: '⭐' },
    { word: 'TREE', emoji: '🌳' },
    { word: 'FISH', emoji: '🐠' },
    { word: 'BIRD', emoji: '🦜' },
    { word: 'APPLE', emoji: '🍎' },
    { word: 'BOOK', emoji: '📚' }
];

let currentWord = null;
let currentLetters = [];
let score = 0;
let wordCount = 0;

function startWordGame() {
    // Pick a random word
    currentWord = words[Math.floor(Math.random() * words.length)];
    currentLetters = [];
    
    // Display image
    document.getElementById('wordImage').textContent = currentWord.emoji;
    
    // Create letter slots
    const slotsContainer = document.getElementById('letterSlots');
    slotsContainer.innerHTML = '';
    for (let i = 0; i < currentWord.word.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.dataset.index = i;
        slotsContainer.appendChild(slot);
    }
    
    // Create letter bank (scrambled)
    const letters = currentWord.word.split('');
    const extraLetters = ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T'];
    for (let i = 0; i < 3; i++) {
        letters.push(extraLetters[Math.floor(Math.random() * extraLetters.length)]);
    }
    letters.sort(() => Math.random() - 0.5);
    
    const bankContainer = document.getElementById('letterBank');
    bankContainer.innerHTML = '';
    letters.forEach((letter, index) => {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        tile.textContent = letter;
        tile.dataset.index = index;
        tile.onclick = () => selectLetter(tile, letter);
        bankContainer.appendChild(tile);
    });
}

function selectLetter(tile, letter) {
    if (tile.classList.contains('used')) return;
    
    // Find next empty slot
    const slots = document.querySelectorAll('.letter-slot');
    for (let slot of slots) {
        if (!slot.textContent) {
            slot.textContent = letter;
            slot.classList.add('filled');
            tile.classList.add('used');
            currentLetters.push({ tile, slot, letter });
            break;
        }
    }
}

function resetWord() {
    currentLetters.forEach(({ tile, slot }) => {
        tile.classList.remove('used');
        slot.textContent = '';
        slot.classList.remove('filled');
    });
    currentLetters = [];
}

function checkWord() {
    const slots = document.querySelectorAll('.letter-slot');
    let word = '';
    slots.forEach(slot => {
        word += slot.textContent;
    });
    
    if (word === currentWord.word) {
        score += 100;
        wordCount++;
        document.getElementById('score').textContent = score;
        document.getElementById('wordCount').textContent = wordCount;
        
        // Celebration effect
        slots.forEach((slot, i) => {
            setTimeout(() => {
                slot.style.transform = 'scale(1.2) rotate(360deg)';
                slot.style.background = '#55efc4';
            }, i * 100);
        });
        
        setTimeout(() => {
            startWordGame();
        }, 1500);
    } else {
        // Wrong answer effect
        slots.forEach(slot => {
            slot.style.animation = 'shake 0.5s ease';
        });
        setTimeout(() => {
            slots.forEach(slot => {
                slot.style.animation = '';
            });
        }, 500);
    }
}

// Start game on load
window.addEventListener('load', startWordGame);
