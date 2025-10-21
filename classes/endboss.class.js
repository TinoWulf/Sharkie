class Endboss extends MovableObject {

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
        ],
        stillDead: [
            'img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
        ]
    };

    currentImageIndex = 0;
    introduced = false;
    speed = 8;           // Startgeschwindigkeit
    speedDirection = 10;  // 1 = erhöhen, -1 = verringern
    maxSpeed = 16;
    minSpeed = 6;
    dead = false;
    isDying = false;        // wurde Sterbeablauf gestartet?
    isPlayingDead = false;

    offset = { top: 190, bottom: 80, left: -60, right: -20 };

    constructor() {
        super().loadImage('');
        this.loadImages(this.imagesEndboss.introduce);
        this.loadImages(this.imagesEndboss.floating);
        this.loadImages(this.imagesEndboss.attacking);
        this.loadImages(this.imagesEndboss.hurt);
        this.loadImages(this.imagesEndboss.dead);
        this.loadImages(this.imagesEndboss.stillDead);
        this.x = 800;
        this.y = 20;
        this.height = 400;
        this.width = 300;
        this.health = 100;
    }

    hit(damage) {
        if (this.dead || this.isDying) return; // bereits tot oder stirbt gerade

        this.health -= damage;
        this.lastHit = new Date().getTime();
        this.hurtTime = this.lastHit; // Zeitstempel für Hurt-Status

        // Hurt-Zustand für 500 ms aktiv halten
        this.isCurrentlyHurt = true;
        setTimeout(() => {
            this.isCurrentlyHurt = false;
        }, 900);

        // Falls Lebenspunkte <= 0, Sterbeablauf erst starten, nicht sofort "dead"
        if (this.health <= 0 && !this.isDying) {
            this.health = 0;
            this.isDying = true;

            // Hurt kurz zeigen, dann dead starten
            setTimeout(() => {
                this.isPlayingDead = true;
            }, 1000);

            // stillDead erst nach Dead-Animation setzen
            setTimeout(() => {
                this.dead = true;
                this.isDying = false;
                this.isPlayingDead = false;
            }, 1500);
        }
    }

    animate() {
        if (!this.world || this.world.character.isDead()) return;
        // 1) Wenn tot → stillDead anzeigen
        if (this.dead) {
            this.playAnimation(this.imagesEndboss.stillDead);
            return;
        }

        // 2) Wenn gerade stirbt → Dead oder Hurt
        if (this.isDying) {
            if (this.isPlayingDead) {
                this.playAnimation(this.imagesEndboss.dead);
            } else {
                this.playAnimation(this.imagesEndboss.hurt);
            }
            return;
        }

        // 3) Wenn verletzt (nicht tot)
        if (this.isCurrentlyHurt) {
            this.playAnimation(this.imagesEndboss.hurt);
            return;
        }

        if (this.world.character.bitingSharkie) {
            this.playAnimation(this.imagesEndboss.attacking);
            return;
        }

        // 4) Introduce
        if (this.world.character.x > 200 && !this.introduced) {
            this.playAnimation(this.imagesEndboss.introduce);
            if (this.currentImageIndex % this.imagesEndboss.introduce.length === this.imagesEndboss.introduce.length - 1) {
                this.introduced = true;
                this.currentImageIndex = 0;
            }
            return;
        }

        // 5) Normal bewegen
        if (this.introduced) {
            this.playAnimation(this.imagesEndboss.floating);
            this.moveTowardsCharacter();
        }
    }







    moveTowardsCharacter() {
        const character = this.world.character;

        // --- Dynamische Geschwindigkeit ---
        this.speed += 0.02 * this.speedDirection;  // leicht erhöhen oder verringern
        if (this.speed > this.maxSpeed || this.speed < this.minSpeed) {
            this.speedDirection *= -1; // Richtungswechsel
        }

        // Horizontale Bewegung
        if (character.x < this.x) {
            this.otherDirection = false; // nach links schauen
            this.x -= this.speed;
        } else {
            this.otherDirection = true;  // nach rechts schauen
            this.x += this.speed;
        }

        // Vertikale Bewegung (zielt auf Character)
        if (character.y + character.height / 2 < this.y + this.height / 2) {
            this.y -= this.speed / 2;
        } else if (character.y + character.height / 2 > this.y + this.height / 2) {
            this.y += this.speed / 2;
        }
    }
}
