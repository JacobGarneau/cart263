class Fireball {
  constructor(direction) {
    this.x = player.x;
    this.y = player.y;
    this.mapX = player.mapX;
    this.mapY = player.mapY;
    this.progress = 0;
    this.size = player.attackSize;
    this.speed = 10;
    this.direction = direction;
    this.movable = true;
  }

  display() {
    if (player.currentAction === undefined) {
      this.die();
    }

    push();
    fill(255, 255, 0);
    translate(this.x, this.y);
    angleMode(DEGREES);
    rotate(this.direction);
    imageMode(CENTER);
    image(images.fireball, 0, this.progress);

    noStroke();
    fill(255, 200, 0);
    ellipse(0, this.progress + 6, 32);
    pop();
  }

  move() {
    if (this.movable) {
      this.progress += this.speed;

      let hitboxX;
      let hitboxY;
      if (this.direction === 0) {
        hitboxX = this.x;
        hitboxY = this.y + this.progress;
      } else if (this.direction === 90) {
        hitboxX = this.x - this.progress;
        hitboxY = this.y;
      } else if (this.direction === 180) {
        hitboxX = this.x;
        hitboxY = this.y - this.progress;
      } else if (this.direction === 270) {
        hitboxX = this.x + this.progress;
        hitboxY = this.y;
      }

      for (let i = 0; i < entities.length; i++) {
        if (
          dist(hitboxX, hitboxY, entities[i].x, entities[i].y) <=
            this.size / 2 + entities[i].size / 2 &&
          this.mapX === entities[i].mapX &&
          this.mapY === entities[i].mapY
        ) {
          entities[i].takeDamage(player.damage, player.active);
        }
      }
    }
  }

  die() {
    projectiles.splice(projectiles.indexOf(this), 1);
  }
}
