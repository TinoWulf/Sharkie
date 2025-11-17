/**
 * StatusBar
 *
 * UI element that displays and updates game status: health, coins collected,
 * poison ammo, and volume control. Each status bar shows a visual representation
 * (sprite image) that updates based on the current value.
 *
 * Inherits from DrawableObject for rendering to canvas.
 *
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    /** All status bar sprites organized by type and value percentage */
    statusImages = {
        coins: [
            'img/4. Marcadores/green/Coin/0_  copia 4.png',
            'img/4. Marcadores/green/Coin/20_  copia 2.png',
            'img/4. Marcadores/green/Coin/40_  copia 4.png',
            'img/4. Marcadores/green/Coin/60_  copia 4.png',
            'img/4. Marcadores/green/Coin/80_  copia 4.png',
            'img/4. Marcadores/green/Coin/100_ copia 4.png'
        ],
        life: [
            'img/4. Marcadores/green/Life/0_  copia 3.png',
            'img/4. Marcadores/green/Life/20_ copia 4.png',
            'img/4. Marcadores/green/Life/40_  copia 3.png',
            'img/4. Marcadores/green/Life/60_  copia 3.png',
            'img/4. Marcadores/green/Life/80_  copia 3.png',
            'img/4. Marcadores/green/Life/100_  copia 2.png'
        ],
        poison: [
            'img/4. Marcadores/green/poisoned bubbles/0_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/20_ copia 3.png',
            'img/4. Marcadores/green/poisoned bubbles/40_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/60_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/80_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/100_ copia 3.png'
        ],
        volume: {
            up: [
                'img/8.Volume/volume-up.png'
            ],
            down: [
                'img/8.Volume/volume-down.png'
            ]
        }
    }


    /** Bar type: 'life', 'coins', 'poison', or 'volume' */
    type;

    /**
     * Create a status bar UI element for the given type.
     * Loads all sprite variants (0-100% states) and initializes
     * the appropriate display image for the bar type.
     *
     * @param {string} type - status type: 'life', 'coins', 'poison', 'volume'
     * @param {number} x - canvas X position
     * @param {number} y - canvas Y position
     * @param {number} height - bar height in pixels
     * @param {number} width - bar width in pixels
     */
    constructor(type, x, y, height, width) {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        this.height = height;
        this.width = width;
        this.loadImages(this.statusImages.coins);
        this.loadImages(this.statusImages.life);
        this.loadImages(this.statusImages.poison);
        //this.loadImages(this.statusImages.instructions);
        this.loadImages(this.statusImages.volume.up);
        this.loadImages(this.statusImages.volume.down);
        this.checkType();
    }

    /**
     * Initialize the status bar based on its type.
     * Sets the initial display image and any default values.
     */
    checkType() {
        switch (this.type) {
            case 'life': this.setHealth(100); break;
            case 'coins': this.setCoins(0); break;
            case 'poison': this.setPoison(0); break;
            //case 'instructions': this.setInstructions(); break;
            case 'volume': this.setVolume(); break;
        }
    }


    /**
     * Set the volume button image based on global mute state.
     * Shows muted icon if muted, unmuted icon otherwise.
     */
    setVolume() {
        let images = globalMuted
            ? this.statusImages[this.type].down
            : this.statusImages[this.type].up;

        let path = images[0];
        this.img = this.imageCache[path];
    }

    /**
     * Update mute state and refresh the volume icon display.
     *
     * @param {boolean} isMuted - whether audio is muted
     */
    setMuted(isMuted) {
        this.percentage = isMuted ? 0 : 100;
    }



    /*setInstructions() {
        let images = this.statusImages[this.type];
        let path = images[0];
        this.img = this.imageCache[path];
    }*/

    /**
     * Update poison ammo count and display the corresponding bar image.
     *
     * @param {number} poison - current poison ammo count (0-100)
     */
    setPoison(poison) {
        this.poison = poison
        let images = this.statusImages[this.type];
        let path = images[this.returnImageIndex(this.poison)];
        this.img = this.imageCache[path];
    }

    /**
     * Update coin count and display the corresponding bar image.
     *
     * @param {number} coins - current coin count (0-100)
     */
    setCoins(coins) {
        this.coins = coins
        let images = this.statusImages[this.type];
        let path = images[this.returnImageIndex(this.coins)];
        this.img = this.imageCache[path];
    }

    /**
     * Update health points and display the corresponding bar image.
     *
     * @param {number} health - current health (0-100)
     */
    setHealth(health) {
        this.health = health
        let images = this.statusImages[this.type];
        let path = images[this.returnImageIndex(this.health)];
        this.img = this.imageCache[path];
    }

    /**
     * Map a numeric value (0-100) to the appropriate sprite index.
     * Returns an index into the statusImages array that represents
     * the visual fill level of the status bar.
     *
     * @param {number} type - value to map (0-100)
     * @returns {number} sprite index (0-5)
     */
    returnImageIndex(type) {
        if (!type && type !== 0) type = 100;
        if (type >= 100) return 5;
        if (type >= 80) return 4;
        if (type >= 60) return 3;
        if (type >= 40) return 2;
        if (type >= 20) return 1;
        return 0;
    }
}