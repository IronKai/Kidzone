const scenarios = [
    {
        text: "Your friend shared their favorite toy with you at school.",
        correct: "happy",
        emotions: ["happy", "sad", "angry", "scared"],
        feedback: "That's right! We feel happy when friends are kind to us!"
    },
    {
        text: "You worked really hard and finished a difficult puzzle.",
        correct: "proud",
        emotions: ["proud", "sad", "worried", "angry"],
        feedback: "Excellent! We feel proud when we accomplish something difficult!"
    },
    {
        text: "Your pet is sick and needs to go to the vet.",
        correct: "worried",
        emotions: ["happy", "excited", "worried", "angry"],
        feedback: "That's right! It's normal to feel worried when someone we love is sick."
    },
    {
        text: "Someone took your snack without asking.",
        correct: "upset",
        emotions: ["happy", "upset", "excited", "sleepy"],
        feedback: "Correct! It's okay to feel upset when someone takes our things without asking."
    },
    {
        text: "You're going to your favorite park tomorrow!",
        correct: "excited",
        emotions: ["sad", "angry", "excited", "scared"],
        feedback: "Yes! We feel excited when we're looking forward to something fun!"
    }
];

const emotionEmojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    scared: "😨",
    proud: "😌",
    worried: "😟",
    upset: "😔",
    excited: "🤗",
    sleepy: "😴"
};

let currentScenario = null;
let score = 0;
let level = 1;

function loadScenario() {
    currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    document.getElementById('scenario').textContent = currentScenario.text;
    
    const optionsContainer = document.getElementById('emotionOptions');
    optionsContainer.innerHTML = '';
    
    currentScenario.emotions.forEach(emotion => {
        const card = document.createElement('div');
        card.className = 'emotion-card';
        card.onclick = () => checkEmotion(emotion);
        
        const face = document.createElement('div');
        face.className = 'emotion-face';
        face.textContent = emotionEmojis[emotion];
        
        const label = document.createElement('div');
        label.className = 'emotion-label';
        label.textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        
        card.appendChild(face);
        card.appendChild(label);
        optionsContainer.appendChild(card);
    });
    
    document.getElementById('feedback').style.display = 'none';
}

function checkEmotion(emotion) {
    const feedback = document.getElementById('feedback');
    
    if (emotion === currentScenario.correct) {
        score += 10;
        document.getElementById('score').textContent = score;
        
        feedback.className = 'feedback correct';
        feedback.textContent = currentScenario.feedback;
        
        if (score % 50 === 0) {
            level++;
            document.getElementById('level').textContent = level;
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = "Not quite. Think about how this situation would make you feel.";
    }
    
    feedback.style.display = 'block';
}

function nextScenario() {
    loadScenario();
}

window.addEventListener('load', loadScenario);
