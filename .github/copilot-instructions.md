# Copilot Instructions for Sharkie

## Project Overview
- **Sharkie** is a browser-based JavaScript game. The main entry point is `index.html`, with game logic in `game.js` and modular classes in `classes/`.
- The game features animated characters, enemies, collectables, and backgrounds, with assets organized under `img/` and `audio/`.

## Architecture & Key Components
- **Classes**: All game entities (player, enemies, objects, world) are defined in `classes/*.js` as ES6 classes. Example: `character.class.js`, `endboss.class.js`, `collectable.class.js`.
- **World Logic**: The main game loop and rendering are managed by `world.class.js`.
- **Levels**: Level configuration is in `levels/level1.js`.
- **Assets**: Images and audio are organized by type and usage in `img/` and `audio/`.

## Developer Workflows
- **Run/Debug**: Open `index.html` in a browser. No build step required; all scripts are loaded directly.
- **Edit Classes**: Extend or modify behavior by editing files in `classes/`. Each class is responsible for its own rendering and logic.
- **Add Assets**: Place new images/audio in the appropriate subfolder. Reference them in class constructors or methods.

## Project-Specific Patterns
- **Inheritance**: Game objects inherit from `drawable-object.class.js` or `moveable-objects.class.js`.
- **Keyboard Input**: Managed by `keyboard.class.js`.
- **Status Bars**: UI elements like health/coins use `status-bar.class.js`.
- **Animation**: Frame-based animation is handled by swapping image sources in class methods.
- **No Frameworks**: Pure JavaScript, no external libraries or build tools.

## Integration Points
- **Levels**: To add a new level, create a new file in `levels/` and update game initialization logic.
- **Audio/Visuals**: Reference assets by relative path; maintain folder structure for consistency.

## Examples
- To create a new enemy, subclass `moveable-objects.class.js` and add logic to `world.class.js` for spawning and interaction.
- To add a new collectable, extend `collectable.class.js` and update collision logic in `character.class.js`.

## Key Files & Directories
- `index.html`: Entry point
- `game.js`: Game initialization
- `classes/`: All game logic classes
- `levels/`: Level definitions
- `img/`, `audio/`: Game assets

---
**For AI agents:**
- Always follow the class-based structure for new entities.
- Maintain asset organization and reference patterns.
- Avoid introducing frameworks or build tools.
- When in doubt, review similar patterns in `classes/` for guidance.
