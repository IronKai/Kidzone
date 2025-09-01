const stories = [
    {
        title: "The Magic Garden",
        template: "Once upon a time, there was a [ADJECTIVE] garden. In this garden lived a [ANIMAL] who loved to [VERB]. Every day, the [ANIMAL] would find [NUMBER] [OBJECTS] and feel very [EMOTION].",
        blanks: ['ADJECTIVE', 'ANIMAL', 'VERB', 'ANIMAL', 'NUMBER', 'OBJECTS', 'EMOTION'],
        words: {
            'ADJECTIVE': ['magical', 'beautiful', 'colorful', 'mysterious'],
            'ANIMAL': ['rabbit', 'butterfly', 'bird', 'squirrel'],
            'VERB': ['sing', 'dance', 'play', 'explore'],
            'NUMBER': ['three', 'five', 'seven', 'ten'],
            'OBJECTS': ['flowers', 'stones', 'leaves', 'seeds'],
            'EMOTION': ['happy', 'excited', 'peaceful', 'joyful']
        }
    },
    {
        title: "Space Adventure",
        template: "The [ADJECTIVE] astronaut flew to the [PLACE]. There, they discovered [NUMBER] [ADJECTIVE] aliens who liked to [VERB]. Together, they shared [FOOD] and became [EMOTION] friends.",
        blanks: ['ADJECTIVE', 'PLACE', 'NUMBER', 'ADJECTIVE', 'VERB', 'FOOD', 'EMOTION'],
        words: {
            'ADJECTIVE': ['brave', 'curious', 'friendly', 'smart'],
            'PLACE': ['moon', 'Mars', 'stars', 'galaxy'],
            'NUMBER': ['two', 'four', 'six', 'eight'],
            'VERB': ['jump', 'float', 'spin', 'laugh'],
            'FOOD': ['cookies', 'pizza', 'fruit', 'cake'],
            'EMOTION': ['best', 'good', 'happy', 'close']
        }
    }
];

let currentStory = null;
let selectedWords = {};
let storyCount = 0;

function newStory() {
    currentStory = stories[Math.floor(Math.random() * stories.length)];
    selectedWords = {};
    
    document.getElementById('storyTitle').textContent = currentStory.title;
    
    // Create story with blanks
    let storyHTML = currentStory.template;
    currentStory.blanks.forEach((blank, index) => {
        storyHTML = storyHTML.replace(`[${blank}]`, `<span class="blank" data-blank="${blank}" data-index="${index}" onclick="selectBlank(this)">_____</span>`);
    });
    
    document.getElementById('storyText').innerHTML = storyHTML;
    
    // Create word bank
    createWordBank();
}

function createWordBank() {
    const container = document.getElementById('wordBank');
    container.innerHTML = '<h3 style="width: 100%; text-align: center; color: #667eea;">Choose words to complete the story:</h3>';
    
    // Get all unique word types needed
    const uniqueBlanks = [...new Set(currentStory.blanks)];
    
    uniqueBlanks.forEach(blankType => {
        const words = currentStory.words[blankType];
        words.forEach(word => {
            const chip = document.createElement('div');
            chip.className = 'word-chip';
            chip.textContent = word;
            chip.dataset.type = blankType;
            chip.onclick = () => useWord(word, blankType, chip);
            container.appendChild(chip);
        });
    });
}

let selectedBlank = null;

function selectBlank(blank) {
    // Highlight selected blank
    document.querySelectorAll('.blank').forEach(b => b.style.background = '');
    blank.style.background = 'rgba(102, 126, 234, 0.2)';
    selectedBlank = blank;
}

function useWord(word, type, chip) {
    if (!selectedBlank) {
        // Find first empty blank of this type
        const blanks = document.querySelectorAll(`.blank[data-blank="${type}"]`);
        for (let blank of blanks) {
            if (blank.textContent === '_____') {
                selectedBlank = blank;
                break;
            }
        }
    }
    
    if (selectedBlank && selectedBlank.dataset.blank === type) {
        selectedBlank.textContent = word;
        selectedBlank.classList.add('filled');
        selectedBlank.style.background = '';
        
        chip.classList.add('used');
        
        selectedWords[selectedBlank.dataset.index] = word;
        selectedBlank = null;
    }
}

function checkStory() {
    const blanks = document.querySelectorAll('.blank');
    let complete = true;
    
    blanks.forEach(blank => {
        if (blank.textContent === '_____') {
            complete = false;
            blank.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                blank.style.animation = '';
            }, 500);
        }
    });
    
    if (complete) {
        storyCount++;
        document.getElementById('storyCount').textContent = storyCount;
        alert('Great story! You completed it beautifully! 📖✨');
    } else {
        alert('Please fill in all the blanks to complete your story!');
    }
}

window.addEventListener('load', newStory);
