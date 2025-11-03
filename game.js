let canvas;
let world;
let keyboard = new Keyboard();
let intervals = [];


function init() {
    document.getElementById('startHeadline').innerHTML = 'Dive into the Depths with Sharkie! 🦈';
}


window.addEventListener('DOMContentLoaded', () => {
    const clickableButtons = [
        '#startBtn',
        '#backToMenu',
        '#changingBtn',
        '.endScreenBtn',
        '#descriptionBtn',
        '#closeDescriptionBtn'
    ];

    clickableButtons.forEach(selector => {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('click', () => {
                playMenuSound('audio/volume-up.wav', 0.4);
            });
        });
    });
});



function startGame() {
    checkScreenScale();
    intervals.forEach(id => clearInterval(id));
    intervals = [];
    world = null;
    level1 = createLevel1();
    canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'flex';
    canvas.classList.add('active');
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    document.getElementById('descriptionBtn').style.display = 'none';
    world = new World(canvas, keyboard);
    playBackgroundMusik();
}

function checkScreenScale() {
    if (window.matchMedia("(max-height: 480px)")) {
        document.getElementById('gameHeadline').style.display = 'none';
    } return
}


function backToMenu() {
    init();
    canvas.style.display = 'none';
    canvas.classList.remove('active');
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    document.getElementById('backToMenu').style.display = 'none';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('excuseText').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'flex';
    document.getElementById('descriptionBtn').style.display = 'flex';
    document.getElementById('gameHeadline').style.display = 'flex';
}

function openDescription() {
    checkScreenScale();
    const description = document.getElementById('description');
    const startBtn = document.getElementById('startBtn');
    const startHeadline = document.getElementById('startHeadline');
    const descriptionBtn = document.getElementById('descriptionBtn');
    const infoTable = document.getElementById('infoTable');
    startBtn.style.display = 'none';
    startHeadline.style.display = 'none';
    descriptionBtn.style.display = 'none';
    description.style.display = 'flex';
    infoTable.scrollTop = 0;
    infoTable.innerHTML = `
        <p id="startText">
            Join Sharkie on an epic underwater adventure through vibrant coral caves and dark ocean trenches.
            Battle fierce jellyfish, sneaky pufferfish, and the mighty Endboss lurking in the deep.
            Swim, strike, and survive in this fast-paced, beautifully animated world where every bubble counts.
            Can you help Sharkie reclaim the seas?
        </p>

    
        <h2>Movement Overview</h2>
        <div class="info-row">
            <div class="info-text">
                <h3>Swim</h3>
                <p>Move Sharkie freely through the ocean using the arrow keys or WASD.</p>
            </div>
            <img src="img/6.Botones/Key/arrow keys.png" alt="Sharkie Swimming">
        </div>

        <div class="info-row">
            <div class="info-text">
                <h3>Attack</h3>
                <p>Press the spacebar to shoot bubbles and defeat enemies in your way.</p>
            </div>
            <img src="img/6.Botones/Key/Space Bar key.png" alt="Sharkie Attack">
        </div>

        <h2>Enemies Overview</h2>

        <div class="info-row">
            <div class="info-text">
                <h3>Puffer Fish</h3>
                <p>It looks cute, however, these spiky fish puff up when threatened. Stay away or attack from distance!</p>
            </div>
            <img src="img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png" alt="Puffer Fish">
        </div>

        <div class="info-row">
            <div class="info-text">
                <h3>Jelly Fish Lila</h3>
                <p>They float up and down gracefully but can electrocute Sharkie on contact.
                It is the yellow-purple form of the jellyfish and is considered a normal jellyfish, it is more common</p>
            </div>
            <img src="img/2.Enemy/2 Jelly fish/Regular damage/Lila 1.png" alt="Jelly Fish">
        </div>

        <div class="info-row">
            <div class="info-text">
                <h3>Jelly Fish Yellow</h3>
                <p>They also can electrocute Sharkie on contact but float up and down significantly faster, which makes it so dangerous.
                It should not be underestimated.</p>
            </div>
            <img src="img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png" alt="Jelly Fish">
        </div>

        <div class="info-row">
            <div class="info-text">
                <h3>Jelly Fish Green</h3>
                <p>It's the most dangerous of all sea creatures.
                One sting from here and you'll die instantly! But fortunately it is less common</p>
            </div>
            <img src="img/2.Enemy/2 Jelly fish/Súper dangerous/Green 1.png" alt="Jelly Fish">
        </div>

        <div class="info-row">
            <div class="info-text">
                <h3>Endboss</h3>
                <p>The mighty ruler of the deep sea. Beware its massive size and deadly attacks!</p>
            </div>
            <img src="img/2.Enemy/3 Final Enemy/2.floating/5.png" alt="Endboss">
        </div>
    
    `;
}

function closeDescription() {
    const description = document.getElementById('description');
    const startBtn = document.getElementById('startBtn');
    const startHeadline = document.getElementById('startHeadline');
    const descriptionBtn = document.getElementById('descriptionBtn');
    const infoTable = document.getElementById('infoTable');
    const gameHeadline = document.getElementById('gameHeadline');
    description.style.display = 'none';
    infoTable.innerHTML = '';
    startBtn.style.display = 'flex';
    startHeadline.style.display = 'flex';
    descriptionBtn.style.display = 'flex';
    gameHeadline.style.display = 'flex';
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
    document.getElementById('excuseText').style.display = 'flex';
    document.getElementById('backToMenu').style.display = 'flex';
    document.getElementById('excuseText').innerHTML = 'Unfortunately, no further levels exist yet, as the game is currently in alpha. However, you can replay the same level.';
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

function playMenuSound(path, volume) {
    let sound = new Audio(path);
    sound.volume = volume;
    sound.play();
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
