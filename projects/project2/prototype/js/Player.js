class Player {
  constructor() {
    this.x = width / 2; // horizontal position on the screen
    this.y = height / 2; // vertical position on the screen
    this.speed = 5;
    this.vx = 0;
    this.vy = -this.speed;
    this.rotation = 180;
    this.mapX = 5; // horizontal position on the map tiles
    this.mapY = 5; // vertical position on the map tiles
    this.movable = true;
    this.maxHealth = playerData.stats.health;
    this.health = this.maxHealth;
    this.hitlag = 0; // time before you can make another attack
    this.attackSize = 0; // size of the hitbox on an attack
    this.attackX = 0; // horizontal position of the attack hitbox
    this.attackY = 0; // vertical position of the attack hitbox
  }

  display() {
    push();
    fill(255, 0, 0);
    translate(this.x, this.y);
    angleMode(DEGREES);
    rotate(this.rotation);
    // ellipse(0, 0, 100);
    triangle(0, 24, 24, -16, -24, -16);
    triangle(0, 24, 12, 4, -12, 4);
    pop();
  }

  move() {
    if (this.movable) {
      if (keyIsDown(87)) {
        this.vx = 0;
        this.vy = -this.speed;
        this.rotation = 180;
      }
      if (keyIsDown(83)) {
        this.vx = 0;
        this.vy = this.speed;
        this.rotation = 0;
      }
      if (keyIsDown(65)) {
        this.vy = 0;
        this.vx = -this.speed;
        this.rotation = 90;
      }
      if (keyIsDown(68)) {
        this.vy = 0;
        this.vx = this.speed;
        this.rotation = 270;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  handleActions() {
    if (this.hitlag > 0) {
      this.hitlag--;
    } else {
      this.active = undefined;
      this.attackSize = undefined;
    }

    if (this.active === `peck`) {
      push();
      fill(255, 255, 0);
      translate(this.x, this.y);
      angleMode(DEGREES);
      rotate(this.rotation);
      ellipse(0, 32, this.attackSize);
      pop();
    }
  }

  attack(attack) {
    if (this.hitlag === 0) {
      this.active = attack.name;
      this.attackX = attack.posX;
      this.attackY = attack.posY;
      this.attackSize = attack.size;
      this.hitlag = attack.hitlag;
    }
  }
}
