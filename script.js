// PART 1: switch between screens
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');

  screens.forEach(function (screen) {
    screen.classList.remove('active');
  });

  document.getElementById(screenId).classList.add('active');
}

// PART 2: the game's memory
const game = {
  currentLevel: 1,
  score: 0
};

// PART 3: start a level
function startLevel(levelNumber) {
  game.currentLevel = levelNumber;
  game.score = 0;

  document.getElementById('game-area').innerHTML =
    '<p>Level ' + levelNumber + ' started!</p>';

  showScreen('game-screen');
}
