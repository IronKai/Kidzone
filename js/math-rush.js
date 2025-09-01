let score = 0;
let level = 1;
let currentAnswer = 0;

function startMathGame() {
    score = 0;
    level = 1;
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    generateProblem();
}

function generateProblem() {
    const maxNum = level * 5 + 5;
    const operations = ['+', '-'];
    if (level > 2) operations.push('×');
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
    
    // Ensure positive results for subtraction
    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    
    // Calculate answer
    switch(operation) {
        case '+': currentAnswer = num1 + num2; break;
        case '-': currentAnswer = num1 - num2; break;
        case '×': currentAnswer = num1 * num2; break;
    }
    
    // Display problem
    document.getElementById('problem').textContent = `${num1} ${operation} ${num2} = ?`;
    
    // Generate answer options
    const answers = [currentAnswer];
    while (answers.length < 4) {
        const wrongAnswer = currentAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrongAnswer >= 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    
    // Shuffle answers
    answers.sort(() => Math.random() - 0.5);
    
    // Display answers
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
        btn.textContent = answers[i];
        btn.classList.remove('correct', 'wrong');
        btn.dataset.value = answers[i];
    });
}

function checkAnswer(index) {
    const button = document.querySelectorAll('.answer-btn')[index];
    const value = parseInt(button.dataset.value);
    
    if (value === currentAnswer) {
        button.classList.add('correct');
        score += level * 10;
        document.getElementById('score').textContent = score;
        
        // Level up every 5 correct answers
        if (score % 50 === 0) {
            level++;
            document.getElementById('level').textContent = level;
        }
        
        setTimeout(() => {
            generateProblem();
        }, 1000);
    } else {
        button.classList.add('wrong');
    }
}
