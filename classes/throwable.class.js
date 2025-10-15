class Throwable extends MovableObject {
    
    height = 30;
    width = 30;
    otherDirection = false;
    offset = {  top: 5,
                bottom: 5,
                left: 5,
                right: 5
    };
        

    constructor(x, y, otherDirection) {
        super().loadImage('img/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw();
    }


    throw() {
        this.speedY = -20;
        setStoppableIntervals(() => this.applyGravity(), 40);
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
        }, 25);
    }
}