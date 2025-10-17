class MovableObject extends DrawableObject {

    otherDirection = false;
    lastHit = 0;
    gravity = 2; // pixels per tick^2, just a start value
    speedY = 0;
    keyboard;
    startMovingDistance = 1000;
    isPoisoned = false;
    isElectrified = false;

    getHitbox() {
        return {
            x: this.x + this.offset.left,
            y: this.y + this.offset.top,
            width: this.width - this.offset.left - this.offset.right,
            height: this.height - this.offset.top - this.offset.bottom
        };
    }

    isColliding(mo) {
        let a = this.getHitbox();
        let b = mo.getHitbox();

        return (
            a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.x < b.x + b.width &&
            a.y < b.y + b.height
        );
    }

    hit(damage, hittedBy) {
        let now = new Date().getTime();
        if (now - this.lastHit < 1000) return; // 1 Sekunde Immunität nach Hit

        this.world.character.health -= damage;
        this.lastHit = now;

        if (hittedBy === 'poison') this.isPoisoned = true;
        if (hittedBy === 'electric') this.isElectrified = true;

        if (this.world.character.health <= 0) {
            this.world.character.health = 0;
        }
    }

    /*
    hit(damage, hittedBy) {
        this.world.character.health -= damage;
        if (hittedBy == 'poison') {
            this.isPoisoned = true;
        } else if (hittedBy == 'electric') {
            this.isElectrified = true;
        }
        if (this.world.character.health < 0) {
            this.world.character.health = 0;
        }
        else {
            this.lastHit = new Date().getTime();
        }
    }
    */

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit
        timepassed = timepassed / 1000;
        return timepassed < 1;
        //return this.energy  < 100 && this.energy > 0;
    }

    isDead() {
        return this.world.character.health == 0;        
    }

    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    moveLeft(speed) {
            this.x -= speed; // move left by 'speed' pixels every 1/60 second
    }

    moveRight(speed) {
        setInterval(() => {
            this.x += speed; // move right by 'speed' pixels every 1/60 second
        }, 1000 / 60); // 60 frames per second
    }

    applyGravity() {
                this.y += this.speedY;
                this.speedY += this.gravity;
    }



}