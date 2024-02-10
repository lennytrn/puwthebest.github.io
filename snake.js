const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const scoreTable = document.getElementById("scoreTable");
const scoreList = document.getElementById("scoreList");
const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');

const tileSize = 20;
const canvasSize = 400;
let snake = [{ x: 10, y: 10 }];
let direction = "right"; // Direction initiale
let nextDirection = "right"; // Prochaine direction (mise à jour lors des changements)
let food = { x: 15, y: 15 };
let isPlaying = false;
let score = 0;
let framesPerSecond = 5; // Vitesse par défaut
const topScores = [];

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Dessiner le serpent
  ctx.fillStyle = "#00F";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
  });

  // Dessiner la nourriture
  ctx.fillStyle = "#F00";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function update() {
  const head = { ...snake[0] };

  // Mise à jour de la position de la tête du serpent en fonction de la direction
  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  // Vérifier les collisions avec les murs ou avec lui-même
  if (
    head.x < 0 ||
    head.x >= canvasSize / tileSize ||
    head.y < 0 ||
    head.y >= canvasSize / tileSize ||
    isCollidingWithItself(head)
  ) {
    endGame();
    return;
  }

  // Vérifier si le serpent mange la nourriture
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
  } else {
    // Retirer la queue s'il n'y a pas de nourriture mangée
    snake.pop();
  }

  // Mettre à jour le serpent avec la nouvelle tête
  snake.unshift(head);

  // Dessiner l'état mis à jour
  draw();
}

function isCollidingWithItself(head) {
  // Vérifier la collision avec le corps du serpent à l'exception de la tête
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / tileSize)),
    y: Math.floor(Math.random() * (canvasSize / tileSize)),
  };

  // S'assurer que la nourriture n'est pas générée sur le serpent
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * (canvasSize / tileSize)),
      y: Math.floor(Math.random() * (canvasSize / tileSize)),
    };
  }
}

function startGame() {
  if (!isPlaying) {
    isPlaying = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    snake = [{ x: 10, y: 10 }]; // Réinitialiser le serpent
    generateFood();

    // Boucle de jeu
    function gameLoop() {
      direction = nextDirection; // Mettre à jour la direction actuelle
      update();
      if (isPlaying) {
        setTimeout(() => requestAnimationFrame(gameLoop), 1000 / framesPerSecond);
      }
    }

    gameLoop();
  }
}

function endGame() {
  isPlaying = false;
  alert(score === canvasSize / tileSize ** 2 ? 'You won!' : `Game Over! Your score is ${score}`);
  updateScoreTable();
}

function updateScoreTable() {
  if (topScores.length < 10 || score > topScores[9]) {
    // Ajouter le score actuel à la liste
    topScores.push(score);

    // Trier les scores par ordre décroissant
    topScores.sort((a, b) => b - a);

    // Conserver uniquement les 10 meilleurs scores
    topScores.splice(10);

    // Mettre à jour les scores affichés
    displayScores();
  }
}

function displayScores() {
  // Effacer les scores précédents
  scoreList.innerHTML = "";

  // Afficher les 10 meilleurs scores dans le tableau
  topScores.forEach((topScore, index) => {
    const row = document.createElement("tr");
    const rankCell = document.createElement("td");
    const scoreCell = document.createElement("td");

    rankCell.textContent = index + 1;
    scoreCell.textContent = topScore;

    row.appendChild(rankCell);
    row.appendChild(scoreCell);

    scoreList.appendChild(row);
  });
}

function setDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy':
      framesPerSecond = 5;
      break;
    case 'medium':
      framesPerSecond = 7.5;
      break;
    case 'hard':
      framesPerSecond = 10;
      break;
  }

  // Si le jeu est en cours, redémarrer avec la nouvelle difficulté
  if (isPlaying) {
    endGame();
    startGame();
  }
}

// Événement pour les contrôles clavier
let keyDownFlag = false;

document.addEventListener("keydown", (event) => {
  if (!isPlaying && !keyDownFlag) {
    keyDownFlag = true;
    startGame();
  }

  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") nextDirection = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") nextDirection = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") nextDirection = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") nextDirection = "right";
      break;
  }
});

document.addEventListener("keyup", () => {
  keyDownFlag = false;
});

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Dessiner le serpent
  snake.forEach(segment => {
    // Dessiner le corps du serpent avec bordures
    ctx.fillStyle = "#00F";
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    ctx.strokeStyle = "#FFF"; // Couleur de la bordure
    ctx.strokeRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
  });

  // Dessiner la nourriture
  ctx.fillStyle = "#F00";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
  ctx.strokeStyle = "#FFF"; // Couleur de la bordure pour la nourriture
  ctx.strokeRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// Dessin initial
draw();

