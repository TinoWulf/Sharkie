function randomColor() {
    const colors = ['lila', 'yellow', 'green'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createLevel1() {
    return new Level(
        [
            new PufferFish(1000),
            new PufferFish(1300),
            new JellyFish(1000, randomColor()),
            new JellyFish(1300, randomColor()),
            new JellyFish(1600, randomColor()),
            new Endboss()
        ],
        createWorldBackground()
    );
}


function createWorldBackground() {
    const images = [
        'img/3. Background/Layers/5. Water/L1.png',
        'img/3. Background/Layers/1. Light/COMPLETO.png',
        'img/3. Background/Layers/1. Light/1.png',
        'img/3. Background/Layers/1. Light/2.png',
        'img/3. Background/Layers/3.Fondo 1/D.png',
        'img/3. Background/Layers/4.Fondo 2/D.png',
        'img/3. Background/Layers/2. Floor/D.png'
    ];

    const backgroundObjects = [];
    const stepWidth = 1440;  // Abstand pro Wiederholung
    const repeatCount = 7;   // Wie oft wiederholen

    for (let i = 0; i < repeatCount; i++) {
        const xOffset = i * stepWidth;
        images.forEach(imgPath => {
            backgroundObjects.push(new BackgroundObject(imgPath, xOffset, 0));
        });
    }

    return backgroundObjects;
}
