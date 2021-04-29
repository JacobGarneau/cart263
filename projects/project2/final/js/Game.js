class Game extends Entity {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.detectionDistance = 200; // distance at which the game will detect the player's approach
    this.type = `game`;

    // movement and acceleration stats
    this.vx = 0;
    this.vy = 0;
    this.ax = 0.1;
    this.ay = 0.1;

    this.maxSpeed = 1;

    // change the game's icon depending on its biome
    if (this.cell.biome === `sea`) {
      this.icon = images.fish;
      this.healthGain = 15;
    } else {
      this.icon = images.rabbit;
      this.healthGain = 5;
    }

    // places the game on the map if it was not alread killed
    if (this.health > 0) {
      entities.push(this);
    }
  }

  // displays the game
  display() {
    super.display();

    // draws the game's icon
    push();
    fill(0, 255, 0);
    image(
      this.icon,
      this.mapX * width + this.x - player.mapX * width - 20,
      this.mapY * height + this.y - player.mapY * height,
      this.size,
      this.size
    );
    pop();
  }

  // moves the game
  move() {
    if (this.movable) {
      // detect the game's distance from the player
      let distance = dist(
        this.mapX * width + this.x - player.mapX * width,
        this.mapY * height + this.y - player.mapY * height,
        player.x,
        player.y
      );

      // move the game away from the player if they get too close
      if (this.mapX === player.mapX && this.mapY === player.mapY) {
        if (this.x > player.x && distance <= this.detectionDistance) {
          this.vx += this.ax;
        } else if (this.x < player.x && distance <= this.detectionDistance) {
          this.vx -= this.ax;
        } else if (distance > this.detectionDistance) {
          if (this.vx > 0) {
            this.vx -= this.ax;
          } else if (this.vx < 0) {
            this.vx += this.ax;
          }
        }
        this.vx = constrain(this.vx, -this.maxSpeed, this.maxSpeed);

        if (this.y > player.y && distance <= this.detectionDistance) {
          this.vy += this.ay / 2;
        } else if (this.y < player.y && distance <= this.detectionDistance) {
          this.vy -= this.ay;
        } else if (distance > this.detectionDistance) {
          if (this.vy > 0) {
            this.vy -= this.ay;
          } else if (this.vy < 0) {
            this.vy += this.ay;
          }
        }
        this.vy = constrain(this.vy, -this.maxSpeed, this.maxSpeed);
      }
    }

    super.move();
  }
}
