class Level {
    enemies;
    backgroundObjects;
    levelEndX = 3000;

    constructor(enemies, backgroundObjects) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}