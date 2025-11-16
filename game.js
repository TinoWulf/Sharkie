let canvas;
let world;
let keyboard = new Keyboard();
let intervals = [];
let globalMuted = false;


function init() {
    document.getElementById('startHeadline').innerHTML = 'Dive into the Depths with Sharkie! 🦈';
}


window.addEventListener('DOMContentLoaded', () => {
    const clickableButtons = ['#startBtn', '#backToMenu', '#changingBtn', '.endScreenBtn', '#descriptionBtn', '#closeDescriptionBtn', '#impressumBtn'];

    clickableButtons.forEach(selector => {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('click', () => {
                playMenuSound('audio/volume-up.wav', 0.4);
            });
        });
    });
});


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


const storedMute = localStorage.getItem('globalMuted');
if (storedMute !== null) {
    globalMuted = storedMute === 'true';
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("menuMuteBtn").innerHTML = globalMuted ? "🔇" : "🔊";
});


window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation);


function checkOrientation() {
    const rotateOverlay = document.getElementById("rotateDevice"); // Overlay element
    if (window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(max-height: 480px)").matches) { // Only for small screens
        if (window.innerHeight > window.innerWidth) { // Portrait mode
            rotateOverlay.style.display = "flex"; // Show overlay
            if (canvas) canvas.style.display = "none"; // Hide canvas
            document.getElementById('touch-controls').style.display = 'none'; // Hide touch controls
        } else {
            rotateOverlay.style.display = "none";
            if (canvas) canvas.style.display = "flex";
            if (world) document.getElementById('touch-controls').style.display = 'flex';
        }
    }
}


window.addEventListener('load', checkOrientation);


function loadImpressum() {
    const impressumDiv = document.getElementById('impressum');
    const impressumBtn = document.getElementById('impressumBtn');
    if (impressumDiv.style.display === 'none') {
        showImpressum(impressumBtn, impressumDiv);
    } else {
        hideImpressum(impressumBtn, impressumDiv);
    }
    impressumDiv.innerHTML = loadImpressumHtml();
}


function showImpressum(impressumBtn, impressumDiv) {
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('descriptionBtn').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'none';
    document.getElementById('gameHeadline').style.display = 'none';
    impressumDiv.style.display = 'flex';
    impressumBtn.innerText = 'Close Impressum';
}


function hideImpressum(impressumBtn, impressumDiv) {
    impressumDiv.style.display = 'none';
    impressumBtn.innerText = 'Impressum';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('descriptionBtn').style.display = 'flex';
    document.getElementById('startHeadline').style.display = 'flex';
    document.getElementById('gameHeadline').style.display = 'flex';
}


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
    hideMenuElements();
    world = new World(canvas, keyboard);
    world.isMuted = globalMuted;
    syncWorldAudio();
    world.statusBar.find(s => s.type === "volume").setMuted(globalMuted);
    playBackgroundMusic();
}


function hideMenuElements() {
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    document.getElementById('descriptionBtn').style.display = 'none';
    document.getElementById('impressumBtn').style.display = 'none';
    document.getElementById('menuMuteBtn').style.display = 'none';
}


function checkScreenScale() {
    if (window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(max-height: 480px)").matches) {
        document.getElementById('gameHeadline').style.display = 'none';
        document.getElementById('touch-controls').style.display = 'flex';
        bindTouchControls();
    } else {
        document.getElementById('touch-controls').style.display = 'none';
    }
}


function backToMenu() {
    init();
    canvas.style.display = 'none';
    canvas.classList.remove('active');
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    document.getElementById('backToMenu').style.display = 'none';
    document.getElementById('touch-controls').style.display = 'none';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('excuseText').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'flex';
    document.getElementById('descriptionBtn').style.display = 'flex';
    document.getElementById('gameHeadline').style.display = 'flex';
    document.getElementById('impressumBtn').style.display = 'flex';
    document.getElementById('menuMuteBtn').style.display = 'flex';
    document.getElementById('menuMuteBtn').innerHTML = globalMuted ? "🔇" : "🔊";
}


function openDescription() {
    checkScreenScale();
    document.getElementById('description').style.display = 'flex';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('impressumBtn').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'none';
    document.getElementById('descriptionBtn').style.display = 'none';
    document.getElementById('touch-controls').style.display = 'none';
    document.getElementById('startBtn').style.display = 'none';
    const infoTable = document.getElementById('infoTable');
    infoTable.scrollTop = 0;
    infoTable.innerHTML = loadInfoTableHtml();
}


function closeDescription() {
    document.getElementById('impressumBtn').style.display = 'flex';
    document.getElementById('description').style.display = 'none';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('startHeadline').style.display = 'flex';
    document.getElementById('descriptionBtn').style.display = 'flex';
    document.getElementById('gameHeadline').style.display = 'flex';
    document.getElementById('infoTable').innerHTML = '';
}


