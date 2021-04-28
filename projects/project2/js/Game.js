class Game extends Entity {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.detectionDistance = 200;
    this.type = `game`;

    this.vx = 0;
    this.vy = 0;
    this.ax = 0.1;
    this.ay = 0.1;

    this.maxSpeed = 1;

    if (this.cell.biome === `sea`) {
      this.icon = images.fish;
      this.healthGain = 15;
    } else {
      this.icon = images.rabbit;
      this.healthGain = 5;
    }

    if (this.health > 0) {
      entities.push(this);
    }
  }

  display() {
    super.display();
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

  move() {
    if (this.movable) {
      let distance = dist(
        this.mapX * width + this.x - player.mapX * width,
        this.mapY * height + this.y - player.mapY * height,
        player.x,
        player.y
      );

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
