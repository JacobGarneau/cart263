class Projectile {
  constructor(owner) {
    this.x = owner.x;
    this.y = owner.y;
    this.mapX = owner.mapX;
    this.mapY = owner.mapY;

    // movement and acceleration stats
    this.vx = 0;
    this.vy = 0;
    this.ax = 0.4;
    this.ay = 0.4;
    this.maxSpeed = 8;

    this.movable = true;
    this.size = 60;
    this.rotation = 0;

    this.damage = owner.rangedDamage; // damage dealt by the projectile
    this.duration = 80; // time until the projectile disappears
    this.age = 0; // time passed since the projectile has been created

    // adds the projectile to the projectile array
    projectiles.push(this);
    sounds.spiritShoot.play();
  }

  // displays the projectile
  display() {
    // ticks up the projectile's age
    this.age++;
    // destroys the projectile if its age matches up its maximum duration
    if (this.age >= this.duration) {
      this.die();
    }

    // spins the projectile on itself
    this.rotation--;

    // draws the projectile's icon
    push();
    translate(
      this.mapX * width + this.x - player.mapX * width,
      this.mapY * height + this.y - player.mapY * height
    );
    rotate(this.rotation);
    fill(255, 255, 0);
    imageMode(CENTER);
    image(images.nova3, 0, 0);

    noStroke();
    fill(255, 200, 0);
    ellipse(0, 0, 32);
    pop();

    // deals damage to the player if touching
    this.dealDamage();
  }

  // moves the projectile
  move() {
    if (player.movable) {
      // moves up and down, left and right depending on the player's current position relative to the projectile's
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

  // deals damage to the player
  dealDamage() {
    let d = dist(this.x, this.y, player.x, player.y);
    if (
      d < this.size / 2 &&
      this.mapX === player.mapX &&
      this.mapY === player.mapY
    ) {
      // if the player touches the projectile, deal damage to them and destroy the projectile to prevent repeating damage
      player.healthTarget -= this.damage;
      sounds.spiritHit.play();
      this.die();
    }
  }

  // destroys the projectile
  die() {
    // removes the projectile from the projectile array
    projectiles.splice(projectiles.indexOf(this), 1);
  }
}
