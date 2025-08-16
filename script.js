let start = false; 
const ipadScreen = document.getElementById("ipadScreen");
let level = 0; 

const player = document.getElementById("player");
const friend = document.getElementById("friend");

let playerX = 100;
let playerY = 100;

let hideDistractionTime = 2000;
let distractionInterval = 10000;
let emojiIndex = 0;

let text_options_index = 0;
let textOptions = [
    "98% of Americans now own a smartphone",
    "9 in 10 teens use Youtube",
    "73% of teens report using Youtube daily",
    "1/3 of teens report using social media almost constantly",
    "46% of teens report using the internet almost constantly",
    "4 in 10 adults report using the internet almost constantly",
    "48% of teens report social media as negatively affecting people their age"
];

shuffleArray(textOptions);

    const appEmojis = ["📞", "💬", "🎵", "📍","🗺️", "⏰", "📷", "📝", "📚", "🎮", "📆", "🚕", "🌤️", "✉️", "🕑", "🔊","💳"];


function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getIpadRect() {
    return ipadScreen.getBoundingClientRect();
}

// Get the welcome screen and start button elements
const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('startButton');



// Add a click event listener to the start button
startButton.addEventListener('click', () => {
  // Use a smooth fade-out transition
  welcomeScreen.style.opacity = '0';
  start = true;
  player.style.opacity= 1;
  friend.style.opacity= 1;

  for (const wall of window.walls || []) {
        wall.style.opacity = 1;
    }

  // Hide the element completely after the transition ends
  setTimeout(() => {
    welcomeScreen.style.display = 'none';
  }, 500); // This duration should match the CSS transition time
});



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
createRandomWalls(2); // Add 5 random walls
for (const wall of window.walls || []) {
    wall.style.opacity = .3;
}
let isAlertActive = false;
let distractionTimeout;



function showDistractionModal() {
    if (!isAlertActive & start) {
        document.getElementById("distractionModal").style.display = "block";
        isAlertActive = true;

        


        document.getElementById("notification-text").textContent = textOptions[text_options_index];
        text_options_index = (text_options_index + 1) % textOptions.length;
        console.log(text_options_index)
        // Hide after 0.5 seconds
        setTimeout(hideDistractionModal, hideDistractionTime);


    }
}

function hideDistractionModal() {
  const modal = document.getElementById("distractionModal");
  modal.classList.add('slideOut'); // Start the animation

  // Use a one-time event listener to wait for the animation to complete
  modal.addEventListener('animationend', handleAnimationEnd, { once: true });
}

function handleAnimationEnd() {
  const modal = document.getElementById("distractionModal");
  modal.style.display = "none"; // Hide the modal after the animation is finished
  modal.classList.remove('slideOut'); // Clean up the class for next use

  isAlertActive = false;
  // Show again after random 1-3 seconds
  distractionTimeout = setTimeout(showDistractionModal, distractionInterval);
}

// Start the first timeout (random 1-3 seconds)
distractionTimeout = setTimeout(showDistractionModal, distractionInterval);

// Movement with Arrow Keys
// document.addEventListener("keydown", (e) => {
//     if (isAlertActive || !start) return; // Prevent movement when modal is active

//     let newX = playerX;
//     let newY = playerY;
//     switch (e.key) {
//         case "ArrowUp":
//             newY -= 10;
//         break;

//         case "ArrowDown":
//             newY += 10;
//         break;
//         case "ArrowLeft":
//         newX -= 10;
//         break;
//         case "ArrowRight":
//         newX += 10;
//         break;
//     }

//     // Clamp to screen boundaries
//     const maxX = window.innerWidth - 50;
//     const maxY = window.innerHeight - 50;
//     newX = Math.max(0, Math.min(maxX, newX));
//     newY = Math.max(0, Math.min(maxY, newY));

//     // Only move if not colliding with a wall
//     if (!collidesWithWall(newX, newY)) {
//     playerX = newX;
//     playerY = newY;
//     updatePlayerPosition();
//     checkCollision();
//     }
// });

