class PufferFish extends MovableObject {
    
    constructor() {
        super().loadImage('img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');

        this.x = 120 + Math.random() * 500; // random x position between 600 and 1100
        this.y = 300; // fixed y position
    }
    
    jump() {

    }
}