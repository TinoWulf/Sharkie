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
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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