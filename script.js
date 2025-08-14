const ipadScreen = document.getElementById("ipadScreen");
function getIpadRect() {
    return ipadScreen.getBoundingClientRect();
}
const player = document.getElementById("player");
const friend = document.getElementById("friend");

let playerX = 100;
let playerY = 100;

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function placeFriend() {
    const friendSize = 50;
    let placed = false;
    let attempts = 0;
    const screenWidth = ipadScreen.clientWidth;
    const screenHeight = ipadScreen.clientHeight;
    while (!placed && attempts < 100) {
    // Right side: between 2/3 and full width of iPad
    const minX = Math.floor(screenWidth * 0.66);
    const maxX = screenWidth - friendSize;
    const x = Math.floor(Math.random() * (maxX - minX)) + minX;
    const y = Math.floor(Math.random() * (screenHeight - friendSize));

    // Check collision with walls
    const friendRect = { left: x, top: y, right: x + friendSize, bottom: y + friendSize };
    let collides = false;
    for (const wall of window.walls || []) {
        const wallLeft = parseInt(wall.style.left, 10);
        const wallTop = parseInt(wall.style.top, 10);
        const wallWidth = parseInt(wall.style.width, 10);
        const wallHeight = parseInt(wall.style.height, 10);
        const wallRect = {
        left: wallLeft,
        top: wallTop,
        right: wallLeft + wallWidth,
        bottom: wallTop + wallHeight
        };
        if (
        friendRect.left < wallRect.right &&
        friendRect.right > wallRect.left &&
        friendRect.top < wallRect.bottom &&
        friendRect.bottom > wallRect.top
        ) {
        collides = true;
        break;
        }
    }
    if (!collides) {
        friend.style.left = `${x}px`;
        friend.style.top = `${y}px`;
        placed = true;
    }
    attempts++;
    }
}

function placePlayer() {
    const playerSize = 40;
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
    // Near top left: x and y between 10 and 60
    const x = Math.floor(Math.random() * playerSize) + 10;
    const y = Math.floor(Math.random() * playerSize) + 10;

    // Check collision with walls
    const playerRect = { left: x, top: y, right: x + playerSize, bottom: y + playerSize };
    let collides = false;
    for (const wall of window.walls || []) {
        const wallRect = wall.getBoundingClientRect();
        if (
        playerRect.left < wallRect.right &&
        playerRect.right > wallRect.left &&
        playerRect.top < wallRect.bottom &&
        playerRect.bottom > wallRect.top
        ) {
        collides = true;
        break;
        }
    }
    if (!collides) {
        playerX = x;
        playerY = y;
        updatePlayerPosition();
        placed = true;
    }
    attempts++;
    }
}

// Initialize
updatePlayerPosition();
placePlayer();

placeFriend();
createRandomWalls(40); // Add 5 random walls



let distractionInterval = 6000; // Initial delay in milliseconds

function showDistractionModal() {
    if (!isAlertActive) {
    document.getElementById("distractionModal").style.display = "block";
    isAlertActive = true;
    }
}

function getHintDirection() {
    const step = 40; // Same as player size
    const directions = [
    { name: "up", dx: 0, dy: -step },
    { name: "down", dx: 0, dy: step },
    { name: "left", dx: -step, dy: 0 },
    { name: "right", dx: step, dy: 0 }
    ];

    // Get friend's center position
    const friendRect = friend.getBoundingClientRect();
    const friendCenterX = friendRect.left + friendRect.width / 2;
    const friendCenterY = friendRect.top + friendRect.height / 2;

    // Calculate best direction
    let bestDir = null;
    let minDist = Infinity;
    for (const dir of directions) {
    const newX = playerX + dir.dx;
    const newY = playerY + dir.dy;
    if (
        newX >= 0 &&
        newY >= 0 &&
        newX <= window.innerWidth - step &&
        newY <= window.innerHeight - step &&
        !collidesWithWall(newX, newY)
    ) {
        // Distance from new position to friend
        const dist = Math.hypot(
        (newX + step / 2) - friendCenterX,
        (newY + step / 2) - friendCenterY
        );
        if (dist < minDist) {
        minDist = dist;
        bestDir = dir.name;
        }
    }
    }
    return bestDir ? `Go ${bestDir}` : "No clear direction!";
}

