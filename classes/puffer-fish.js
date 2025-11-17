/**
 * PufferFish
 *
 * Represents a puffer fish enemy. PufferFish swims slowly until the
 * player nears, then may inflate (blow up) and switch to a different
 * swimming animation. The class extends `MovableObject` and uses the
 * shared drawing, animation and collision features.
 *
 * Responsibilities:
 * - Load swimming, blowing and dead sprites
 * - Start moving when the character is within `startMovingDistance`
 * - Provide animated states: normal swim, inflate transition, blown-up swim, dead
 *
 * @extends MovableObject
 */
class PufferFish extends MovableObject {
    
    imagesPufferFish = {
        swimming : [
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png'
        ],
        dead : [
            'img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png',
            'img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png',
            'img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png'
        ],
        blowing : [
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition1.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition2.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition3.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition4.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition5.png'
        ],
        swimmingBlowed : [
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim1.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim2.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim3.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim4.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim5.png'
        ]
    };

    /** Current animation frame index */
    currentImageIndex = 0;
    /** Has movement been started (interval created) */
    startedMoving = false;
    /** Sprite dimensions (px) */
    height = 100;
    width = 100;
    /** State flags */
    dead = false;
    blownUp = false; // inflated state
    blownSwimming = false; // swimming while inflated
    /** Hitbox offsets (smaller than sprite) */
    offset = { top: 15, bottom: 35, left: 10, right: 20 };

    /**
     * Create a new PufferFish
     * @param {number} x - Base x coordinate where this pufferfish will spawn
     */
    constructor(x) {
        super().loadImage('img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
        // Randomized speed within a slow range
        this.speed = 0.5 + Math.random() * 1;

        // Preload animation frames
        this.loadImages(this.imagesPufferFish.swimming);
        this.loadImages(this.imagesPufferFish.dead);
        this.loadImages(this.imagesPufferFish.blowing);
        this.loadImages(this.imagesPufferFish.swimmingBlowed);

        // Slight random offset so multiple puffers don't align exactly
        this.x = x + Math.random() * 500;
        this.y = 400 - Math.random() * 400;
    }

    /**
     * Start movement when the player is close enough.
     * This method checks the character position and, if within
     * `startMovingDistance`, creates a stoppable interval that moves
     * the puffer left each frame.
     *
     * Called repeatedly by World after the puffer's `world` reference
     * has been set.
     */
    startMoving() {
        if (this.world.character.x + this.startMovingDistance > this.x && !this.startedMoving) {
            setStoppableIntervals(() => this.moveLeft(this.speed), 1000 / 60);
            this.startedMoving = true;
        }
    }
    
    /**
     * Animation update for the PufferFish.
     * States (priority):
     * 1. If `blownUp` and not yet `blownSwimming`: play blowing transition frames
     *    and switch to blownSwimming when the transition completes.
     * 2. If `blownSwimming`: play blown-up swimming animation.
     * 3. If not dead: play normal swimming animation.
     * 4. If dead: play death animation.
     */
    animate() {
        if (this.blownUp && !this.blownSwimming && !this.dead) {
            this.playAnimation(this.imagesPufferFish.blowing);
            if (this.currentImageIndex % this.imagesPufferFish.blowing.length === this.imagesPufferFish.blowing.length - 1 && !this.blownSwimming) {
                this.blownSwimming = true;
                this.currentImageIndex = 0;
            }
        } else if (this.blownSwimming && !this.dead) {
            this.playAnimation(this.imagesPufferFish.swimmingBlowed);
        } else if (!this.dead) {
            this.playAnimation(this.imagesPufferFish.swimming);
        } else if (this.dead) {
            this.playAnimation(this.imagesPufferFish.dead);
        }
    }
}