function endGame(output) {
    setTimeout(() => {
        if (output === 'lose') {
            showGameIsLost();
        }
        if (output === 'win') {
            showGameIsWon();
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


function showGameIsLost() {
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


function showGameIsWon() {
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


function nextGame() {
    canvas.style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('touch-controls').style.display = 'none';
    document.getElementById('excuseText').style.display = 'flex';
    document.getElementById('backToMenu').style.display = 'flex';
    document.getElementById('excuseText').innerHTML = 'Unfortunately, no further levels exist yet, as the game is currently in alpha. However, you can replay the same level.';
}


function setStoppableIntervals(fn, time) {
    let id = setInterval(fn, time);
    intervals.push(id);
}


function initIntervals(world) {
    setStoppableIntervals(() => world.character.moveCharacter(), 1000 / 60);
    setStoppableIntervals(() => world.character.animate(), 100);
    if (world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            if (typeof enemy.animate === 'function') {
                setStoppableIntervals(() => enemy.animate(), 1000 / 6);
            }
        });
    }
    setStoppableIntervals(() => world.run(), 1000 / 60);
}


function playBackgroundMusic() {
    const bgMusic = new Audio('audio/Game-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.1;
    if (world.isMuted) {
        bgMusic.muted = true;
    }
    bgMusic.play();
    world.backgroundMusic = bgMusic;
    window.world = world;
    playEndbossMusic();
}


function playEndbossMusic() {
    const bossMusic = new Audio('audio/game-music-endboss.mp3');
    bossMusic.loop = true;
    bossMusic.volume = 0.5;
    if (world.isMuted) {
        bossMusic.muted = true;
    }
    world.bossMusic = bossMusic;
    world.bossMusicStarted = false;
}


function playMenuSound(path, volume) {
    if (globalMuted) return;
    let sound = new Audio(path);
    sound.volume = volume;
    sound.muted = globalMuted;
    sound.play();
}


function toggleMuteFromMenu() {
    globalMuted = !globalMuted;
    localStorage.setItem('globalMuted', globalMuted);
    document.getElementById("menuMuteBtn").innerHTML = globalMuted ? "🔇" : "🔊";
    if (window.world) {
        world.isMuted = globalMuted;
        syncWorldAudio();
        world.statusBar.find(s => s.type === "volume").setMuted(globalMuted);
    }
}


function syncWorldAudio() {
    if (!world) return;
    const mute = world.isMuted;
    if (world.backgroundMusic) world.backgroundMusic.muted = mute;
    if (world.bossMusic) world.bossMusic.muted = mute;
    document.querySelectorAll("audio").forEach(a => a.muted = mute);
}



function bindTouchControls() {
    const touchControls = createTouchControls();
    touchControls.forEach(m => {
        const el = document.getElementById(m.id);
        if (!el) return;
        el.addEventListener('mousedown', m.down);
        el.addEventListener('mouseup', m.up);
        el.addEventListener('mouseleave', m.up);
        el.addEventListener('touchstart', (e) => { e.preventDefault(); m.down(); }, { passive: false });
        el.addEventListener('touchend', (e) => { e.preventDefault(); m.up(); }, { passive: false });
    });
}


function createTouchControls() {
    return [
        { id: 'leftBtn', down: () => keyboard.LEFT = true, up: () => keyboard.LEFT = false },
        { id: 'rightBtn', down: () => keyboard.RIGHT = true, up: () => keyboard.RIGHT = false },
        { id: 'upBtn', down: () => keyboard.UP = true, up: () => keyboard.UP = false },
        { id: 'downBtn', down: () => keyboard.DOWN = true, up: () => keyboard.DOWN = false },
        { id: 'shootBtn', down: () => keyboard.SPACE = true, up: () => keyboard.SPACE = false },
    ]
}


function loadImpressumHtml() {
    return `
    <h1>Impressum</h1><h3>Allgemeine Angaben</h3><p><b>Internet:</b> <a href="https://tino-wulf.developerakademie.net/Sharkie/Sharkie/index.html" target="_blank">https://tino-wulf.developerakademie.net/Sharkie/Sharkie/index.html</a></p>
    <p><b>Name des Diensteanbieters:</b> Developer Akademie Einzelunternehmen</p>
    <p><b>Vertreten durch:</b> Manuel Thaler, Junus Ergin </p>
    <h3>Anschrift und Kontakt</h3><p> Tassiloplatz 25</p>
    <p>81541 München</p>
    <p><b>Telefon: <a href="tel:016002000730">016002000730</a></p>
    <p><b>Email: <a href="mailto:info@developerakademie.com">info@developerakademie.com</a></p>
    <p>Erstellt von <a href="https://impressum-generator.info/" target="_blank">impressum-generator.info</a></p>`
}


function loadInfoTableHtml() {
    return `
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

        <h2>Items Overview</h2>
        <div class="info-row">
            <div class="info-text">
                <h3>Coin</h3>
                <p>Collect coins to buy advantages for the next level after the game.</p>
            </div>
            <img src="img/4. Marcadores/green/100_ copia 6.png" alt="Coin">
        </div>

        <div class="info-row">
            <div class="info-text">
                <h3>Health</h3>
                <p>Collect health to restore Sharkie's vitality and survive longer in the ocean.</p>
            </div>
            <img src="img/4. Marcadores/green/100_  copia 3.png" alt="Coin">
        </div>

        <div class="info-row">
            <div class="info-text">
                <h3>Poison</h3>
                <p>It's important to collect poison, because in the end it grants you a damage advantage.</p>
            </div>
            <img src="img/4. Marcadores/green/100_ copia 5.png" alt="Coin">
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
            <img src="img/2.Enemy/3 Final Enemy/2.Floating/5.png" alt="Endboss">
        </div>
    
    `
}

