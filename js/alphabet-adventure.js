const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const letterWords = {
    'A': { word: 'Apple', emoji: '🍎' },
    'B': { word: 'Ball', emoji: '⚽' },
    'C': { word: 'Cat', emoji: '🐱' },
    'D': { word: 'Dog', emoji: '🐶' },
    'E': { word: 'Elephant', emoji: '🐘' },
    'F': { word: 'Fish', emoji: '🐠' },
    'G': { word: 'Grapes', emoji: '🍇' },
    'H': { word: 'House', emoji: '🏠' },
    'I': { word: 'Ice cream', emoji: '🍦' },
    'J': { word: 'Juice', emoji: '🧃' },
    'K': { word: 'Kite', emoji: '🪁' },
    'L': { word: 'Lion', emoji: '🦁' },
    'M': { word: 'Moon', emoji: '🌙' },
    'N': { word: 'Nest', emoji: '🪺' },
    'O': { word: 'Orange', emoji: '🍊' },
    'P': { word: 'Pizza', emoji: '🍕' },
    'Q': { word: 'Queen', emoji: '👸' },
    'R': { word: 'Rainbow', emoji: '🌈' },
    'S': { word: 'Sun', emoji: '☀️' },
    'T': { word: 'Tree', emoji: '🌳' },
    'U': { word: 'Umbrella', emoji: '☂️' },
    'V': { word: 'Violin', emoji: '🎻' },
    'W': { word: 'Whale', emoji: '🐋' },
    'X': { word: 'Xylophone', emoji: '🎼' },
    'Y': { word: 'Yacht', emoji: '🛥️' },
    'Z': { word: 'Zebra', emoji: '🦓' }
};

let currentLetter = 'A';
let foundLetters = [];
let score = 0;

function initAlphabet() {
    const grid = document.getElementById('alphabetGrid');
    grid.innerHTML = '';
    
    // Shuffle letters for the grid
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.textContent = letter;
        card.dataset.letter = letter;
        
        if (foundLetters.includes(letter)) {
            card.classList.add('found');
        } else {
            card.onclick = () => checkLetter(letter, card);
        }
        
        grid.appendChild(card);
    });
}

function newLetter() {
    // Find next unfound letter
    for (let letter of alphabet) {
        if (!foundLetters.includes(letter)) {
            currentLetter = letter;
            break;
        }
    }
    
    if (foundLetters.length === 26) {
        alert('Congratulations! You found all the letters! 🎉');
        return;
    }
    
    // Update display
    document.getElementById('targetLetter').textContent = currentLetter;
    document.getElementById('pictureHint').textContent = letterWords[currentLetter].emoji;
    document.getElementById('wordHint').textContent = `${currentLetter} is for ${letterWords[currentLetter].word}`;
    
    initAlphabet();
}

function checkLetter(letter, card) {
    if (letter === currentLetter) {
        card.classList.add('found');
        foundLetters.push(letter);
        score += 10;
        
        document.getElementById('found').textContent = foundLetters.length;
        document.getElementById('score').textContent = score;
        
        // Celebrate
        card.onclick = null;
        
        setTimeout(() => {
            if (foundLetters.length < 26) {
                newLetter();
            } else {
                alert('Amazing! You completed the alphabet! 🌟');
            }
        }, 1000);
    } else {
        card.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
}

function playSound() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`${currentLetter}. ${currentLetter} is for ${letterWords[currentLetter].word}`);
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

window.addEventListener('load', () => {
    newLetter();
});
