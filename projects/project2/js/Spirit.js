class Spirit extends Entity {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.healthGain = 0;
    this.healthIncrease = 10;

    this.type = `spirit`;
    this.deathQuotes = [
      `The Light of the Sun shines anew.`,
      `Silence reigns once more.`,
      `The Phoenix burns eternally.`,
      `None can resist the might of the Sun.`,
    ];
    this.popupDuration = 360;

    this.meleeTimer = 0;
    this.meleeChargeup = 30;
    this.meleeRange = 60;
    this.meleeDamage = 8;
    this.meleeX = 0;
    this.meleeY = 0;
    this.meleeHit = false;

    this.rangedTimer = 0;
    this.rangedChargeup = 120;
    this.rangedRange = 180;
    this.rangedDamage = 4;

    this.vx = 0;
    this.vy = 0;
    this.ax = 0.1;
    this.ay = 0.1;

    this.maxSpeed = 2;

    if (this.health > 0) {
      entities.push(this);
    }
  }

  display() {
    super.display();
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

  move() {
    if (this.movable) {
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

  detectPlayer() {
    if (
      player.mapX === this.mapX &&
      player.mapY === this.mapY &&
      player.movable
    ) {
      let d = dist(this.x, this.y + 20, player.x, player.y);

      push();
      noFill();
      strokeWeight(6);
      stroke(255, 0, 0, 100);
      ellipse(this.x, this.y + 20, this.meleeRange * 2);
      stroke(0, 255, 0, 100);
      ellipse(this.x, this.y + 20, this.rangedRange * 2);
      pop();

      if (d < this.meleeRange) {
        this.meleeTimer++;

        if (this.meleeTimer >= this.meleeChargeup) {
          this.attackMelee();
        }
      } else {
        this.meleeTimer = 0;
      }

      if (d > this.rangedRange) {
        this.rangedTimer++;

        if (this.rangedTimer >= this.rangedChargeup) {
          this.attackRanged();
          this.rangedTimer = 0;
        }
      } else {
        this.rangedTimer = 0;
      }

      if (this.meleeHit) {
        push();
        imageMode(CENTER);
        image(images.strike2, this.meleeX, this.meleeY, 48, 48);
        pop();
      }
    }
  }

  attackMelee() {
    player.healthTarget -= this.meleeDamage;
    this.meleeX = player.x;
    this.meleeY = player.y;
    this.meleeTimer = -this.meleeChargeup * 1.5;
    this.meleeHit = true;
    sounds.spiritHit.play();

    setTimeout(() => {
      this.meleeHit = false;
    }, 200);
  }

  attackRanged() {
    let projectile = new Projectile(this);
  }

  die() {
    player.sunPoints++;
    player.currentSunPoints++;
    this.cell.spiritDefeated = true;
    player.mapMovable = true;
    if (this.type === `spirit`) {
      sounds.spiritDefeat.play();
    }

    for (let i = 0; i < entities.length; i++) {
      if (entities[i] instanceof Spirit) {
        entities[i].maxHealth += this.healthIncrease;
        entities[i].health += this.healthIncrease;
        entities[i].healthTarget += this.healthIncrease;
      }
    }

    popup = new Popup(random(this.deathQuotes), this.popupDuration);

    super.die();
  }
}
