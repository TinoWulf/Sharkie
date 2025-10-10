class Collectable extends MovableObject {
    height = 50;
    width = 50;
    collected = false;
    offset = {  top: 12,
                bottom: 12,
                left: 12,
                right: 12
    };
    imageType = {
        life : 'img/4. Marcadores/green/100_  copia 3.png',
        poison : 'img/4. Marcadores/green/100_ copia 5.png',
        coin : 'img/4. Marcadores/green/100_ copia 6.png'
    }

    constructor(x, y, type) {
        super();
        this.type = type; // Speichere den Typ
        this.loadImage(this.imageType[type]);
        this.x = x;
        this.y = y;
        this.collect();
    }

    collect() {
        setInterval(() => {
            if (this.collected) {
                this.y -= 5; // Move up by 5 pixels every interval
                if (this.y < -50) {
                    this.y = -50; // Stop moving up after reaching a certain height
                }
            }
        }, 1000 / 60); // 60 frames per second
    }
}