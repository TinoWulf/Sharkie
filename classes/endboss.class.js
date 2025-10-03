class Endboss extends MovableObject {

        
    currentImageIndex = 0;
    introduced = false;

    offset = { top: 20,
               bottom: 20,
               left: 30,
               right: 30
    }

    imagesEndboss = {
        introduce: [
            'img/2.Enemy/3 Final Enemy/1.Introduce/1.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/2.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/3.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/4.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/5.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/6.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/7.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/8.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/9.png',
            'img/2.Enemy/3 Final Enemy/1.Introduce/10.png'
        ],
        floating: [
            'img/2.Enemy/3 Final Enemy/2.Floating/1.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/2.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/3.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/4.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/5.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/6.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/7.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/8.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/9.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/10.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/11.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/12.png',
            'img/2.Enemy/3 Final Enemy/2.Floating/13.png'
        ],
        attacking: [
            'img/2.Enemy/3 Final Enemy/Attack/1.png',
            'img/2.Enemy/3 Final Enemy/Attack/2.png',
            'img/2.Enemy/3 Final Enemy/Attack/3.png',
            'img/2.Enemy/3 Final Enemy/Attack/4.png',
            'img/2.Enemy/3 Final Enemy/Attack/5.png',
            'img/2.Enemy/3 Final Enemy/Attack/6.png'
        ],
        hurt: [
            'img/2.Enemy/3 Final Enemy/Hurt/1.png',
            'img/2.Enemy/3 Final Enemy/Hurt/2.png',
            'img/2.Enemy/3 Final Enemy/Hurt/3.png',
            'img/2.Enemy/3 Final Enemy/Hurt/4.png'
        ],
        dead: [
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
        ]
    }

    constructor() {
        super().loadImage('');
        this.loadImages(this.imagesEndboss.introduce);
        this.loadImages(this.imagesEndboss.floating);
        this.loadImages(this.imagesEndboss.attacking);
        this.loadImages(this.imagesEndboss.hurt);
        this.loadImages(this.imagesEndboss.dead);
        this.x = 2000;
        this.y = 20;
        this.height = 400;
        this.width = 300;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.character.x > 1200 && !this.introduced) {
                this.playAnimation(this.imagesEndboss.introduce);
                if (this.currentImageIndex % this.imagesEndboss.introduce.length === this.imagesEndboss.introduce.length - 1) {
                    this.introduced = true;
                    this.currentImageIndex = 0;
                }
            } else if (this.introduced) {
                this.playAnimation(this.imagesEndboss.floating);
            }
            
        }, 1000 / 6);
    }    
}