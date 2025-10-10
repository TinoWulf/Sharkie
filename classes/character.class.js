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
        ],
        attack : {
            bubble : [
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png',
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png',
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png',
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png',
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png',
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png',
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png',
                'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png'
            ]
        }

    }

    offset = { top: 140,
        bottom: 70,
        left: 40,
        right: 40
    }

    currentImageIndex = 0;
    height = 250;
    width = 180;
    x = 100;
    y = 100;
    world;
    dead = false;
    isAttacking = false;


    constructor() {
        super().loadImage('img/1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.imagesCharacter.standing);
        this.loadImages(this.imagesCharacter.swimming);
        this.loadImages(this.imagesCharacter.hurtPoisoned);
        this.loadImages(this.imagesCharacter.dead);
        this.loadImages(this.imagesCharacter.attack.bubble);
        this.moveCharacter();
        this.animate();
    }


    moveCharacter() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX && !this.isDead()) {
                this.x += 3;
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 100  && !this.isDead()) {
                this.x -= 3;
                this.otherDirection = true;
            }
            if (this.world.keyboard.UP  && this.y > -140 && !this.isDead()) {
                this.y -= 2;
            }
            if (this.world.keyboard.DOWN && this.y < this.world.canvas.height - this.height + 50 && !this.isDead()) {
                this.y += 2;
            }
            this.world.camera_x = -this.x + 100; // camera follows character
        }, 1000 / 60); // 60 frames per second
    }
    
    animate() {
        setInterval(() => {

            // --- ATTACK START ---
            if (this.world.keyboard.SPACE && !this.isHurt() && !this.isDead() && !this.isAttacking) {
                this.isAttacking = true; // Angriff starten
                this.currentImageIndex = 0; // Animation von vorne
                this.playAttackAnimation();
                setTimeout(() => {
                    this.world.checkThrowableObjects();
                }, 350); // Verzögerung, damit die Blase zur richtigen Zeit geworfen wird
            }

            // --- BEWEGUNG / ZUSTÄNDE ---
            else if (!this.isAttacking) {
                if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) && !this.isHurt()) {
                    this.playAnimation(this.imagesCharacter.swimming);
                } else if (this.isDead() && !this.dead) {
                    this.playAnimation(this.imagesCharacter.dead);
                    if (this.currentImageIndex % this.imagesCharacter.dead.length === this.imagesCharacter.dead.length - 1) {
                        this.dead = true;
                        this.currentImageIndex = 0;
                    }
                } else if (this.dead) {
                    this.playAnimation(this.imagesCharacter.stillDead);
                } else if (this.isHurt()) {
                    this.playAnimation(this.imagesCharacter.hurtPoisoned);
                } else {
                    this.playAnimation(this.imagesCharacter.standing);
                }
            }
        }, 1000 / 10); // 10 FPS für normale Animationen
    }


    playAttackAnimation() {
    const frames = this.imagesCharacter.attack.bubble;
    let i = 0;

    const attackInterval = setInterval(() => {
        this.loadImage(frames[i]);
        i++;

        // Wenn die Animation fertig ist:
        if (i >= frames.length) {
            clearInterval(attackInterval);
            this.isAttacking = false; // Angriff beendet
            this.currentImageIndex = 0;
        }
    }, 50); // 100 ms pro Frame → ca. 10 FPS
}


}