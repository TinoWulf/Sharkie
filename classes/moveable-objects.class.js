/**
 * MovableObject
 * `DrawableObject` to gain rendering capabilities and adds collision/physics
 * helpers such as gravity, hit detection and state flags used across enemies
}
 * and the player character.
 *
 * @extends DrawableObject
 */
/**
 * MovableObject
 *
 * Base class for all objects that move or are affected by physics. Extends
 * `DrawableObject` to gain rendering capabilities and adds collision/physics
 * helpers such as gravity, hit detection and state flags used across enemies
 * and the player character.
 *
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {

    /** Whether the sprite is flipped horizontally */
    otherDirection = false;

    /** Timestamp of last time this object was hit (ms) */
    lastHit = 0;

    /** Gravity acceleration applied to vertical speed */
    gravity = 2;

    /** Vertical velocity */
    speedY = 0;

    /** Optional keyboard reference for player or AI-driven movement */
    keyboard;

    /** Distance at which AI entities may start moving toward the player */
    startMovingDistance = 1000;

    /** Status flags applied when hit by poison/electric enemies */
    isPoisoned = false;
    isElectrified = false;
    bitingSharkie = false;

    /** Generic health value for enemies; player health is stored on Character */
    health = 100;

    /**
     * Compute the object's collision hitbox, applying the configured offset.
     * @returns {{x:number,y:number,width:number,height:number}}
     */
    getHitbox() {
        const off = Object.assign({ top: 0, bottom: 0, left: 0, right: 0 }, this.offset || {});
        return {
            x: this.x + off.left,
            y: this.y + off.top,
            width: this.width - off.left - off.right,
            height: this.height - off.top - off.bottom
        };
    }

    /**
     * Check AABB collision with another movable object.
     * @param {MovableObject} mo - other object
     * @returns {boolean}
     */
    isColliding(mo) {
        let a = this.getHitbox();
        let b = mo.getHitbox();

        return (
            a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.x < b.x + b.width &&
            a.y < b.y + b.height
        );
    }

    /**
     * Check AABB collision against a raw box object {x,y,width,height}.
     * @param {{x:number,y:number,width:number,height:number}} box
     * @returns {boolean}
     */
    isCollidingWithBox(box) {
        let a = this.getHitbox();
        let b = box;

        return (
            a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.x < b.x + b.width &&
            a.y < b.y + b.height
        );
    }

    /**
     * Apply damage to this object. Uses a short immunity window to avoid
     * multiple rapid hits. For the player (`Character`) the world health is
     * updated; for enemies their local `health` is reduced.
     *
     * @param {number} damage - amount of damage to apply
     * @param {string} hittedBy - cause of damage ('poison'|'electric'|...)
     */
    hit(damage, hittedBy) {
        if (this.isHurt()) return;
        this.lastHit = Date.now();

        if (this instanceof Character)
            this.handleCharacterHit(damage, hittedBy);
        else
            this.handleEnemyHit(damage);
    }

    /**
     * Handle damage application for the player character.
     * @param {number} damage
     * @param {string} hittedBy
     */
    handleCharacterHit(damage, hittedBy) {
        this.world.character.health = Math.max(0, this.world.character.health - damage);
        this.applyStatusEffects(hittedBy);
        if (this.world.character.health === 0)
            this.world.playSound('audio/dead.mp3', 0.4);
    }

    /**
     * Apply status effects based on the type of damage.
     * @param {string} type
     */
    applyStatusEffects(type) {
        if (type === 'poison') {
            this.isPoisoned = true;
            this.world.playSound('audio/hurt-poisen.wav', 0.4);
        }
        if (type === 'electric') {
            this.isElectrified = true;
            this.world.playSound('audio/electric-shock.wav', 0.4);
        }
    }

    /**
     * Handle damage application for enemies.
     * @param {number} damage
     */
    handleEnemyHit(damage) {
        this.health = Math.max(0, this.health - damage);
        if (this.health === 0) {
            this.dead = true;
            this.world.playSound('audio/dead.mp3', 0.4);
        }
    }

    /**
     * Whether the object is currently within the hit immunity window.
     * @returns {boolean}
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed < 1200;
    }

    /**
     * Convenience helper used by the Character code to determine player death.
     * Note: for non-player objects check `this.dead` or `this.health` instead.
     * @returns {boolean}
     */
    isDead() {
        return this.world.character.health == 0;
    }

    /**
     * Cycle through an array of image paths and display the next frame.
     * @param {string[]} images - array of image paths loaded in imageCache
     */
    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    /** Move left by a given speed */
    moveLeft(speed) {
        this.x -= speed;
    }

    /**
     * Move right. Note: this implementation uses setInterval which will create
     * a repeating timer; callers should prefer using the world's movement
     * loop for consistent motion when possible.
     */
    moveRight(speed) {
        setInterval(() => {
            this.x += speed;
        }, 1000 / 60);
    }

    /** Apply gravity to vertical position/velocity */
    applyGravity() {
        this.y += this.speedY;
        this.speedY -= this.gravity;
    }
}