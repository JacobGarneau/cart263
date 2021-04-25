class Game extends Entity {
  constructor() {
    super();
    this.maxHealth = 15;
    this.health = this.maxHealth;
    this.healthTarget = this.health;
    this.healthGain = 15;

    if (this.biome === `sea`) {
      this.icon = images.fish;
    } else {
      this.icon = images.rabbit;
    }

    entities.push(this);
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
}
