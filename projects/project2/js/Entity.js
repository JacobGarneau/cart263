class Entity {
  constructor(attributes) {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = 40;
    this.damage = 0;
    this.maxHealth = attributes.maxHealth;
    this.health = this.health;
    this.healthTarget = this.healthTarget;
    this.healthGain = 0;
    this.healthBarShift = 0;
    this.mapX = attributes.mapX;
    this.mapY = attributes.mapY;
    this.movable = true;
    this.iFrames = 0; // frames of intangibility, often used to avoid taking the same attack multiple times

    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        if (i === this.mapX && j === this.mapY) {
          this.cell = mapGrid[i][j];
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
      this.mapY * height +
        this.y -
        16 -
        player.mapY * height -
        this.healthBarShift,
      this.size,
      6
    );

    fill(255, 0, 0);
    let healthBarSize = (this.size / this.maxHealth) * this.health;
    rect(
      this.mapX * width + this.x - this.size / 2 - player.mapX * width,
      this.mapY * height +
        this.y -
        16 -
        player.mapY * height -
        this.healthBarShift,
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

      if (
        this.type === `spirit` ||
        this.type === `greatSpirit` ||
        this.type === `finalBoss`
      ) {
        if (player.currentAction === `emberNova`) {
          sounds.tick.play();
        } else {
          sounds.spiritDamage.play();
        }

        if (
          (this.type === `greatSpirit` &&
            this.healthTarget < this.maxHealth / 2) ||
          (this.type === `finalBoss` && this.healthTarget < this.maxHealth / 2)
        ) {
          sounds.rotateHum.play();
          sounds.rotateHum.loop();
        }

        if (this.type === `finalBoss`) {
          player.frostbiteTarget += 6;
        }
      } else if (this.type === `game`) {
        if (this.cell.biome === `sea`) {
          sounds.fishDamage.play();
        } else {
          sounds.rabbitDamage.play();
        }
      }
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
