class Collectable extends MovableObject {
    height = 50;
    width = 50;
    collected = false;
    offset = { top: 12, bottom: 12, left: 12, right: 12 };
    imageType = {
        life: 'img/4. Marcadores/green/100_  copia 3.png',
        poison: 'img/4. Marcadores/green/100_ copia 5.png',
        coin: 'img/4. Marcadores/green/100_ copia 6.png'
    }

    constructor(x = null, y = null, type = 'coin') {
        super();
        this.type = type;

        // Load image for type
        this.loadImage(this.imageType[type]);

        // Random position if not specified
        this.x = x ?? Collectable.randomX();
        this.y = y ?? Collectable.randomY();

        setStoppableIntervals(() => this.collect(), 1000 / 60);
    }

    collect() {
        if (this.collected) {
            this.y -= 5; // Move up
            if (this.y < -50) this.y = -50;
        }
    }

    // --- Static helpers for random positioning ---
    static randomX() {
        return 1000 + Math.random() * (8000 - 1000); // X between 1000–8000
    }

    static randomY() {
        return 100 + Math.random() * 300; // Y between 100–400 (adjustable)
    }

    // --- Optional: spawn a batch of coins ---
    static spawnBatch(count = 10, type = 'coin') {
        const coins = [];
        for (let i = 0; i < count; i++) {
            coins.push(new Collectable(null, null, type));
        }
        return coins;
    }
}
