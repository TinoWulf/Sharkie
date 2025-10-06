class MovableObject extends DrawableObject {

    otherDirection = false;
    lastHit = 0;
    gravity = 2; // pixels per tick^2, just a start value
    speedY = 0;

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

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        }
        else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit
        timepassed = timepassed / 1000;
        return timepassed < 1;
        //return this.energy  < 100 && this.energy > 0;
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    moveLeft(speed) {
        setInterval(() => {
            this.x -= speed; // move left by 'speed' pixels every 1/60 second
        }, 1000 / 60); // 60 frames per second
    }


    isAboveCharacter() {        
        return this.world.character.y + this.world.character.height - this.height;
    }


    applyGravity() {
    setInterval(() => {
        console.log(this.speedY);
        
        if (this.y < this.isAboveCharacter()) {
            this.y += this.speedY;
            this.speedY += this.gravity;
        } else {
            this.y = this.isAboveCharacter();
            this.speedY = 0;
        }
    }, 1000 / 25);
}



}