class Entity {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = 40;
    this.damage = 0;
    this.health = 10;
    this.mapX = Math.round(random(0, 9));
    this.mapY = Math.round(random(0, 9));
    this.iFrames = 0; // frames of intangibility, often used to avoid taking the same attack multiple times
  }

  // display the entity
  display() {
    push();
    fill(0, 255, 0);
    ellipse(
      this.mapX * width + this.x - player.mapX * width,
      this.mapY * height + this.y - player.mapY * height,
      this.size
    );
    pop();

    if (this.iFrames > 0) {
      this.iFrames--;
    }
  }

  // randomly move the entity
  move() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);
  }

  takeDamage(amount, frames) {
    if (this.iFrames === 0) {
      this.health -= amount;
      console.log(this.health);
      this.iFrames = frames + 1;

      if (this.health <= 0) {
        this.die();
      }
    }
  }

  die() {
    player.staminaTarget += this.staminaGain;
    if (player.staminaTarget > player.maxStamina) {
      player.staminaTarget = player.maxStamina;
    }
    entities.splice(entities.indexOf(this), 1);
  }
}
