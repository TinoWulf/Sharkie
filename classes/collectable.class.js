/**
 * Collectable
 *
 * Items the player can pick up: coins, health (life), or poison ammo. These
 * extend MovableObject to participate in collisions and can be spawned
 * randomly across the level.
 *
 * @extends MovableObject
 */
class Collectable extends MovableObject {
    /** Visual size of the collectable sprite */
    height = 50;
    width = 50;

    /** Whether the item has been collected and should float away */
    collected = false;

    /** Tight hitbox offset inside the sprite */
    offset = { top: 12, bottom: 12, left: 12, right: 12 };

    /** Default image path per type */
    imageType = {
        life: 'img/4. Marcadores/green/100_  copia 3.png',
        poison: 'img/4. Marcadores/green/100_ copia 5.png',
        coin: 'img/4. Marcadores/green/100_ copia 6.png'
    }

    /**
     * Create a collectable at an explicit or random location.
     * @param {number|null} x - X coordinate or null for random
     * @param {number|null} y - Y coordinate or null for random
     * @param {string} [type='coin'] - 'coin' | 'life' | 'poison'
     */
    constructor(x = null, y = null, type = 'coin') {
        super();
        this.type = type;
        this.loadImage(this.imageType[type]);
        this.x = x ?? Collectable.randomX();
        this.y = y ?? Collectable.randomY();
        setStoppableIntervals(() => this.collect(), 1000 / 60);
    }

    /**
     * If collected, the item floats upward and off-screen.
     */
    collect() {
        if (this.collected) {
            this.y -= 5;
            if (this.y < -50) this.y = -50;
        }
    }

    /** Generate a random X position within playable area */
    static randomX() {
        return 1000 + Math.random() * (8000 - 1000);
    }

    /** Generate a random Y position within reasonable vertical bounds */
    static randomY() {
        return 100 + Math.random() * 300;
    }

    /**
     * Spawn a batch of collectables of a given type.
     * @param {number} count - number of items
     * @param {string} type - item type
     * @returns {Collectable[]}
     */
    static spawnBatch(count = 10, type = 'coin') {
        const coins = [];
        for (let i = 0; i < count; i++) {
            coins.push(new Collectable(null, null, type));
        }
        return coins;
    }
}
