# Sharkie - Quick Reference & Code Snippets

## Quick Start

### Running the Game
```bash
# Open index.html in a web browser
# Or use a local server:
python -m http.server 8000
# Then open: http://localhost:8000
```

### File Load Order (Critical)
The HTML loads scripts in this exact order:
1. `keyboard.class.js` - Input handling
2. `game.js` - Bootstrap and menu
3. `drawable-object.class.js` - Base drawable
4. `moveable-objects.class.js` - Base movable
5. `endboss-healthbar.class.js` - Boss health display
6. `character.class.js` - Player
7. `puffer-fish.js` - Enemy
8. `jelly-fish.class.js` - Enemy
9. `endboss.class.js` - Boss
10. `status-bar.class.js` - HUD
11. `world.class.js` - Game world
12. `background-object.class.js` - Background
13. `throwable.class.js` - Projectile
14. `collectable.class.js` - Items
15. `level.class.js` - Level structure
16. `levels/level1.js` - Level definition

**Why order matters**: Classes extend others, so parents must load first.

---

## Common Code Patterns

### Creating a New Game Object

```javascript
class MyObject extends MovableObject {
  // 1. Animation frames
  imagesObj = {
    idle: ['img/path/1.png', 'img/path/2.png'],
    attack: ['img/path/1.png', 'img/path/2.png']
  };

  // 2. Properties
  currentImageIndex = 0;
  speed = 5;
  x = 100;
  y = 100;
  width = 50;
  height = 50;

  // 3. Constructor
  constructor() {
    super().loadImage('img/default.png');
    this.loadImages(this.imagesObj.idle);
    this.loadImages(this.imagesObj.attack);
  }

  // 4. Animation logic
  animate() {
    if (this.isHurt()) {
      // Play hurt
    } else if (this.isAttacking) {
      this.playAnimation(this.imagesObj.attack);
    } else {
      this.playAnimation(this.imagesObj.idle);
    }
  }

  // 5. Movement logic
  move() {
    this.x += this.speed;
  }
}
```

### Collision Detection

```javascript
// Check if two objects collide
if (character.isColliding(enemy)) {
  character.hit(20, 'poison');
}

// Check if object collides with custom box
let customBox = {
  x: 100,
  y: 50,
  width: 200,
  height: 100
};

if (throwable.isCollidingWithBox(customBox)) {
  // Damage the target
}

// AABB collision formula (Axis-Aligned Bounding Box)
function aabbCollision(a, b) {
  return a.x + a.width > b.x &&     // Right edge of A past left of B
         a.y + a.height > b.y &&    // Bottom of A past top of B
         a.x < b.x + b.width &&     // Left of A before right of B
         a.y < b.y + b.height;      // Top of A before bottom of B
}
```

### Animation Loop Pattern

```javascript
// Standard animation through frame array
animate() {
  this.playAnimation(this.imagesObj.walking);
  // playAnimation() uses currentImageIndex % array.length
  // So it loops forever
}

// One-time animation
playAttackAnimation(frames) {
  let i = 0;
  const interval = setInterval(() => {
    this.img = this.imageCache[frames[i]];
    i++;
    if (i >= frames.length) {
      clearInterval(interval);
      this.isAttacking = false; // Done
    }
  }, 50); // 50ms per frame = 20 fps for animation
}

// Looping animation with state
playSleepingAnimation() {
  let interval = setInterval(() => {
    if (this.isSleeping) {
      this.playAnimation(this.imagesObj.sleeping);
    } else {
      clearInterval(interval); // Stop when not sleeping
    }
  }, 1000 / 5); // 5 fps
}
```

### Damage & Immunity System

```javascript
// Apply damage with immunity window
hit(damage, type) {
  let now = new Date().getTime();
  if (now - this.lastHit < 1200) return; // 1.2 second immunity

  this.lastHit = now; // Reset immunity timer
  this.health -= damage;

  if (type === 'poison') {
    this.isPoisoned = true;
  } else if (type === 'electric') {
    this.isElectrified = true;
  }

  if (this.health <= 0) {
    this.health = 0;
    this.dead = true;
  }
}

// Check if in hurt state (immunity active)
isHurt() {
  let timepassed = new Date().getTime() - this.lastHit;
  return timepassed < 1200; // Still in 1.2s window
}
```

### Sound Management

```javascript
// Play a sound effect
world.playSound('audio/hit enemy.mp3', 0.4); // 40% volume

// Toggle mute
toggleMuteFromMenu() {
  globalMuted = !globalMuted;
  localStorage.setItem('globalMuted', globalMuted);
  
  if (window.world) {
    world.isMuted = globalMuted;
    syncWorldAudio();
  }
}

// Sync all audio to mute state
syncWorldAudio() {
  if (!world) return;
  const mute = world.isMuted;
  if (world.backgroundMusic) world.backgroundMusic.muted = mute;
  if (world.bossMusic) world.bossMusic.muted = mute;
  document.querySelectorAll("audio").forEach(a => a.muted = mute);
}
```

