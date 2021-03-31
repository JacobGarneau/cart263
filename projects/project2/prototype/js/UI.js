class UI {
  constructor() {
    this.healthBar = {
      x: 20,
      y: 20,
      height: 24,
      width: 4,
      fill: {
        r: 255,
        g: 0,
        b: 0,
      },
    };
  }

  display() {
    // draw health bar container
    fill(0);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      this.healthBar.width * player.maxHealth,
      this.healthBar.height
    );

    // draw health bar fill
    fill(this.healthBar.fill.r, this.healthBar.fill.g, this.healthBar.fill.b);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      this.healthBar.width * player.health,
      this.healthBar.height
    );
  }
}
