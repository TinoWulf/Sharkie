let canvas;            // Reference to the game canvas
let world;             // World instance for the running game
let keyboard = new Keyboard(); // Keyboard input handler
let intervals = [];    // Stores intervals to stop them later
let globalMuted = false; // Global mute state (used across menu + game)


/**
 * Initializes the start screen headline text.
 * Called when the menu loads or when returning to the menu.
 */
function init() { // Set start headline text
    document.getElementById('startHeadline').innerHTML = 'Dive into the Depths with Sharkie! 🦈'; // Set title text
}


/**
 * Adds click sound to all menu buttons.
 * Runs once when DOM is fully loaded.
 */
window.addEventListener('DOMContentLoaded', () => { // Add click sound listeners
    const clickableButtons = ['#startBtn', '#backToMenu', '#changingBtn', '.endScreenBtn', '#descriptionBtn', '#closeDescriptionBtn', '#impressumBtn']; // List of button selectors

    clickableButtons.forEach(selector => { // Loop over each selector
        document.querySelectorAll(selector).forEach(btn => { // Find all matching buttons
            btn.addEventListener('click', () => { // Play sound on click
                playMenuSound('audio/volume-up.wav', 0.4); // Play menu sound
            });
        });
    });
});


/**
 * Handles keyboard key down events.
 * Sets direction and action flags on the keyboard object.
 */
window.addEventListener("keydown", (e) => { // Listen for keydown events
    if (e.key === "ArrowRight") keyboard.RIGHT = true; // Move right
    if (e.key === "ArrowLeft") keyboard.LEFT = true;  // Move left
    if (e.key === "ArrowUp") keyboard.UP = true;      // Move up
    if (e.key === "ArrowDown") keyboard.DOWN = true;  // Move down
    if (e.key === " ") keyboard.SPACE = true;         // Attack / shoot
    if (e.key === "d") keyboard.D = true;             // Extra control
    if (e.key === "w") keyboard.W = true;             // Extra control
});


/**
 * Handles keyboard key up events.
 * Resets the key states when the user releases a key.
 */
window.addEventListener("keyup", (e) => { // Listen for keyup events
    if (e.key === "ArrowRight") keyboard.RIGHT = false; // Stop right movement
    if (e.key === "ArrowLeft") keyboard.LEFT = false;   // Stop left movement
    if (e.key === "ArrowUp") keyboard.UP = false;       // Stop up movement
    if (e.key === "ArrowDown") keyboard.DOWN = false;   // Stop down movement
    if (e.key === " ") keyboard.SPACE = false;          // Stop shooting
    if (e.key === "d") keyboard.D = false;              // Release D
    if (e.key === "w") keyboard.W = false;              // Release W
});


/**
 * Loads and applies the saved mute state from localStorage.
 * Ensures mute state persists after reloading the page.
 */
const storedMute = localStorage.getItem('globalMuted'); // Get stored mute value
if (storedMute !== null) { // If value exists
    globalMuted = storedMute === 'true'; // Convert back to boolean
}


/**
 * Updates the mute icon in the menu after the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => { // Update menu mute icon
    document.getElementById("menuMuteBtn").innerHTML = globalMuted ? "🔇" : "🔊"; // Set mute icon
});


window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);


/**
 * Enhanced orientation + device-type handling.
 * Smartphones must rotate to landscape,
 * Tablets may remain in portrait and still play,
 * Touch controls enabled on both when world exists.
 */
function checkOrientation() {
    const { rotateOverlay, touchControls, canvas, inMenu, isPhone, isTablet, isTouchDevice, portrait } = getOrientationState();
    if (inMenu) {
        rotateOverlay.style.display = "none"; touchControls.style.display = "none";
        return;
    }
    if (isTouchDevice && isPhone && portrait) {
        rotateOverlay.style.display = "flex"; touchControls.style.display = "none"; canvas.style.display = "none";
        return;
    }
    if (isTouchDevice) {
        rotateOverlay.style.display = "none"; canvas.style.display = "flex"; touchControls.style.display = "flex";
        return;
    }
    rotateOverlay.style.display = "none"; canvas.style.display = "flex"; touchControls.style.display = "none";
}


/** * Retrieves the current orientation and device state.
 * @return {{rotateOverlay:HTMLElement,touchControls:HTMLElement,canvas:HTMLElement,inMenu:boolean,isTouch:boolean,isPhone:boolean,portrait:boolean}}
 **/