function showHint() {
    const hintWidth = 200;
    const hintHeight = 100;
    let placed = false;
    let attempts = 0;

    // Get player's current position
    const playerRect = player.getBoundingClientRect();
    const playerCenterX = playerRect.left + playerRect.width / 2;
    const playerCenterY = playerRect.top + playerRect.height / 2;

    while (!placed && attempts < 100) {
    // Generate random offset within ±200 pixels
    const offsetX = Math.floor(Math.random() * 401) - 200;
    const offsetY = Math.floor(Math.random() * 401) - 200;

    let hintX = playerCenterX + offsetX;
    let hintY = playerCenterY + offsetY;

    // Clamp to ipadScreen boundaries
    const maxX = ipadScreen.clientWidth - hintWidth;
    const maxY = ipadScreen.clientHeight - hintHeight;
    hintX = Math.max(0, Math.min(maxX, hintX));
    hintY = Math.max(0, Math.min(maxY, hintY));

    // Check for overlap with existing hints
    let collides = false;
    const existingHints = document.querySelectorAll('.hintBox');
    for (const hintEl of existingHints) {
        // Use the style.left/top and style.width/height for overlap math
        const existingX = parseInt(hintEl.style.left, 10);
        const existingY = parseInt(hintEl.style.top, 10);
        const existingWidth = parseInt(hintEl.style.width, 10) || hintWidth;
        const existingHeight = parseInt(hintEl.style.height, 10) || hintHeight;

        if (
        hintX < existingX + existingWidth &&
        hintX + hintWidth > existingX &&
        hintY < existingY + existingHeight &&
        hintY + hintHeight > existingY
        ) {
        collides = true;
        break;
        }
    }

    const hintText = getHintDirection(); // Get direction hint


    if (!collides) {
        const hint = document.createElement("div");
        hint.className = "hintBox";
        hint.style.left = `${hintX}px`;
        hint.style.top = `${hintY}px`;

        // Add a bell icon
        const notificationEmojis = ["🔔", "💬", "🎵", "✉️"];
        const icon = document.createElement("span");

        icon.className = "icon";
        icon.textContent = notificationEmojis[Math.floor(Math.random() * notificationEmojis.length)];
        hint.appendChild(icon);

        // Notification title
        const title = document.createElement("div");
        title.className = "title";
        title.textContent = "Notification";

        // Notification message
        const hintPara = document.createElement("div");
        hintPara.className = "message";
        hintPara.textContent = hintText;

        // Stack title and message vertically
        const textStack = document.createElement("div");
        textStack.className = "textStack";
        textStack.appendChild(title);
        textStack.appendChild(hintPara);

        hint.appendChild(textStack);

        ipadScreen.appendChild(hint);

        document.body.appendChild(hint);
        placed = true;
    }
    attempts++;
    }
}

// Update handleDistraction to show hint on "respond"
function handleDistraction(type) {
if (type === 'respond') {
    distractionInterval = distractionInterval - 100;
    showHint(); // <-- Add this line
} else if (type === 'ignore') {
    distractionInterval =  distractionInterval + 100;
}

document.getElementById("distractionModal").style.display = "none";
isAlertActive = false;

clearTimeout(distractionTimeout);
distractionTimeout = setTimeout(showDistractionModal, distractionInterval);
console.log(distractionInterval)
}

let isAlertActive = false;
let distractionTimeout = setTimeout(showDistractionModal, distractionInterval);

// Movement with Arrow Keys
document.addEventListener("keydown", (e) => {
    if (isAlertActive) return; // Prevent movement when modal is active

    let newX = playerX;
    let newY = playerY;
    switch (e.key) {
        case "w":
        newY -= 10;
        break;
        case "s":
        newY += 10;
        break;
        case "a":
        newX -= 10;
        break;
        case "d":
        newX += 10;
        break;
    }


    // Clamp to screen boundaries
    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;
    newX = Math.max(0, Math.min(maxX, newX));
    newY = Math.max(0, Math.min(maxY, newY));

    // Only move if not colliding with a wall
    if (!collidesWithWall(newX, newY)) {
    playerX = newX;
    playerY = newY;
    updatePlayerPosition();
    checkCollision();
    }
});


