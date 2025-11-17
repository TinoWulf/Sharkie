class BackgroundObject extends MovableObject {
    
    width = 1440; // Standard width for background images
    height = 480; // Standard height for background images

    constructor(imagePath, x, y) { // x and y position of the background object
        super().loadImage(imagePath); // Load background image
        this.x = x;
        this.y = y;
        
    }
}