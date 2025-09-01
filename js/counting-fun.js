const countingObjects = ['🍎', '🍊', '🍌', '🍇', '🍓', '🌟', '🎈', '🦋', '🌸', '🐢'];
let currentCount = 0;
let score = 0;
let streak = 0;

function newCountingProblem() {
    // Generate random count (1-10 for beginners)
    currentCount = Math.floor(Math.random() * 10) + 1;
    
    // Pick random object
    const object = countingObjects[Math.floor(Math.random() * countingObjects.length)];
    
    // Display objects
    const container = document.getElementById('objectsContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < currentCount; i++) {
        setTimeout(() => {
            const obj = document.createElement('div');
            obj.className = 'count-object';
            obj.textContent = object;
            obj.style.animationDelay = `${i * 0.1}s`;
            container.appendChild(obj);
        }, i * 100);
    }
    
    // Create number buttons
    createNumberButtons();
}

function createNumberButtons() {
    const container = document.getElementById('numberButtons');
    container.innerHTML = '';
    
    // Create buttons 1-10
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.textContent = i;
        btn.onclick = () => checkAnswer(i, btn);
        container.appendChild(btn);
    }
}

function checkAnswer(answer, button) {
    if (answer === currentCount) {
        button.classList.add('correct');
        score += 10;
        streak++;
        
        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        document.getElementById('question').textContent = '✅ Correct! Well done!';
        
        // Disable all buttons
        document.querySelectorAll('.num-btn').forEach(btn => btn.disabled = true);
        
        setTimeout(() => {
            document.getElementById('question').textContent = 'How many do you see?';
            newCountingProblem();
        }, 1500);
    } else {
        button.classList.add('wrong');
        streak = 0;
        document.getElementById('streak').textContent = streak;
    }
}

window.addEventListener('load', newCountingProblem);
