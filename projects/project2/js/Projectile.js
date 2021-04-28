class Projectile {
  constructor(owner) {
    this.x = owner.x;
    this.y = owner.y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0.4;
    this.ay = 0.4;
    this.maxSpeed = 8;
    this.movable = true;
    this.size = 60;

    this.damage = owner.rangedDamage;
    this.duration = 80;
    this.age = 0;

    projectiles.push(this);
  }

  display() {
    // console.log(`PROJECTILE INCOMING`);
    this.age++;
    if (this.age >= this.duration) {
      this.die();
    }

    push();
    fill(255, 255, 0);
    imageMode(CENTER);
    image(images.nova3, this.x, this.y, this.size, this.size);
    // console.log(`PROJECTILE INCOMING`);

    noStroke();
    fill(255, 200, 0);
    ellipse(this.x, this.y, 32);
    pop();

    this.dealDamage();
  }

  move() {
    if (this.movable) {
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

      this.x += this.vx;
      this.y += this.vy;
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
    }
  }

  dealDamage() {
    let d = dist(this.x, this.y, player.x, player.y);
    if (d < this.size / 2) {
      player.healthTarget -= this.damage;
      this.die();
    }
  }

  die() {
    projectiles.splice(projectiles.indexOf(this), 1);
  }
}
