function createLevel1() {
    const level = new Level(
        [
            new Endboss() // only endboss manually placed
        ],
        createWorldBackground()
    );

    level.spawnEnemies = function (character) {
        // --- stop spawning once Sharkie reaches boss area ---
        if (character.x >= 7000) return;
        if (character.x < 300) return;

        // --- Dynamische Spawnrate abhängig von Fortschritt ---
        const progress = Math.floor((character.x - 300) / 1000);
        const spawnChance = 0.4 + Math.min(progress * 0.05, 0.4); // 40% → 80%
        const spawnCount = Math.min(3 + progress, 10);

        // --- Zufällig entscheiden, ob überhaupt gespawnt wird ---
        if (Math.random() > spawnChance) return;

        for (let i = 0; i < spawnCount; i++) {
            const randomX = character.x + 800 + Math.random() * 500;
            const randomY = 80 + Math.random() * 340;

            let enemy;
            if (Math.random() < 0.5) {
                enemy = new PufferFish(randomX);
            } else {
                enemy = new JellyFish(randomX, randomColor());
            }

            enemy.y = randomY;
            enemy.world = character.world;
            this.enemies.push(enemy);

            // --- Animation & Bewegung starten ---
            if (typeof enemy.animate === 'function')
                setStoppableIntervals(() => enemy.animate(), 1000 / 6);
            if (typeof enemy.startMoving === 'function')
                setStoppableIntervals(() => {
                    enemy.startMoving();

                    // Entfernen, wenn weit außerhalb des Bildes
                    if (enemy.x < -1000) {
                        const index = this.enemies.indexOf(enemy);
                        if (index !== -1) this.enemies.splice(index, 1);
                    }
                }, 1000 / 60);
        }

        // --- Endboss dauerhaft sicherstellen ---
        let endboss = this.enemies.find(e => e instanceof Endboss);
        if (!endboss) {
            endboss = new Endboss();
            endboss.world = character.world;
            this.enemies.push(endboss);

            // Endboss sofort aktivieren
            setStoppableIntervals(() => endboss.animate(), 1000 / 6);
        }

        // --- Limit enemies in memory (Boss bleibt immer erhalten) ---
        const maxEnemies = 300;
        const nonBossEnemies = this.enemies.filter(e => !(e instanceof Endboss) && !e.dead);
        this.enemies = [endboss, ...nonBossEnemies.slice(-maxEnemies)];
    };


    return level;
}


function randomColor() {
    const colors = ['lila', 'yellow', 'green', 'lila', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
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
