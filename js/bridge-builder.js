let selectedMaterial = 'beam';
let bridgePieces = [];
let level = 1;
let score = 0;
let maxWeight = 10;
let currentWeight = 0;

function selectMaterial(material) {
    selectedMaterial = material;
    document.querySelectorAll('.material-item').forEach(item => {
        item.style.background = 'white';
    });
    event.currentTarget.style.background = '#e7f3ff';
}

document.getElementById('bridgeContainer').addEventListener('click', (e) => {
    if (e.target.id === 'bridgeContainer') {
        placePiece(e.offsetX, e.offsetY);
    }
});

function placePiece(x, y) {
    const container = document.getElementById('bridgeContainer');
    const piece = document.createElement('div');
    piece.className = `bridge-piece ${selectedMaterial}`;
    
    // Snap to grid
    x = Math.round(x / 20) * 20;
    y = Math.round(y / 20) * 20;
    
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
    
    // Make draggable
    piece.addEventListener('mousedown', startDrag);
    piece.addEventListener('dblclick', () => {
        piece.remove();
        bridgePieces = bridgePieces.filter(p => p !== piece);
        updateWeight();
    });
    
    container.appendChild(piece);
    bridgePieces.push(piece);
    
    updateWeight();
}

function startDrag(e) {
    const piece = e.target;
    const startX = e.clientX - piece.offsetLeft;
    const startY = e.clientY - piece.offsetTop;
    
    function drag(e) {
        let x = e.clientX - startX;
        let y = e.clientY - startY;
        
        // Snap to grid
        x = Math.round(x / 20) * 20;
        y = Math.round(y / 20) * 20;
        
        piece.style.left = x + 'px';
        piece.style.top = y + 'px';
    }
    
    function stopDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function updateWeight() {
    currentWeight = bridgePieces.length * 2;
    document.getElementById('weight').textContent = currentWeight;
    
    // Update stability
    const stability = Math.max(0, 100 - (currentWeight / maxWeight) * 100);
    document.getElementById('stabilityFill').style.width = stability + '%';
}

function testBridge() {
    const vehicle = document.getElementById('testVehicle');
    
    // Check if bridge connects platforms
    const bridgeComplete = checkBridgeConnection();
    
    if (!bridgeComplete) {
        alert('Bridge is not complete! Connect both platforms.');
        return;
    }
    
    // Animate vehicle
    vehicle.style.transition = 'all 3s ease';
    vehicle.style.left = '750px';
    
    // Check stability
    setTimeout(() => {
        if (currentWeight > maxWeight) {
            // Bridge collapse
            bridgePieces.forEach((piece, i) => {
                setTimeout(() => {
                    piece.style.transform = 'rotate(' + (Math.random() * 90 - 45) + 'deg) translateY(300px)';
                }, i * 50);
            });
            
            vehicle.style.transform = 'translateY(200px) rotate(45deg)';
            
            setTimeout(() => {
                alert('Bridge collapsed! Too heavy. Try using fewer pieces.');
            }, 1000);
        } else {
            // Success
            score += level * 100;
            document.getElementById('score').textContent = score;
            alert('Success! Your bridge held the weight!');
            
            if (score >= level * 300) {
                level++;
                document.getElementById('level').textContent = level;
            }
        }
        
        // Reset vehicle
        setTimeout(() => {
            vehicle.style.transition = 'none';
            vehicle.style.left = '60px';
            vehicle.style.transform = 'none';
        }, 1000);
    }, 3000);
}

function checkBridgeConnection() {
    // Simplified check - in real implementation would check actual connectivity
    return bridgePieces.length >= 3;
}

function clearBridge() {
    bridgePieces.forEach(piece => piece.remove());
    bridgePieces = [];
    updateWeight();
    
    const vehicle = document.getElementById('testVehicle');
    vehicle.style.left = '60px';
    vehicle.style.transform = 'none';
}

function nextLevel() {
    level++;
    document.getElementById('level').textContent = level;
    maxWeight = 10 + (level * 5);
    clearBridge();
    
    // Change vehicle for higher levels
    const vehicles = ['🚗', '🚚', '🚌', '🚂'];
    document.getElementById('testVehicle').textContent = vehicles[Math.min(level - 1, vehicles.length - 1)];
}

window.addEventListener('load', () => {
    selectMaterial('beam');
});
