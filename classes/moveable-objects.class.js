class MovableObject {
    x = 10;
    y = 120;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    otherDirection = false;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Endboss || this instanceof PufferFish) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokestyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x + mo.width &&
               this.y < mo.y + mo.height;
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
}