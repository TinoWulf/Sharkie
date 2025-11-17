/**
 * Throwable (Bubble)
 *
 * Projectile spawned by the player's attack action. Extends MovableObject
 * to inherit gravity, collision detection, and animation capabilities.
 *
 * The bubble travels in the direction the character was facing and can be
 * poisoned (more damage) or regular (less damage). Collides with enemies
 * and applies damage on impact.
 *
 * @extends MovableObject
 */
class Throwable extends MovableObject {
    /** Visual dimensions of the bubble sprite */
    height = 30;
    width = 30;

    /** Direction: true means projectile travels left, false means right */
    otherDirection = false;

    /** Whether this bubble is powered by poison (higher damage) */
    isPoisonedBubble = false;

    /** Tight hitbox offset within the sprite */
    offset = { top: 5, bottom: 5, left: 5, right: 5 };

    /**
     * Create a new throwable bubble at the specified position, traveling
     * in the given direction. Loads the appropriate sprite (poisoned or regular)
     * and immediately starts movement and gravity.
     *
     * @param {number} x - spawn X coordinate
     * @param {number} y - spawn Y coordinate
     * @param {boolean} otherDirection - true for left, false for right
     * @param {boolean} [isPoisonedBubble=false] - whether bubble is powered
     */
    constructor(x, y, otherDirection, isPoisonedBubble = false) {
        super();
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.isPoisonedBubble = isPoisonedBubble;
        if (this.isPoisonedBubble) {
            this.loadImage('img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png');
            console.log('yes');
        } else {
            this.loadImage('img/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        }
        this.throw();
    }

    /**
     * Start the throwable's movement: apply gravity and horizontal velocity.
     * The bubble travels horizontally in the facing direction and falls
     * due to gravity over time.
     */
    throw() {
        this.speedY = 10;
        setStoppableIntervals(() => this.applyGravity(), 40);
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= 15;
            } else {
                this.x += 15;
            }
        }, 25);
    }

    /**
     * Get the damage value this bubble inflicts on impact.
     * Poisoned bubbles deal 50 damage; regular bubbles deal 10.
     *
     * @returns {number} damage value
     */
    getDamage() {
        return this.isPoisonedBubble ? 50 : 10;
    }
}
