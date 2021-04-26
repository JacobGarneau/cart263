class Shrine extends Structure {
  constructor(mapX, mapY, x, y, icon) {
    super(mapX, mapY, x, y, icon);
    this.interactionRange = 200;

    shrines.push(this);
  }

  display() {
    super.display();
    push();
    imageMode(CENTER);
    image(
      images.sun2,
      this.mapX * width - player.mapX * width + this.x,
      this.mapY * height - player.mapY * height + this.y + 40
    );
    pop();
  }

  interact() {
    let d = dist(
      this.mapX * width - player.mapX * width + this.x,
      this.mapY * height - player.mapY * height + this.y,
      player.x,
      player.y
    );
    if (d < this.interactionRange) {
      // draw command prompt
      push();
      fill(0);
      rectMode(CENTER);
      rect(width / 2, height - 60, 510, 40);
      textSize(24);
      textAlign(CENTER, CENTER);
      fill(255);
      text(
        `Press [SPACEBAR] to interact with the shrine`,
        width / 2,
        height - 60
      );
      pop();
    }
  }
}
