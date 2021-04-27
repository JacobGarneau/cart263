class Spirit extends Entity {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.healthGain = 15;
    this.healthIncrease = 25;
    this.type = `spirit`;

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
