// Use the provided image as the character
const characterImgSrc = "image1"; // The uploaded image should be saved as 'image1' in the project directory.
const bugImgSrc = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Giant_water_bug.png"; // Open-license example bug image

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let characterImg = new Image();
characterImg.src = characterImgSrc;

let bugImg = new Image();
bugImg.src = bugImgSrc;

const characterWidth = 80;
const characterHeight = 120;
let characterX = canvas.width / 2 - characterWidth / 2;
const characterY = canvas.height - characterHeight - 10;

const bugWidth = 50;
const bugHeight = 50;

let bugs = [];
let score = 0;

function spawnBug() {
  const x = Math.random() * (canvas.width - bugWidth);
  bugs.push({ x, y: -bugHeight, squashed: false });
}

function drawCharacter() {
  ctx.drawImage(characterImg, characterX, characterY, characterWidth, characterHeight);
}

function drawBugs() {
  for (let bug of bugs) {
    if (!bug.squashed) {
      ctx.drawImage(bugImg, bug.x, bug.y, bugWidth, bugHeight);
    }
  }
}

function updateBugs() {
  for (let bug of bugs) {
    if (!bug.squashed) {
      bug.y += 2;

      // Check for collision
      if (
        bug.y + bugHeight > characterY &&
        bug.x + bugWidth > characterX &&
        bug.x < characterX + characterWidth &&
        bug.y < characterY + characterHeight
      ) {
        bug.squashed = true;
        score++;
        scoreEl.textContent = score;
      }
    }
  }
  // Remove bugs that are out of the screen or squashed
  bugs = bugs.filter(bug => bug.y < canvas.height && !bug.squashed);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clearCanvas();
  drawCharacter();
  drawBugs();
}

function gameLoop() {
  updateBugs();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  characterX = e.clientX - rect.left - characterWidth / 2;
  if (characterX < 0) characterX = 0;
  if (characterX > canvas.width - characterWidth) characterX = canvas.width - characterWidth;
});

// Touch support
canvas.addEventListener('touchmove', function (e) {
  if (e.touches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    characterX = e.touches[0].clientX - rect.left - characterWidth / 2;
    if (characterX < 0) characterX = 0;
    if (characterX > canvas.width - characterWidth) characterX = canvas.width - characterWidth;
  }
}, { passive: false });

window.onload = function() {
  // Start game when both images are loaded
  let loaded = 0;
  characterImg.onload = bugImg.onload = function() {
    loaded++;
    if (loaded === 2) {
      setInterval(spawnBug, 1000);
      gameLoop();
    }
  }
};