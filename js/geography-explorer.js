const countries = {
    africa: [
        { name: 'Egypt', flag: '🇪🇬', capital: 'Cairo', language: 'Arabic', fact: 'Has pyramids!' },
        { name: 'Kenya', flag: '🇰🇪', capital: 'Nairobi', language: 'Swahili', fact: 'Safari land!' },
        { name: 'South Africa', flag: '🇿🇦', capital: 'Cape Town', language: 'English', fact: 'Has penguins!' }
    ],
    asia: [
        { name: 'Japan', flag: '🇯🇵', capital: 'Tokyo', language: 'Japanese', fact: 'Land of sushi!' },
        { name: 'China', flag: '🇨🇳', capital: 'Beijing', language: 'Mandarin', fact: 'Has pandas!' },
        { name: 'India', flag: '🇮🇳', capital: 'New Delhi', language: 'Hindi', fact: 'Has tigers!' }
    ],
    europe: [
        { name: 'France', flag: '🇫🇷', capital: 'Paris', language: 'French', fact: 'Eiffel Tower!' },
        { name: 'Italy', flag: '🇮🇹', capital: 'Rome', language: 'Italian', fact: 'Pizza origin!' },
        { name: 'Spain', flag: '🇪🇸', capital: 'Madrid', language: 'Spanish', fact: 'Flamenco dance!' }
    ],
    northamerica: [
        { name: 'USA', flag: '🇺🇸', capital: 'Washington', language: 'English', fact: '50 states!' },
        { name: 'Canada', flag: '🇨🇦', capital: 'Ottawa', language: 'English/French', fact: 'Maple syrup!' },
        { name: 'Mexico', flag: '🇲🇽', capital: 'Mexico City', language: 'Spanish', fact: 'Tacos!' }
    ],
    southamerica: [
        { name: 'Brazil', flag: '🇧🇷', capital: 'Brasília', language: 'Portuguese', fact: 'Amazon rainforest!' },
        { name: 'Argentina', flag: '🇦🇷', capital: 'Buenos Aires', language: 'Spanish', fact: 'Tango dance!' },
        { name: 'Peru', flag: '🇵🇪', capital: 'Lima', language: 'Spanish', fact: 'Machu Picchu!' }
    ]
};

let selectedContinent = null;
let currentCountry = null;
let score = 0;
let foundCountries = 0;

function selectContinent(continent) {
    selectedContinent = continent;
    
    // Update visual selection
    document.querySelectorAll('.continent').forEach(c => {
        c.classList.remove('selected');
    });
    document.querySelector(`[data-continent="${continent}"]`).classList.add('selected');
    
    // Load country question
    nextCountry();
}

function nextCountry() {
    if (!selectedContinent) {
        document.getElementById('question').textContent = 'Please select a continent first!';
        return;
    }
    
    const continentCountries = countries[selectedContinent];
    currentCountry = continentCountries[Math.floor(Math.random() * continentCountries.length)];
    
    // Display flag
    document.getElementById('flagDisplay').textContent = currentCountry.flag;
    document.getElementById('question').textContent = 'Which country is this?';
    
    // Clear info
    document.getElementById('capital').textContent = '?';
    document.getElementById('language').textContent = '?';
    document.getElementById('funFact').textContent = '?';
    
    // Create options
    const options = [currentCountry];
    const allCountries = Object.values(countries).flat();
    
    while (options.length < 4) {
        const random = allCountries[Math.floor(Math.random() * allCountries.length)];
        if (!options.find(c => c.name === random.name)) {
            options.push(random);
        }
    }
    
    // Shuffle and display
    options.sort(() => Math.random() - 0.5);
    
    const container = document.getElementById('countryOptions');
    container.innerHTML = '';
    
    options.forEach(country => {
        const btn = document.createElement('button');
        btn.className = 'country-btn';
        btn.textContent = country.name;
        btn.onclick = () => checkAnswer(country, btn);
        container.appendChild(btn);
    });
}

function checkAnswer(country, button) {
    const buttons = document.querySelectorAll('.country-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (country.name === currentCountry.name) {
        button.classList.add('correct');
        score += 10;
        foundCountries++;
        
        // Show country info
        document.getElementById('capital').textContent = currentCountry.capital;
        document.getElementById('language').textContent = currentCountry.language;
        document.getElementById('funFact').textContent = currentCountry.fact;
        
        document.getElementById('score').textContent = score;
        document.getElementById('countries').textContent = foundCountries;
        
        playCorrectSound();
    } else {
        button.classList.add('wrong');
        // Show correct answer
        buttons.forEach(btn => {
            if (btn.textContent === currentCountry.name) {
                btn.classList.add('correct');
            }
        });
    }
}

function playCorrectSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}