function createRandomWalls(numWalls = 5) {
    window.walls = [];
    const screenWidth = ipadScreen.clientWidth;
    const screenHeight = ipadScreen.clientHeight;
    const playerSize = 40;
    const friendSize = 50;
    const playerRect = {
        left: playerX,
        top: playerY,
        right: playerX + playerSize,
        bottom: playerY + playerSize
    };
    const friendRect = {
        left: parseInt(friend.style.left, 10),
        top: parseInt(friend.style.top, 10),
        right: parseInt(friend.style.left, 10) + friendSize,
        bottom: parseInt(friend.style.top, 10) + friendSize
    };
    for (let i = 0; i < numWalls; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const width = 50;
            const height = 50;
            // const width = Math.floor(Math.random() * 100) + 50;
            // const height = Math.floor(Math.random() * 100) + 50;
            const left = Math.floor(Math.random() * (screenWidth - width));
            const top = Math.floor(Math.random() * (screenHeight - height));
            const newRect = { left, top, right: left + width, bottom: top + height };

            // Check for overlap with existing walls
            let collides = false;
            for (const wall of window.walls) {
                const wallLeft = parseInt(wall.style.left, 10);
                const wallTop = parseInt(wall.style.top, 10);
                const wallWidth = parseInt(wall.style.width, 10);
                const wallHeight = parseInt(wall.style.height, 10);
                const wallRect = {
                    left: wallLeft,
                    top: wallTop,
                    right: wallLeft + wallWidth,
                    bottom: wallTop + wallHeight
                };
                if (
                    newRect.left < wallRect.right &&
                    newRect.right > wallRect.left &&
                    newRect.top < wallRect.bottom &&
                    newRect.bottom > wallRect.top
                ) {
                    collides = true;
                    break;
                }
            }

            // Check for overlap with player
            if (
                newRect.left < playerRect.right &&
                newRect.right > playerRect.left &&
                newRect.top < playerRect.bottom &&
                newRect.bottom > playerRect.top
            ) {
                collides = true;
            }

            // Check for overlap with friend
            if (
                newRect.left < friendRect.right &&
                newRect.right > friendRect.left &&
                newRect.top < friendRect.bottom &&
                newRect.bottom > friendRect.top
            ) {
                collides = true;
            }

            if (!collides) {
                const appEmojis = ["📚", "🎮", "🎵", "🗺️", "📷", "📝", "🕹️", "📺", "🧩", "🎨", "📡", "🧭", "🛒", "📦", "🗂️"];
                const wall = document.createElement("div");
                // After creating and appending each wall:
                wall.vx = (Math.random() - 0.5) * 2; // Random velocity X
                wall.vy = (Math.random() - 0.5) * 2; // Random velocity Y
                wall.style.opacity = "0.5";
                wall.fadeInProgress = true;
                wall.fadeValue = 0.5;
                wall.className = "wall";
                wall.style.left = `${left}px`;
                wall.style.top = `${top}px`;
                wall.style.width = `${width}px`;
                wall.style.height = `${height}px`;

                // Add a random app icon emoji
                const icon = document.createElement("span");
                icon.className = "icon";
                icon.textContent = appEmojis[Math.floor(Math.random() * appEmojis.length)];
                wall.appendChild(icon);

                ipadScreen.appendChild(wall);
                window.walls.push(wall);
                placed = true;
            }
            attempts++;
        }
    }
}

function collidesWithWall(x, y) {
    const playerSize = 40; // Match CSS

    const playerRect = {
    left: x,
    top: y,
    right: x + playerSize,
    bottom: y + playerSize
    };
    for (const wall of window.walls || []) {
    const wallLeft = parseInt(wall.style.left, 10);
    const wallTop = parseInt(wall.style.top, 10);
    const wallWidth = parseInt(wall.style.width, 10);
    const wallHeight = parseInt(wall.style.height, 10);
    const wallRect = {
        left: wallLeft,
        top: wallTop,
        right: wallLeft + wallWidth,
        bottom: wallTop + wallHeight
    };
    if (
        playerRect.left < wallRect.right &&
        playerRect.right > wallRect.left &&
        playerRect.top < wallRect.bottom &&
        playerRect.bottom > wallRect.top
    ) {
        return true;
    }
    }
    return false;
}

function showWinMessage() {
    // Remove any existing win message
    const oldWin = document.getElementById("winMessage");
    if (oldWin) oldWin.remove();

    const win = document.createElement("div");
    win.id = "winMessage";
    win.textContent = "You Win!";
    win.style.position = "fixed";
    win.style.left = "50%";
    win.style.top = "50%";
    win.style.transform = "translate(-50%, -50%)";
    win.style.background = "#28a745";
    win.style.color = "white";
    win.style.padding = "48px 96px";
    win.style.borderRadius = "16px";
    win.style.fontSize = "3rem";
    win.style.fontWeight = "bold";
    win.style.zIndex = "2000";
    win.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
    document.body.appendChild(win);
}


function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const friendRect = friend.getBoundingClientRect();

    if (
    playerRect.left < friendRect.right &&
    playerRect.right > friendRect.left &&
    playerRect.top < friendRect.bottom &&
    playerRect.bottom > friendRect.top
    ) {
    // Collision detected, reset game or handle as needed
    showWinMessage();
    }
}

function animateWalls() {
    const screenWidth = ipadScreen.clientWidth;
    const screenHeight = ipadScreen.clientHeight;
    for (const wall of window.walls || []) {
        let left = parseFloat(wall.style.left);
        let top = parseFloat(wall.style.top);
        let width = parseFloat(wall.style.width);
        let height = parseFloat(wall.style.height);

        // Move wall
        left += wall.vx;
        top += wall.vy;

        // Bounce off left/right
        if (left <= 0) {
            left = 0;
            wall.vx *= -1;
        }
        if (left + width >= screenWidth) {
            left = screenWidth - width;
            wall.vx *= -1;
        }
        // Bounce off top/bottom
        if (top <= 0) {
            top = 0;
            wall.vy *= -1;
        }
        if (top + height >= screenHeight) {
            top = screenHeight - height;
            wall.vy *= -1;
        }

        wall.style.left = `${left}px`;
        wall.style.top = `${top}px`;

         if (wall.fadeInProgress) {
            wall.fadeValue += 0.001; // Adjust speed here
            if (wall.fadeValue >= 1) {
                wall.fadeValue = 1;
                wall.fadeInProgress = false;
            }
            wall.style.opacity = wall.fadeValue;
        }
    }
    requestAnimationFrame(animateWalls);
}

// Start animation after walls are created
requestAnimationFrame(animateWalls);