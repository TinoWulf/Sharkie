# Sharkie - Architecture & Design Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      HTML/DOM Layer                          │
│  (index.html - Canvas, Buttons, Menus, Touch Controls)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Input System                              │
│  • Keyboard (keyboard.class.js)                             │
│  • Touch Controls (game.js: bindTouchControls)              │
│  • Menu Buttons (game.js: Event Listeners)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Game Bootstrap                            │
│  (game.js)                                                   │
│  • startGame() → Creates World                              │
│  • Audio Management                                          │
│  • Interval Management                                       │
│  • Menu Logic                                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    World Instance                            │
│  (world.class.js - Main Game Loop)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Properties:                                      │      │
│  │ • Character                                      │      │
│  │ • Level (enemies, background)                   │      │
│  │ • Collectibles                                   │      │
│  │ • Projectiles (throwables)                       │      │
│  │ • Status Bars (HUD)                              │      │
│  │ • Canvas/Context                                 │      │
│  │ • Keyboard                                       │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Game Loop (60 FPS):                              │      │
│  │                                                  │      │
│  │ 1. draw()                                        │      │
│  │    └─ Render all objects                         │      │
│  │                                                  │      │
│  │ 2. run() (every 16ms via requestAnimationFrame) │      │
│  │    ├─ checkCollisions()                          │      │
│  │    ├─ popup() (enemy state)                      │      │
│  │    ├─ checkGameOver()                            │      │
│  │    └─ checkMusicSwitch()                         │      │
│  │                                                  │      │
│  │ 3. Animation Loop (every 100ms)                  │      │
│  │    └─ character.animate()                        │      │
│  │                                                  │      │
│  │ 4. Movement Loop (every 16ms)                    │      │
│  │    └─ character.moveCharacter()                  │      │
│  │                                                  │      │
│  │ 5. Enemy Logic Loops (every 166ms animate,       │      │
│  │    every 16ms movement)                          │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Class Hierarchy

```
DrawableObject
├── MovableObject
│   ├── Character
│   ├── PufferFish
│   ├── JellyFish
│   └── Endboss
├── BackgroundObject
├── Throwable
├── Collectable
├── StatusBar
└── EndbossHealthBar
```

### Design Pattern: Template Method

All renderable objects inherit from `DrawableObject` which provides:
- Image loading/caching
- Canvas drawing interface
- Animation frame playback

Movable entities inherit from `MovableObject` which adds:
- Collision detection (AABB)
- Damage/hit system
- Hitbox calculation
- Physics (gravity)

---

## Data Flow Diagram

### Character Input → Action

```
Keyboard Press
    ↓
keyboard.[KEY] = true
    ↓
character.moveCharacter() (60 FPS)
    ├─ isMoving(keyboard)
    │  └─ Update x/y coordinates
    ├─ isNotMoving(keyboard)
    │  └─ Check sleep timeout
    └─ Update camera_x
    ↓
character.animate() (100 FPS)
    ├─ Check if attacking
    ├─ Play appropriate animation
    └─ Return image to render
    ↓
world.draw()
    └─ Render to canvas
```

### Attack Flow

```
SPACE Pressed
    ↓
character.animate()
    └─ characterIsAttacking()
       ├─ Set isAttacking = true
       └─ playAttackAnimation()
          └─ Iterate through attack frames
    ↓
[After 350ms timeout]
    ↓
world.checkThrowableObjects()
    ├─ Calculate spawn position
    ├─ Create new Throwable
    └─ Add to throwableObject[]
    ↓
throw()
    ├─ Set speedY = -20 (upward)
    ├─ Start horizontal movement interval
    └─ Start gravity interval
    ↓
Next collision check → Damage enemy or miss
```

### Collision Detection Flow

```
world.checkCollisions()
    ├─ handleEnemyCollisions()
    │  ├─ For each enemy
    │  └─ Check isColliding(character)
    │     ├─ hitByPufferFish() → 20 poison damage
    │     ├─ hitByJellyFish() → 20 electric or 100 green
    │     └─ hitByEndboss() → 20 poison damage
    │
    ├─ handleThrowableCollisions()
    │  ├─ For each throwable
    │  ├─ For each enemy
    │  └─ If Endboss: Check getBubbleHitbox()
    │     └─ Hit = 20-25 damage
    │  └─ Else: Check isColliding()
    │     └─ Hit = Remove enemy
    │
    └─ handleCollectableCollisions()
       ├─ For each collectible
       └─ Check isColliding(character)
          ├─ Coin → Add 20 coins
          ├─ Life → Add 20 health
          └─ Poison → Add 20 poison power
```

