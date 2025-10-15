let canvas;
let world;
let keyboard = new Keyboard();
let intervals = [];


function startGame() {
    intervals.forEach(id => clearInterval(id));
    intervals = [];
    world = null;
    level1 = createLevel1(); // <-- das kommt gleich
    canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'flex';
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('startText').style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    world = new World(canvas, keyboard);
}


function setStoppableIntervals(fn, time) {
    let id = setInterval(fn, time);
    intervals.push(id);
}

function endGame() {
    setTimeout(() => {
                document.getElementById('endScreen').style.display = 'flex';
                document.getElementById('endScreenBtns').style.display = 'flex';
                intervals.forEach(id => clearInterval(id));
                intervals = [];
                initIntervals(world);
                }, 2000);

}

function initIntervals(world) {
    // Character Bewegung und Animation
    setStoppableIntervals(() => world.character.moveCharacter(), 1000 / 60);
    setStoppableIntervals(() => world.character.animate(), 100);

    // Gegner-Animationen (z.B. Endboss, PufferFish)
    if (world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            if (typeof enemy.animate === 'function') {
                setStoppableIntervals(() => enemy.animate(), 1000 / 6);
            }
        });
    }

    // Weitere Intervalle nach Bedarf (z.B. für World-Methoden)
    setStoppableIntervals(() => world.run(), 1000 / 60);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (e.key === "ArrowLeft") {
        keyboard.LEFT = true;
    }
    if (e.key === "ArrowUp") {
        keyboard.UP = true;
    }
    if (e.key === "ArrowDown") {
        keyboard.DOWN = true;
    }
    if (e.key === " ") {
        keyboard.SPACE = true;
    }
    if (e.key === "d") {
        keyboard.D = true;
    }
    if (e.key === "w") {
        keyboard.W = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") {
        keyboard.RIGHT = false;
    }
    if (e.key === "ArrowLeft") {
        keyboard.LEFT = false;
    }
    if (e.key === "ArrowUp") {
        keyboard.UP = false;
    }
    if (e.key === "ArrowDown") {
        keyboard.DOWN = false;
    }
    if (e.key === " ") {
        keyboard.SPACE = false;
    }
    if (e.key === "d") {
        keyboard.D = false;
    }
    if (e.key === "w") {
        keyboard.W = false;
    }
});