let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function playerMovement() {
    // Calculate the new potential position
    

    let newX = playerX;
    let newY = playerY;

    if (!isAlertActive && start){
        if (keys['ArrowUp']  ) {
        newY -= 3;
        }
        if (keys['ArrowDown'] ) {
            newY += 3;
        }
        if (keys['ArrowLeft']  ) {
            newX -= 3;
        }
        if (keys['ArrowRight']  ) {
            newX += 3;
        }

        // Clamp the new potential position to screen boundaries
        const screenWidth = ipadScreen.clientWidth -50;
        const screenHeight = ipadScreen.clientHeight -50;
        newX = Math.max(0, Math.min(screenWidth, newX));
        newY = Math.max(0, Math.min(screenHeight, newY));
    }



    // Only update player's actual position if the new position is valid
    if (!collidesWithWall(newX, newY)) {
        playerX = newX;
        playerY = newY;
    }
    
    // Call your existing functions to update the player's position on screen
    updatePlayerPosition();
    checkCollision();

    // Request the next animation frame to continue the loop
    requestAnimationFrame(playerMovement);
}

// Start the game loop
requestAnimationFrame(playerMovement);


function createRandomWalls(numWalls = 5) {
    for (const wall of window.walls || []) {
        wall.remove();
    }

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
                const wall = document.createElement("div");
                // After creating and appending each wall:
                wall.vx = (Math.random() - 0.5) * 2; // Random velocity X
                wall.vy = (Math.random() - 0.5) * 2; // Random velocity Y

                wall.className = "wall";
                wall.style.left = `${left}px`;
                wall.style.top = `${top}px`;
                wall.style.width = `${width}px`;
                wall.style.height = `${height}px`;
                wall.style.zIndex = "1000";
                wall.style.opacity = 1;

                // Add a random app icon emoji
                const icon = document.createElement("span");
                icon.className = "icon";
                // console.log(emojiIndex)
                icon.textContent = appEmojis[emojiIndex];
                wall.appendChild(icon);
                emojiIndex = (emojiIndex + 1) % appEmojis.length;

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
     for (const wall of window.walls || []) {
        wall.style.opacity = ".1";
    }

    start = false;

    player.style.opacity = "0.1";
    friend.style.opacity = "0.1";


    const winMessage = document.getElementById("winMessage");
    winMessage.style.display = "block";
    winMessage.style.opacity = "1";
     winMessage.style.zIndex = "2300";

}



// Variable to hold the timer ID so we can cancel it
let timer = null; 

// Variable to track if a collision has happened on this level
let collisionOccurred = false;

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
        collisionOccurred = true;

        if (level == 0){
            placePlayer();
            placeFriend();
            createRandomWalls(10);
            hideDistractionTime = 2000;
            distractionInterval = Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000;
            collisionOccurred = false;
        }
        else if (level ==1){
            collisionOccurred = false;
            placePlayer();
            placeFriend();
            createRandomWalls(20);
            hideDistractionTime = 2000;
            distractionInterval = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
            collisionOccurred = false;


        }
        else if (level ==2){
            startTimer();
            placePlayer();
            placeFriend();
            createRandomWalls(40);
            hideDistractionTime = 2000;
            distractionInterval = Math.floor(Math.random() * (4000 - 1500 + 1)) + 1500;
            collisionOccurred = false;

        }
        else if (level ==3){
            startTimer();
            showWinMessage();
        }

        level += 1;

    
    }
}

function startTimer() {
    // Reset the collision flag for this new level
    
    timer = setTimeout(() => {
        // If the collision flag is still false after 60 seconds, refresh
        if (!collisionOccurred) {
            document.getElementById("end-heading").textContent = 'Oh no, too slow!';
            document.getElementById("end-text").textContent = 'You failed to escape the digital world.';
            showWinMessage();
        }
    }, 45000); 
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
        if (start){
            left += wall.vx;
            top += wall.vy;
        }

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

        
    }
    requestAnimationFrame(animateWalls);
}

// Start animation after walls are created
requestAnimationFrame(animateWalls);