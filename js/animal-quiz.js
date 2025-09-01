const animalQuestions = [
    {
        animal: "🦁",
        name: "Lion",
        questions: [
            {
                question: "What sound does a lion make?",
                answers: ["Roar", "Meow", "Bark", "Chirp"],
                correct: 0,
                fact: "A lion's roar can be heard from 5 miles away!"
            },
            {
                question: "Where do lions live?",
                answers: ["Ocean", "Arctic", "Savanna", "Sky"],
                correct: 2,
                fact: "Lions are the only cats that live in groups called prides!"
            }
        ]
    },
    {
        animal: "🐘",
        name: "Elephant",
        questions: [
            {
                question: "What do elephants use their trunk for?",
                answers: ["Flying", "Breathing and grabbing", "Swimming only", "Dancing"],
                correct: 1,
                fact: "An elephant's trunk has over 40,000 muscles!"
            },
            {
                question: "What do elephants eat?",
                answers: ["Meat", "Fish", "Plants", "Rocks"],
                correct: 2,
                fact: "Elephants eat up to 300 pounds of food every day!"
            }
        ]
    },
    {
        animal: "🦅",
        name: "Eagle",
        questions: [
            {
                question: "What makes eagles special hunters?",
                answers: ["Sharp eyesight", "Long tail", "Colorful feathers", "Loud voice"],
                correct: 0,
                fact: "Eagles can see up to 8 times better than humans!"
            }
        ]
    },
    {
        animal: "🐬",
        name: "Dolphin",
        questions: [
            {
                question: "How do dolphins communicate?",
                answers: ["Writing", "Clicks and whistles", "Sign language", "Telepathy"],
                correct: 1,
                fact: "Each dolphin has its own unique whistle, like a name!"
            }
        ]
    },
    {
        animal: "🦒",
        name: "Giraffe",
        questions: [
            {
                question: "What's special about a giraffe?",
                answers: ["Longest neck", "Fastest runner", "Best swimmer", "Loudest roar"],
                correct: 0,
                fact: "A giraffe's tongue is 18-20 inches long and purple!"
            }
        ]
    }
];

let currentAnimal = null;
let currentQuestion = null;
let score = 0;
let streak = 0;

function loadQuestion() {
    // Pick random animal
    currentAnimal = animalQuestions[Math.floor(Math.random() * animalQuestions.length)];
    currentQuestion = currentAnimal.questions[Math.floor(Math.random() * currentAnimal.questions.length)];
    
    // Display animal and question
    document.getElementById('animalDisplay').textContent = currentAnimal.animal;
    document.getElementById('question').textContent = currentQuestion.question;
    
    // Hide fact box
    document.getElementById('factBox').classList.remove('show');
    
    // Create answer buttons
    const grid = document.getElementById('answerGrid');
    grid.innerHTML = '';
    
    currentQuestion.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index, btn);
        grid.appendChild(btn);
    });
}

function checkAnswer(index, button) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (index === currentQuestion.correct) {
        button.classList.add('correct');
        score += 10;
        streak++;
        
        // Show fun fact
        document.getElementById('funFact').textContent = currentQuestion.fact;
        document.getElementById('factBox').classList.add('show');
    } else {
        button.classList.add('incorrect');
        buttons[currentQuestion.correct].classList.add('correct');
        streak = 0;
    }
    
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
}

function nextQuestion() {
    loadQuestion();
}

window.addEventListener('load', loadQuestion);
