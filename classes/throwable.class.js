class Throwable extends MovableObject {
    height = 30;
    width = 30;
    x = 100;
    y = 100;
    

    constructor() {
        super().loadImage('img/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        //this.animate();
        //this.moveRight(this.speedx);
        this.throw(this.x, this.y);
    }

    throw(x, y) {
        setInterval(() => {
        if (this.world.keyboard.SPACE) {
            this.x = x;
            this.y = y;
            this.speedY = 15;
            this.applyGravity();
        } 
    }, 1000 / 25);       
    }
}