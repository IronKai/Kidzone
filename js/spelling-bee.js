const spellingWords = [
    { word: 'HOUSE', emoji: '🏠', difficulty: 1 },
    { word: 'TREE', emoji: '🌳', difficulty: 1 },
    { word: 'FLOWER', emoji: '🌸', difficulty: 2 },
    { word: 'RAINBOW', emoji: '🌈', difficulty: 2 },
    { word: 'BUTTERFLY', emoji: '🦋', difficulty: 3 },
    { word: 'ELEPHANT', emoji: '🐘', difficulty: 3 },
    { word: 'COMPUTER', emoji: '💻', difficulty: 3 },
    { word: 'BICYCLE', emoji: '🚴', difficulty: 2 },
    { word: 'PIZZA', emoji: '🍕', difficulty: 1 },
    { word: 'ROCKET', emoji: '🚀', difficulty: 2 }
];

let currentWord = null;
let score = 0;
let wordCount = 0;

function newWord() {
    currentWord = spellingWords[Math.floor(Math.random() * spellingWords.length)];
    document.getElementById('wordImage').textContent = currentWord.emoji;
    
    // Create input boxes
    const container = document.getElementById('letterInput');
    container.innerHTML = '';
    
    for (let i = 0; i < currentWord.word.length; i++) {
        const input = document.createElement('input');
        input.className = 'letter-box';
        input.maxLength = 1;
        input.dataset.index = i;
        
        // Auto-focus next input
        input.addEventListener('input', (e) => {
            if (e.target.value && i < currentWord.word.length - 1) {
                container.children[i + 1].focus();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && i > 0) {
                container.children[i - 1].focus();
            }
        });
        
        container.appendChild(input);
    }
    
    // Focus first input
    container.children[0].focus();
}

function checkSpelling() {
    const inputs = document.querySelectorAll('.letter-box');
    let spelled = '';
    
    inputs.forEach(input => {
        spelled += input.value.toUpperCase();
    });
    
    if (spelled === currentWord.word) {
        // Correct!
        score += currentWord.difficulty * 10;
        wordCount++;
        
        document.getElementById('score').textContent = score;
        document.getElementById('wordCount').textContent = wordCount;
        
        // Celebrate
        inputs.forEach((input, i) => {
            setTimeout(() => {
                input.style.background = '#51cf66';
                input.style.transform = 'scale(1.2) rotate(360deg)';
            }, i * 100);
        });
        
        setTimeout(() => {
            newWord();
        }, 1500);
    } else {
        // Wrong - shake animation
        inputs.forEach(input => {
            input.style.animation = 'shake 0.5s ease';
            if (input.value.toUpperCase() !== currentWord.word[input.dataset.index]) {
                input.style.background = '#ff6b6b';
            }
        });
        
        setTimeout(() => {
            inputs.forEach(input => {
                input.style.animation = '';
                input.style.background = 'rgba(255,255,255,0.9)';
            });
        }, 1000);
    }
}

function clearLetters() {
    document.querySelectorAll('.letter-box').forEach(input => {
        input.value = '';
        input.style.background = 'rgba(255,255,255,0.9)';
    });
    document.querySelector('.letter-box').focus();
}

function speakWord() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
    }
}

window.addEventListener('load', newWord);
