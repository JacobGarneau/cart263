class Spirit extends Entity {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.healthGain = 15;
    this.healthIncrease = 25;
    this.type = `spirit`;

    this.meleeTimer = 0;
    this.meleeChargeup = 30;
    this.meleeRange = 60;
    this.meleeDamage = 20;

    this.rangedTimer = 0;
    this.rangedChargeup = 120;
    this.rangedRange = 180;
    this.rangedDamage = 12;

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
    image(
      images.ghost,
      this.mapX * width + this.x - player.mapX * width - 20,
      this.mapY * height + this.y - player.mapY * height,
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
    if (player.mapX === this.mapX && player.mapY === this.mapY) {
      let d = dist(this.x, this.y + 20, player.x, player.y);

      push();
      noStroke();
      fill(255, 0, 0, 100);
      ellipse(this.x, this.y + 20, this.meleeRange * 2);
      fill(0, 255, 0, 100);
      ellipse(this.x, this.y + 20, this.rangedRange * 2);
      pop();

      if (d < this.meleeRange) {
        this.meleeTimer++;
        console.log(this.meleeTimer);

        if (this.meleeTimer >= this.meleeChargeup) {
          this.attackMelee();
          this.meleeTimer = 0;
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
    }
  }

  attackMelee() {
    player.healthTarget -= this.meleeDamage;
  }

  attackRanged() {
    let projectile = new Projectile(this);
  }

  die() {
    player.sunPoints++;
    player.currentSunPoints++;
    player.frostbiteTarget += 20;
    player.frostbiteTarget = constrain(
      player.frostbiteTarget,
      0,
      player.maxFrostbite
    );

    this.cell.spiritDefeated = true;
    player.mapMovable = true;

    for (let i = 0; i < entities.length; i++) {
      if (entities[i] instanceof Spirit) {
        entities[i].maxHealth += this.healthIncrease;
        entities[i].health += this.healthIncrease;
        entities[i].healthTarget += this.healthIncrease;
      }
    }

    super.die();
  }
}
