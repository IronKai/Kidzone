const phonicsLevels = [
    {
        level: 1,
        sounds: [
            {
                sound: 'at',
                words: [
                    { word: 'cat', emoji: '🐱', has: true },
                    { word: 'bat', emoji: '🦇', has: true },
                    { word: 'hat', emoji: '🎩', has: true },
                    { word: 'dog', emoji: '🐶', has: false },
                    { word: 'sun', emoji: '☀️', has: false },
                    { word: 'mat', emoji: '🏠', has: true }
                ]
            },
            {
                sound: 'ch',
                words: [
                    { word: 'chair', emoji: '🪑', has: true },
                    { word: 'cheese', emoji: '🧀', has: true },
                    { word: 'cherry', emoji: '🍒', has: true },
                    { word: 'apple', emoji: '🍎', has: false },
                    { word: 'beach', emoji: '🏖️', has: true },
                    { word: 'book', emoji: '📚', has: false }
                ]
            }
        ]
    },
    {
        level: 2,
        sounds: [
            {
                sound: 'sh',
                words: [
                    { word: 'ship', emoji: '🚢', has: true },
                    { word: 'fish', emoji: '🐠', has: true },
                    { word: 'shoe', emoji: '👟', has: true },
                    { word: 'shell', emoji: '🐚', has: true },
                    { word: 'car', emoji: '🚗', has: false },
                    { word: 'tree', emoji: '🌳', has: false }
                ]
            },
            {
                sound: 'ing',
                words: [
                    { word: 'ring', emoji: '💍', has: true },
                    { word: 'swing', emoji: '🎪', has: true },
                    { word: 'singing', emoji: '🎤', has: true },
                    { word: 'king', emoji: '👑', has: true },
                    { word: 'ball', emoji: '⚽', has: false },
                    { word: 'star', emoji: '⭐', has: false }
                ]
            }
        ]
    }
];

let currentLevel = 0;
let currentSoundIndex = 0;
let score = 0;
let foundWords = [];

function loadPhonics() {
    const levelData = phonicsLevels[currentLevel];
    const soundData = levelData.sounds[currentSoundIndex];
    
    document.getElementById('soundBubble').textContent = soundData.sound;
    document.getElementById('level').textContent = currentLevel + 1;
    
    // Create word grid
    const grid = document.getElementById('wordGrid');
    grid.innerHTML = '';
    
    // Shuffle words
    const shuffled = [...soundData.words].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(wordData => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.onclick = () => selectWord(wordData, card);
        
        const image = document.createElement('div');
        image.className = 'word-image';
        image.textContent = wordData.emoji;
        
        const text = document.createElement('div');
        text.className = 'word-text';
        text.textContent = wordData.word;
        
        card.appendChild(image);
        card.appendChild(text);
        grid.appendChild(card);
    });
    
    foundWords = [];
}

function selectWord(wordData, card) {
    if (foundWords.includes(wordData.word)) return;
    
    if (wordData.has) {
        card.classList.add('correct');
        score += 10;
        foundWords.push(wordData.word);
        playCorrectSound();
    } else {
        card.classList.add('wrong');
        setTimeout(() => card.classList.remove('wrong'), 1000);
    }
    
    document.getElementById('score').textContent = score;
    
    // Check if all correct words found
    const levelData = phonicsLevels[currentLevel];
    const soundData = levelData.sounds[currentSoundIndex];
    const correctWords = soundData.words.filter(w => w.has);
    
    if (foundWords.length === correctWords.length) {
        setTimeout(() => {
            alert('Great job! You found all the words!');
            nextPhonics();
        }, 1000);
    }
}

function playSound() {
    if ('speechSynthesis' in window) {
        const sound = document.getElementById('soundBubble').textContent;
        const utterance = new SpeechSynthesisUtterance(sound);
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
    }
}

function playCorrectSound() {
    // Simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function showHint() {
    const cards = document.querySelectorAll('.word-card');
    const levelData = phonicsLevels[currentLevel];
    const soundData = levelData.sounds[currentSoundIndex];
    
    // Find an unfound correct word
    for (let i = 0; i < cards.length; i++) {
        const wordText = cards[i].querySelector('.word-text').textContent;
        const wordData = soundData.words.find(w => w.word === wordText);
        
        if (wordData && wordData.has && !foundWords.includes(wordText)) {
            cards[i].style.animation = 'pulse 1s ease 3';
            setTimeout(() => {
                cards[i].style.animation = '';
            }, 3000);
            break;
        }
    }
}

function nextPhonics() {
    currentSoundIndex++;
    
    if (currentSoundIndex >= phonicsLevels[currentLevel].sounds.length) {
        currentSoundIndex = 0;
        currentLevel++;
        
        if (currentLevel >= phonicsLevels.length) {
            currentLevel = 0;
        }
    }
    
    loadPhonics();
}

window.addEventListener('load', loadPhonics);
