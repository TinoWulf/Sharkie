/**
 * DrawableObject
 *
 * Small utility base class for any object that can be drawn to a canvas.
 * Responsibilities:
 * - hold position and size information
 * - lazily load single images and preload image arrays into an image cache
 * - provide a defensive `draw(ctx)` that won't crash if images are not yet
 *   available
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 100;
    y = 100;
    height = 150;
    width = 100;

    /**
     * Load a single image and assign to `this.img`.
     * @param {string} path - image file path
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preload multiple images into the local `imageCache` for fast switching.
     * @param {string[]} arr - array of image paths
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draw the current image onto the provided CanvasRenderingContext2D. If
     * no image has been set, try to fall back to the first cached image.
     * This method guards against missing images and avoids runtime exceptions
     * while assets are still loading.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.img) {
            const keys = Object.keys(this.imageCache);
            if (keys.length) {
                this.img = this.imageCache[keys[0]];
            }
        }
        if (this.img && this.img instanceof HTMLImageElement) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /*
    drawFrame(ctx) {
        // only when an offset hitbox is defined
        if (this.offset) {
            let box = this.getHitbox();
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'red';
            ctx.rect(box.x, box.y, box.width, box.height);
            ctx.stroke();
        }
    }

    drawAttackFrame(ctx) {
        if (this.bubbleOffset) {
            let box = this.getBubbleHitbox();
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'green';
            ctx.rect(box.x, box.y, box.width, box.height);
            ctx.stroke();
        }
    }
    */
}