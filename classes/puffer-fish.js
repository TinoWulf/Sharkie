class PufferFish extends MovableObject {
    
    imagesSwimming = [
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
            'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png'
    ];
    currentImageIndex = 0;
    height = 100;
    width = 100;

    constructor() {
        super().loadImage('img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
        this.loadImages(this.imagesSwimming);
        this.animate(this.imagesSwimming,this.currentImageIndex);
        this.moveLeft(0.5);
        this.x = 900 + Math.random() * 500; // random x position between 600 and 1100
        this.y = 300; // fixed y position
    }
    
    
     

    jump() {

    }
}