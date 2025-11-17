/**
 * World
 *
 * The central game controller and scene manager. Orchestrates the game loop,
 * manages collision detection between all game objects, handles drawing/rendering
 * via Canvas 2D, and coordinates state (game over, music switching, sound effects).
 *
 * Responsibilities:
 * - Maintain game entities: character, level, collectables, throwables, enemies
 * - Run collision checks (enemy damage, throwable hits, item collection)
 * - Manage camera position and canvas transformation
 * - Play sounds and control background/boss music
 * - Update UI elements (status bars, health, etc.)
 */
class World {
    /** Player-controlled character instance */
    character = new Character();

    /** Current level with enemies and background layout */
    level = createLevel1();

    /** Canvas rendering context and keyboard input state */
    ctx; canvas; keyboard;

    /** Speed/difficulty modifier (currently unused) */
    speedLever = 0;

    /** Camera X offset for scrolling the view with character movement */
    camera_x = -100;

    /** Immunity timer flag to prevent rapid successive damage */
    collidingImunity = false;

    /** Flag indicating the game has ended (win/lose) */
    gameOver = false;

    /** Mute state for all sounds */
    isMuted = false;

    /** UI status bars: [health, coins, poison, volume] */
    statusBar = [
        new StatusBar('life', 10, 0, 50, 200),
        new StatusBar('coins', 10, 40, 50, 200),
        new StatusBar('poison', 10, 80, 50, 200),
        new StatusBar('volume', 970, 10, 40, 40)
    ];

    /** Collectable items (health, poison) scattered across the level */
    collectableObjects = [
        new Collectable(3000, 400, 'life'),
        new Collectable(3900, 400, 'life'),
        new Collectable(4760, 400, 'life'),
        new Collectable(7400, 400, 'life'),
        new Collectable(8000, 400, 'life'),
        new Collectable(9000, 400, 'life'),
        new Collectable(1000, 400, 'poison'),
        new Collectable(1900, 400, 'poison'),
        new Collectable(2300, 400, 'poison'),
        new Collectable(3150, 400, 'poison'),
        new Collectable(6000, 400, 'poison'),
        new Collectable(7000, 400, 'poison')
    ];

    /** Active throwable objects (player-fired bubbles) in the world */
    throwableObject = [new Throwable()];

    /**
     * Initialize the World with a canvas and keyboard handler.
     * Sets up all entities, collision detection, and animation intervals.
     *
     * @param {HTMLCanvasElement} canvas - the game canvas
     * @param {Keyboard} keyboard - keyboard state tracker
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.initVolumeButton();
        this.checkCollisions();
        this.character.world = this;
        this.level.enemies.forEach(e => e.world = this);
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss) {
            this.endbossHealthBar = new EndbossHealthBar(boss);
        }
        setStoppableIntervals(() => this.character.moveCharacter(), 1000 / 60);
        setStoppableIntervals(() => this.character.animate(), 100);
        setStoppableIntervals(() => this.run(), 1000 / 60);
        setStoppableIntervals(() => this.level.spawnEnemies(this.character), 2000);
        this.collectableObjects.push(...Collectable.spawnBatch(15, 'coin'));
        bindTouchControls();
        this.isMuted = globalMuted;
    }

    /**
     * Assign the world reference to all entities (character, enemies, throwables)
     * and start their animation/movement intervals.
     * Called once during construction to defer interval setup until world is initialized.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(e => {
            e.world = this;
            if (typeof e.animate === 'function')
                setStoppableIntervals(() => e.animate(), 1000 / 6);
            if (typeof e.startMoving === 'function')
                setStoppableIntervals(() => e.startMoving(), 1000 / 60);
        });
        if (this.throwableObject)
            this.throwableObject.forEach(obj => obj.world = this);
    }

    /**
     * Main game loop step. Called frequently to check collisions, update
     * game state, and handle music/audio.
     */
    run() {
        this.checkCollisions();
        this.popup();
        this.checkGameOver();
        this.checkMusicSwitch();
    }

