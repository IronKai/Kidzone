let leftValue = 0;
let rightValue = 0;
let correctAnswer = 0;
let selectedNumber = null;
let score = 0;
let level = 1;

function newEquation() {
    selectedNumber = null;
    
    // Generate equation based on level
    if (level === 1) {
        // Simple addition
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        leftValue = a + b;
        correctAnswer = leftValue;
        document.getElementById('equation').textContent = `${a} + ${b} = ?`;
        document.getElementById('leftPan').textContent = `${a}+${b}`;
    } else if (level === 2) {
        // Subtraction
        const a = Math.floor(Math.random() * 15) + 10;
        const b = Math.floor(Math.random() * 10) + 1;
        leftValue = a - b;
        correctAnswer = leftValue;
        document.getElementById('equation').textContent = `${a} - ${b} = ?`;
        document.getElementById('leftPan').textContent = `${a}-${b}`;
    } else {
        // Multiplication
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
        leftValue = a * b;
        correctAnswer = leftValue;
        document.getElementById('equation').textContent = `${a} × ${b} = ?`;
        document.getElementById('leftPan').textContent = `${a}×${b}`;
    }
    
    document.getElementById('rightPan').textContent = '?';
    
    // Reset scale
    document.getElementById('beam').className = 'scale-beam';
    
    // Generate options
    generateOptions();
}

function generateOptions() {
    const container = document.getElementById('numberOptions');
    container.innerHTML = '';
    
    const options = [correctAnswer];
    while (options.length < 4) {
        const wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrong > 0 && !options.includes(wrong)) {
            options.push(wrong);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(num => {
        const card = document.createElement('div');
        card.className = 'number-card';
        card.textContent = num;
        card.onclick = () => selectNumber(num, card);
        container.appendChild(card);
    });
}

function selectNumber(num, card) {
    // Remove previous selection
    document.querySelectorAll('.number-card').forEach(c => c.classList.remove('selected'));
    
    // Select new card
    card.classList.add('selected');
    selectedNumber = num;
    rightValue = num;
    
    // Update right pan
    document.getElementById('rightPan').textContent = num;
    
    // Animate scale
    animateScale();
}

function animateScale() {
    const beam = document.getElementById('beam');
    
    if (rightValue < leftValue) {
        beam.className = 'scale-beam tilt-left';
    } else if (rightValue > leftValue) {
        beam.className = 'scale-beam tilt-right';
    } else {
        beam.className = 'scale-beam';
    }
}

function checkBalance() {
    if (selectedNumber === null) {
        alert('Please select a number first!');
        return;
    }
    
    if (selectedNumber === correctAnswer) {
        score += level * 10;
        document.getElementById('score').textContent = score;
        
        // Show success
        document.getElementById('equation').textContent = '✅ Perfect balance!';
        
        // Level up
        if (score >= level * 50) {
            level++;
            document.getElementById('level').textContent = level;
        }
        
        setTimeout(newEquation, 1500);
    } else {
        document.getElementById('equation').textContent = '❌ Try again!';
    }
}

window.addEventListener('load', newEquation);
