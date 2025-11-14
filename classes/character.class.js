class Character extends MovableObject {

    imagesCharacter = {
        standing: [
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
        swimming: [
            'img/1.Sharkie/3.Swim/1.png',
            'img/1.Sharkie/3.Swim/2.png',
            'img/1.Sharkie/3.Swim/3.png',
            'img/1.Sharkie/3.Swim/4.png',
            'img/1.Sharkie/3.Swim/5.png',
            'img/1.Sharkie/3.Swim/6.png'
        ],
        hurtPoisoned: [
            'img/1.Sharkie/5.Hurt/1.Poisoned/1.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/2.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/3.png',
            'img/1.Sharkie/5.Hurt/1.Poisoned/4.png'
        ],
        hurtElectric: [
            'img/1.Sharkie/5.Hurt/2.Electric shock/1.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/2.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/3.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/1.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/2.png',
            'img/1.Sharkie/5.Hurt/2.Electric shock/3.png'
        ],
        dead: {
            poisoned: [
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
            electric: [
                'img/1.Sharkie/6.dead/2.Electro_shock/1.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/2.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/3.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/4.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/5.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/6.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/7.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/8.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/9.png',
                'img/1.Sharkie/6.dead/2.Electro_shock/10.png'
            ]
        },
        stillDead: {
            poisoned: [
                'img/1.Sharkie/6.dead/1.Poisoned/12.png'
            ],
            electric: [
                'img/1.Sharkie/6.dead/2.Electro_shock/10.png'
            ]
        },
        attack: [
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png',
            'img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png'
        ],
        attackForWhale: [
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png',
            'img/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png'
        ],
        fallAsleep: [
            'img/1.Sharkie/2.Long_IDLE/i1.png',
            'img/1.Sharkie/2.Long_IDLE/I2.png',
            'img/1.Sharkie/2.Long_IDLE/I3.png',
            'img/1.Sharkie/2.Long_IDLE/I4.png',
            'img/1.Sharkie/2.Long_IDLE/I5.png',
            'img/1.Sharkie/2.Long_IDLE/I6.png',
            'img/1.Sharkie/2.Long_IDLE/I7.png',
            'img/1.Sharkie/2.Long_IDLE/I8.png',
            'img/1.Sharkie/2.Long_IDLE/I9.png',
            'img/1.Sharkie/2.Long_IDLE/I10.png',
            'img/1.Sharkie/2.Long_IDLE/I11.png',
            'img/1.Sharkie/2.Long_IDLE/I12.png',
            'img/1.Sharkie/2.Long_IDLE/I13.png',
            'img/1.Sharkie/2.Long_IDLE/I14.png'
        ],
        sleeping: [
            'img/1.Sharkie/2.Long_IDLE/I11.png',
            'img/1.Sharkie/2.Long_IDLE/I12.png',
            'img/1.Sharkie/2.Long_IDLE/I13.png',
            'img/1.Sharkie/2.Long_IDLE/I14.png'
        ]

    }

    offset = {
        top: 140,
        bottom: 70,
        left: 40,
        right: 40
    }
    lastKeyPressTime = 0;
    sleepInterval = null;
    currentImageIndex = 0;
    height = 250;
    width = 180;
    x = 100;
    y = 100;
    health = 100;
    world;
    deadByElectric = false;
    deadByPoison = false;
    isAttacking = false;
    waitingForAttack = false;
    isSleeping = false;
    isFallingAsleep = false;


    constructor() {
        super().loadImage('img/1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.imagesCharacter.standing);
        this.loadImages(this.imagesCharacter.swimming);
        this.loadImages(this.imagesCharacter.hurtPoisoned);
        this.loadImages(this.imagesCharacter.hurtElectric);
        this.loadImages(this.imagesCharacter.dead.poisoned);
        this.loadImages(this.imagesCharacter.dead.electric);
        this.loadImages(this.imagesCharacter.attack);
        this.loadImages(this.imagesCharacter.attackForWhale);
        this.loadImages(this.imagesCharacter.fallAsleep);
        this.loadImages(this.imagesCharacter.sleeping);
        this.lastKeyPressTime = new Date().getTime();
    }

    moveCharacter() {
        let kb = this.world.keyboard;
        this.isMoving(kb);
        this.isNotMoving(kb);
        this.world.camera_x = -this.x + 100; // camera follows character
    }

    isMoving(kb) {
        if (kb.RIGHT && this.x < this.world.level.levelEndX && !this.isDead()) {
            this.x += 3;
            this.otherDirection = false;
        }
        if (kb.LEFT && this.x > 100 && !this.isDead()) {
            this.x -= 3;
            this.otherDirection = true;
        }
        if (kb.UP && this.y > -100 && !this.isDead()) {
            this.y -= 2;
        }
        if (kb.DOWN && this.y < this.world.canvas.height - this.height + 50 && !this.isDead()) {
            this.y += 2;
        }
    }

    isNotMoving(kb) {
        if (!kb.RIGHT && !kb.LEFT && !kb.UP && !kb.DOWN && !this.isDead() && !this.isAttacking && !this.isHurt()) {
            let currentTime = new Date().getTime();
            let timeSinceLastKeyPress = currentTime - this.lastKeyPressTime;
            if (timeSinceLastKeyPress > 10000 && !this.isFallingAsleep && !this.isSleeping && !this.isDead() && !this.isAttacking) {
                this.isFallingAsleep = true;
            }
        } else {
            this.lastKeyPressTime = new Date().getTime();
            this.isFallingAsleep = false;
            this.isSleeping = false;
        }
    }

    animate() {
        if (this.world.keyboard.SPACE && !this.isHurt() && !this.isDead() && !this.isAttacking && !this.waitingForAttack) {
            this.characterIsAttacking();
        }
        else if (!this.isAttacking) {
            this.characterAnimationWithoutAttacking();
        }
    }

    characterAnimationWithoutAttacking() {
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) && !this.isHurt() && !this.isDead()) {
            this.playAnimation(this.imagesCharacter.swimming);
        } else if (this.isDead() && !this.deadByElectric && !this.deadByPoison) {
            this.characterIsDeadBy();
        } else if (this.deadByPoison) {
            this.playAnimation(this.imagesCharacter.stillDead.poisoned);
        } else if (this.deadByElectric) {
            this.playAnimation(this.imagesCharacter.stillDead.electric);
        } else if (this.isFallingAsleep && !this.isSleeping) {
            this.characterIsSleeping();
        } else if (this.isHurt() && this.isPoisoned) {
            this.characterIsHurtByPoison();
        } else if (this.isHurt() && this.isElectrified) {
            this.characterIsHurtByElectric();
        } else if (!this.isSleeping && !this.isFallingAsleep && !this.isDead() && !this.isAttacking) {
            this.playAnimation(this.imagesCharacter.standing);
        }
    }

    characterIsAttacking() {
        this.isAttacking = true;
        this.waitingForAttack = true;
        this.currentImageIndex = 0;
        const poisonFull = this.world.statusBar[2].poison >= 100;
        if (poisonFull) {
            this.playAttackAnimation(this.imagesCharacter.attackForWhale);
        } else {
            this.playAttackAnimation(this.imagesCharacter.attack);
        }
        setTimeout(() => {
            this.world.checkThrowableObjects(poisonFull);
            this.world.playSound('audio/bubble-pop-06-351337.mp3', 0.4);
        }, 350);
    }


    characterIsDeadBy() {
        if (this.isPoisoned) {
            this.playAnimation(this.imagesCharacter.dead.poisoned);
            if (this.currentImageIndex % this.imagesCharacter.dead.poisoned.length === this.imagesCharacter.dead.poisoned.length - 1) {
                this.deadByPoison = true;
                this.currentImageIndex = 0;
            }
        } else if (this.isElectrified) {
            this.playAnimation(this.imagesCharacter.dead.electric);
            if (this.currentImageIndex % this.imagesCharacter.dead.poisoned.length === this.imagesCharacter.dead.poisoned.length - 1) {
                this.deadByElectric = true;
                this.currentImageIndex = 0;
            }
        }
    }

    characterIsSleeping() {
        this.playAnimation(this.imagesCharacter.fallAsleep);
        if (this.currentImageIndex % this.imagesCharacter.fallAsleep.length === this.imagesCharacter.fallAsleep.length - 1) {
            this.isSleeping = true;
            this.isFallingAsleep = false;
            this.currentImageIndex = 0;
            this.playSleepingAnimation();
        }
    }

    characterIsHurtByPoison() {
        this.playAnimation(this.imagesCharacter.hurtPoisoned);
        setTimeout(() => {
            if (!this.isHurt()) this.isPoisoned = false;
        }, 1200);
    }

    characterIsHurtByElectric() {
        this.playAnimation(this.imagesCharacter.hurtElectric);
        setTimeout(() => {
            if (!this.isHurt()) this.isElectrified = false;
        }, 1200);
    }

    playSleepingAnimation() {
        if (this.sleepInterval) {
            clearInterval(this.sleepInterval);
            this.sleepInterval = null;
        }

        this.sleepInterval = setInterval(() => {
            if (this.isSleeping) {
                this.playAnimation(this.imagesCharacter.sleeping);
            } else {
                clearInterval(this.sleepInterval);
                this.sleepInterval = null;
            }
        }, 1000 / 5);
    }

    playAttackAnimation(frames) {
        frames = frames || this.imagesCharacter.attack;
        let i = 0;
        const attackInterval = setInterval(() => {
            this.loadImage(frames[i]);
            i++;
            if (i >= frames.length) {
                clearInterval(attackInterval);
                this.isAttacking = false;
                this.currentImageIndex = 0;
                setTimeout(() => {
                    this.waitingForAttack = false;
                }, 1000);
            }
        }, 50);
    }
}