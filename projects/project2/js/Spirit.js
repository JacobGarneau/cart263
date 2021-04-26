class Spirit extends Entity {
  constructor(mapX, mapY) {
    super(mapX, mapY);
    this.maxHealth = 150;
    this.health = this.maxHealth;
    this.healthTarget = this.health;
    this.healthGain = 15;

    this.vx = 0;
    this.vy = 0;
    this.ax = 0.1;
    this.ay = 0.1;

    this.maxSpeed = 2;

    entities.push(this);
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
    super.die();
  }
}