### Damage & Death Flow

```
character.hit(damage, type)
    ├─ Set isPoisoned = true OR isElectrified = true
    ├─ Set lastHit timestamp
    └─ Play sound
    ↓
character.animate() (every 100ms)
    └─ Check isHurt()
       ├─ If isPoisoned → playAnimation(hurtPoisoned)
       ├─ If isElectrified → playAnimation(hurtElectric)
       └─ If immunity expired (1200ms) → Clear flag
    ↓
If health <= 0:
    ├─ character.isDead() = true
    ├─ Continue animating appropriate death
    └─ Set deadByPoison or deadByElectric flag
    ↓
world.checkGameOver()
    └─ If deadByElectric or deadByPoison → endGame('lose')
```

---

## Animation State Machine

### Character Animation States (Priority Order)

```
animate() decision tree:
│
├─ SPACE pressed?
│  └─ YES → characterIsAttacking()
│     ├─ playAttackAnimation(frames)
│     └─ After completion: createThrowable()
│
├─ Attacking?
│  └─ YES → Continue attack animation
│
├─ Is hurt?
│  ├─ isPoisoned → playAnimation(hurtPoisoned)
│  └─ isElectrified → playAnimation(hurtElectric)
│
├─ Is dead?
│  ├─ characterIsDeadBy()
│  ├─ isDying → Play death animation
│  └─ deadByPoison/Electric → Still dead frame
│
├─ Is falling asleep?
│  ├─ characterIsSleeping()
│  └─ After completion: isSleeping = true
│
├─ Is sleeping?
│  └─ playSleepingAnimation() (repeating loop)
│
├─ Movement keys pressed?
│  └─ playAnimation(swimming)
│
└─ Default:
   └─ playAnimation(standing)
```

### Enemy Animation States

#### PufferFish
```
animate():
├─ If not introduced → playIntroduction()
├─ If hurt → playAnimation(hurt)
├─ If blownUp → playAnimation(blown_up)
└─ Default → playAnimation(swimming)
```

#### JellyFish
```
animate():
├─ If hurt → playAnimation(hurt)
├─ If dead → Stop animation
└─ Default → playAnimation(swim_[color])
```

#### Endboss
```
animate():
├─ If dead → playAnimation(stillDead)
├─ If isDying → playAnimation(dead/hurt sequence)
├─ If hurt → playAnimation(hurt)
├─ If attacking → playAnimation(attacking)
├─ If not introduced → playEndbossIntroducing()
└─ Default → playAnimation(floating) + moveTowardsCharacter()
```

---

## Hitbox System

### Collision Boxes with Offsets

```
Each MovableObject has optional offset:
offset = { top: 0, bottom: 0, left: 0, right: 0 }

Actual hitbox = {
  x: obj.x + offset.left,
  y: obj.y + offset.top,
  width: obj.width - offset.left - offset.right,
  height: obj.height - offset.top - offset.bottom
}
```

### Example: Character
```
Width: 180, Height: 250
Offset: { top: 140, bottom: 70, left: 40, right: 40 }

Actual collision box:
  x: character.x + 40
  y: character.y + 140
  width: 180 - 40 - 40 = 100
  height: 250 - 140 - 70 = 40

Result: Much tighter than visual sprite
```

### Endboss Special Hitboxes

**Two separate boxes for different purposes**:

1. **Attack Hitbox (Red)**
   ```
   Used when: Endboss attacking character
   Offset: { left: -60, right: -20, top: 190, bottom: 80 }
   Purpose: Define where damage is dealt FROM boss
   Damage: 20 poison
   ```

2. **Bubble Hitbox (Blue)**
   ```
   Used when: Projectile hits boss
   Offset: { left: 60, right: 60, top: 200, bottom: 100 }
   Purpose: Define where boss can be damaged (vulnerable zone)
   Damage: 20 (25 if poisoned projectile)
   ```

