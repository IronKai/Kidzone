let totalSlices = 8;
let selectedSlices = 0;
let targetFraction = null;
let score = 0;
let level = 1;

function createPizza() {
    const pizza = document.getElementById('pizza');
    pizza.innerHTML = '';
    
    // Create slices based on level
    totalSlices = level < 3 ? 4 : level < 5 ? 6 : 8;
    
    for (let i = 0; i < totalSlices; i++) {
        const slice = document.createElement('div');
        slice.className = 'pizza-slice';
        slice.style.transform = `rotate(${(360/totalSlices) * i}deg)`;
        slice.style.clipPath = `polygon(0 0, 50% 0, 0 50%)`;
        
        // Add toppings
        const toppings = ['🍄', '🧀', '🍅', '🌶️', '🥓'];
        for (let j = 0; j < 3; j++) {
            const topping = document.createElement('span');
            topping.className = 'topping';
            topping.textContent = toppings[Math.floor(Math.random() * toppings.length)];
            topping.style.left = Math.random() * 30 + 10 + 'px';
            topping.style.top = Math.random() * 30 + 10 + 'px';
            slice.appendChild(topping);
        }
        
        slice.onclick = () => toggleSlice(slice);
        pizza.appendChild(slice);
    }
}

function toggleSlice(slice) {
    if (slice.classList.contains('selected')) {
        slice.classList.remove('selected');
        selectedSlices--;
    } else {
        slice.classList.add('selected');
        selectedSlices++;
    }
    
    updateFractionDisplay();
}

function updateFractionDisplay() {
    document.getElementById('fractionDisplay').textContent = `${selectedSlices}/${totalSlices}`;
    
    // Simplify fraction
    const gcd = getGCD(selectedSlices, totalSlices);
    if (gcd > 1) {
        const simplified = `${selectedSlices/gcd}/${totalSlices/gcd}`;
        document.getElementById('fractionDisplay').textContent += ` = ${simplified}`;
    }
}

function getGCD(a, b) {
    return b === 0 ? a : getGCD(b, a % b);
}

function newPizzaProblem() {
    selectedSlices = 0;
    createPizza();
    updateFractionDisplay();
    
    // Generate target fraction
    const numerator = Math.floor(Math.random() * (totalSlices - 1)) + 1;
    targetFraction = { num: numerator, den: totalSlices };
    
    // Simplify target
    const gcd = getGCD(numerator, totalSlices);
    const simplifiedNum = numerator / gcd;
    const simplifiedDen = totalSlices / gcd;
    
    document.getElementById('instruction').textContent = 
        `Select ${simplifiedNum}/${simplifiedDen} of the pizza!`;
    
    generateOptions();
}

function generateOptions() {
    const container = document.getElementById('fractionOptions');
    container.innerHTML = '<p style="color: white; width: 100%; text-align: center;">Or choose the matching fraction:</p>';
    
    const options = [];
    
    // Add correct answer
    const gcd = getGCD(targetFraction.num, targetFraction.den);
    options.push(`${targetFraction.num/gcd}/${targetFraction.den/gcd}`);
    
    // Add wrong options
    while (options.length < 4) {
        const wrongNum = Math.floor(Math.random() * totalSlices) + 1;
        const wrongDen = totalSlices;
        const wrongGcd = getGCD(wrongNum, wrongDen);
        const wrongFraction = `${wrongNum/wrongGcd}/${wrongDen/wrongGcd}`;
        
        if (!options.includes(wrongFraction)) {
            options.push(wrongFraction);
        }
    }
    
    // Shuffle and display
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(fraction => {
        const card = document.createElement('div');
        card.className = 'fraction-card';
        card.textContent = fraction;
        card.onclick = () => selectFraction(fraction);
        container.appendChild(card);
    });
}

function selectFraction(fraction) {
    const gcd = getGCD(targetFraction.num, targetFraction.den);
    const correct = `${targetFraction.num/gcd}/${targetFraction.den/gcd}`;
    
    if (fraction === correct) {
        score += level * 10;
        document.getElementById('score').textContent = score;
        
        // Show correct slices
        const slices = document.querySelectorAll('.pizza-slice');
        for (let i = 0; i < targetFraction.num; i++) {
            slices[i].classList.add('selected');
        }
        
        if (score >= level * 50) {
            level++;
            document.getElementById('level').textContent = level;
        }
        
        setTimeout(newPizzaProblem, 2000);
    }
}

function checkAnswer() {
    if (selectedSlices === targetFraction.num) {
        score += level * 10;
        document.getElementById('score').textContent = score;
        document.getElementById('instruction').textContent = '✅ Correct! Well done!';
        
        if (score >= level * 50) {
            level++;
            document.getElementById('level').textContent = level;
        }
        
        setTimeout(newPizzaProblem, 1500);
    } else {
        document.getElementById('instruction').textContent = '❌ Try again!';
    }
}

window.addEventListener('load', newPizzaProblem);
