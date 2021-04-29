class Spirit extends Entity {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.healthGain = 0;
    this.healthIncrease = 10; // amount by which all of the other spirits' health is increased after one is defeated

    this.type = `spirit`;
    this.deathQuotes = [
      `The Light of the Sun shines anew.`,
      `Silence reigns once more.`,
      `The Phoenix burns eternally.`,
      `None can resist the might of the Sun.`,
      `Spirits will haunt these lands no more.`,
    ]; // quotes that popup when the spirit is defeated
    this.popupDuration = 360;

    // stats for the spirit's melee attack
    this.meleeTimer = 0;
    this.meleeChargeup = 30; // time the player has to spend in the attack's range for it to trigger
    this.meleeRange = 60; // range of the attack
    this.meleeDamage = 8;
    this.meleeX = 0;
    this.meleeY = 0;
    this.meleeHit = false;

    // stats for the spirit's ranged attack
    this.rangedTimer = 0;
    this.rangedChargeup = 120; // time the player has to spend in the attack's range for it to trigger
    this.rangedRange = 180; // range of the attack
    this.rangedDamage = 4;

    // movement and acceleration stats
    this.vx = 0;
    this.vy = 0;
    this.ax = 0.1;
    this.ay = 0.1;

    this.maxSpeed = 2;

    // places the spirit on the map if it was not alread defeated
    if (this.health > 0) {
      entities.push(this);
    }
  }

  // displays the spirit
  display() {
    super.display();

    // draw the spirit's icon
    push();
    fill(0, 255, 0);
    imageMode(CENTER);
    image(
      images.ghost,
      this.mapX * width + this.x - player.mapX * width,
      this.mapY * height + this.y - player.mapY * height + 20,
      this.size,
      this.size
    );
    pop();
  }

  // moves the spirit towards the player
  move() {
    if (this.movable) {
      // move the spirit up and down, left and right to track the player
      if (this.mapX === player.mapX && this.mapY === player.mapY) {
        if (this.x < player.x) {
          this.vx += this.ax;
          this.vx = constrain(this.vx, -this.maxSpeed, this.maxSpeed);
        } else if (this.x > player.x) {
          this.vx -= this.ax;
          this.vx = constrain(this.vx, -this.maxSpeed, this.maxSpeed);
        }

        if (this.y < player.y) {
          this.vy += this.ay;
          this.vy = constrain(this.vy, -this.maxSpeed, this.maxSpeed);
        } else if (this.y > player.y) {
          this.vy -= this.ay;
          this.vy = constrain(this.vy, -this.maxSpeed, this.maxSpeed);
        }
      } else {
        if (this.x < width / 2) {
          this.vx += this.ax;
          this.vx = constrain(this.vx, -this.maxSpeed, this.maxSpeed);
        } else if (this.x > width / 2) {
          this.vx -= this.ax;
          this.vx = constrain(this.vx, -this.maxSpeed, this.maxSpeed);
        }

        if (this.y < height / 2) {
          this.vy += this.ay;
          this.vy = constrain(this.vy, -this.maxSpeed, this.maxSpeed);
        } else if (this.y > height / 2) {
          this.vy -= this.ay;
          this.vy = constrain(this.vy, -this.maxSpeed, this.maxSpeed);
        }
      }
    }

    super.move();
  }

  // check the player's position for attacks
  detectPlayer() {
    if (
      player.mapX === this.mapX &&
      player.mapY === this.mapY &&
      player.movable
    ) {
      let d = dist(this.x, this.y + 20, player.x, player.y);

      // draw the range of the melee attack in red
      push();
      noFill();
      strokeWeight(6);
      stroke(255, 0, 0, 100);
      ellipse(this.x, this.y + 20, this.meleeRange * 2);
      stroke(0, 255, 0, 100);
      ellipse(this.x, this.y + 20, this.rangedRange * 2);
      pop();

      // handle the melee attack
      if (d < this.meleeRange) {
        this.meleeTimer++;

        if (this.meleeTimer >= this.meleeChargeup) {
          // if the player is inside the melee attack's range for too long, deal damage to them
          this.attackMelee();
        }
      } else {
        this.meleeTimer = 0;
      }

      // handle the ranged attack
      if (d > this.rangedRange) {
        this.rangedTimer++;

        if (this.rangedTimer >= this.rangedChargeup) {
          // if the player is outside the ranged attack's range for too long, shoot a projectile
          this.attackRanged();
          this.rangedTimer = 0;
        }
      } else {
        this.rangedTimer = 0;
      }

      if (this.meleeHit) {
        // draw the melee attack if the payer is being hit
        push();
        imageMode(CENTER);
        image(images.strike2, this.meleeX, this.meleeY, 48, 48);
        pop();
      }
    }
  }

  // deals damage to the player
  attackMelee() {
    player.healthTarget -= this.meleeDamage;
    this.meleeX = player.x;
    this.meleeY = player.y;
    this.meleeTimer = -this.meleeChargeup * 1.5;
    this.meleeHit = true;
    sounds.spiritHit.play();

    setTimeout(() => {
      // erase the hit visual effect after a short while
      this.meleeHit = false;
    }, 200);
  }

  // shoots a projectile that tracks the player
  attackRanged() {
    let projectile = new Projectile(this);
  }

  // kills the spirit
  die() {
    // increase the player's sun point count
    player.sunPoints++;
    player.currentSunPoints++;

    // save in the map data that the spirit on this tile has been defeated
    this.cell.spiritDefeated = true;
    player.mapMovable = true;
    if (this.type === `spirit`) {
      // refill the player's Warmth gauge by a little bit if this spirit was not a great one nor the boss
      sounds.spiritDefeat.play();
      player.frostbiteTarget += 5;
    }

    for (let i = 0; i < entities.length; i++) {
      // increase the health of other spirits
      if (entities[i] instanceof Spirit) {
        entities[i].maxHealth += this.healthIncrease;
        entities[i].health += this.healthIncrease;
        entities[i].healthTarget += this.healthIncrease;
      }
    }

    // display the spirit's death quote as a popup
    popup = new Popup(random(this.deathQuotes), this.popupDuration);

    super.die();
  }
}
