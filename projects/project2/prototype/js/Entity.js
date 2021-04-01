class Entity {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = 40;
    this.damage = 0;
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.healthTarget = this.health;
    this.healthGain = 0;
    this.mapX = Math.round(random(0, 9));
    this.mapY = Math.round(random(0, 9));
    this.iFrames = 0; // frames of intangibility, often used to avoid taking the same attack multiple times
  }

  // display the entity
  display() {
    push();
    fill(0, 255, 0);
    image(
      images.fish,
      this.mapX * width + this.x - player.mapX * width,
      this.mapY * height + this.y - player.mapY * height,
      this.size,
      this.size
    );
    pop();

    this.updateStats();

    push();
    fill(0);
    rect(
      this.mapX * width + this.x - this.size / 2 - player.mapX * width,
      this.mapY * height + this.y - 36 - player.mapY * height,
      this.size,
      6
    );

    fill(255, 0, 0);
    let healthBarSize = (this.size / this.maxHealth) * this.health;
    rect(
      this.mapX * width + this.x - this.size / 2 - player.mapX * width,
      this.mapY * height + this.y - 36 - player.mapY * height,
      healthBarSize,
      6
    );
    pop();
  }

  // randomly move the entity
  move() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);
  }

  takeDamage(amount, frames) {
    if (this.iFrames === 0) {
      this.healthTarget -= amount;
      this.iFrames = frames + 1;
    }
  }

  updateStats() {
    if (this.iFrames > 0) {
      this.iFrames--;
    }

    if (this.healthTarget < this.health) {
      this.health--;
    } else if (this.healthTarget > this.health) {
      this.health++;
    }

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    player.healthTarget += this.healthGain;
    player.healthTarget = constrain(player.healthTarget, 0, player.maxHealth);
    entities.splice(entities.indexOf(this), 1);
  }
}
