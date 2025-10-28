class World {

    character = new Character();
    level = createLevel1();
    ctx;
    canvas;
    keyboard;
    speedLever = 0;
    camera_x = -100;
    collidingImunity = false;
    gameOver = false;
    isMuted = false;

    statusBar = [new StatusBar('life', 10, 0, 50, 200),
    new StatusBar('coins', 10, 40, 50, 200),
    new StatusBar('poison', 10, 80, 50, 200),
    new StatusBar('instructions', 0, 330, 150, 300),
    new StatusBar('volume', 970, 10, 40, 40)
    ];
    throwableObject = [new Throwable()];
    collectableObjects = [
        new Collectable(1500, 400, 'life'),
        new Collectable(3000, 400, 'life'),
        new Collectable(4000, 400, 'life'),
        new Collectable(6000, 400, 'life'),
        new Collectable(8000, 400, 'life'),
        new Collectable(9000, 400, 'life'),
        new Collectable(600, 400, 'poison'),
        new Collectable(2300, 400, 'poison'),
        new Collectable(3150, 400, 'poison'),
        new Collectable(600, 400, 'poison'),
        new Collectable(600, 400, 'poison')
    ];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.setWorld();
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();

        this.initVolumeButton();


        this.checkCollisions();
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
        setStoppableIntervals(() => this.character.moveCharacter(), 1000 / 60);
        setStoppableIntervals(() => this.character.animate(), 100);
        setStoppableIntervals(() => this.run(), 1000 / 60);
        //setStoppableIntervals(() => this.level.spawnEnemies(this.character), 2000);
        this.collectableObjects.push(...Collectable.spawnBatch(15, 'coin'));
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(e => {
            e.world = this;
            if (typeof e.animate === 'function') {
                setStoppableIntervals(() => e.animate(), 1000 / 6);
            }
            if (typeof e.startMoving === 'function') {
                setStoppableIntervals(() => e.startMoving(), 1000 / 60);
            }
        });
        if (this.throwableObject) {
            this.throwableObject.forEach(obj => {
                obj.world = this;
            });
        }
    }

    run() {
        this.checkCollisions();
        this.popup();
        this.checkGameOver();
        this.checkMusicSwitch();
        console.log(this.character.x);
    }

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

    popup() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof PufferFish && enemy.x < this.character.x + 400) {
                enemy.blownUp = true;
                enemy.offset.top = 5;
                enemy.offset.bottom = 5;
                enemy.offset.left = 10;
            }
        });
    }

    checkThrowableObjects() {
        let throwX, throwY;
        if (this.character.otherDirection) {
            throwX = this.character.getHitbox().x;
            throwY = this.character.getHitbox().y + this.character.getHitbox().height / 2;
        } else {
            throwX = this.character.getHitbox().x + this.character.getHitbox().width - 10;
            throwY = this.character.getHitbox().y + this.character.getHitbox().height / 2 - 12;
        }

        const t = new Throwable(throwX, throwY);
        t.otherDirection = this.character.otherDirection;
        this.throwableObject.push(t);

    }

    checkCollisions() { // Main function that handles all in-game collision checks
        if (!this.collidingImunity) { // Only run if Sharkie is not temporarily invincible
            this.level.enemies.forEach(enemy => { // Loop through every enemy in the level
                let damage = 20; // Default collision damage
                if (this.character.isColliding(enemy) && !this.character.isDead() && !this.character.isHurt()) { // If Sharkie collides, is alive, and not currently hurt
                    if (enemy instanceof PufferFish) { // Collision with pufferfish
                        this.character.hit(damage, 'poison'); // Apply poison damage
                        this.collidingImunity = true; // Enable short immunity
                    } else if (enemy instanceof JellyFish) { // Collision with jellyfish
                        if (enemy.color == 'green') { // Green jellyfish deal more damage
                            damage = 100; // Stronger electric damage
                            this.collidingImunity = true; // Enable immunity
                        }
                        this.character.hit(damage, 'electric'); // Apply electric damage
                    } else if (enemy instanceof Endboss) { // Collision with endboss
                        let sharkieBox = this.character.getHitbox(); // Get Sharkie’s hitbox
                        let bossBox = enemy.getAttackHitbox(); // Get the boss’s attack hitbox
                        if (this.boxCollision(sharkieBox, bossBox)) { // Check if Sharkie overlaps with attack zone
                            this.character.bitingSharkie = true; // Boss bite animation/flag
                            setTimeout(() => { // Delay before damage is applied
                                this.character.hit(damage, 'poison'); // Apply bite damage
                                this.statusBar[0].setHealth(this.character.health); // Update life bar
                            }, 500); // Apply after 0.5 seconds
                        }
                    }
                    this.statusBar[0].setHealth(this.character.health); // Always update health display
                    setTimeout(() => { // Schedule immunity reset
                        if (this.character.bitingSharkie) {
                            this.playSound('audio/enboss bite.wav', 0.4);
                        }
                        this.collidingImunity = false; // Remove invincibility
                        this.character.bitingSharkie = false; // Stop bite animation
                    }, 500); // Immunity lasts for 1.2 seconds
                }
            });
        }

        // --- Throwable (bubble) vs enemy collision check ---
        for (let i = this.throwableObject.length - 1; i >= 0; i--) { // Iterate backwards through all active bubbles
            const throwable = this.throwableObject[i]; // Current bubble reference
            for (let j = this.level.enemies.length - 1; j >= 0; j--) { // Iterate backwards through all enemies
                const enemy = this.level.enemies[j]; // Current enemy reference

                if (enemy instanceof Endboss) { // Special case: Endboss has two hitboxes
                    if (throwable.isCollidingWithBox(enemy.getBubbleHitbox())) { // If bubble hits the green (vulnerable) hitbox
                        enemy.hit(20, 'bubble'); // Apply bubble damage to the boss
                        this.throwableObject.splice(i, 1); // Remove the bubble from the array
                        this.playSound('audio/hit enemy.mp3', 0.4);
                        this.playSound('audio/endboss hurt.mp3', 0.4);
                        break; // Exit inner loop and go to next bubble
                    }
                    continue; // Skip checking the red box — it should not remove the bubble
                }

                if (throwable.isColliding(enemy)) { // Regular enemy collision
                    this.throwableObject.splice(i, 1); // Remove bubble once it hits
                    if (enemy instanceof Endboss) { // Safety fallback for boss (should not trigger)
                        enemy.hit(20, 'bubble'); // Apply bubble damage just in case
                    } else { // Normal enemy logic
                        enemy.dead = true; // Mark enemy as dead
                        this.playSound('audio/hit enemy.mp3', 0.4);
                        setTimeout(() => { // Remove enemy from level after short delay
                            this.level.enemies.splice(j, 1); // Delete enemy from array
                        }, 500);
                    }
                    break; // Stop checking this bubble after a hit
                }
            }
        }
        this.collectableObjects.forEach(collectable => {
            if (this.character.isColliding(collectable) && !collectable.collected) {
                if (collectable.imageType.coin.includes('Coin') || collectable.constructor.name === 'Collectable' && collectable.type === 'coin') {
                    this.statusBar[1].setCoins(this.statusBar[1].coins + 20);
                    this.playSound('audio/collect coin (2).mp3', 0.4);
                    collectable.collected = true;
                }
                else if (collectable.imageType.life.includes('Life') || collectable.type === 'life') {
                    this.statusBar[0].setHealth(this.statusBar[0].health + 20);
                    this.playSound('audio/collect health.wav', 0.3);
                    collectable.collected = true;
                }
                else if (collectable.imageType.poison.includes('poison') || collectable.type === 'poison') {
                    this.statusBar[2].setPoison(this.statusBar[2].poison + 20);
                    this.playSound('audio/collect poison.mp3', 0.4);
                    collectable.collected = true;
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
        this.ctx.translate(this.camera_x, 0); // camera movement

        this.drawMultipleObjects(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.drawMultipleObjects(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.drawObject(this.character);
        this.drawMultipleObjects(this.level.enemies);
        this.drawMultipleObjects(this.throwableObject);
        this.drawMultipleObjects(this.collectableObjects);
        this.ctx.translate(-this.camera_x, 0); // reset camera

        requestAnimationFrame(() => this.draw());
    }

    drawMultipleObjects(object) {
        object.forEach(o => {
            this.drawObject(o);
        });
    }

    drawObject(movableObject) {
        if (movableObject.otherDirection) {
            this.ctx.save();
            this.ctx.translate(movableObject.x + movableObject.width / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(movableObject.x + movableObject.width / 2), 0);
            this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);
            this.ctx.restore();
            movableObject.drawFrame(this.ctx);
            return;

        }
        if (movableObject instanceof Endboss) {
            movableObject.drawHitboxes(this.ctx); // zeigt beide Boxen gleichzeitig
        }
        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);
    }

    boxCollision(boxA, boxB) {
        return (
            boxA.x < boxB.x + boxB.width &&
            boxA.x + boxA.width > boxB.x &&
            boxA.y < boxB.y + boxB.height &&
            boxA.y + boxA.height > boxB.y
        );
    }

    initVolumeButton() {
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const volumeBar = this.statusBar.find(s => s.type === 'volume');
            if (
                mouseX >= volumeBar.x &&
                mouseX <= volumeBar.x + volumeBar.width &&
                mouseY >= volumeBar.y &&
                mouseY <= volumeBar.y + volumeBar.height
            ) {
                this.toggleVolume();
            }
        });
    }


    toggleVolume() {
        this.playSound('audio/volume-up.wav', 0.5);
        // Zustand umschalten (laut/leise)
        this.isMuted = !this.isMuted;
        // Passendes Volume-Icon auswählen
        const volumeBar = this.statusBar.find(s => s.type === 'volume');
        const imagePath = this.isMuted
            ? volumeBar.statusImages.volume.down[0]
            : volumeBar.statusImages.volume.up[0];
        volumeBar.img = volumeBar.imageCache[imagePath];

        if (window.world && window.world.backgroundMusic) {
            window.world.backgroundMusic.muted = this.isMuted;
        }
        this.playSound('audio/volume-up.wav', 0.5);
    }

    playSound(path, volume) {
        let sound = new Audio(path);
        sound.volume = volume;
        if (world.isMuted) {
            sound.muted = true;
        }
        sound.play();
    }

    checkMusicSwitch() {
        if (!this.bossMusicStarted && this.character.x >= 8100) {
            // Hintergrundmusik stoppen
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
            // Boss-Musik starten
            if (this.bossMusic) {
                this.bossMusic.play();
            }
            this.bossMusicStarted = true;
        }
    }




}