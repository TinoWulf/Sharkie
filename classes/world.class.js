class World {
    character = new Character();
    level = createLevel1();
    ctx; canvas; keyboard;
    speedLever = 0;
    camera_x = -100;
    collidingImunity = false;
    gameOver = false;
    isMuted = false;

    statusBar = [
        new StatusBar('life', 10, 0, 50, 200),
        new StatusBar('coins', 10, 40, 50, 200),
        new StatusBar('poison', 10, 80, 50, 200),
        new StatusBar('volume', 970, 10, 40, 40)
    ];

    collectableObjects = [
        new Collectable(3000, 400, 'life'),
        new Collectable(3900, 400, 'life'),
        new Collectable(4760, 400, 'life'),
        new Collectable(7400, 400, 'life'),
        new Collectable(8000, 400, 'life'),
        new Collectable(9000, 400, 'life'),
        new Collectable(1900, 400, 'poison'),
        new Collectable(2300, 400, 'poison'),
        new Collectable(3150, 400, 'poison'),
        new Collectable(6000, 400, 'poison'),
        new Collectable(7000, 400, 'poison')
    ];

    throwableObject = [new Throwable()];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.initVolumeButton();
        this.checkCollisions();
        this.character.world = this;
        this.level.enemies.forEach(e => e.world = this);
        setStoppableIntervals(() => this.character.moveCharacter(), 1000 / 60);
        setStoppableIntervals(() => this.character.animate(), 100);
        setStoppableIntervals(() => this.run(), 1000 / 60);
        setStoppableIntervals(() => this.level.spawnEnemies(this.character), 2000);
        this.collectableObjects.push(...Collectable.spawnBatch(15, 'coin'));
        bindTouchControls();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(e => {
            e.world = this;
            if (typeof e.animate === 'function')
                setStoppableIntervals(() => e.animate(), 1000 / 6);
            if (typeof e.startMoving === 'function')
                setStoppableIntervals(() => e.startMoving(), 1000 / 60);
        });
        if (this.throwableObject)
            this.throwableObject.forEach(obj => obj.world = this);
    }

    run() {
        this.checkCollisions();
        this.popup();
        this.checkGameOver();
        this.checkMusicSwitch();
    }

    checkGameOver() {
        if ((this.character.deadByElectric || this.character.deadByPoison) && !this.gameOver) {
            endGame('lose');
            this.gameOver = true;
        }
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.dead && !this.gameOver) {
            endGame('win');
            this.gameOver = true;
        }
    }

    popup() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof PufferFish && enemy.x < this.character.x + 400) {
                enemy.blownUp = true;
                enemy.offset = { top: 5, bottom: 5, left: 10, right: 20 };
            }
        });
    }

    checkThrowableObjects() {
        let hb = this.character.getHitbox();
        let x = hb.x + (this.character.otherDirection ? 0 : hb.width - 10);
        let y = hb.y + hb.height / 2 - (this.character.otherDirection ? 0 : 12);
        const t = new Throwable(x, y);
        t.otherDirection = this.character.otherDirection;
        this.throwableObject.push(t);
    }

    checkCollisions() {
        if (!this.collidingImunity) this.handleEnemyCollisions();
        this.handleThrowableCollisions();
        this.handleCollectableCollisions();
    }

    handleEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && this.canTakeDamage())
                this.applyEnemyCollision(enemy);
        });
    }

    canTakeDamage() {
        return !this.character.isDead() && !this.character.isHurt();
    }

    applyEnemyCollision(enemy) {
        let damage = 20;
        if (enemy instanceof PufferFish) this.hitByPufferFish(damage);
        else if (enemy instanceof JellyFish) this.hitByJellyFish(enemy, damage);
        else if (enemy instanceof Endboss) this.hitByEndboss(enemy, damage);
        this.updateAfterCollision();
    }

    hitByPufferFish(damage) {
        if (!this.collidingImunity && !this.character.isHurt()) {
            this.collidingImunity = true;
            this.character.hit(damage, 'poison');
            this.statusBar[0].setHealth(this.character.health);
            this.playSound('audio/hit enemy.mp3', 0.4);
            setTimeout(() => this.collidingImunity = false, 800);
        }
    }


    hitByJellyFish(enemy, damage) {
        if (enemy.color === 'green') damage = 100;
        this.character.hit(damage, 'electric');
        this.collidingImunity = true;
    }

    hitByEndboss(enemy, damage) {
        this.character.bitingSharkie = true;
        setTimeout(() => {
            this.character.hit(damage, 'poison');
            this.statusBar[0].setHealth(this.character.health);
        }, 500);
    }

    updateAfterCollision() {
        this.statusBar[0].setHealth(this.character.health);
        setTimeout(() => {
            if (this.character.bitingSharkie)
                this.playSound('audio/enboss bite.wav', 0.4);
            this.collidingImunity = false;
            this.character.bitingSharkie = false;
        }, 500);
    }

    handleThrowableCollisions() {
        for (let i = this.throwableObject.length - 1; i >= 0; i--) {
            const t = this.throwableObject[i];
            if (this.checkThrowableHitsEnemy(t, i)) continue;
        }
    }

    checkThrowableHitsEnemy(throwable, i) {
        for (let j = this.level.enemies.length - 1; j >= 0; j--) {
            const enemy = this.level.enemies[j];
            if (this.processThrowableHit(throwable, enemy, i, j)) return true;
        }
        return false;
    }

    processThrowableHit(throwable, enemy, i, j) {
        if (enemy instanceof Endboss && throwable.isCollidingWithBox(enemy.getBubbleHitbox())) {
            enemy.hit(20, 'bubble');
            this.removeThrowable(i);
            this.playSound('audio/endboss hurt.mp3', 0.4);
            return true;
        }
        if (!(enemy instanceof Endboss) && throwable.isColliding(enemy)) {
            this.removeThrowable(i);
            this.killEnemy(enemy, j);
            return true;
        }

        return false;
    }

    removeThrowable(i) {
        this.throwableObject.splice(i, 1);
        this.playSound('audio/hit enemy.mp3', 0.4);
    }

    killEnemy(enemy, j) {
        enemy.dead = true;
        setTimeout(() => this.level.enemies.splice(j, 1), 500);
    }

    handleCollectableCollisions() {
        this.collectableObjects.forEach(c => {
            if (this.character.isColliding(c) && !c.collected)
                this.collectItem(c);
        });
    }

    collectItem(c) {
        if (c.type === 'coin') this.addCoins(c);
        else if (c.type === 'life') this.addLife(c);
        else if (c.type === 'poison') this.addPoison(c);
    }

    addCoins(c) {
        this.statusBar[1].setCoins(this.statusBar[1].coins + 20);
        this.playSound('audio/collect coin (2).mp3', 0.4);
        c.collected = true;
    }

    addLife(c) {
        this.statusBar[0].setHealth(this.statusBar[0].health + 20);
        this.playSound('audio/collect health.wav', 0.3);
        c.collected = true;
    }

    addPoison(c) {
        this.statusBar[2].setPoison(this.statusBar[2].poison + 20);
        this.playSound('audio/collect poison.mp3', 0.4);
        c.collected = true;
    }

    // --- Drawing & Helpers ---
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawMultipleObjects(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.drawMultipleObjects(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.drawObject(this.character);
        this.drawMultipleObjects(this.level.enemies);
        this.drawMultipleObjects(this.throwableObject);
        this.drawMultipleObjects(this.collectableObjects);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    drawMultipleObjects(objs) {
        objs.forEach(o => this.drawObject(o));
    }

    drawObject(obj) {
        if (obj.otherDirection) {
            this.ctx.save();
            this.ctx.translate(obj.x + obj.width / 2, 0);
            this.ctx.scale(-1, 1);
            this.ctx.translate(-(obj.x + obj.width / 2), 0);
            this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
            this.ctx.restore();
            return;
        }
        obj.draw(this.ctx);
    }

    boxCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    initVolumeButton() {
        this.canvas.addEventListener('click', e => {
            const r = this.canvas.getBoundingClientRect();
            const x = (e.clientX - r.left) * (this.canvas.width / r.width);
            const y = (e.clientY - r.top) * (this.canvas.height / r.height);
            const vol = this.statusBar.find(s => s.type === 'volume');
            if (x >= vol.x && x <= vol.x + vol.width &&
                y >= vol.y && y <= vol.y + vol.height)
                this.toggleVolume();
        });
    }

    toggleVolume() {
        this.playSound('audio/volume-up.wav', 0.5);
        this.isMuted = !this.isMuted;
        const v = this.statusBar.find(s => s.type === 'volume');
        const imgPath = this.isMuted ? v.statusImages.volume.down[0]
            : v.statusImages.volume.up[0];
        v.img = v.imageCache[imgPath];
        if (window.world?.backgroundMusic) window.world.backgroundMusic.muted = this.isMuted;
        if (window.world?.bossMusic) window.world.bossMusic.muted = this.isMuted;
        this.playSound('audio/volume-up.wav', 0.5);
    }

    playSound(path, vol) {
        let s = new Audio(path);
        s.volume = vol;
        if (world.isMuted) s.muted = true;
        s.play();
    }

    checkMusicSwitch() {
        if (!this.bossMusicStarted && this.character.x >= 8100) {
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
            }
            if (this.bossMusic) this.bossMusic.play();
            this.bossMusicStarted = true;
        }
    }
}
