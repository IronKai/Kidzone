let blocks = [];
let currentBlock = null;
let towerHeight = 0;
let blockCount = 0;
let gameActive = true;
let windStrength = 0;

function createNewBlock() {
    if (!gameActive) return;
    
    const area = document.getElementById('towerArea');
    const block = document.createElement('div');
    block.className = 'block preview';
    
    // Random width
    const width = Math.floor(Math.random() * 60) + 60;
    block.style.width = width + 'px';
    block.style.height = '40px';
    
    // Position at top
    block.style.left = '250px';
    block.style.top = '20px';
    
    area.appendChild(block);
    currentBlock = block;
    
    // Move block with mouse
    area.addEventListener('mousemove', moveBlock);
}

function moveBlock(e) {
    if (!currentBlock) return;
    
    const area = document.getElementById('towerArea');
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left - (currentBlock.offsetWidth / 2);
    
    // Apply wind effect
    const windOffset = Math.sin(Date.now() / 500) * windStrength;
    
    currentBlock.style.left = Math.max(0, Math.min(x + windOffset, area.offsetWidth - currentBlock.offsetWidth)) + 'px';
}

function dropBlock() {
    if (!currentBlock || !gameActive) {
        createNewBlock();
        return;
    }
    
    const area = document.getElementById('towerArea');
    area.removeEventListener('mousemove', moveBlock);
    
    currentBlock.classList.remove('preview');
    currentBlock.classList.add('falling');
    
    // Calculate landing position
    let landingY = area.offsetHeight - 50; // Ground level
    
    // Check collision with other blocks
    blocks.forEach(block => {
        const blockTop = parseInt(block.style.top);
        if (blockTop < landingY) {
            // Check horizontal overlap
            const currentLeft = parseInt(currentBlock.style.left);
            const currentRight = currentLeft + currentBlock.offsetWidth;
            const blockLeft = parseInt(block.style.left);
            const blockRight = blockLeft + block.offsetWidth;
            
            if (currentLeft < blockRight && currentRight > blockLeft) {
                landingY = Math.min(landingY, blockTop);
            }
        }
    });
    
    // Place block
    currentBlock.style.top = (landingY - 40) + 'px';
    blocks.push(currentBlock);
    
    // Update stats
    blockCount++;
    towerHeight = Math.max(towerHeight, Math.floor((area.offsetHeight - landingY + 40) / 10));
    
    document.getElementById('blocks').textContent = blockCount;
    document.getElementById('height').textContent = towerHeight;
    
    // Check stability
    checkStability();
    
    // Create new block
    currentBlock = null;
    setTimeout(createNewBlock, 500);
    
    // Increase difficulty
    if (blockCount % 5 === 0) {
        windStrength = Math.min(windStrength + 5, 20);
        updateWind();
    }
}

function checkStability() {
    // Simple stability check
    if (blocks.length > 1) {
        const lastBlock = blocks[blocks.length - 1];
        const lastLeft = parseInt(lastBlock.style.left);
        const lastRight = lastLeft + lastBlock.offsetWidth;
        
        let supported = false;
        for (let i = blocks.length - 2; i >= 0; i--) {
            const block = blocks[i];
            const blockLeft = parseInt(block.style.left);
            const blockRight = blockLeft + block.offsetWidth;
            
            // Check if at least 50% is supported
            const overlap = Math.min(lastRight, blockRight) - Math.max(lastLeft, blockLeft);
            if (overlap > lastBlock.offsetWidth * 0.5) {
                supported = true;
                break;
            }
        }
        
        if (!supported && blocks.length > 2) {
            // Tower falls!
            gameActive = false;
            blocks.forEach((block, i) => {
                setTimeout(() => {
                    block.style.transform = 'rotate(' + (Math.random() * 90 - 45) + 'deg) translateX(' + (Math.random() * 200 - 100) + 'px)';
                }, i * 50);
            });
            
            setTimeout(() => {
                alert(`Tower collapsed! Height: ${towerHeight}m, Blocks: ${blockCount}`);
            }, 1000);
        }
    }
}

function updateWind() {
    const indicator = document.getElementById('windIndicator');
    if (windStrength > 10) {
        indicator.textContent = '💨';
    } else if (windStrength > 5) {
        indicator.textContent = '🍃';
    }
}

function resetTower() {
    blocks.forEach(block => block.remove());
    blocks = [];
    if (currentBlock) currentBlock.remove();
    currentBlock = null;
    
    towerHeight = 0;
    blockCount = 0;
    windStrength = 0;
    gameActive = true;
    
    document.getElementById('blocks').textContent = '0';
    document.getElementById('height').textContent = '0';
    updateWind();
    
    createNewBlock();
}

window.addEventListener('load', () => {
    createNewBlock();
});
