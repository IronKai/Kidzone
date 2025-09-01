let currentSequence = [];
let missingIndex = 0;
let correctAnswer = 0;
let score = 0;
let streak = 0;

const patterns = [
    { type: 'add', name: 'Adding' },
    { type: 'subtract', name: 'Subtracting' },
    { type: 'multiply', name: 'Multiplying' },
    { type: 'even', name: 'Even Numbers' },
    { type: 'odd', name: 'Odd Numbers' }
];

function generateSequence() {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let start = Math.floor(Math.random() * 5) + 1;
    
    currentSequence = [];
    
    switch(pattern.type) {
        case 'add':
            const addStep = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < 5; i++) {
                currentSequence.push(start + (i * addStep));
            }
            document.getElementById('hint').textContent = `Pattern: Adding ${addStep}`;
            break;
            
        case 'subtract':
            start = Math.floor(Math.random() * 10) + 20;
            const subStep = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < 5; i++) {
                currentSequence.push(start - (i * subStep));
            }
            document.getElementById('hint').textContent = `Pattern: Subtracting ${subStep}`;
            break;
            
        case 'multiply':
            const mulStep = 2;
            for (let i = 0; i < 5; i++) {
                currentSequence.push(start * Math.pow(mulStep, i));
            }
            document.getElementById('hint').textContent = 'Pattern: Doubling';
            break;
            
        case 'even':
            for (let i = 0; i < 5; i++) {
                currentSequence.push((start + i) * 2);
            }
            document.getElementById('hint').textContent = 'Pattern: Even Numbers';
            break;
            
        case 'odd':
            for (let i = 0; i < 5; i++) {
                currentSequence.push((start + i) * 2 - 1);
            }
            document.getElementById('hint').textContent = 'Pattern: Odd Numbers';
            break;
    }
    
    // Pick random position to hide
    missingIndex = Math.floor(Math.random() * 5);
    correctAnswer = currentSequence[missingIndex];
    
    displaySequence();
    generateOptions();
}

function displaySequence() {
    const container = document.getElementById('sequenceContainer');
    container.innerHTML = '';
    
    currentSequence.forEach((num, index) => {
        const box = document.createElement('div');
        box.className = index === missingIndex ? 'number-box missing' : 'number-box';
        box.textContent = index === missingIndex ? '?' : num;
        container.appendChild(box);
    });
}

function generateOptions() {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    
    const options = [correctAnswer];
    
    // Generate wrong options
    while (options.length < 4) {
        const wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrong > 0 && !options.includes(wrong)) {
            options.push(wrong);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(num => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = num;
        btn.onclick = () => checkAnswer(num, btn);
        container.appendChild(btn);
    });
}

function checkAnswer(answer, button) {
    if (answer === correctAnswer) {
        button.style.background = '#51cf66';
        score += 10;
        streak++;
        
        // Update display
        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        
        // Show correct answer in sequence
        document.querySelectorAll('.number-box')[missingIndex].textContent = correctAnswer;
        
        setTimeout(() => {
            generateSequence();
        }, 1500);
    } else {
        button.style.background = '#ff6b6b';
        streak = 0;
        document.getElementById('streak').textContent = streak;
    }
}

window.addEventListener('load', generateSequence);
