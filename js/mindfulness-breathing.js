let currentPattern = null;
let isBreathing = false;
let breathCount = 0;
let calmLevel = 0;
let sessionTime = 0;
let breathingInterval = null;
let timerInterval = null;

const patterns = {
    calm: {
        name: 'Calm Breathing',
        inhale: 4,
        hold: 4,
        exhale: 4,
        message: 'Breathe slowly and deeply'
    },
    energy: {
        name: 'Energy Boost',
        inhale: 2,
        hold: 1,
        exhale: 2,
        message: 'Quick energizing breaths'
    },
    sleep: {
        name: 'Sleepy Time',
        inhale: 4,
        hold: 7,
        exhale: 8,
        message: 'Relax and prepare for sleep'
    },
    focus: {
        name: 'Focus Mode',
        inhale: 5,
        hold: 5,
        exhale: 5,
        message: 'Center your mind'
    }
};

function selectPattern(patternName) {
    currentPattern = patterns[patternName];
    
    // Update UI
    document.querySelectorAll('.pattern-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    document.getElementById('instruction').textContent = currentPattern.message;
    document.getElementById('breathText').textContent = 'Ready';
    
    resetSession();
}

function startBreathing() {
    if (!currentPattern) {
        alert('Please select a breathing pattern first!');
        return;
    }
    
    if (isBreathing) return;
    
    isBreathing = true;
    
    // Start timer
    timerInterval = setInterval(() => {
        sessionTime++;
        const minutes = Math.floor(sessionTime / 60);
        const seconds = sessionTime % 60;
        document.getElementById('sessionTime').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Start breathing cycle
    breathingCycle();
}

async function breathingCycle() {
    if (!isBreathing) return;
    
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathText');
    const instruction = document.getElementById('instruction');
    
    // Inhale
    circle.className = 'breathing-circle inhale';
    text.textContent = 'Breathe In';
    instruction.textContent = `Inhale for ${currentPattern.inhale} seconds...`;
    updateProgress(currentPattern.inhale);
    await sleep(currentPattern.inhale * 1000);
    
    if (!isBreathing) return;
    
    // Hold
    circle.className = 'breathing-circle hold';
    text.textContent = 'Hold';
    instruction.textContent = `Hold for ${currentPattern.hold} seconds...`;
    updateProgress(currentPattern.hold);
    await sleep(currentPattern.hold * 1000);
    
    if (!isBreathing) return;
    
    // Exhale
    circle.className = 'breathing-circle exhale';
    text.textContent = 'Breathe Out';
    instruction.textContent = `Exhale for ${currentPattern.exhale} seconds...`;
    updateProgress(currentPattern.exhale);
    await sleep(currentPattern.exhale * 1000);
    
    if (!isBreathing) return;
    
    // Complete one breath
    breathCount++;
    document.getElementById('breathCount').textContent = breathCount;
    
    // Update calm level
    calmLevel = Math.min(100, calmLevel + 5);
    document.getElementById('calmLevel').textContent = calmLevel;
    document.getElementById('calmFill').style.width = calmLevel + '%';
    
    // Continue cycle
    breathingCycle();
}

function updateProgress(duration) {
    const circle = document.querySelector('.progress-ring__circle');
    const circumference = 2 * Math.PI * 145;
    
    circle.style.strokeDashoffset = circumference;
    circle.style.transition = `stroke-dashoffset ${duration}s linear`;
    
    setTimeout(() => {
        circle.style.strokeDashoffset = 0;
    }, 50);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pauseBreathing() {
    isBreathing = false;
    clearInterval(timerInterval);
    
    const circle = document.getElementById('breathingCircle');
    circle.className = 'breathing-circle';
    
    document.getElementById('breathText').textContent = 'Paused';
    document.getElementById('instruction').textContent = 'Press Start to continue';
}

function resetSession() {
    pauseBreathing();
    
    breathCount = 0;
    calmLevel = 0;
    sessionTime = 0;
    
    document.getElementById('breathCount').textContent = '0';
    document.getElementById('calmLevel').textContent = '0';
    document.getElementById('calmFill').style.width = '0%';
    document.getElementById('sessionTime').textContent = '0:00';
    document.getElementById('breathText').textContent = 'Ready';
    
    if (currentPattern) {
        document.getElementById('instruction').textContent = currentPattern.message;
    }
}

// Add calming background sounds (simulated)
function playAmbientSound() {
    // In a real implementation, would play calming background sounds
    console.log('Playing ambient sounds...');
}

window.addEventListener('load', () => {
    // Optional: Auto-select first pattern
    selectPattern('calm');
});
