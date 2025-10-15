class PufferFish extends MovableObject {
    
    imagesPufferFish = {
        swimming : [
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png'
        ],
        dead : [
            'img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png',
            'img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png',
            'img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png'
        ],
        blowing : [
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition1.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition2.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition3.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition4.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition5.png'
        ],
        swimmingBlowed : [
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim1.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim2.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim3.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim4.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim5.png'
        ]
    };

    currentImageIndex = 0;
    height = 100;
    width = 100;
    dead = false;
    blownUp = false;
    blownSwimming = false;
    offset = {  top: 15,
                bottom: 35,
                left: 10,
                right: 20
        };

    constructor(x) {
        super().loadImage('img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
        setStoppableIntervals(() => this.animate(), 1000 / 6);
        setStoppableIntervals(() => this.moveLeft(this.speed), 1000 / 60);
        this.speed = 0.5 + Math.random() * 1;  //random speed between 0.5 and 1.5
        this.loadImages(this.imagesPufferFish.swimming);
        this.loadImages(this.imagesPufferFish.dead);
        this.loadImages(this.imagesPufferFish.blowing);
        this.loadImages(this.imagesPufferFish.swimmingBlowed);
        this.x = x + Math.random() * 500; // random x position between 600 and 1100
        this.y = 400 - Math.random() * 400; // fixed y position
    }
    
    animate() {
        if (this.blownUp && !this.blownSwimming && !this.dead) {
            this.playAnimation(this.imagesPufferFish.blowing);
            if (this.currentImageIndex % this.imagesPufferFish.blowing.length === this.imagesPufferFish.blowing.length - 1 && !this.blownSwimming) {
                this.blownSwimming = true;
                this.currentImageIndex = 0;
            }
        } else if (this.blownSwimming && !this.dead) {
            this.playAnimation(this.imagesPufferFish.swimmingBlowed);
        } else if (!this.dead) {
            this.playAnimation(this.imagesPufferFish.swimming);
        } else if (this.dead) {
            this.playAnimation(this.imagesPufferFish.dead);
        }
    }
}