class World {

    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = -100;
    statusBar = new StatusBar();

    constructor(canvas , keyboard) {
        this.ctx = canvas.getContext('2d');
        this.setWorld();
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
        // Endboss-Referenz auf World setzen
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(e => {
                if (e.constructor && e.constructor.name === 'Endboss') {
                    e.world = this;
                }
            });
        }
    }

    checkCollisions() {
        setInterval(() => {
            // Check collision with enemies
            this.level.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && !this.character.isDead() && !this.isHurt) {
                    this.character.hit(); 
                    
                    console.log('Character energy: ' + this.character.energy);
                }
            });
        }, 100);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
        this.ctx.translate(this.camera_x, 0); // camera movement

        this.drawMultipleObjects(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.drawObject(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.drawObject(this.character);
        this.drawMultipleObjects(this.level.enemies);


        this.ctx.translate(-this.camera_x, 0); // reset camera

        requestAnimationFrame(() => this.draw());
    }

    drawMultipleObjects(object) {
        object.forEach(o => {
            this.drawObject(o);
        });
    }

    drawObject(movableObject) {
        if(movableObject.otherDirection) {
            this.ctx.save();
            this.ctx.translate(movableObject.x + movableObject.width / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(movableObject.x + movableObject.width / 2), 0);
            this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);
            this.ctx.restore();
            movableObject.drawFrame(this.ctx);
            return;
            
        }
        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);
    }


}