class Entity {
  constructor(attributes) {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = 40;
    this.damage = 0; // damage dealt by this entity
    this.maxHealth = attributes.maxHealth;
    this.health = this.health;
    this.healthTarget = this.healthTarget;
    this.healthGain = 0; // health gained by the player when this entity dies
    this.healthBarShift = 0; // vertical displacement of the health bar
    this.mapX = attributes.mapX;
    this.mapY = attributes.mapY;
    this.movable = true;
    this.iFrames = 0; // frames of intangibility, often used to avoid taking the same attack multiple times

    // attributes this entity to a specific map tile
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

    // draw the health bar container
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

    // draw the health bar
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

  // reduce this entity's health in response to the player's actions
  takeDamage(amount, frames) {
    // entity is immune to damage if it got hit too fast twice
    if (this.iFrames === 0) {
      this.healthTarget -= amount;
      this.iFrames = frames + 1;

      if (
        this.type === `spirit` ||
        this.type === `greatSpirit` ||
        this.type === `finalBoss`
      ) {
        // play the appropriate damage sound for spirits
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
          // play the sounds for the spirits' rotating attack
          sounds.rotateHum.play();
          sounds.rotateHum.loop();
        }

        if (this.type === `finalBoss`) {
          // refill the player's Warmth gauge when they hit a great spirit or the final boss
          player.frostbiteTarget += 6;
          player.frostbiteTarget = constrain(
            player.frostbiteTarget,
            0,
            player.maxFrostbite
          );
        }
      } else if (this.type === `game`) {
        // play the sounds for the various types of game depending on their biome
        if (this.cell.biome === `sea`) {
          sounds.fishDamage.play();
        } else {
          sounds.rabbitDamage.play();
        }
      }
    }
  }

  // updates the entity's health and other stats
  updateStats() {
    // ticks down invincibility frames
    if (this.iFrames > 0) {
      this.iFrames--;
    }

    // adjusts health depending on current health target
    if (this.healthTarget < this.health) {
      this.health--;
    } else if (this.healthTarget > this.health) {
      this.health++;
    }

    // kill the entity if its health reaches 0
    if (this.health <= 0) {
      this.die();
    }
  }

  // kill the entity
  die() {
    // refill the player's health a certain amount
    player.healthTarget += this.healthGain;
    player.healthTarget = constrain(player.healthTarget, 0, player.maxHealth);
    // remove this entity from the entity array
    entities.splice(entities.indexOf(this), 1);
  }
}