function getOrientationState() {
    const isPhone = window.innerWidth <= 766;
    const isTablet = window.innerWidth > 766 && window.innerWidth <= 1400;
    const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    return {
        rotateOverlay: document.getElementById("rotateDevice"),
        touchControls: document.getElementById("touch-controls"),
        canvas: document.getElementById("canvas"),
        inMenu: !world,
        isPhone,
        isTablet,
        isTouchDevice: hasTouch,
        portrait: window.matchMedia("(orientation: portrait)").matches
    };
}


/**
 * Loads and toggles the impressum display.
 * Called when the impressum button is clicked.
 **/
function loadImpressum() {
    const impressumDiv = document.getElementById('impressum');
    const impressumBtn = document.getElementById('impressumBtn');
    if (impressumDiv.style.display === 'none') { // If impressum is hidden
        showImpressum(impressumBtn, impressumDiv); // Show impressum
    } else { // If impressum is visible
        hideImpressum(impressumBtn, impressumDiv); // Hide impressum
    }
    impressumDiv.innerHTML = loadImpressumHtml(); // Load impressum content
}


/**
 * Shows the impressum section and hides other menu elements.
 * @param {HTMLElement} impressumBtn - The button that toggles the impressum.
 * @param {HTMLElement} impressumDiv - The div containing the impressum content.
 */
function showImpressum(impressumBtn, impressumDiv) {
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('descriptionBtn').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'none';
    document.getElementById('gameHeadline').style.display = 'none';
    impressumDiv.style.display = 'flex';
    impressumBtn.innerText = 'Close Impressum';
}


/** Hides the impressum section and shows other menu elements.
 * @param {HTMLElement} impressumBtn - The button that toggles the impressum.
 * @param {HTMLElement} impressumDiv - The div containing the impressum content.
 */
function hideImpressum(impressumBtn, impressumDiv) {
    impressumDiv.style.display = 'none';
    impressumBtn.innerText = 'Impressum';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('descriptionBtn').style.display = 'flex';
    document.getElementById('startHeadline').style.display = 'flex';
    document.getElementById('gameHeadline').style.display = 'flex';
}


/** Starts a new game by initializing the world and canvas. */
function startGame() {
    checkScreenScale(); // Adjust screen for device
    intervals.forEach(id => clearInterval(id)); // Clear existing intervals
    intervals = []; // Reset intervals array
    world = null; // Clear existing world
    level1 = createLevel1(); // Create level 1
    canvas = document.getElementById("canvas"); // Get canvas element
    const ctx = canvas.getContext('2d'); // Get 2D context
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    canvas.style.display = 'flex'; // Show canvas
    canvas.classList.add('active'); // Activate canvas styling
    hideMenuElements(); // Hide menu elements
    world = new World(canvas, keyboard); // Initialize new world
    world.isMuted = globalMuted; // Apply global mute state
    syncWorldAudio(); // Sync audio states
    world.statusBar.find(s => s.type === "volume").setMuted(globalMuted); // Set volume mute state
    playBackgroundMusic(); // Play background music
    checkOrientation(); // Check device orientation
}


/** Hides all menu-related elements. */
function hideMenuElements() {
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('startHeadline').style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('endScreenBtns').style.display = 'none';
    document.getElementById('descriptionBtn').style.display = 'none';
    document.getElementById('impressumBtn').style.display = 'none';
    document.getElementById('menuMuteBtn').style.display = 'none';
}


/** Adjusts the display based on screen size for responsive design. */
function checkScreenScale() {
    if (window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(max-height: 480px)").matches) { // Small screens
        document.getElementById('gameHeadline').style.display = 'none';
        document.getElementById('touch-controls').style.display = 'flex';
        bindTouchControls();
    } else {
        document.getElementById('touch-controls').style.display = 'none';
    }
}


/** Returns to the main menu, resetting the game state. */
function backToMenu() {
    init(); // Reset menu state
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
    document.getElementById('menuMuteBtn').innerHTML = globalMuted ? "🔇" : "🔊"; // Update mute button icon
}


/** Opens the description section, adjusting UI elements accordingly. */
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
    infoTable.scrollTop = 0; // Scroll to top
    infoTable.innerHTML = loadInfoTableHtml(); // Load info table content
}


/** Hides the description section. */
function closeDescription() {
    document.getElementById('impressumBtn').style.display = 'flex';
    document.getElementById('description').style.display = 'none';
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('startHeadline').style.display = 'flex';
    document.getElementById('descriptionBtn').style.display = 'flex';
    document.getElementById('gameHeadline').style.display = 'flex';
    document.getElementById('infoTable').innerHTML = '';
}


