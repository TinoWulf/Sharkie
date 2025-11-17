/**
 * Character (Sharkie)
 *
 * The player-controlled character. Inherits from `MovableObject` and
 * encapsulates input handling, movement, animation state machine, attack
 * mechanics and sleep/hurt/death state transitions.
 *
 * Responsibilities:
 * - Load and manage animation frames for all character states
 * - Interpret keyboard/touch input into movement and attacks
 * - Spawn projectiles (throwables) when attacking
 * - Manage temporary states: hurt, attack cooldown, sleeping, death
 *
 * @extends MovableObject
 */
class Character extends MovableObject {

    imagesCharacter = {
        standing: [
            'img/1.Sharkie/1.IDLE/1.png',
            'img/1.Sharkie/1.IDLE/2.png',
            'img/1.Sharkie/1.IDLE/3.png',
            'img/1.Sharkie/1.IDLE/4.png',
            'img/1.Sharkie/1.IDLE/5.png',
            'img/1.Sharkie/1.IDLE/6.png',
            'img/1.Sharkie/1.IDLE/7.png',
            'img/1.Sharkie/1.IDLE/8.png',
            'img/1.Sharkie/1.IDLE/9.png',
            'img/1.Sharkie/1.IDLE/10.png',
            'img/1.Sharkie/1.IDLE/11.png',
            'img/1.Sharkie/1.IDLE/12.png',
            'img/1.Sharkie/1.IDLE/13.png',
            'img/1.Sharkie/1.IDLE/14.png',
            'img/1.Sharkie/1.IDLE/15.png',
            'img/1.Sharkie/1.IDLE/16.png',
            'img/1.Sharkie/1.IDLE/17.png',
            'img/1.Sharkie/1.IDLE/18.png',
        ],
        swimming: [
            'img/1.Sharkie/3.Swim/1.png',
            'img/1.Sharkie/3.Swim/2.png',
            'img/1.Sharkie/3.Swim/3.png',
            'img/1.Sharkie/3.Swim/4.png',
            'img/1.Sharkie/3.Swim/5.png',
            'img/1.Sharkie/3.Swim/6.png'
        ],
        hurtPoisoned: [
            'img/1.Sharkie/5.Hurt/1.Poisoned/1.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/2.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/3.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/4.png'
        ],
        hurtElectric: [
            'img/1.Sharkie/5.Hurt/2.Electric shock/1.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/2.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/3.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/1.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/2.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/3.png'
        ],
        dead: {
            poisoned: [
                'img/1.Sharkie/6.dead/1.Poisoned/1.png',
                'img/1.Sharkie/6.dead/1.Poisoned/2.png',
                'img/1.Sharkie/6.dead/1.Poisoned/3.png',
                'img/1.Sharkie/6.dead/1.Poisoned/4.png',
                'img/1.Sharkie/6.dead/1.Poisoned/5.png',
                'img/1.Sharkie/6.dead/1.Poisoned/6.png',
                'img/1.Sharkie/6.dead/1.Poisoned/7.png',
                'img/1.Sharkie/6.dead/1.Poisoned/8.png',
                'img/1.Sharkie/6.dead/1.Poisoned/9.png',
                'img/1.Sharkie/6.dead/1.Poisoned/10.png',
                'img/1.Sharkie/6.dead/1.Poisoned/11.png',
                'img/1.Sharkie/6.dead/1.Poisoned/12.png'
            ],
            electric: [
                'img/1.Sharkie/6.dead/2.Electro_shock/1.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/2.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/3.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/4.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/5.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/6.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/7.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/8.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/9.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/10.png'
            ]
        },
        stillDead: {
            poisoned: [
                'img/1.Sharkie/6.dead/1.Poisoned/12.png'
            ],
            electric: [
                'img/1.Sharkie/6.dead/2.Electro_shock/10.png'
            ]
        },
        attack: [
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png'
        ],
        attackForWhale: [
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png'
        ],
        fallAsleep: [
            'img/1.Sharkie/2.Long_IDLE/i1.png',
            'img/1.Sharkie/2.Long_IDLE/I2.png',
            'img/1.Sharkie/2.Long_IDLE/I3.png',
            'img/1.Sharkie/2.Long_IDLE/I4.png',
            'img/1.Sharkie/2.Long_IDLE/I5.png',
            'img/1.Sharkie/2.Long_IDLE/I6.png',
            'img/1.Sharkie/2.Long_IDLE/I7.png',
            'img/1.Sharkie/2.Long_IDLE/I8.png',
            'img/1.Sharkie/2.Long_IDLE/I9.png',
            'img/1.Sharkie/2.Long_IDLE/I10.png',
            'img/1.Sharkie/2.Long_IDLE/I11.png',
            'img/1.Sharkie/2.Long_IDLE/I12.png',
            'img/1.Sharkie/2.Long_IDLE/I13.png',
            'img/1.Sharkie/2.Long_IDLE/I14.png'
        ],
        sleeping: [
            'img/1.Sharkie/2.Long_IDLE/I11.png',
            'img/1.Sharkie/2.Long_IDLE/I12.png',
            'img/1.Sharkie/2.Long_IDLE/I13.png',
            'img/1.Sharkie/2.Long_IDLE/I14.png'
        ]

    }

