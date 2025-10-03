class StatusBar extends DrawableObject {

    statusImages = {
        coins : [
            'img/4. Marcadores/green/Coin/0_  copia 4.png',
            'img/4. Marcadores/green/Coin/20_  copia 2.png',
            'img/4. Marcadores/green/Coin/40_  copia 4.png',
            'img/4. Marcadores/green/Coin/60_  copia 4.png',
            'img/4. Marcadores/green/Coin/80_  copia 4.png',
            'img/4. Marcadores/green/Coin/100_ copia 4.png'
        ],
        life : [
            'img/4. Marcadores/green/Life/0_  copia 3.png',
            'img/4. Marcadores/green/Life/20_ copia 4.png',
            'img/4. Marcadores/green/Life/40_  copia 3.png',
            'img/4. Marcadores/green/Life/60_  copia 3.png',
            'img/4. Marcadores/green/Life/80_  copia 3.png',
            'img/4. Marcadores/green/Life/100_  copia 2.png'
        ],
        poison : [
            'img/4. Marcadores/green/poisoned bubbles/0_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/20_ copia 3.png',
            'img/4. Marcadores/green/poisoned bubbles/40_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/60_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/80_ copia 2.png',
            'img/4. Marcadores/green/poisoned bubbles/100_ copia 3.png'
        ]
    }

    height = 50;
    width = 250;

    percantage = 100;

    constructor() {
        super();
        this.loadImages(this.statusImages.coins);
        this.loadImages(this.statusImages.life);
        this.loadImages(this.statusImages.poison);
        this.setPercentage(100);
    }

    setPercentage(percantage) {
        this.percantage = percantage
        let imagePath = this.statusImages.life[this.returnImageIndex()];
        this.img = this.imageCache[imagePath];
        
    }

    returnImageIndex() {
        if(this.percantage ==100) {
            return 5;
        }
        else if (this.percantage > 80) {
            return 4;
        }
        else if (this.percantage > 60) {
            return 4;
        }
        else if (this.percantage > 40) {
            return 4;
        }
        else if (this.percantage > 20) {
            return 4;
        }
        else {
            return 0;
        }
    }
}