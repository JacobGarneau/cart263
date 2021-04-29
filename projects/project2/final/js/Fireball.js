class Fireball {
  constructor(direction) {
    this.x = player.x;
    this.y = player.y;
    this.mapX = player.mapX;
    this.mapY = player.mapY;
    this.progress = 0; // distance the fireball has travelled so far
    this.size = player.attackSize;
    this.speed = 10;
    this.direction = direction; // direction in which the fireball is moving
    this.movable = true;
  }

  // displays the fireball
  display() {
    if (player.currentAction === undefined) {
      // destroys the fireball if the player's active attack frames run out
      this.die();
    }

    // draws the fireball with an image and an ellipse layered one on top of the other
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

  // moves the fireball
  move() {
    if (this.movable) {
      this.progress += this.speed;

      // add the fireball's progress to its position depending on the direction it is going
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
        // deal damage to all entities that touch the fireball and give them appropriate invincibility frames to prevent repeating damage
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

  // destroys the fireball
  die() {
    // removes the fireball from the projectile array
    projectiles.splice(projectiles.indexOf(this), 1);
  }
}