    /** Hitbox offset: tight collision box inside sprite */
    offset = {
        top: 140,
        bottom: 70,
        left: 40,
        right: 40
    }

    /** Timestamp of last key press (ms) used for sleep detection */
    lastKeyPressTime = 0;

    /** Interval ID for sleeping animation loop (if active) */
    sleepInterval = null;

    /** Current animation frame index (used across animations) */
    currentImageIndex = 0;

    /** Visual size of character sprite */
    height = 250;
    width = 180;

    /** World reference is set by World.setWorld() */
    x = 100;
    y = 100;
    health = 100;
    world;

    /** Death-type flags to determine which "still dead" frame to show */
    deadByElectric = false;
    deadByPoison = false;

    /** Attack and animation state flags */
    isAttacking = false;
    waitingForAttack = false;

    /** Sleep state flags (idle detection) */
    isSleeping = false;
    isFallingAsleep = false;


    /**
     * Create the player character and preload all animation frames.
     * The constructor only loads sprite frames and initializes the idle timestamp.
     */
    constructor() {
        super().loadImage('img/1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.imagesCharacter.standing);
        this.loadImages(this.imagesCharacter.swimming);
        this.loadImages(this.imagesCharacter.hurtPoisoned);
        this.loadImages(this.imagesCharacter.hurtElectric);
        this.loadImages(this.imagesCharacter.dead.poisoned);
        this.loadImages(this.imagesCharacter.dead.electric);
        this.loadImages(this.imagesCharacter.attack);
        this.loadImages(this.imagesCharacter.attackForWhale);
        this.loadImages(this.imagesCharacter.fallAsleep);
        this.loadImages(this.imagesCharacter.sleeping);
        // Initialize last keypress time to avoid immediate sleep
        this.lastKeyPressTime = new Date().getTime();
    }

    /**
     * Update character position based on current keyboard state and
     * update the camera to follow the character.
     * This is called frequently by the world's movement interval.
     */
    moveCharacter() {
        let kb = this.world.keyboard;
        this.isMoving(kb);
        this.isNotMoving(kb);
        this.world.camera_x = -this.x + 100; // camera follows character 
    }

    /**
     * Apply movement input based on keyboard state.
     * - RIGHT/LEFT update X position and facing
     * - UP/DOWN update Y position within bounds
     * @param {Keyboard} kb - keyboard state object
     */
    isMoving(kb) {
        if (kb.RIGHT && this.x < this.world.level.levelEndX && !this.isDead()) {
            this.x += 3;
            this.otherDirection = false;
        }
        if (kb.LEFT && this.x > 100 && !this.isDead()) {
            this.x -= 3;
            this.otherDirection = true;
        }
        if (kb.UP && this.y > -100 && !this.isDead()) {
            this.y -= 3;
        }
        if (kb.DOWN && this.y < this.world.canvas.height - this.height + 50 && !this.isDead()) {
            this.y += 3;
        }
    }

    /**
     * Handle idle behaviour detection. If no movement keys are pressed for
     * a configured timeout (10s), the character will initiate falling asleep.
     * Any input resets the timer and sleep flags.
     * @param {Keyboard} kb - keyboard state object
     */
    isNotMoving(kb) {
        if (!kb.RIGHT && !kb.LEFT && !kb.UP && !kb.DOWN && !this.isDead() && !this.isAttacking && !this.isHurt()) {
            let currentTime = new Date().getTime();
            let timeSinceLastKeyPress = currentTime - this.lastKeyPressTime;
            if (timeSinceLastKeyPress > 10000 && !this.isFallingAsleep && !this.isSleeping && !this.isDead() && !this.isAttacking) {
                this.isFallingAsleep = true;
            }
        } else {
            this.lastKeyPressTime = new Date().getTime();
            this.isFallingAsleep = false;
            this.isSleeping = false;
        }
    }

    /**
     * Main animation dispatcher. Decides whether to start an attack
     * sequence or to run the non-attacking animation logic.
     * Called regularly by the world's animation interval.
     */
    animate() {
        if (this.world.keyboard.SPACE && !this.isHurt() && !this.isDead() && !this.isAttacking && !this.waitingForAttack) {
            this.characterIsAttacking();
        }
        else if (!this.isAttacking) {
            this.characterAnimationWithoutAttacking();
        }
    }

    /**
     * Animation logic used when the character is not performing an attack.
     * Checks animation states (movement, hurt, death, sleep) in priority order
     * and selects the appropriate animation frames.
     */
    characterAnimationWithoutAttacking() {
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) && !this.isHurt() && !this.isDead()) {
            this.playAnimation(this.imagesCharacter.swimming);
        } else if (this.isDead() && !this.deadByElectric && !this.deadByPoison) {
            this.characterIsDeadBy();
        } else if (this.deadByPoison) {
            this.playAnimation(this.imagesCharacter.stillDead.poisoned);
        } else if (this.deadByElectric) {
            this.playAnimation(this.imagesCharacter.stillDead.electric);
        } else if (this.isFallingAsleep && !this.isSleeping) {
            this.characterIsSleeping();
        } else if (this.isHurt() && this.isPoisoned) {
            this.characterIsHurtByPoison();
        } else if (this.isHurt() && this.isElectrified) {
            this.characterIsHurtByElectric();
        } else if (!this.isSleeping && !this.isFallingAsleep && !this.isDead() && !this.isAttacking) {
            this.playAnimation(this.imagesCharacter.standing);
        }
    }

    /**
     * Begin an attack sequence: set attack flags, play the appropriate
     * attack animation (normal or powered by poison) and spawn a throwable
     * after the animation delay.
     */
    characterIsAttacking() {
        this.isAttacking = true;
        this.waitingForAttack = true;
        this.currentImageIndex = 0;
        const poisonFull = this.world.statusBar[2].poison >= 100;
        if (poisonFull) {
            this.playAttackAnimation(this.imagesCharacter.attackForWhale);
        } else {
            this.playAttackAnimation(this.imagesCharacter.attack);
        }
        setTimeout(() => {
            this.world.checkThrowableObjects(poisonFull);
            this.world.playSound('audio/bubble-pop-06-351337.mp3', 0.4);
        }, 350);
    }


    /**
     * Play the appropriate death animation depending on the cause (poison or
     * electric). When the animation finished, mark the character with the
     * corresponding `deadBy...` flag so the correct still frame is shown.
     */
    characterIsDeadBy() {
        if (this.isPoisoned) {
            this.playAnimation(this.imagesCharacter.dead.poisoned);
            if (this.currentImageIndex % this.imagesCharacter.dead.poisoned.length === this.imagesCharacter.dead.poisoned.length - 1) {
                this.deadByPoison = true;
                this.currentImageIndex = 0;
            }
        } else if (this.isElectrified) {
            this.playAnimation(this.imagesCharacter.dead.electric);
            if (this.currentImageIndex % this.imagesCharacter.dead.poisoned.length === this.imagesCharacter.dead.poisoned.length - 1) {
                this.deadByElectric = true;
                this.currentImageIndex = 0;
            }
        }
    }

    /**
     * Play the falling-asleep animation. Once complete, switch into the
     * persistent sleeping state and start the sleeping animation loop.
     */
    characterIsSleeping() {
        this.playAnimation(this.imagesCharacter.fallAsleep);
        if (this.currentImageIndex % this.imagesCharacter.fallAsleep.length === this.imagesCharacter.fallAsleep.length - 1) {
            this.isSleeping = true;
            this.isFallingAsleep = false;
            this.currentImageIndex = 0;
            this.playSleepingAnimation();
        }
    }

    /**
     * Play poison-hurt animation and clear the poisoned flag after the hurt
     * immunity window if the character is no longer in hurt state.
     */
    characterIsHurtByPoison() {
        this.playAnimation(this.imagesCharacter.hurtPoisoned);
        setTimeout(() => {
            if (!this.isHurt()) this.isPoisoned = false;
        }, 1200);
    }

    /**
     * Play electric-hurt animation and clear the electrified flag after the
     * hurt immunity window if appropriate.
     */
    characterIsHurtByElectric() {
        this.playAnimation(this.imagesCharacter.hurtElectric);
        setTimeout(() => {
            if (!this.isHurt()) this.isElectrified = false;
        }, 1200);
    }

    /**
     * Start or continue a repeating sleeping animation while `isSleeping` is true.
     * Ensures previous sleep interval is cleared before creating a new one.
     */
    playSleepingAnimation() {
        if (this.sleepInterval) {
            clearInterval(this.sleepInterval);
            this.sleepInterval = null;
        }

        this.sleepInterval = setInterval(() => {
            if (this.isSleeping) {
                this.playAnimation(this.imagesCharacter.sleeping);
            } else {
                clearInterval(this.sleepInterval);
                this.sleepInterval = null;
            }
        }, 1000 / 5);
    }

    /**
     * Play an attack animation sequence (frames array). This uses a temporary
     * interval to step through provided frames; on completion it resets attack
     * flags and starts the attack cooldown (`waitingForAttack`).
     *
     * @param {string[]} [frames] - Optional array of image paths to use for attack
     */
    playAttackAnimation(frames) {
        frames = frames || this.imagesCharacter.attack;
        let i = 0;
        const attackInterval = setInterval(() => {
            this.img = this.imageCache[frames[i]];
            i++;
            if (i >= frames.length) {
                clearInterval(attackInterval);
                this.isAttacking = false;
                this.currentImageIndex = 0;
                setTimeout(() => this.waitingForAttack = false, 1000);
            }
        }, 50);
    }

}