let audioContext = null;
let recording = false;
let recordedNotes = [];
let recordStartTime = 0;

// Initialize audio context on first user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playNote(note) {
    initAudio();
    
    // Simple frequency mapping
    const frequencies = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[note];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Visual feedback
    const key = document.querySelector(`[data-note="${note}"]`);
    key.classList.add('active');
    setTimeout(() => key.classList.remove('active'), 100);
    
    // Record if recording
    if (recording) {
        recordedNotes.push({
            type: 'note',
            value: note,
            time: Date.now() - recordStartTime
        });
    }
}

function playDrum(type) {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different sounds for different drums
    switch(type) {
        case 'kick':
            oscillator.frequency.value = 60;
            oscillator.type = 'sine';
            break;
        case 'snare':
            oscillator.frequency.value = 200;
            oscillator.type = 'sawtooth';
            break;
        case 'hihat':
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            break;
        case 'crash':
            oscillator.frequency.value = 400;
            oscillator.type = 'sawtooth';
            break;
        case 'tom':
            oscillator.frequency.value = 150;
            oscillator.type = 'sine';
            break;
        case 'ride':
            oscillator.frequency.value = 600;
            oscillator.type = 'triangle';
            break;
    }
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
    
    // Record if recording
    if (recording) {
        recordedNotes.push({
            type: 'drum',
            value: type,
            time: Date.now() - recordStartTime
        });
    }
}

function switchInstrument(instrument) {
    if (instrument === 'piano') {
        document.getElementById('pianoSection').style.display = 'block';
        document.getElementById('drumsSection').style.display = 'none';
    } else {
        document.getElementById('pianoSection').style.display = 'none';
        document.getElementById('drumsSection').style.display = 'grid';
    }
}

function toggleRecording() {
    const btn = document.getElementById('recordBtn');
    
    if (!recording) {
        recording = true;
        recordedNotes = [];
        recordStartTime = Date.now();
        btn.classList.add('recording');
        btn.textContent = '⏹️ Stop';
    } else {
        recording = false;
        btn.classList.remove('recording');
        btn.textContent = '⏺️ Record';
    }
}

function playRecording() {
    if (recordedNotes.length === 0) {
        alert('No recording to play! Record something first.');
        return;
    }
    
    recordedNotes.forEach(note => {
        setTimeout(() => {
            if (note.type === 'note') {
                playNote(note.value);
            } else {
                playDrum(note.value);
            }
        }, note.time);
    });
}

// Keyboard support for piano
document.addEventListener('keydown', (e) => {
    const keyMap = {
        'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
        'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
        'u': 'A#', 'j': 'B'
    };
    
    if (keyMap[e.key.toLowerCase()]) {
        playNote(keyMap[e.key.toLowerCase()]);
    }
});
