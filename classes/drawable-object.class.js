class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 100;
    y = 100;
    height = 150;
    width = 100;



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
        // Defensive: ensure this.img is a valid HTMLImageElement (or similar) before drawing
        if (!this.img) {
            // try to pick a cached image as a fallback
            const keys = Object.keys(this.imageCache);
            if (keys.length) {
                this.img = this.imageCache[keys[0]];
            }
        }
        if (this.img && this.img instanceof HTMLImageElement) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx) {
        // nur wenn eine Offset-Hitbox definiert ist
        if (this.offset) {
            let box = this.getHitbox();
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'red';
            ctx.rect(box.x, box.y, box.width, box.height);
            ctx.stroke();
        }
    }
}