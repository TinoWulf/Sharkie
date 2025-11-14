class Endboss extends MovableObject {

    imagesEndboss = {
        introduce: [
            'img/2.Enemy/3 Final Enemy/1.Introduce/1.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/2.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/3.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/4.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/5.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/6.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/7.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/8.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/9.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/10.png'
        ],
        floating: [
            'img/2.Enemy/3 Final Enemy/2.Floating/1.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/2.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/3.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/4.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/5.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/6.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/7.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/8.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/9.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/10.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/11.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/12.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/13.png'
        ],
        attacking: [
            'img/2.Enemy/3 Final Enemy/Attack/1.png',
            'img/2.Enemy/3 Final Enemy/Attack/2.png',
            'img/2.Enemy/3 Final Enemy/Attack/3.png',
            'img/2.Enemy/3 Final Enemy/Attack/4.png',
            'img/2.Enemy/3 Final Enemy/Attack/5.png',
            'img/2.Enemy/3 Final Enemy/Attack/6.png'
        ],
        hurt: [
            'img/2.Enemy/3 Final Enemy/Hurt/1.png',
            'img/2.Enemy/3 Final Enemy/Hurt/2.png',
            'img/2.Enemy/3 Final Enemy/Hurt/3.png',
            'img/2.Enemy/3 Final Enemy/Hurt/4.png'
        ],
        dead: [
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
        ],
        stillDead: [
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
        ]
    };

    currentImageIndex = 0;
    introduced = false;
    speed = 15;
    speedDirection = 5;
    maxSpeed = 25;
    minSpeed = 10;
    dead = false;
    isDying = false;
    isPlayingDead = false;
    endbossIntroducingSound = false;

    attackOffset = { top: 190, bottom: 80, left: -60, right: -20 };
    bubbleOffset = { top: 200, bottom: 100, left: 60, right: 60 };

    offset = { top: 190, bottom: 80, left: -60, right: -20 };

    constructor() {
        super().loadImage('');
        this.loadImages(this.imagesEndboss.introduce);
        this.loadImages(this.imagesEndboss.floating);
        this.loadImages(this.imagesEndboss.attacking);
        this.loadImages(this.imagesEndboss.hurt);
        this.loadImages(this.imagesEndboss.dead);
        this.loadImages(this.imagesEndboss.stillDead);
        this.x = 9000;
        this.y = 20;
        this.height = 400;
        this.width = 300;
        this.health = 200;
        this.img = this.imageCache[this.imagesEndboss.introduce[0]];
    }

    hit(damage) {
        if (this.dead || this.isDying) return;
        this.health -= damage;
        if (this.world?.endbossHealthBar)
            this.world.endbossHealthBar.setBossHealth(this.health);
        this.lastHit = new Date().getTime();
        this.hurtTime = this.lastHit;
        this.isCurrentlyHurt = true;
        setTimeout(() => {
            this.isCurrentlyHurt = false;
        }, 900);
        this.playIsDyingSequence();
    }


    playIsDyingSequence() {
        if (this.health <= 0 && !this.isDying) {
            this.health = 0;
            this.isDying = true;
            setTimeout(() => {
                this.isPlayingDead = true;
            }, 1000);
            setTimeout(() => {
                console.log('check');

                this.dead = true;
                this.isDying = false;
                this.isPlayingDead = false;
            }, 1500);
        }
    }


    animate() {
        if (!this.world || this.world.character.isDead()) return;
        if (this.dead) { this.playAnimation(this.imagesEndboss.stillDead); return }
        if (this.isDying) { this.playIsDyingAnimation(); return }
        if (this.isCurrentlyHurt) { this.playAnimation(this.imagesEndboss.hurt); return }
        if (this.world.character.bitingSharkie) { this.playAnimation(this.imagesEndboss.attacking); return }
        if (this.world.character.x > 8100 && !this.introduced) { this.playEndbossIntroducing(); return }
        if (this.introduced) {
            this.playAnimation(this.imagesEndboss.floating);
            this.moveTowardsCharacter();
        }
    }


    playIsDyingAnimation() {
        if (this.isPlayingDead) {
            this.playAnimation(this.imagesEndboss.dead);
        } else {
            this.playAnimation(this.imagesEndboss.hurt);
        }
    }


    playEndbossIntroducing() {
        this.playAnimation(this.imagesEndboss.introduce);
        this.playEndbossSounds();
        if (this.currentImageIndex % this.imagesEndboss.introduce.length === this.imagesEndboss.introduce.length - 1) {
            this.introduced = true;
            this.currentImageIndex = 0;
        }
    }


    moveTowardsCharacter() {
        const character = this.world.character;
        this.speed += 0.02 * this.speedDirection;
        if (this.speed > this.maxSpeed || this.speed < this.minSpeed) {
            this.speedDirection *= -1;
        }
        this.moveHorizontal(character);
        this.moveVertical(character);
    }


    moveVertical(character) {
        if (character.y + character.height / 2 < this.y + this.height / 2) {
            this.y -= this.speed / 2;
        } else if (character.y + character.height / 2 > this.y + this.height / 2) {
            this.y += this.speed / 2;
        }
    }


    moveHorizontal(character) {
        if (character.x < this.x) {
            this.otherDirection = false;
            this.x -= this.speed;
        } else {
            this.otherDirection = true;
            this.x += this.speed;
        }
    }


    getAttackHitbox() {
        return {
            x: this.x + this.attackOffset.left,
            y: this.y + this.attackOffset.top,
            width: this.width - this.attackOffset.left - this.attackOffset.right,
            height: this.height - this.attackOffset.top - this.attackOffset.bottom
        };
    }


    getBubbleHitbox() {
        return {
            x: this.x + this.bubbleOffset.left,
            y: this.y + this.bubbleOffset.top,
            width: this.width - this.bubbleOffset.left - this.bubbleOffset.right,
            height: this.height - this.bubbleOffset.top - this.bubbleOffset.bottom
        };
    }


    playEndbossSounds() {
        if (!this.endbossIntroducingSound) {
            this.world.playSound('audio/introducing endboss.mp3', 0.4);
            this.world.playSound('audio/water splash.mp3', 0.4);
            this.endbossIntroducingSound = true;
        }
    }


    /*drawHitboxes(ctx) {
        // Attackbox red
        const attackBox = this.getAttackHitbox();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.rect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
        ctx.stroke();

        // Bubblehitbox green
        const bubbleBox = this.getBubbleHitbox();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'green';
        ctx.rect(bubbleBox.x, bubbleBox.y, bubbleBox.width, bubbleBox.height);
        ctx.stroke();
    }*/
}
