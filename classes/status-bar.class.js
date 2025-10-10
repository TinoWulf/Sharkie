class StatusBar extends DrawableObject {

    statusImages = {
        coins : [
            'img/4. Marcadores/green/Coin/0_  copia 4.png',
            'img/4. Marcadores/green/Coin/20_  copia 2.png',
            'img/4. Marcadores/green/Coin/40_  copia 4.png',
            'img/4. Marcadores/green/Coin/60_  copia 4.png',
            'img/4. Marcadores/green/Coin/80_  copia 4.png',
            'img/4. Marcadores/green/Coin/100_ copia 4.png'
        ],
        life : [
            'img/4. Marcadores/green/Life/0_  copia 3.png',
            'img/4. Marcadores/green/Life/20_ copia 4.png',
            'img/4. Marcadores/green/Life/40_  copia 3.png',
            'img/4. Marcadores/green/Life/60_  copia 3.png',
            'img/4. Marcadores/green/Life/80_  copia 3.png',
            'img/4. Marcadores/green/Life/100_  copia 2.png'
        ],
        poison : [
            'img/4. Marcadores/green/poisoned bubbles/0_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/20_ copia 3.png',
            'img/4. Marcadores/green/poisoned bubbles/40_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/60_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/80_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/100_ copia 3.png'
        ],
        instructions : [
            'img/6.Botones/Instructions 2.png'
        ]
    }

    health = 100;
    coins = 0;
    poison = 0;
    type; // 'life', 'coins', 'poison', 'instructions'

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
        this.loadImages(this.statusImages.instructions);
        this.checkType();
    }

    checkType() {
        switch (this.type) {
        case 'life':
            this.setHealth(100);
            break;
        case 'coins':
            this.setCoins(0);
            break;
        case 'poison':
            this.setPoison(0);
            break;
        case 'instructions':
            this.setInstructions();
            break;
        }
    }

    setInstructions() {
        let images = this.statusImages[this.type];
        let path = images[0];
        this.img = this.imageCache[path];
    }

    setPoison(poison) {
        this.poison = poison
        let images = this.statusImages[this.type];
        let path = images[this.returnImageIndex(this.poison)];
        this.img = this.imageCache[path];
    }

    setCoins(coins) {
        this.coins = coins
        let images = this.statusImages[this.type];
        let path = images[this.returnImageIndex(this.coins)];
        this.img = this.imageCache[path];
    }

    setHealth(health) {
        this.health = health
        let images = this.statusImages[this.type];
        let path = images[this.returnImageIndex(this.health)];
        this.img = this.imageCache[path];
    }

    returnImageIndex(type) {
        // Map health (0-100) to image index (0..5)
        if (!type && type !== 0) type = 100;
        if (type >= 100) return 5;
        if (type >= 80) return 4;
        if (type >= 60) return 3;
        if (type >= 40) return 2;
        if (type >= 20) return 1;
        return 0;
    }
}