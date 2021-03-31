class Player {
  constructor() {
    this.x = width / 2; // horizontal position on the screen
    this.y = height / 2; // vertical position on the screen
    this.mapX = 5; // horizontal position on the map tiles
    this.mapY = 5; // vertical position on the map tiles
    this.speed = 6;
    this.movable = true;
    this.maxHealth = data.player.health;
    this.health = this.maxHealth;
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, 100);
  }

  move() {
    if (this.movable) {
      if (keyIsDown(87)) {
        this.y -= this.speed;
      }
      if (keyIsDown(83)) {
        this.y += this.speed;
      }
      if (keyIsDown(65)) {
        this.x -= this.speed;
      }
      if (keyIsDown(68)) {
        this.x += this.speed;
      }
    }
  }
}
