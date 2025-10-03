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
    offset = {  top: 15,
                bottom: 35,
                left: 10,
                right: 20
    }   

    constructor() {
        super().loadImage('img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
        this.speed = 0.5 + Math.random() * 1;  //random speed between 0.5 and 1.5
        this.loadImages(this.imagesSwimming);
        this.animate();
        this.moveLeft(this.speed);
        this.x = 1200 + Math.random() * 500; // random x position between 600 and 1100
        this.y = 400 - Math.random() * 400; // fixed y position
        
    }
    
    animate() {
        setInterval(() => {
            this.playAnimation(this.imagesSwimming);
        }, 1000 / 6); // change image every 1/6 second
    }
     

    jump() {

    }
}