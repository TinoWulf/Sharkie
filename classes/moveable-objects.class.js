class MovableObject {
    x = 10;
    y = 120;
    height = 150;
    width = 100;
    img;
    imageCache = {};

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    animate(imageArray, interval,) {
        setInterval(() => {
            let i = interval % imageArray.length;
            let path = imageArray[i];
            this.img = this.imageCache[path];
            interval++;
        }, 1000 / 6); // change image every 1/6 second
    }


    moveRight() {
        
    }

    moveLeft(speed) {
        setInterval(() => {
            this.x -= speed; // move left by 'speed' pixels every 1/60 second
        }, 1000 / 60); // 60 frames per second
    }
}