class MovableObject extends DrawableObject {

    otherDirection = false;
    lastHit = 0;
    gravity = 2; // pixels per tick^2, just a start value
    speedY = 0;
    keyboard;
    startMovingDistance = 1000;
    isPoisoned = false;
    isElectrified = false;
    bitingSharkie = false;
    health = 100;

    getHitbox() {
        // Ensure offset fields exist (fallback to 0) to avoid NaN when a caller
        // assigns a partial offset object.
        const off = Object.assign({ top: 0, bottom: 0, left: 0, right: 0 }, this.offset || {});
        return {
            x: this.x + off.left,
            y: this.y + off.top,
            width: this.width - off.left - off.right,
            height: this.height - off.top - off.bottom
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

    isCollidingWithBox(box) {
        let a = this.getHitbox();
        let b = box;

        return (
            a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.x < b.x + b.width &&
            a.y < b.y + b.height
        );
    }

    hit(damage, hittedBy) {
        let now = new Date().getTime();
        if (now - this.lastHit < 1200) return; // 1.2 Sek. Immunität
        this.lastHit = now;

        if (this instanceof Character) {
            this.world.character.health -= damage;

            if (hittedBy === 'poison') {
                this.isPoisoned = true;
                this.world.playSound('audio/hurt-poisen.wav', 0.4);
            }
            if (hittedBy === 'electric') {
                this.isElectrified = true;
                this.world.playSound('audio/electric-shock.wav', 0.4);
            }
            if (this.world.character.health <= 0) {
                this.world.character.health = 0;
                this.world.playSound('audio/dead.mp3', 0.4);
            }
        } else {
            this.health -= damage;
            if (this.health <= 0) {
                this.health = 0;
                this.dead = true;
                this.world.playSound('audio/dead.mp3', 0.4);
            }
        }
    }



    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed < 1200; // 1 Sekunde "hurt"-Status
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