### Camera & Canvas Transform

```javascript
// Draw objects with camera following character
draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Apply camera transform
  ctx.translate(camera_x, 0);
  
  // Draw world objects (camera follows)
  drawMultipleObjects(level.backgroundObjects);
  drawMultipleObjects(level.enemies);
  
  // Reset camera
  ctx.translate(-camera_x, 0);
  
  // Draw HUD (fixed to screen)
  drawMultipleObjects(statusBar);
  
  requestAnimationFrame(() => this.draw());
}

// Update camera to follow character
moveCharacter() {
  if (keyboard.RIGHT && x < level.levelEndX) {
    x += 3;
  }
  this.world.camera_x = -this.x + 100; // Character stays 100px from left
}
```

### Drawing Mirrored Objects

```javascript
drawObject(obj) {
  if (obj.otherDirection) {
    ctx.save();
    // Translate to center of object
    ctx.translate(obj.x + obj.width / 2, 0);
    // Flip horizontally
    ctx.scale(-1, 1);
    // Translate back to original position (flipped)
    ctx.translate(-(obj.x + obj.width / 2), 0);
    ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    ctx.restore();
  } else {
    ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
  }
}
```

### Creating a Throwable/Projectile

```javascript
// Character shoots
characterIsAttacking() {
  this.isAttacking = true;
  this.waitingForAttack = true;
  
  setTimeout(() => {
    world.checkThrowableObjects(poisonFull);
    world.playSound('audio/bubble-pop.mp3', 0.4);
  }, 350); // Shoot at frame 350ms into animation
}

// World creates throwable
checkThrowableObjects(poisoned = false) {
  let hb = character.getHitbox();
  let x = hb.x + (character.otherDirection ? 0 : hb.width - 10);
  let y = hb.y + hb.height / 2 - (character.otherDirection ? 0 : 12);
  
  const t = new Throwable(x, y, character.otherDirection, poisoned);
  throwableObject.push(t);
}

// Throwable class
class Throwable extends MovableObject {
  width = 30;
  height = 30;
  otherDirection = false;
  
  constructor(x, y, otherDirection, poisoned) {
    super().loadImage('img/bubble.png');
    this.x = x;
    this.y = y;
    this.otherDirection = otherDirection;
    this.poisoned = poisoned;
    this.throw();
  }

  throw() {
    this.speedY = -20; // Upward initial velocity
    setStoppableIntervals(() => this.applyGravity(), 40);
    setInterval(() => {
      if (this.otherDirection) {
        this.x -= 10; // Left
      } else {
        this.x += 10; // Right
      }
    }, 25);
  }

  getDamage() {
    return this.poisoned ? 25 : 20;
  }
}
```

### Handling Collisions with Special Boxes

```javascript
// Example: Endboss has two hitboxes

// Get vulnerable area (where projectiles damage it)
getBubbleHitbox() {
  return {
    x: this.x + 60,
    y: this.y + 200,
    width: this.width - 60 - 60,
    height: this.height - 200 - 100
  };
}

// Get attack area (where it damages player)
getAttackHitbox() {
  return {
    x: this.x - 60,
    y: this.y + 190,
    width: this.width + 40,
    height: this.height - 270
  };
}

// Check collision with specific box
processThrowableHit(throwable, enemy, i, j) {
  if (enemy instanceof Endboss) {
    // Only damage if hits vulnerable zone
    if (throwable.isCollidingWithBox(enemy.getBubbleHitbox())) {
      enemy.hit(throwable.getDamage(), 'bubble');
      removeThrowable(i);
      return true;
    }
  } else {
    // Regular enemy: full collision = damage
    if (throwable.isColliding(enemy)) {
      removeThrowable(i);
      killEnemy(enemy, j);
      return true;
    }
  }
  return false;
}
```

### Spawn Enemies Dynamically

```javascript
// In level1.js
level.spawnEnemies = function(character) {
  // Stop spawning in boss area
  if (character.x >= 7000) return;
  if (character.x < 600) return;

  // Spawn count increases with progression
  const progress = Math.floor((character.x - 600) / 1000);
  const spawnCount = Math.min(3 + progress, 10);

  if (Math.random() < 0.5) return; // 50% spawn rate per check

  for (let i = 0; i < spawnCount; i++) {
    const randomX = character.x + 1000 + Math.random() * 500;
    const randomY = 100 + Math.random() * 300;

    let enemy;
    if (Math.random() < 0.5) {
      enemy = new PufferFish(randomX);
    } else {
      enemy = new JellyFish(randomX, randomColor());
    }

    enemy.y = randomY;
    enemy.world = character.world;
    this.enemies.push(enemy);

    // Start animations
    if (typeof enemy.animate === 'function')
      setStoppableIntervals(() => enemy.animate(), 1000 / 6);
    if (typeof enemy.startMoving === 'function')
      setStoppableIntervals(() => enemy.startMoving(), 1000 / 60);
  }

  // Memory management: keep only last 30 enemies
  const maxEnemies = 30;
  if (this.enemies.length > maxEnemies) {
    this.enemies = this.enemies.slice(-maxEnemies);
  }
};
```