**Method Call**:
```javascript
// In world.processThrowableHit()
if (throwable.isCollidingWithBox(enemy.getBubbleHitbox())) {
  enemy.hit(damage, 'bubble'); // Only Endboss takes damage here
}
```

---

## Camera System

### Parallax Scrolling

```
world.draw():
  1. ctx.clearRect() - Clear canvas
  
  2. ctx.translate(camera_x, 0) - Apply camera transform
     └─ drawMultipleObjects(backgroundObjects)
        └─ Far background layers (slower perceived movement)
  
  3. ctx.translate(-camera_x, 0) - Reset camera
     └─ drawMultipleObjects(statusBar)
        └─ HUD stays fixed on screen
  
  4. ctx.translate(camera_x, 0) - Reapply camera
     ├─ drawObject(character)
     ├─ drawMultipleObjects(enemies)
     ├─ drawMultipleObjects(throwables)
     └─ drawMultipleObjects(collectables)
  
  5. ctx.translate(-camera_x, 0) - Reset camera
     └─ Return to normal screen space
```

### Camera Position Calculation

```
moveCharacter():
  camera_x = -character.x + 100
  
Result:
  • Character stays ~100px from left edge
  • World scrolls as character moves
  • Level extends to x=9000 (camera can scroll that far)
```

### Canvas Mirroring

```
drawObject(obj):
  if (obj.otherDirection === true):
    ctx.save()
    ctx.translate(obj.x + obj.width/2, 0)  // Move to center
    ctx.scale(-1, 1)                        // Mirror horizontally
    ctx.translate(-(obj.x + obj.width/2), 0) // Restore position
    ctx.drawImage()                         // Draw mirrored
    ctx.restore()
  else:
    ctx.drawImage()                         // Draw normal
```

---

## Audio Management

### Audio State

```
World:
  isMuted: boolean
  backgroundMusic: Audio instance
  bossMusic: Audio instance
  bossMusicStarted: boolean
```

### Music Switching Logic

```
checkMusicSwitch():
  if character.x >= 8100 AND !bossMusicStarted:
    backgroundMusic.pause()
    bossMusic.play()
    bossMusicStarted = true
```

### Sound Effect System

```
playSound(path, volume):
  let sound = new Audio(path)
  sound.volume = volume
  sound.muted = world.isMuted
  sound.play()
  
Called in various places:
  • character takes damage
  • character dies
  • enemy dies
  • item collected
  • throwable hits
  • etc.
```

### Mute Persistence

```
toggleVolume():
  isMuted = !isMuted
  localStorage.setItem('globalMuted', isMuted)
  
On startup:
  globalMuted = localStorage.getItem('globalMuted') === 'true'
```

---

## Game State Management

### States

```
MENU:
  • Character/World not created
  • Canvas hidden
  • Menu buttons visible
  • No game loop running

PLAYING:
  • World exists
  • Game loop running (draw, animate, collide)
  • Input active
  • Music playing
  • Canvas visible

GAME_OVER:
  • World still exists but paused
  • End screen shown
  • Intervals cleared
  • Retry/Menu options

UNIMPLEMENTED - Could add:
  • PAUSED - Game loop stopped, can resume
  • LOADING - Preload assets
  • TUTORIAL - First-time walkthrough
```

### State Transitions

```
MENU
  ↓ (startGame)
PLAYING
  ├─ (character.health <= 0)
  │  ↓
  │  GAME_OVER (LOSE)
  │  ├─ (Try Again)
  │  │  ↓ startGame()
  │  │  PLAYING
  │  └─ (Back to Menu)
  │     ↓ backToMenu()
  │     MENU
  │
  └─ (endboss.dead)
     ↓
     GAME_OVER (WIN)
     ├─ (Next Level - not implemented yet)
     │  ↓
     │  (Same level again or MENU)
     └─ (Back to Menu)
        ↓ backToMenu()
        MENU
```

---

## Performance Optimization Strategies

### Current Optimizations

1. **Image Caching**
   ```javascript
   // Load once, reuse many times
   loadImages(arr) {
     arr.forEach(path => {
       let img = new Image();
       img.src = path;
       this.imageCache[path] = img;
     });
   }
   ```

2. **Enemy Limit**
   ```javascript
   // Never more than 30 enemies
   if (this.enemies.length > maxEnemies) {
     this.enemies = this.enemies.slice(-maxEnemies);
   }
   ```