    /**
     * Check win/lose conditions: character dies or defeats the Endboss.
     * Updates game over state and triggers end-game screen.
     */
    checkGameOver() {
        if ((this.character.deadByElectric || this.character.deadByPoison) && !this.gameOver) {
            endGame('lose');
            this.gameOver = true;
        }
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.dead && !this.gameOver) {
            endGame('win');
            this.gameOver = true;
        }
    }

    /**
     * Activate Puffer Fish blow-up state when they approach the character.
     * Adjusts collision hitbox when the fish inflates.
     */
    popup() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof PufferFish && enemy.x < this.character.x + 400) {
                enemy.blownUp = true;
                enemy.offset = { top: 5, bottom: 5, left: 10, right: 20 };
            }
        });
    }

    /**
     * Spawn a new throwable (bubble) from the character's position
     * in the direction they are facing.
     *
     * @param {boolean} [poisoned=false] - whether the bubble is powered by poison
     */
    checkThrowableObjects(poisoned = false) {
        let hb = this.character.getHitbox();
        let x = hb.x + (this.character.otherDirection ? 0 : hb.width - 10);
        let y = hb.y + hb.height / 2 - (this.character.otherDirection ? 0 : 12);
        const t = new Throwable(x, y, this.character.otherDirection, poisoned);
        this.throwableObject.push(t);
    }

    /**
     * Main collision dispatcher. Checks for all collision types:
     * enemy damage, throwable hits, and collectables.
     */
    checkCollisions() {
        if (!this.collidingImunity) this.handleEnemyCollisions();
        this.handleThrowableCollisions();
        this.handleCollectableCollisions();
    }

    /**
     * Check if character is colliding with any enemy and apply damage.
     */
    handleEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && this.canTakeDamage())
                this.applyEnemyCollision(enemy);
        });
    }

    /**
     * Check if character can take damage (not dead or already hurt).
     *
     * @returns {boolean} true if character is vulnerable
     */
    canTakeDamage() {
        return !this.character.isDead() && !this.character.isHurt();
    }

    /**
     * Apply damage from an enemy based on its type.
     * Different enemies deal different damage and apply different effects.
     *
     * @param {MovableObject} enemy - the colliding enemy
     */
    applyEnemyCollision(enemy) {
        let damage = 20;
        if (enemy instanceof PufferFish) this.hitByPufferFish(damage);
        else if (enemy instanceof JellyFish) this.hitByJellyFish(enemy, damage);
        else if (enemy instanceof Endboss) this.hitByEndboss(enemy, damage);
        this.updateAfterCollision();
    }

    /**
     * Handle Puffer Fish collision: apply poison damage with immunity cooldown.
     *
     * @param {number} damage - damage to deal
     */
    hitByPufferFish(damage) {
        if (!this.collidingImunity && !this.character.isHurt()) {
            this.collidingImunity = true;
            this.character.hit(damage, 'poison');
            this.statusBar[0].setHealth(this.character.health);
            this.playSound('audio/hit enemy.mp3', 0.4);
            setTimeout(() => this.collidingImunity = false, 800);
        }
    }


    /**
     * Handle Jelly Fish collision: green jellyfish deal massive damage.
     * Electric damage is applied.
     *
     * @param {JellyFish} enemy - the jellyfish
     * @param {number} damage - base damage (increased for green)
     */
    hitByJellyFish(enemy, damage) {
        if (enemy.color === 'green') damage = 100;
        this.character.hit(damage, 'electric');
        this.collidingImunity = true;
    }

    /**
     * Handle Endboss collision: bite animation plays before poison damage is applied.
     *
     * @param {Endboss} enemy - the boss enemy
     * @param {number} damage - damage to deal
     */
    hitByEndboss(enemy, damage) {
        this.character.bitingSharkie = true;
        setTimeout(() => {
            this.character.hit(damage, 'poison');
            this.statusBar[0].setHealth(this.character.health);
        }, 500);
    }

    /**
     * Update UI and play bite sound after collision.
     * Also clear the immunity flag.
     */
    updateAfterCollision() {
        this.statusBar[0].setHealth(this.character.health);
        setTimeout(() => {
            if (this.character.bitingSharkie)
                this.playSound('audio/enboss bite.wav', 0.4);
            this.collidingImunity = false;
            this.character.bitingSharkie = false;
        }, 500);
    }

    /**
     * Check all throwables for collisions with enemies (including special
     * hitbox logic for the Endboss).
     */
    handleThrowableCollisions() {
        for (let i = this.throwableObject.length - 1; i >= 0; i--) {
            const t = this.throwableObject[i];
            if (this.checkThrowableHitsEnemy(t, i)) continue;
        }
    }

    /**
     * Check if a throwable object collides with any enemy in the level.
     *
     * @param {Throwable} throwable - the projectile to check
     * @param {number} i - index of the throwable in the array
     * @returns {boolean} true if a hit occurred
     */
    checkThrowableHitsEnemy(throwable, i) {
        for (let j = this.level.enemies.length - 1; j >= 0; j--) {
            const enemy = this.level.enemies[j];
            if (this.processThrowableHit(throwable, enemy, i, j)) return true;
        }
        return false;
    }

    /**
     * Process a potential throwable-enemy collision.
     * Endboss uses a special vulnerable hitbox (bubble).
     * Regular enemies use normal collision bounds.
     *
     * @param {Throwable} throwable - the projectile
     * @param {MovableObject} enemy - the enemy to check
     * @param {number} i - throwable index
     * @param {number} j - enemy index
     * @returns {boolean} true if a hit was registered
     */
    processThrowableHit(throwable, enemy, i, j) {
        if (enemy instanceof Endboss && throwable.isCollidingWithBox(enemy.getBubbleHitbox())) {
            const damage = throwable.getDamage();
            enemy.hit(damage, 'bubble');
            this.removeThrowable(i);
            this.playSound('audio/endboss hurt.mp3', 0.4);
            return true;
        }
        if (!(enemy instanceof Endboss) && throwable.isColliding(enemy)) {
            this.removeThrowable(i);
            this.killEnemy(enemy, j);
            return true;
        }

        return false;
    }

    /**
     * Remove a throwable from the world and play sound.
     *
     * @param {number} i - index of throwable in array
     */
    removeThrowable(i) {
        this.throwableObject.splice(i, 1);
        this.playSound('audio/hit enemy.mp3', 0.4);
    }

    /**
     * Remove an enemy from the world after death animation delay.
     *
     * @param {MovableObject} enemy - the enemy to kill
     * @param {number} j - index of enemy in array
     */
    killEnemy(enemy, j) {
        enemy.dead = true;
        setTimeout(() => this.level.enemies.splice(j, 1), 500);
    }

    /**
     * Check collisions between character and collectable items (coins, health, poison).
     */
    handleCollectableCollisions() {
        this.collectableObjects.forEach(c => {
            if (this.character.isColliding(c) && !c.collected)
                this.collectItem(c);
        });
    }

    /**
     * Process collection of an item based on its type.
     *
     * @param {Collectable} c - the item to collect
     */
    collectItem(c) {
        if (c.type === 'coin') this.addCoins(c);
        else if (c.type === 'life') this.addLife(c);
        else if (c.type === 'poison') this.addPoison(c);
    }

    /**
     * Add coins to the player's score. Mark item as collected.
     *
     * @param {Collectable} c - the coin item
     */
    addCoins(c) {
        this.statusBar[1].setCoins(this.statusBar[1].coins + 20);
        this.playSound('audio/collect coin (2).mp3', 0.4);
        c.collected = true;
    }

    /**
     * Restore player health. Mark item as collected.
     *
     * @param {Collectable} c - the health item
     */
    addLife(c) {
        this.statusBar[0].setHealth(this.statusBar[0].health + 20);
        this.playSound('audio/collect health.wav', 0.3);
        c.collected = true;
    }

    /**
     * Add poison to the player's ammo. Mark item as collected.
     *
     * @param {Collectable} c - the poison item
     */
    addPoison(c) {
        this.statusBar[2].setPoison(this.statusBar[2].poison + 20);
        this.playSound('audio/collect poison.mp3', 0.4);
        c.collected = true;
    }


    /**
     * Render the entire scene: clear canvas, translate for camera offset,
     * draw all game objects in correct order, and request next frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawMultipleObjects(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.drawMultipleObjects(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.drawObject(this.character);
        this.drawMultipleObjects(this.level.enemies);
        if (this.endbossHealthBar && !this.endbossHealthBar.boss.dead) {
            this.endbossHealthBar.updatePosition();
            this.drawObject(this.endbossHealthBar);
        }
        this.drawMultipleObjects(this.throwableObject);
        this.drawMultipleObjects(this.collectableObjects);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draw multiple objects to the canvas.
     *
     * @param {DrawableObject[]} objs - array of drawable objects
     */
    drawMultipleObjects(objs) {
        objs.forEach(o => this.drawObject(o));
    }

    /**
     * Draw an object, flipping the canvas if the object faces left (otherDirection).
     * Uses canvas save/restore to preserve transform state.
     *
     * @param {DrawableObject} obj - the object to draw
     */
    drawObject(obj) {
        if (obj.otherDirection) {
            this.ctx.save();
            this.ctx.translate(obj.x + obj.width / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(obj.x + obj.width / 2), 0);
            this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
            this.ctx.restore();
            return;
        }
        obj.draw(this.ctx);
    }

    /**
     * Simple AABB (Axis-Aligned Bounding Box) collision test.
     *
     * @param {Object} a - object with x, y, width, height
     * @param {Object} b - object with x, y, width, height
     * @returns {boolean} true if bounding boxes overlap
     */
    boxCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    /**
     * Initialize the volume mute button click handler on the canvas.
     * Converts mouse coordinates to canvas-space and checks against
     * the volume button hitbox.
     */
    initVolumeButton() {
        this.canvas.addEventListener('click', e => {
            const r = this.canvas.getBoundingClientRect(); // Get canvas bounding rectangle
            const x = (e.clientX - r.left) * (this.canvas.width / r.width); // Convert mouse X to canvas space
            const y = (e.clientY - r.top) * (this.canvas.height / r.height); // Convert mouse Y to canvas space
            const vol = this.statusBar.find(s => s.type === 'volume'); // Find volume status bar element
            if (x >= vol.x && x <= vol.x + vol.width &&
                y >= vol.y && y <= vol.y + vol.height) // Check if click is within volume button bounds
                this.toggleVolume();
        });
    }

    /**
     * Toggle global mute state, update UI icon, and mute/unmute all audio.
     * Settings are persisted in localStorage.
     */
    toggleVolume() {
        this.isMuted = !this.isMuted; // Toggle mute state
        localStorage.setItem('globalMuted', this.isMuted); // Save mute state
        const v = this.statusBar.find(s => s.type === 'volume'); // Find volume status bar element
        const imgPath = this.isMuted ? v.statusImages.volume.down[0] // Select muted icon
            : v.statusImages.volume.up[0]; // Select appropriate icon
        v.img = v.imageCache[imgPath]; // Update volume icon image
        if (window.world?.backgroundMusic) window.world.backgroundMusic.muted = this.isMuted;
        if (window.world?.bossMusic) window.world.bossMusic.muted = this.isMuted;
        globalMuted = this.isMuted;
        document.getElementById("menuMuteBtn").innerHTML = this.isMuted ? "🔇" : "🔊";
    }

    /**
     * Play a sound effect with the given volume level.
     * Respects global mute state.
     *
     * @param {string} path - path to audio file
     * @param {number} vol - volume level (0.0 to 1.0)
     */
    playSound(path, vol) {
        let s = new Audio(path);
        s.volume = vol;
        if (world.isMuted) s.muted = true;
        s.play();
    }

    /**
     * Switch from background music to boss music when the character reaches
     * the Endboss location (x >= 8100). Transition is one-time only.
     */
    checkMusicSwitch() {
        if (!this.bossMusicStarted && this.character.x >= 8100) {
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
            if (this.bossMusic) this.bossMusic.play();
            this.bossMusicStarted = true;
        }
    }
}