### Debug: Visualize Hitboxes (Commented Out)

```javascript
// In drawable-object.class.js - uncomment to enable
drawFrame(ctx) {
  if (this.offset) {
    let box = this.getHitbox();
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'red';
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
  }
}

// In endboss.class.js - uncomment to visualize boss hitboxes
drawHitboxes(ctx) {
  // Attack box red
  const attackBox = this.getAttackHitbox();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'red';
  ctx.rect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
  ctx.stroke();

  // Bubble hitbox green
  const bubbleBox = this.getBubbleHitbox();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'green';
  ctx.rect(bubbleBox.x, bubbleBox.y, bubbleBox.width, bubbleBox.height);
  ctx.stroke();
}
```

---

## Debugging Tips

### Console Logging

```javascript
// Check game state
console.log(world.character.x); // Character position
console.log(world.character.health); // Health
console.log(world.level.enemies.length); // Enemy count
console.log(world.throwableObject.length); // Projectile count

// Inspect specific object
console.log(world.level.enemies[0]); // First enemy

// Check collision
let hitbox = world.character.getHitbox();
console.log('Character hitbox:', hitbox);

// List all enemies
world.level.enemies.forEach(e => {
  console.log(e.constructor.name, 'x:', e.x, 'health:', e.health);
});
```

### Pausing the Game

```javascript
// In browser console:
// Pause all intervals
intervals.forEach(id => clearInterval(id));

// Resume (restart game loop)
setStoppableIntervals(() => world.run(), 1000 / 60);
```

### Testing Specific Features

```javascript
// Force boss spawn
world.character.x = 8100;

// Damage character
world.character.hit(50, 'poison');

// Spawn projectile
world.checkThrowableObjects(false);

// Toggle mute
world.toggleVolume();

// End game
endGame('win');
```

### Performance Monitoring

```javascript
// Add to game loop to measure frame time
let lastTime = performance.now();

function measureFPS() {
  let now = performance.now();
  let fps = 1000 / (now - lastTime);
  console.log('FPS:', fps.toFixed(1));
  lastTime = now;
}

// Call in draw() or run() periodically
```

---

## Common Issues & Solutions

### Issue: Enemy not appearing
**Solution**: Check if enemy was added to `level.enemies` and if `world` reference is set.
```javascript
console.log(world.level.enemies);
world.level.enemies.forEach(e => {
  if (!(e instanceof Endboss)) console.log(e.constructor.name, e.x);
});
```

### Issue: Projectile not damaging
**Solution**: Verify collision detection and hitbox offsets.
```javascript
// In world.checkCollisions(), log hits
if (throwable.isColliding(enemy)) {
  console.log('Throwable hit', enemy.constructor.name);
}
```

### Issue: Audio not playing
**Solution**: Check mute state and browser audio permissions.
```javascript
console.log('Muted:', world.isMuted);
console.log('Audio element:', document.querySelector('audio'));
```

### Issue: Character animation stuck
**Solution**: Check animation state flags and intervals.
```javascript
console.log('isAttacking:', character.isAttacking);
console.log('isHurt:', character.isHurt());
console.log('isDead:', character.isDead());
console.log('isSleeping:', character.isSleeping);
```

### Issue: Performance lag
**Solution**: Check enemy count and active intervals.
```javascript
console.log('Enemies:', world.level.enemies.length);
console.log('Throwables:', world.throwableObject.length);
console.log('Intervals:', intervals.length);
```

---

## Testing Checklist

- [ ] Character movement in all directions
- [ ] Character can't move past level boundaries
- [ ] Attack animation plays
- [ ] Projectile spawns and moves
- [ ] Projectile hits puffer fish → enemy dies
- [ ] Projectile hits jellyfish → enemy dies
- [ ] Projectile hits boss bubble → boss takes damage
- [ ] Projectile hits boss body → no damage
- [ ] Character collides with puffer fish → takes poison damage
- [ ] Character collides with jellyfish → takes electric damage
- [ ] Character collides with green jellyfish → dies instantly
- [ ] Character collides with boss → takes damage
- [ ] Character collects coin → adds 20 coins
- [ ] Character collects life → adds 20 health
- [ ] Character collects poison → adds 20 poison
- [ ] Boss appears at x=8100
- [ ] Boss music starts at x=8100
- [ ] Boss dies → win screen
- [ ] Character dies → lose screen
- [ ] Mute button works
- [ ] Touch controls work on mobile
- [ ] Game resets properly with "Try Again"

---

## Performance Metrics

**Target Performance**:
- 60 FPS game loop
- <16ms per frame
- <5MB memory

**Current Estimates**:
- ~40-60 FPS (varies by system)
- ~3-5MB memory typical
- Bottleneck: Draw calls with many objects

---

*Quick Reference - November 2025*
