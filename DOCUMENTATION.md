# Sharkie - Complete Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Core Systems](#core-systems)
4. [Class Reference](#class-reference)
5. [Game Flow](#game-flow)
6. [Controls & Mechanics](#controls--mechanics)
7. [Audio System](#audio-system)
8. [Collision System](#collision-system)

---

## Project Overview

**Sharkie** is a browser-based 2D underwater action game where the player controls a shark character (Sharkie) through various ocean levels, battling enemies, collecting items, and ultimately facing an end boss.

### Key Features
- **Player Character**: Sharkie with multiple animations (idle, swimming, attacking, hurt, sleeping, dead)
- **Enemy Types**: Puffer Fish, Jellyfish (3 colors), and an Endboss
- **Collectibles**: Coins, Health potions, and Poison (power-up)
- **Combat System**: Bubble projectiles that damage enemies
- **Audio System**: Background music, boss music, and sound effects
- **Responsive Design**: Touch controls for mobile devices
- **Game States**: Menu, Playing, Game Over (Win/Lose)

---

## File Structure

```
Sharkie/
├── index.html                          # Main HTML entry point
├── game.js                             # Game bootstrap and menu logic
├── style.css                           # Styling
├── README.md                           # Game instructions
├── classes/
│   ├── keyboard.class.js              # Keyboard input handler
│   ├── drawable-object.class.js       # Base class for drawable objects
│   ├── moveable-objects.class.js      # Base class for movable entities
│   ├── character.class.js             # Player character (Sharkie)
│   ├── world.class.js                 # Game world and main game loop
│   ├── level.class.js                 # Level definition
│   ├── puffer-fish.js                 # Enemy: Puffer Fish
│   ├── jelly-fish.class.js            # Enemy: Jellyfish
│   ├── endboss.class.js               # Enemy: Final Boss
│   ├── throwable.class.js             # Projectile (bubble)
│   ├── collectable.class.js           # Collectible items
│   ├── background-object.class.js     # Background graphics
│   ├── status-bar.class.js            # HUD status bars
│   └── endboss-healthbar.class.js    # Boss health bar display
├── levels/
│   └── level1.js                      # Level 1 definition
└── audio/                              # Sound files
    ├── Game-music.mp3
    ├── game-music-endboss.mp3
    ├── bubble-pop-06-351337.mp3
    ├── hit enemy.mp3
    ├── enboss bite.wav
    ├── endboss hurt.mp3
    ├── dead.mp3
    ├── win.wav
    ├── lose.wav
    └── ... (other audio files)
```

---

## Core Systems

### 1. Input System (Keyboard)
**File**: `classes/keyboard.class.js`

Tracks key states for arrow keys, WASD, spacebar, and D key:
- `RIGHT / LEFT / UP / DOWN`: Movement
- `SPACE`: Attack/Shoot
- `D`: Debug (reserved)
- `W`: Reserved

### 2. Game Loop & World Management
**File**: `game.js` & `classes/world.class.js`

**Bootstrap Flow** (`game.js`):
1. `init()`: Initializes game title
2. Keyboard event listeners set up
3. `startGame()`: Creates world, initializes canvas, starts game loop
4. Music and audio setup
5. Touch controls for mobile

**World Loop** (`world.class.js`):
```
draw() → checkCollisions() → popup() → checkGameOver() → requestAnimationFrame()
```

**Key Methods**:
- `checkCollisions()`: Handles all collision detection
- `checkGameOver()`: Determines win/lose conditions
- `draw()`: Renders all game objects with camera translation
- `checkMusicSwitch()`: Switches music when boss appears

### 3. Animation System
**Files**: `classes/drawable-object.class.js`, `classes/character.class.js`

**Image Loading**:
- `loadImage(path)`: Load single image
- `loadImages(arr)`: Pre-load array of images into cache

**Animation Loop**:
```javascript
playAnimation(images) {
  // Cycles through image array at each call
  this.img = this.imageCache[images[index % images.length]];
}
```

Each class has frame-by-frame animation sequences stored as arrays of image paths.

### 4. Collision Detection
**File**: `classes/world.class.js` & `classes/moveable-objects.class.js`

**Methods**:
- `isColliding(mo)`: AABB collision between two objects
- `isCollidingWithBox(box)`: AABB collision with custom box
- `getHitbox()`: Returns collision box with offset applied

**Collision Types**:
1. **Enemy-Character**: Damage application
2. **Throwable-Enemy**: Enemy defeat or boss damage
3. **Character-Collectible**: Item pickup

### 5. Physics
**File**: `classes/moveable-objects.class.js`

- `gravity`: Constant (default: 2)
- `speedY`: Vertical velocity
- `applyGravity()`: Applies gravity per frame

---

## Class Reference

### DrawableObject
**Base class for all renderable objects**

**Properties**:
- `img`: Current image
- `imageCache`: Object storing preloaded images
- `x, y`: Position
- `width, height`: Dimensions

**Methods**:
- `loadImage(path)`: Load single image
- `loadImages(arr)`: Preload image array
- `draw(ctx)`: Draw to canvas context

---

### MovableObject extends DrawableObject
**Base for moving entities (character, enemies)**

**Properties**:
- `otherDirection`: Facing direction (false=left, true=right)
- `health`: Current health
- `isPoisoned`, `isElectrified`: Status effects
- `gravity`, `speedY`: Physics

**Methods**:
- `getHitbox()`: Get collision box with offset
- `isColliding(mo)`: Check collision with another object
- `isCollidingWithBox(box)`: Check collision with box
- `hit(damage, hittedBy)`: Apply damage
- `isHurt()`: Check if in hurt state (1.2s immunity)
- `isDead()`: Check if dead
- `playAnimation(images)`: Play animation frame
- `applyGravity()`: Apply gravity

---

### Character extends MovableObject
**The player character (Sharkie)**

**Properties**:
- `imagesCharacter`: All animation frames organized by action
- `offset`: Hitbox offset
- `health`: Starting 100
- `isAttacking`, `waitingForAttack`: Attack state
- `isSleeping`, `isFallingAsleep`: Sleep state
- `deadByPoison`, `deadByElectric`: Death type flags

**Key Methods**:
- `moveCharacter()`: Handle movement input & camera
- `animate()`: Main animation logic dispatcher
- `characterIsAttacking()`: Play attack animation
- `characterAnimationWithoutAttacking()`: Idle/movement animations
- `playSleepingAnimation()`: Looping sleep animation
- `isMoving(kb)`: Apply movement
- `isNotMoving(kb)`: Handle sleep timeout (10 seconds)

**Animation Priorities** (in `animate()`):
1. Attack (if space pressed and not hurt/dead)
2. Hurt (poison or electric)
3. Dead (poisoned or electrocuted)
4. Movement (if arrow keys pressed)
5. Sleep (if idle 10+ seconds)
6. Standing (idle)

---

### World
**Main game world and logic manager**

**Properties**:
- `character`: Player instance
- `level`: Current level
- `canvas`, `ctx`: Drawing surface
- `keyboard`: Input state
- `camera_x`: Camera position (for parallax)
- `statusBar[]`: HUD elements [life, coins, poison, volume]
- `throwableObject[]`: Active projectiles
- `collectableObjects[]`: Items in world
- `collidingImunity`: Collision cooldown flag
- `gameOver`: Game ended flag
- `isMuted`: Audio mute state
- `endbossHealthBar`: Boss health display

**Key Methods**:
- `setWorld()`: Initialize world references for all entities
- `run()`: Main loop logic
- `checkCollisions()`: Dispatch collision checks
- `draw()`: Render all objects
- `drawObject(obj)`: Draw single object with mirroring
- `checkGameOver()`: Check win/lose conditions
- `checkMusicSwitch()`: Switch to boss music at x=8100
- `playSound(path, vol)`: Play sound effect

**Collision Handlers**:
- `handleEnemyCollisions()`: Check character-enemy collisions
- `handleThrowableCollisions()`: Check projectile hits
- `handleCollectableCollisions()`: Check item pickup
- `applyEnemyCollision(enemy)`: Apply damage by enemy type

---

### Character (continued)
**Death Sequence**:
```
take damage → isPoisoned/isElectrified → isHurt animation (1.2s)
→ isDead() checks type → death animation → stillDead frame
```

---

### Level
**Level configuration**

**Properties**:
- `enemies[]`: Array of enemies
- `backgroundObjects[]`: Array of background layers
- `levelEndX`: Maximum x coordinate (9000)

**Dynamic Enemy Spawning**:
- `spawnEnemies(character)`: Custom spawning logic in level1.js
- Stops spawning when character x >= 7000

---

### Enemy Classes

#### PufferFish extends MovableObject
**Stationary poison-type enemy**

**Properties**:
- `currentImageIndex`: Animation frame
- `speed`: Movement speed (5-15)
- `blownUp`: Inflation state
- `startMovingDistance`: Range to activate (1000)

**Methods**:
- `animate()`: Play animation based on state
- `startMoving()`: Begin movement towards character

---

#### JellyFish extends MovableObject
**Floating electric-type enemy**

**Properties**:
- `color`: "lila", "yellow", or "green"
  - Green = instant kill (100 damage)
  - Yellow = fast moving
  - Lila = normal speed
- `speed`: 2-4 (floats up/down)
- `bobAmp`: Bob amplitude (varies by color)

**Methods**:
- `animate()`: Float animation by color
- `startMoving()`: Float up/down movement

---

#### Endboss extends MovableObject
**Final boss - large whale-like creature**

**Properties**:
- `introduced`: Flag if introduction animation played
- `speed`: Dynamic speed (10-25, varies)
- `health`: 200
- `attackOffset`: Damage hitbox (top: 190, bottom: 80, left: -60, right: -20)
- `bubbleOffset`: Vulnerable area (top: 200, bottom: 100, left: 60, right: 60)

**Key Methods**:
- `animate()`: Main animation dispatcher
- `moveTowardsCharacter()`: Chase player with dynamic speed
- `moveHorizontal()`, `moveVertical()`: Separate movement axes
- `getAttackHitbox()`: Returns damage-dealing box
- `getBubbleHitbox()`: Returns vulnerable area for projectiles
- `playEndbossIntroducing()`: Introduction animation
- `playEndbossSounds()`: Play intro sounds once
- `playIsDyingSequence()`: Death timer sequence
- `playIsDyingAnimation()`: Death frame playback

**Boss Behavior**:
1. Appears at x >= 8100
2. Plays 10-frame introduction
3. Chases player with variable speed
4. Has two hitboxes:
   - **Red (Attack)**: Where boss damages player
   - **Blue (Vulnerable)**: Where projectiles damage boss
5. Death sequence: hurt → dead animation → still dead

---

### Throwable
**Projectile shot by character**

**Properties**:
- `x, y`: Position
- `otherDirection`: Direction fired
- `width, height`: 30x30 px
- `isPoisoned`: Whether powered by poison

**Methods**:
- `getDamage()`: Returns 20 (or 25 if poisoned)
- `throw()`: Initialize movement with gravity

**Physics**:
- Initial `speedY: -20` (upward)
- Applies gravity each frame
- Horizontal movement: ±10 px/frame

---

### Collectable
**Items to pick up**

**Properties**:
- `type`: "coin", "life", or "poison"
- `collected`: Flag if already picked up

**Types**:
- **Coin**: +20 coins
- **Life**: +20 health
- **Poison**: +20 poison (power-up meter)

**Methods**:
- `static spawnBatch(count, type)`: Generate random collectibles

---

### StatusBar
**HUD display elements**

**Types**:
- `life`: Health bar
- `coins`: Coin counter
- `poison`: Poison/power bar
- `volume`: Mute button

**Properties**:
- `x, y, width, height`: Position and size
- `statusImages`: Image arrays for different states

---

### EndbossHealthBar
**Boss health bar display above Endboss**

**Properties**:
- `boss`: Reference to Endboss
- `x, y`: Screen position
- `width`: Health bar width
- `health`: Current health

**Methods**:
- `updatePosition()`: Position bar above boss
- `setBossHealth(h)`: Update health display

---

## Game Flow

### Initialization
```
index.html loads → Scripts load in order → init() → DOM ready
```

### Menu State
- Start button visible
- "What is Sharkie?" description button
- Impressum (legal) button
- Mute button

### Game Start
```
startGame() 
  → Clear intervals & reset state
  → Create level
  → Create World(canvas, keyboard)
  → World constructor runs:
     • setWorld() - wire references
     • start animation intervals
     • start collision/logic intervals
     • draw() begins render loop
```

### Game Loop (60 FPS)
Each frame (~16.67ms):
1. **Move**: Character responds to input, camera updates
2. **Animate**: All objects play animation frames
3. **Physics**: Gravity applied to throwables
4. **Collisions**: Check all collision types
5. **Logic**: Update game state
6. **Draw**: Render frame
7. **Next Frame**: `requestAnimationFrame()`

### Game End
- **Lose**: Character dead (health <= 0)
  - Show game-over screen
  - "Try Again" button → `startGame()`
  
- **Win**: Endboss dead
  - Show victory screen
  - "Next Level" button → Message (alpha, no more levels)

---

## Controls & Mechanics

### Keyboard
| Key | Action |
|-----|--------|
| Arrow Right / D | Move right |
| Arrow Left / A | Move left |
| Arrow Up / W | Move up |
| Arrow Down / S | Move down |
| Spacebar | Attack/Shoot |

### Touch (Mobile)
- Left/Right/Up/Down buttons for movement
- ATTACK button to shoot

### Movement Boundaries
- **Horizontal**: 100 px (left) to level end (9000 px)
- **Vertical**: -100 px (top) to canvas height + 50 px

### Camera
- Follows character: `camera_x = -character.x + 100`
- Parallax scrolling on background layers

### Attack Mechanics
1. Press SPACE → Attack animation plays
2. After 350ms → Throwable created at character position
3. Direction follows character facing
4. With **poison** equipped: Special attack animation (stronger visual)

### Poison System
- Collect poison items (3 on map)
- Fills poison bar
- At 100%: Next attack is "charged" (visual change)
- Used for next attack, resets to 0%

### Sleep Mechanic
- 10+ seconds idle (no input) → Fall asleep animation
- Repeating sleeping animation
- Any key press → Wake up

---

## Audio System

### Music
- **Background**: Loops during normal gameplay (10% volume)
- **Boss Music**: Starts when character x >= 8100, loops (50% volume)
- Only one plays at a time
- Mutable via in-game button or settings

### Sound Effects
| Event | Audio File |
|-------|-----------|
| Bubble shot | bubble-pop-06-351337.mp3 |
| Hit enemy | hit enemy.mp3 |
| Enemy hit | endboss hurt.mp3 |
| Death | dead.mp3 |
| Boss bite | enboss bite.wav |
| Boss intro | introducing endboss.mp3 |
| Water splash | water splash.mp3 |
| Item collected | collect coin / health / poison .mp3 |
| Win | win.wav |
| Lose | lose.wav |
| Menu click | volume-up.wav |

### Mute System
- Toggle via button or console
- Persisted in localStorage
- Affects all audio playback
- Syncs between menu and in-game

---

## Collision System

### Hitbox Calculation
```javascript
getHitbox() {
  offset = { top: 0, bottom: 0, left: 0, right: 0 }
  return {
    x: this.x + offset.left,
    y: this.y + offset.top,
    width: this.width - offset.left - offset.right,
    height: this.height - offset.top - offset.bottom
  }
}
```

### Collision Detection (AABB)
```javascript
isColliding(a, b) {
  return a.x + a.width > b.x && 
         a.y + a.height > b.y && 
         a.x < b.x + b.width && 
         a.y < b.y + b.height
}
```

### Enemy-Character Collisions
**Puffer Fish**:
- Damage: 20 (poison)
- Cooldown: 800ms

**Jellyfish**:
- Damage: 20 (normal) or 100 (green) = instant death
- Type: Electric shock

**Endboss**:
- Damage: 20 (poison)
- Special: Uses custom `getAttackHitbox()` for damage zone
- Damage applied 500ms after collision (bite animation)

### Throwable-Enemy Collisions
**Regular Enemies**:
- Hit = Enemy dies (removed after 500ms)
- Projectile destroyed

**Endboss**:
- Only takes damage if projectile hits `getBubbleHitbox()` (vulnerable zone)
- Hit applies 20 damage (25 if poisoned)
- Projectile destroyed
- Boss health bar updates

### Special Hitboxes (Endboss)

**Attack Hitbox (Red)** - Where boss damages player:
```javascript
{ left: -60, right: -20, top: 190, bottom: 80 }
```

**Vulnerable Hitbox (Blue)** - Where projectiles damage boss:
```javascript
{ left: 60, right: 60, top: 200, bottom: 100 }
```

---

## Game States

### Menu
- All controls disabled except menu buttons
- Music not playing
- Canvas hidden

### Playing
- Input active
- Collision detection active
- Audio playing
- Canvas rendering

### Paused (Not implemented)
- Could be added with P key

### Game Over
- Input disabled
- Music stops
- End screen shows
- Retry or menu button

---

## Enemy Spawning

**Location**: `levels/level1.js`

**Logic**:
- Spawns PufferFish and Jellyfish randomly
- Starts at character x = 600
- Stops at character x = 7000 (boss area)
- Spawn rate: 50% per cycle
- Count increases with progression: `3 + Math.floor((x-600)/1000)`
- Max 10 enemies at once
- Memory limit: Last 30 enemies kept

---

## Development Notes

### Debugging
Uncomment `drawFrame()` and `drawAttackFrame()` in classes to visualize hitboxes:
- Red = collision box
- Green = attack box

Enable hitbox visualization for Endboss (commented in `endboss.class.js`).

### Performance Considerations
- Enemy limit of 30 prevents lag
- Image caching prevents repeated loading
- Camera culling could improve performance (not currently implemented)

### Extension Points
1. Add more enemy types
2. Add level 2, 3, etc.
3. Add powerups (temporary abilities)
4. Add boss patterns (special moves)
5. Add particle effects (damage, collection)
6. Add combo system
7. Add leaderboard

---

## Browser Compatibility
- Requires HTML5 Canvas
- Requires ES6 (arrow functions, const/let)
- Tested on Chrome, Firefox, Safari, Edge

---

## Asset Locations

All game assets organized in `img/` folder:
- `1.Sharkie/`: Character animations
- `2.Enemy/`: All enemy sprites
- `3. Background/`: Level background layers
- `4. Marcadores/`: UI elements (health, coins, poison)
- `6.Botones/`: Buttons, titles, menu images

---

## License & Credits

**Developer**: Tino Wulf  
**Based on**: Developer Akademie (coding bootcamp project)

---

*Last Updated: November 2025*
