class Shrine extends Structure {
  constructor(attributes) {
    super(attributes);
    this.interactionRange = 200;
    this.icon = images.shrine;

    this.cell.hasShrine = true;

    if (!this.cell.spiritDefeated) {
      let spirit = new Spirit({
        mapX: this.mapX,
        mapY: this.mapY,
        maxHealth: 50,
        health: 50,
        healthTarget: 50,
      });
    }

    shrines.push(this);
  }

  display() {
    super.display();

    if (this.cell.spiritDefeated) {
      push();
      imageMode(CENTER);
      image(
        images.sun2,
        this.mapX * width - player.mapX * width + this.x,
        this.mapY * height - player.mapY * height + this.y + 40
      );
      pop();
    }
  }

  interact() {
    let d = dist(
      this.mapX * width - player.mapX * width + this.x,
      this.mapY * height - player.mapY * height + this.y,
      player.x,
      player.y
    );
    if (d < this.interactionRange && this.cell.spiritDefeated) {
      // draw command prompt
      push();
      fill(246, 122, 51);
      noStroke();
      rectMode(CENTER);
      rect(width / 2, height - 60, 510, 40, 12, 12, 12, 12);
      textSize(24);
      textAlign(CENTER, CENTER);
      fill(255);
      text(
        `Press [SPACEBAR] to interact with the shrine`,
        width / 2,
        height - 59
      );
      pop();
    }
  }
}
