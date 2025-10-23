class Level {
    enemies;
    backgroundObjects;
    levelEndX = 9000;

    constructor(enemies, backgroundObjects) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}