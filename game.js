let canvas;
let world;
let keyboard = new Keyboard();
let intervals = [];

function init() {
    document.getElementById('startHeadline').innerHTML = 'Dive into the Depths with Sharkie! 🦈';
    document.getElementById('startText').innerHTML = 'Join Sharkie on an epic underwater adventure through vibrant coral caves and dark ocean trenches. Battle fierce jellyfish, sneaky pufferfish, and the mighty Endboss lurking in the deep. Swim, strike, and survive in this fast-paced, beautifully animated world where every bubble counts. Can you help Sharkie reclaim the seas?';
}


function startGame() {
    intervals.forEach(id => clearInterval(id));
    intervals = [];
    world = null;
    level1 = createLevel1();
    canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'flex';
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'none';
    document.getElementById('startText').style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    world = new World(canvas, keyboard);
    playBackgroundMusik();
}


function backToMenu() {
    init();
    canvas.style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    document.getElementById('backToMenu').style.display = 'none';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('startText').style.display = 'flex';
    document.getElementById('startHeadline').style.display = 'flex';
}


function endGame(output) {
    setTimeout(() => {
        if (output === 'lose') {
            document.getElementById('endScreen').style.display = 'flex';
            document.getElementById('endScreenBtns').style.display = 'flex';
            document.getElementById('endScreenImg').src = 'img/6.Botones/Tittles/Game Over/Recurso 9.png';
            document.getElementById('changingBtn').onclick = startGame;
            document.getElementById('changingBtn').innerHTML = 'Try Again';
            intervals.forEach(id => clearInterval(id));
            intervals = [];
            initIntervals(world);
            world.playSound('audio/lose.wav', 0.4);
        }

        if (output === 'win') {
            document.getElementById('endScreen').style.display = 'flex';
            document.getElementById('endScreenBtns').style.display = 'flex';
            document.getElementById('endScreenImg').src = 'img/6.Botones/Tittles/You win/Recurso 22.png';
            document.getElementById('changingBtn').onclick = nextGame;
            document.getElementById('changingBtn').innerHTML = 'Next Level';
            intervals.forEach(id => clearInterval(id));
            intervals = [];
            initIntervals(world);
            world.playSound('audio/win.wav', 0.4);
            world.playSound('audio/cheering.wav', 0.4);
        }

        if (world && world.backgroundMusic) {
            world.backgroundMusic.pause();
            world.backgroundMusic.currentTime = 0;
        }

        if (world && world.bossMusic) {
            world.bossMusic.pause();
        }
    }, 1000);
}


function nextGame() {
    canvas.style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('startText').style.display = 'flex';
    document.getElementById('backToMenu').style.display = 'flex';
    document.getElementById('startText').innerHTML = 'Unfortunately, no further levels exist yet, as the game is currently in alpha. However, you can replay the same level.';
}


function setStoppableIntervals(fn, time) {
    let id = setInterval(fn, time);
    intervals.push(id);
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

function playBackgroundMusik() {
    const bgMusic = new Audio('audio/Game-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.1;
    if (world.isMuted) {
        bgMusic.muted = true;
    }
    bgMusic.play();
    world.backgroundMusic = bgMusic;
    window.world = world;
    const bossMusic = new Audio('audio/game-music-endboss.mp3');
    bossMusic.loop = true;
    bossMusic.volume = 0.5;
    world.bossMusic = bossMusic;
    world.bossMusicStarted = false;
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
