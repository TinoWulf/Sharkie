class Throwable extends MovableObject {
    height = 30;
    width = 30;
    otherDirection = false;
    isPoisonedBubble = false;
    offset = { top: 5, bottom: 5, left: 5, right: 5 };

    constructor(x, y, otherDirection, isPoisonedBubble = false) {
        super();
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.isPoisonedBubble = isPoisonedBubble;
        if (this.isPoisonedBubble) {
            this.loadImage('img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png');
            console.log('yes');
        } else {
            this.loadImage('img/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        }
        this.throw();
    }

    throw() {
        this.speedY = 10;
        setStoppableIntervals(() => this.applyGravity(), 40);
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= 15;
            } else {
                this.x += 15;
            }
        }, 25);
    }

    getDamage() {
        return this.isPoisonedBubble ? 50 : 10;
    }
}
