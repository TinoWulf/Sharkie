class World {

    character = new Character();
    level = createLevel1();
    ctx;
    canvas;
    keyboard;
    speedLever = 0;
    camera_x = -100;
    gameOver = false;
    statusBar = [new StatusBar('life', 10, 0, 50, 200),
                 new StatusBar('coins', 10, 40, 50, 200),
                 new StatusBar('poison', 10, 80, 50, 200),
                 new StatusBar('instructions', 0, 330, 150, 300)
    ];
    throwableObject = [new Throwable()];
    collectableObjects = [new Collectable(400, 300, 'coin'),
        new Collectable(800, 200, 'coin'),
        new Collectable(1200, 350, 'coin'),
        new Collectable(1600, 250, 'coin'),
        new Collectable(300, 400, 'life'),
        new Collectable(400, 400, 'life'),
        new Collectable(500, 400, 'life'),
        new Collectable(600, 400, 'poison'),
        new Collectable(700, 400, 'poison'),
        new Collectable(800, 400, 'poison')

    ];

    constructor(canvas , keyboard) {
        this.ctx = canvas.getContext('2d');
        this.setWorld();
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.checkCollisions();
        this.character.world = this;
        setStoppableIntervals(() => this.character.moveCharacter(), 1000 / 60);
        setStoppableIntervals(() => this.character.animate(), 100);
        setStoppableIntervals(() => this.run(), 1000 / 60);
    }

    setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(e => {
        e.world = this;
        if (typeof e.animate === 'function') {
            setStoppableIntervals(() => e.animate(), 1000 / 6);
        }
        if (typeof e.startMoving === 'function') {
            setStoppableIntervals(() => e.startMoving(), 1000 / 60);
        }
    });
        if (this.throwableObject) {
            this.throwableObject.forEach(obj => {
                obj.world = this;
            });
        }
    }

    run() {
        this.checkCollisions();
        this.popup();
        this.checkGameOver();
    }

    checkGameOver() {
        if ((this.character.deadByElectric || this.character.deadByPoison) && !this.gameOver) {
            endGame();
            this.gameOver = true;
        }
    }

    popup() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof PufferFish && enemy.x < this.character.x + 400) {
                enemy.blownUp = true;
                enemy.offset.top = 5;
                enemy.offset.bottom = 5;
                enemy.offset.left = 10;
            }
        });
    }

    checkThrowableObjects() {
            let throwX, throwY;
            if (this.character.otherDirection) {
                throwX = this.character.getHitbox().x;
                throwY = this.character.getHitbox().y + this.character.getHitbox().height / 2;
            } else {
                throwX = this.character.getHitbox().x + this.character.getHitbox().width - 10;
                throwY = this.character.getHitbox().y + this.character.getHitbox().height / 2 - 12 ;
            }

            const t = new Throwable(throwX, throwY);
            t.otherDirection = this.character.otherDirection;
            this.throwableObject.push(t);
           
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            let damage = 20;
            if (this.character.isColliding(enemy) && !this.character.isDead() && !this.character.isHurt()) {
                if (enemy instanceof PufferFish) {
                this.character.hit(damage, 'poison');
            } else if (enemy instanceof JellyFish) {
                if (enemy.color == 'green') {
                    damage = 100;                    
                } 
                this.character.hit(damage, 'electric');
            }
                this.statusBar[0].setHealth(this.character.health);
            }
        });

        for (let i = this.throwableObject.length - 1; i >= 0; i--) {
            for (let j = this.level.enemies.length - 1; j >= 0; j--) {
                if (this.throwableObject[i].isColliding(this.level.enemies[j])) {
                    this.throwableObject.splice(i, 1);
                    this.level.enemies[j].dead = true;
                    setTimeout(() => {
                        this.level.enemies.splice(j, 1);
                    }, 500);
                    break;
                }
            }
        }

        this.collectableObjects.forEach(collectable => {
            if (this.character.isColliding(collectable) && !collectable.collected) {
                if (collectable.imageType.coin.includes('Coin') || collectable.constructor.name === 'Collectable' && collectable.type === 'coin') {
                    this.statusBar[1].setCoins(this.statusBar[1].coins + 20);
                    collectable.collected = true;
                }
                else if (collectable.imageType.life.includes('Life') || collectable.type === 'life') {
                    this.statusBar[0].setHealth(this.statusBar[0].health + 20);
                    collectable.collected = true;
                }
                else if (collectable.imageType.poison.includes('poison') || collectable.type === 'poison') {
                    this.statusBar[2].setPoison(this.statusBar[2].poison + 20);
                    collectable.collected = true;
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
        this.ctx.translate(this.camera_x, 0); // camera movement

        this.drawMultipleObjects(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.drawMultipleObjects(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.drawObject(this.character);
        this.drawMultipleObjects(this.level.enemies);
        this.drawMultipleObjects(this.throwableObject);
        this.drawMultipleObjects(this.collectableObjects);
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