let selectedColors = [];
let mixCount = 0;
let currentChallenge = null;

const colorMixes = {
    'red,blue': { color: '#800080', name: 'Purple' },
    'blue,red': { color: '#800080', name: 'Purple' },
    'red,yellow': { color: '#FFA500', name: 'Orange' },
    'yellow,red': { color: '#FFA500', name: 'Orange' },
    'blue,yellow': { color: '#008000', name: 'Green' },
    'yellow,blue': { color: '#008000', name: 'Green' },
    'red,red': { color: '#FF0000', name: 'Red' },
    'blue,blue': { color: '#0000FF', name: 'Blue' },
    'yellow,yellow': { color: '#FFFF00', name: 'Yellow' }
};

const challenges = [
    { color: '#800080', name: 'Purple', recipe: ['red', 'blue'] },
    { color: '#FFA500', name: 'Orange', recipe: ['red', 'yellow'] },
    { color: '#008000', name: 'Green', recipe: ['blue', 'yellow'] }
];

function newChallenge() {
    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    document.getElementById('targetColor').style.background = currentChallenge.color;
    document.getElementById('targetName').textContent = currentChallenge.name;
    resetMix();
}

function selectColor(colorName, colorHex) {
    if (selectedColors.length >= 2) {
        resetMix();
    }
    
    selectedColors.push(colorName);
    
    // Visual feedback
    document.querySelectorAll('.color-drop').forEach(drop => {
        drop.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    
    // Update bowl
    updateBowl();
    
    if (selectedColors.length === 2) {
        document.getElementById('result').textContent = 'Click "Mix Colors" to see what happens!';
    }
}

function updateBowl() {
    const bowl = document.getElementById('mixingBowl');
    
    if (selectedColors.length === 0) {
        bowl.style.background = '#f0f0f0';
        bowl.textContent = '🎨';
    } else if (selectedColors.length === 1) {
        const colors = {
            'red': '#FF0000',
            'blue': '#0000FF',
            'yellow': '#FFFF00'
        };
        bowl.style.background = colors[selectedColors[0]];
        bowl.textContent = '🖌️';
    }
}

function mixColors() {
    if (selectedColors.length < 2) {
        alert('Please select two colors to mix!');
        return;
    }
    
    const mixKey = selectedColors.join(',');
    const result = colorMixes[mixKey];
    
    if (result) {
        const bowl = document.getElementById('mixingBowl');
        bowl.style.background = result.color;
        bowl.textContent = '✨';
        
        document.getElementById('result').textContent = `You made ${result.name}!`;
        
        mixCount++;
        document.getElementById('mixCount').textContent = mixCount;
        
        // Check if challenge completed
        if (currentChallenge && result.name === currentChallenge.name) {
            setTimeout(() => {
                alert('Perfect! You made the right color! 🎨');
                newChallenge();
            }, 1000);
        }
    }
}

function resetMix() {
    selectedColors = [];
    document.querySelectorAll('.color-drop').forEach(drop => {
        drop.classList.remove('selected');
    });
    updateBowl();
    document.getElementById('result').textContent = 'Select two colors to mix!';
}

window.addEventListener('load', newChallenge);
