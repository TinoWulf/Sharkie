class World {

    character = new Character();
    enemy = [
    new PufferFish(),
    new PufferFish(),
    new PufferFish()
    ];
    backgroundObject = [
        new BackgroundObject('img/3. Background/Layers/5. Water/L1.png', 0, 0),
        new BackgroundObject('img/3. Background/Layers/1. Light/COMPLETO.png', 0, 0),
        new BackgroundObject('img/3. Background/Layers/1. Light/1.png', 0, 0),
        new BackgroundObject('img/3. Background/Layers/1. Light/2.png', 0, 0),
        new BackgroundObject('img/3. Background/Layers/3.Fondo 1/D.png', 0, 0),
        new BackgroundObject('img/3. Background/Layers/4.Fondo 2/D.png', 0, 0),
        new BackgroundObject('img/3. Background/Layers/2. Floor/D.png', 0, 0)
    ]
    ctx;
    canvas;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas
        
        this.drawMultipleObjects(this.backgroundObject);
        this.drawObject(this.character);
        this.drawMultipleObjects(this.enemy);
        

        requestAnimationFrame(() => this.draw());
    }

    drawMultipleObjects(object) {
        object.forEach(o => {
            this.drawObject(o);
        });
    }

    drawObject(movableObject) {
        this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);
    }


}