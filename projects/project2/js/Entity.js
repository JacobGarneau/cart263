class Entity {
  constructor(
    mapX = Math.round(random(0, 9)),
    mapY = Math.round(random(0, 9))
  ) {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = 40;
    this.damage = 0;
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.healthTarget = this.health;
    this.healthGain = 0;
    this.mapX = mapX;
    this.mapY = mapY;
    this.movable = true;
    this.iFrames = 0; // frames of intangibility, often used to avoid taking the same attack multiple times

    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        if (i === this.mapX && j === this.mapY) {
          this.biome = mapGrid[i][j].biome;
        }
      }
    }
  }

  // display the entity
  display() {
    this.updateStats();

    push();
    noStroke();
    fill(0);
    rect(
      this.mapX * width + this.x - this.size / 2 - player.mapX * width,
      this.mapY * height + this.y - 16 - player.mapY * height,
      this.size,
      6
    );

    fill(255, 0, 0);
    let healthBarSize = (this.size / this.maxHealth) * this.health;
    rect(
      this.mapX * width + this.x - this.size / 2 - player.mapX * width,
      this.mapY * height + this.y - 16 - player.mapY * height,
      healthBarSize,
      6
    );
    pop();
  }

  // randomly move the entity
  move() {
    if (this.movable) {
      this.x += this.vx;
      this.y += this.vy;
      this.x = constrain(this.x, this.size / 2, width - this.size / 2);
      this.y = constrain(this.y, this.size / 2, height - this.size / 2);
    }
  }

  takeDamage(amount, frames) {
    if (this.iFrames === 0) {
      this.healthTarget -= amount;
      this.iFrames = frames + 1;
    }
  }

  updateStats() {
    if (this.iFrames > 0) {
      this.iFrames--;
    }

    if (this.healthTarget < this.health) {
      this.health--;
    } else if (this.healthTarget > this.health) {
      this.health++;
    }

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    player.healthTarget += this.healthGain;
    player.healthTarget = constrain(player.healthTarget, 0, player.maxHealth);
    entities.splice(entities.indexOf(this), 1);
  }
}
