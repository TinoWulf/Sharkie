/**
 * EndbossHealthBar
 *
 * Small UI component that tracks the Endboss health and displays one of a set
 * of preloaded images according to the boss' current HP. The bar positions
 * itself relative to the boss so it follows during movement.
 */
class EndbossHealthBar extends DrawableObject {

    /**
     * @param {Endboss} boss - reference to the boss instance to track
     */
    constructor(boss) {
        super();
        this.boss = boss;
        this.width = 150;
        this.height = 40;

        this.healthImages = {
            200: 'img/4. Marcadores/Purple/100_ .png',
            160: 'img/4. Marcadores/Purple/80_ .png',
            120: 'img/4. Marcadores/Purple/60_ .png',
            80:  'img/4. Marcadores/Purple/40_ .png',
            40:  'img/4. Marcadores/Purple/20__1.png',
            0:   'img/4. Marcadores/Purple/0_ .png'
        };

        // preload the images into the parent's image cache
        Object.values(this.healthImages).forEach(path => this.loadImages([path])); // Load each image
        this.setBossHealth(this.boss.health);
    }

    /**
     * Choose the image that matches the current health thresholds and assign
     * it to `this.img` so `draw()` can render it.
     * @param {number} health
     */
    setBossHealth(health) {
        let thresholds = [200, 160, 120, 80, 40, 0];

        let level = thresholds.find(v => health >= v); // Find highest threshold met
        if (level === undefined) level = 0; // Fallback to 0 if none found

        this.img = this.imageCache[this.healthImages[level]]; 
    }

    /**
     * Update position so the health bar follows the boss.
     */
    updatePosition() {
        this.x = this.boss.x + this.boss.width / 2 - this.width / 2;
        this.y = this.boss.y + 70;
    }
}
