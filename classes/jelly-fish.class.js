class JellyFish extends MovableObject {
    imagesJellyFish = {
        lila : {
            swimming : [
                'img/2.Enemy/2 Jelly fish/Regular damage/Lila 1.png',
                'img/2.Enemy/2 Jelly fish/Regular damage/Lila 2.png',
                'img/2.Enemy/2 Jelly fish/Regular damage/Lila 3.png',
                'img/2.Enemy/2 Jelly fish/Regular damage/Lila 4.png'
            ],
            dead : [
                'img/2.Enemy/2 Jelly fish/Dead/Lila/L1.png',
                'img/2.Enemy/2 Jelly fish/Dead/Lila/L2.png',
                'img/2.Enemy/2 Jelly fish/Dead/Lila/L3.png',
                'img/2.Enemy/2 Jelly fish/Dead/Lila/L4.png'
            ]
        },
        yellow : {
            swimming : [
                'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png',
                'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png',
                'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png',
                'img/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png'
            ],
            dead : [
                'img/2.Enemy/2 Jelly fish/Dead/Yellow/y1.png',
                'img/2.Enemy/2 Jelly fish/Dead/Yellow/y2.png',
                'img/2.Enemy/2 Jelly fish/Dead/Yellow/y3.png',
                'img/2.Enemy/2 Jelly fish/Dead/Yellow/y4.png'
            ]
        },
        green : {
            swimming : [
                'img/2.Enemy/2 Jelly fish/Súper dangerous/Green 1.png',
                'img/2.Enemy/2 Jelly fish/Súper dangerous/Green 2.png',
                'img/2.Enemy/2 Jelly fish/Súper dangerous/Green 3.png',
                'img/2.Enemy/2 Jelly fish/Súper dangerous/Green 4.png'
            ],
            dead : [
                'img/2.Enemy/2 Jelly fish/Dead/green/g1.png',
                'img/2.Enemy/2 Jelly fish/Dead/green/g2.png',
                'img/2.Enemy/2 Jelly fish/Dead/green/g3.png',
                'img/2.Enemy/2 Jelly fish/Dead/green/g4.png'
            ]
        },
        
        
    };

    colorStats = { // Stats for each jellyfish color
        lila: {
            speedRange: [0.5, 1.0],
            points: 50,
            danger: 1
        },
        yellow: {
            speedRange: [1.5, 2.5],
            points: 100,
            danger: 2
        },
        green: {
            speedRange: [0.2, 0.7],
            points: 200,
            danger: 3
        }
    };


    height = 50;
    width = 50;
    dead = false;
    currentImageIndex = 0;
    offset = { top: 10, bottom: 15, left: 8, right: 10 }; // Collision box offsets


    constructor(x, color) { // x position and color of the jellyfish
        super(); // Call parent constructor
        this.color = color; // Set jellyfish color
        this.loadImages(this.imagesJellyFish[color].swimming); // Load swimming images
        this.loadImages(this.imagesJellyFish[color].dead); // Load dead images
        this.loadImage(this.imagesJellyFish[color].swimming[0]); // Set initial image

        const stats = this.colorStats[color]; // Get stats based on color
        this.speed = stats.speedRange[0] + Math.random() * (stats.speedRange[1] - stats.speedRange[0]); // Random speed within range
        this.points = stats.points; // Points awarded for this jellyfish
        this.danger = stats.danger; // Danger level of this jellyfish
        this.x = x + Math.random() * 500; // Randomize x position slightly
        this.y = 400 - Math.random() * 400; // Random y position within range
    }


    /**
     * Animates the jellyfish based on its state (swimming or dead).
     */
    animate() {
        if (!this.dead) {
            this.playAnimation(this.imagesJellyFish[this.color].swimming); // Play swimming animation
        } else if (this.dead) {
            this.playAnimation(this.imagesJellyFish[this.color].dead); // Play dead animation
        }
        
    }


    /** * Starts the movement of the jellyfish with a floating effect.
    */
    startMoving() {
        if (this.dead) return; // Do not move if dead
        this.moveLeft(this.speed); // Move jellyfish to the left based on speed
        if (!this.baseY) this.baseY = this.y; // Store initial y position
        if (!this.frame) this.frame = 0; // Initialize frame counter
        this.frame += 0.05 * this.speed; // Increment frame based on speed
        this.y = this.baseY + Math.sin(this.frame) * 50; // Apply floating effect
    }

}