/** Ends the game with the specified outcome ('win' or 'lose'). */
function endGame(output) {
    setTimeout(() => {
        if (output === 'lose') {
            showGameIsLost();
        }
        if (output === 'win') {
            showGameIsWon();
        }
        if (world && world.backgroundMusic) { // Stop background music
            world.backgroundMusic.pause(); // Pause music
            world.backgroundMusic.currentTime = 0; // Reset music to start
        }
        if (world && world.bossMusic) {
            world.bossMusic.pause(); // Pause boss music
            world.bossMusic.currentTime = 0; // Reset boss music to start
        }
    }, 1000);
}


/** Shows the "Game Over" screen with options to retry. */
function showGameIsLost() {
    document.getElementById('endScreen').style.display = 'flex';
    document.getElementById('endScreenBtns').style.display = 'flex';
    document.getElementById('endScreenImg').src = 'img/6.Botones/Tittles/Game Over/Recurso 9.png';
    document.getElementById('changingBtn').onclick = startGame; // Set retry button action
    document.getElementById('changingBtn').innerHTML = 'Try Again';
    intervals.forEach(id => clearInterval(id)); // Clear intervals
    intervals = []; // Reset intervals array
    initIntervals(world); // Re-initialize intervals
    world.playSound('audio/lose.wav', 0.4); // Play lose sound
}


/** Shows the "You Win" screen with options to proceed. */
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


/** Proceeds to the next game level or shows a message if no further levels exist. */
function nextGame() {
    canvas.style.display = 'none';
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('touch-controls').style.display = 'none';
    document.getElementById('excuseText').style.display = 'flex';
    document.getElementById('backToMenu').style.display = 'flex';
    document.getElementById('excuseText').innerHTML = 'Unfortunately, no further levels exist yet, as the game is currently in alpha. However, you can replay the same level.';
}


/** Sets an interval that can be stopped and tracked. */
function setStoppableIntervals(fn, time) {
    let id = setInterval(fn, time);
    intervals.push(id);
}


/** Initializes all necessary intervals for the game world. */
function initIntervals(world) {
    setStoppableIntervals(() => world.character.moveCharacter(), 1000 / 60);
    setStoppableIntervals(() => world.character.animate(), 100);
    if (world.level && world.level.enemies) { // Animate enemies if they exist
        world.level.enemies.forEach(enemy => { // Loop through enemies
            if (typeof enemy.animate === 'function') { // Check if animate method exists
                setStoppableIntervals(() => enemy.animate(), 1000 / 6); // Animate enemy
            }
        });
    }
    setStoppableIntervals(() => world.run(), 1000 / 60);
}


/** Plays the background music for the game. */
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


/** Plays the endboss music for the game. */
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


/** Plays a sound effect for menu interactions. */
function playMenuSound(path, volume) {
    if (globalMuted) return;
    let sound = new Audio(path);
    sound.volume = volume;
    sound.muted = globalMuted;
    sound.play();
}


/** Toggles the global mute state from the menu and updates UI and world audio accordingly. */
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


/** Synchronizes the mute state of all world audio elements with the global mute state. */
function syncWorldAudio() {
    if (!world) return;
    const mute = world.isMuted;
    if (world.backgroundMusic) world.backgroundMusic.muted = mute;
    if (world.bossMusic) world.bossMusic.muted = mute;
    document.querySelectorAll("audio").forEach(a => a.muted = mute);
}


/** Binds touch controls to their respective buttons for mobile interaction. */
function bindTouchControls() {
    const touchControls = createTouchControls();
    touchControls.forEach(m => {
        const el = document.getElementById(m.id); // Get button element
        if (!el) return; // Skip if element not found
        el.addEventListener('mousedown', m.down);
        el.addEventListener('mouseup', m.up);
        el.addEventListener('mouseleave', m.up); // Mouse leave event
        el.addEventListener('touchstart', (e) => { e.preventDefault(); m.down(); }, { passive: false }); // Touch start event
        el.addEventListener('touchend', (e) => { e.preventDefault(); m.up(); }, { passive: false }); // Touch end event
    });
}


/** Creates touch control mappings for mobile interaction. */
function createTouchControls() {
    return [
        { id: 'leftBtn', down: () => keyboard.LEFT = true, up: () => keyboard.LEFT = false },
        { id: 'rightBtn', down: () => keyboard.RIGHT = true, up: () => keyboard.RIGHT = false },
        { id: 'upBtn', down: () => keyboard.UP = true, up: () => keyboard.UP = false },
        { id: 'downBtn', down: () => keyboard.DOWN = true, up: () => keyboard.DOWN = false },
        { id: 'shootBtn', down: () => keyboard.SPACE = true, up: () => keyboard.SPACE = false },
    ]
}


/** Loads the HTML content for the Impressum section. */
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


/** Loads the HTML content for the game information table. */
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

