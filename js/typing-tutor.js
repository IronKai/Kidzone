const lessons = [
    {
        level: 1,
        title: "Home Row Keys",
        text: "asdf jkl asdf jkl sad lad ask fall"
    },
    {
        level: 2,
        title: "Simple Words",
        text: "cat dog run fun sun moon star"
    },
    {
        level: 3,
        title: "Short Sentences",
        text: "The cat is fast. I can run and jump."
    },
    {
        level: 4,
        title: "Typing Challenge",
        text: "The quick brown fox jumps over the lazy dog."
    }
];

let currentLesson = 0;
let currentIndex = 0;
let startTime = null;
let errors = 0;
let correctChars = 0;
let timerInterval = null;

function loadLesson() {
    const lesson = lessons[currentLesson];
    const display = document.getElementById('textDisplay');
    display.innerHTML = '';
    
    lesson.text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        if (index === 0) span.classList.add('current');
        display.appendChild(span);
    });
    
    currentIndex = 0;
    errors = 0;
    correctChars = 0;
    
    // Highlight target key
    highlightTargetKey(lesson.text[0]);
    
    document.getElementById('level').textContent = lesson.level;
}

function startTyping() {
    loadLesson();
    startTime = Date.now();
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    if (!startTime) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Calculate WPM
    if (elapsed > 0) {
        const words = correctChars / 5;
        const wpm = Math.round((words / elapsed) * 60);
        document.getElementById('wpm').textContent = wpm;
    }
}

document.addEventListener('keydown', (e) => {
    if (!startTime) return;
    
    const lesson = lessons[currentLesson];
    const targetChar = lesson.text[currentIndex];
    
    if (!targetChar) return;
    
    // Visual keyboard feedback
    const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
    if (key) {
        key.classList.add('active');
        setTimeout(() => key.classList.remove('active'), 100);
    }
    
    const chars = document.querySelectorAll('.char');
    
    if (e.key === targetChar) {
        // Correct
        chars[currentIndex].classList.add('correct');
        chars[currentIndex].classList.remove('current');
        correctChars++;
        currentIndex++;
        
        if (currentIndex < lesson.text.length) {
            chars[currentIndex].classList.add('current');
            highlightTargetKey(lesson.text[currentIndex]);
        } else {
            // Lesson complete
            completeLesson();
        }
    } else if (e.key.length === 1) {
        // Incorrect
        chars[currentIndex].classList.add('incorrect');
        errors++;
    }
    
    // Update accuracy
    const total = correctChars + errors;
    const accuracy = total > 0 ? Math.round((correctChars / total) * 100) : 100;
    document.getElementById('accuracy').textContent = accuracy + '%';
});

function highlightTargetKey(char) {
    // Remove previous highlight
    document.querySelectorAll('.key.target').forEach(key => {
        key.classList.remove('target');
    });
    
    // Highlight new target
    const targetKey = document.querySelector(`[data-key="${char.toLowerCase()}"]`);
    if (targetKey) {
        targetKey.classList.add('target');
    }
}

function completeLesson() {
    clearInterval(timerInterval);
    
    const elapsed = (Date.now() - startTime) / 1000;
    const words = correctChars / 5;
    const wpm = Math.round((words / elapsed) * 60);
    const accuracy = Math.round((correctChars / (correctChars + errors)) * 100);
    
    const score = Math.round(wpm * accuracy / 10);
    document.getElementById('score').textContent = score;
    
    alert(`Lesson Complete!\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nScore: ${score}`);
}

function nextLesson() {
    currentLesson = (currentLesson + 1) % lessons.length;
    startTyping();
}

window.addEventListener('load', loadLesson);
