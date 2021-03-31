class UI {
  constructor() {
    this.healthBar = {
      x: 20,
      y: 20,
      height: 40,
      width: 360,
      fill: {
        r: 255,
        g: 0,
        b: 0,
      },
    };
  }

  display() {
    fill(0);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      this.healthBar.width,
      this.healthBar.height
    );
    fill(this.healthBar.fill.r, this.healthBar.fill.g, this.healthBar.fill.b);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      (this.healthBar.width * player.health) / 100,
      this.healthBar.height
    );
  }
}