3. **Interval Consolidation**
   ```javascript
   // All intervals tracked centrally
   setStoppableIntervals(fn, time)
   → Can stop all on game reset
   ```

### Potential Improvements

1. **Spatial Partitioning**
   - Divide level into grid
   - Only check collisions for nearby objects
   - Current: O(n²) for every collision check

2. **Object Pooling**
   - Reuse throwable objects instead of creating/destroying
   - Reuse enemy objects for spawning

3. **Camera Culling**
   - Only draw/animate objects on screen
   - Current: Animates all enemies even off-screen

4. **Canvas Optimization**
   - Use offscreen canvas for complex backgrounds
   - Batch draw calls

5. **Sound Pooling**
   - Limit simultaneous audio playback
   - Reuse audio instances

---

## Extension Points

### Adding a New Enemy Type

1. **Create class**
   ```javascript
   class NewEnemy extends MovableObject {
     imagesEnemy = { /* animation frames */ };
     constructor(x, y) { /* setup */ }
     animate() { /* animation logic */ }
     startMoving() { /* movement logic */ }
   }
   ```

2. **Add to level**
   ```javascript
   // In level1.js spawnEnemies()
   if (Math.random() < 0.33) {
     enemy = new NewEnemy(randomX);
   }
   ```

3. **Handle collision**
   ```javascript
   // In world.applyEnemyCollision()
   } else if (enemy instanceof NewEnemy) {
     // Custom collision behavior
   }
   ```

### Adding a New Collectible Type

1. **Create collectible**
   ```javascript
   // In world.collectableObjects
   new Collectable(x, y, 'newtype')
   ```

2. **Handle collection**
   ```javascript
   // In world.collectItem()
   else if (c.type === 'newtype') {
     this.addNewType(c);
   }
   ```

### Adding Power-ups

1. **Create duration-based effect**
   ```javascript
   applyPowerUp(type, duration) {
     this.powerUpActive = true;
     this.powerUpType = type;
     setTimeout(() => {
       this.powerUpActive = false;
     }, duration);
   }
   ```

2. **Check in animate/collide logic**
   ```javascript
   if (this.powerUpActive && this.powerUpType === 'speedboost') {
     movement *= 1.5;
   }
   ```

---

## Event System (Implicit)

### Key Events

```
Window Events:
  • keydown → Update keyboard.[KEY]
  • keyup → Clear keyboard.[KEY]
  • orientationchange → Check orientation
  • resize → Check orientation
  • load → Check orientation
  • DOMContentLoaded → Bind click handlers

Click Events:
  • startBtn.click → startGame()
  • descriptionBtn.click → openDescription()
  • closeDescriptionBtn.click → closeDescription()
  • backToMenu.click → backToMenu()
  • impressumBtn.click → loadImpressum()
  • canvas.click → toggleVolume()

Touch Events:
  • touchstart → Bind to controls (passive: false)
  • touchend → Unbind controls
  • mousedown/mouseup → Also bind (for desktop testing)
```

---

## Testing Recommendations

### Unit Tests
- Character movement calculations
- Collision detection (AABB)
- Damage calculations
- Hitbox offset calculations

### Integration Tests
- Enemy spawn logic
- Throwable trajectory
- Animation sequences
- State transitions

### Manual Tests
- All enemy types
- All collision types
- All collectibles
- Boss introduction
- Boss death sequence
- Audio muting
- Mobile controls

---

## Known Limitations & Future Work

### Current Limitations
1. Only one level (alpha)
2. No pause feature
3. No difficulty settings
4. No combo/combo multiplier system
5. No particle effects
6. Camera culling not implemented
7. No controller support

### Potential Features
1. **Multiple Levels**: Progressively harder
2. **Boss Patterns**: Special attack patterns
3. **Powerups**: Temporary invincibility, speed, etc.
4. **Achievements**: Challenges to unlock rewards
5. **Leaderboard**: High score tracking
6. **Particle System**: Visual feedback for impacts
7. **Dialogue/Story**: Narrative elements
8. **Settings Menu**: Difficulty, graphics options
9. **Replay System**: Save/watch replays
10. **Networked Multiplayer**: Two-player co-op

---

*Architecture Guide - November 2025*
