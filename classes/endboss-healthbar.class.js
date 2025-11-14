class EndbossHealthBar extends DrawableObject {

    constructor(boss) {
        super();
        this.boss = boss;
        this.width = 150;
        this.height = 40;

        this.healthImages = {
            200: 'img/4. Marcadores/Purple/100_ .png',
            160: 'img/4. Marcadores/Purple/80_ .png',
            120: 'img/4. Marcadores/Purple/60_ .png',
            80:  'img/4. Marcadores/Purple/40_ .png',
            40:  'img/4. Marcadores/Purple/20__1.png',
            0:   'img/4. Marcadores/Purple/0_ .png'
        };

        Object.values(this.healthImages).forEach(path => this.loadImages([path]));
        this.setBossHealth(this.boss.health);
    }

    setBossHealth(health) {
        let thresholds = [200, 160, 120, 80, 40, 0];

        let level = thresholds.find(v => health >= v);
        if (level === undefined) level = 0;

        this.img = this.imageCache[this.healthImages[level]];
    }

    updatePosition() {
        this.x = this.boss.x + this.boss.width / 2 - this.width / 2;
        this.y = this.boss.y + 70;
    }
}
