/**
 * Level
 *
 * Simple container for enemies and background objects. Levels define the
 * playable area (end X position) and provide a place to attach spawn logic
 * or additional per-level configuration.
 */
class Level {
    /** Array of enemy instances in this level */
    enemies;

    /** Background objects/layers used for rendering the world */
    backgroundObjects;

    /** X coordinate at which the level ends (used for camera and boss triggers) */
    levelEndX = 9000;

    /**
     * @param {Array} enemies - initial enemies array
     * @param {Array} backgroundObjects - background layer objects
     */
    constructor(enemies, backgroundObjects) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}