// PART 1: switch between screens

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

window.showScreen = function(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.add("active");
    }
};

let samples = 0;

function collectSample() {
    if (samples < 3) {
        samples++;
    }

    document.getElementById("sample-count").textContent =
        "Samples collected: " + samples + " / 3";

    if (samples === 3) {
        document.getElementById("mission-status").textContent =
            "MISSION COMPLETE! You collected all 3 samples!";

        document.getElementById("mission-status").style.color =
            "#00ff99";
    }
}