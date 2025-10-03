class Character extends MovableObject {

    imagesCharacter = {
        standing : [
            'img/1.Sharkie/1.IDLE/1.png',
            'img/1.Sharkie/1.IDLE/2.png',
            'img/1.Sharkie/1.IDLE/3.png',
            'img/1.Sharkie/1.IDLE/4.png',
            'img/1.Sharkie/1.IDLE/5.png',
            'img/1.Sharkie/1.IDLE/6.png',
            'img/1.Sharkie/1.IDLE/7.png',
            'img/1.Sharkie/1.IDLE/8.png',
            'img/1.Sharkie/1.IDLE/9.png',
            'img/1.Sharkie/1.IDLE/10.png',
            'img/1.Sharkie/1.IDLE/11.png',
            'img/1.Sharkie/1.IDLE/12.png',
            'img/1.Sharkie/1.IDLE/13.png',
            'img/1.Sharkie/1.IDLE/14.png',
            'img/1.Sharkie/1.IDLE/15.png',
            'img/1.Sharkie/1.IDLE/16.png',
            'img/1.Sharkie/1.IDLE/17.png',
            'img/1.Sharkie/1.IDLE/18.png',
        ],
        swimming : [
            'img/1.Sharkie/3.Swim/1.png',
            'img/1.Sharkie/3.Swim/2.png',
            'img/1.Sharkie/3.Swim/3.png',
            'img/1.Sharkie/3.Swim/4.png',
            'img/1.Sharkie/3.Swim/5.png',
            'img/1.Sharkie/3.Swim/6.png'
        ],
        hurtPoisoned : [
            'img/1.Sharkie/5.Hurt/1.Poisoned/1.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/2.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/3.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/4.png'
        ],
        hurtElectric : [
            'img/1.Sharkie/5.Hurt/2.Electric shock/.o1.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/.o2.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/.o1.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/.o2.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/.o1.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/.o2.png'
        ],
        dead : [
            'img/1.Sharkie/6.dead/1.Poisoned/1.png',
            'img/1.Sharkie/6.dead/1.Poisoned/2.png',
            'img/1.Sharkie/6.dead/1.Poisoned/3.png',
            'img/1.Sharkie/6.dead/1.Poisoned/4.png',
            'img/1.Sharkie/6.dead/1.Poisoned/5.png',
            'img/1.Sharkie/6.dead/1.Poisoned/6.png',
            'img/1.Sharkie/6.dead/1.Poisoned/7.png',
            'img/1.Sharkie/6.dead/1.Poisoned/8.png',
            'img/1.Sharkie/6.dead/1.Poisoned/9.png',
            'img/1.Sharkie/6.dead/1.Poisoned/10.png',
            'img/1.Sharkie/6.dead/1.Poisoned/11.png',
            'img/1.Sharkie/6.dead/1.Poisoned/12.png'            
        ],
        stillDead : [
            'img/1.Sharkie/6.dead/1.Poisoned/12.png'            
        ]

    }

    offset = { top: 160,
        bottom: 80,
        left: 50,
        right: 50
    }

    currentImageIndex = 0;
    height = 300;
    width = 220;
    x = 100;
    y = 100;
    world;
    dead = false;


    constructor() {
        super().loadImage('img/1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.imagesCharacter.standing);
        this.loadImages(this.imagesCharacter.swimming);
        this.loadImages(this.imagesCharacter.hurtPoisoned);
        this.loadImages(this.imagesCharacter.dead);
        this.moveCharacter();
        this.animate();
        
    }

    moveCharacter() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX && !this.isDead()) {
                this.x += 5;
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 100  && !this.isDead()) {
                this.x -= 5;
                this.otherDirection = true;
            }
            if (this.world.keyboard.UP  && this.y > -140 && !this.isDead()) {
                this.y -= 5;
            }
            if (this.world.keyboard.DOWN && this.y < this.world.canvas.height - this.height + 50 && !this.isDead()) {
                this.y += 5;
            }
            this.world.camera_x = -this.x + 100; // camera follows character
        }, 1000 / 60); // 60 frames per second
    }
    
    animate() {
        setInterval(() => {
            if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) && !this.isHurt) {
            this.playAnimation(this.imagesCharacter.swimming);
        }

        else if (this.isDead() && !this.dead) {
                this.playAnimation(this.imagesCharacter.dead);
                if (this.currentImageIndex % this.imagesCharacter.dead.length === this.imagesCharacter.dead.length - 1) {
                    this.dead = true;
                    this.currentImageIndex = 0;
                }
        }
        else if (this.dead) {
            this.playAnimation(this.imagesCharacter.stillDead);

        }

        else if (this.isHurt()) {
            this.playAnimation(this.imagesCharacter.hurtPoisoned);
        }

        else if (!this.isDead() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.UP && !this.world.keyboard.DOWN) {
            this.playAnimation(this.imagesCharacter.standing);
        }}, 1000 / 6);
    }

    

    jump() {

    }
}