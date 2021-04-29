class Shrine extends Structure {
  constructor(attributes) {
    super(attributes);
    this.interactionRange = 200;
    this.icon = images.shrine;

    this.cell.hasShrine = true;

    entityCount = localStorage.getItem("entityCount");
    if (!this.cell.spiritDefeated && entityCount === null) {
      let spirit = new GreatSpirit({
        mapX: this.mapX,
        mapY: this.mapY,
        maxHealth: 150,
        health: 150,
        healthTarget: 150,
      });
    }

    shrines.push(this);
  }

  display() {
    if (this.cell.biome === `sea`) {
      push();
      imageMode(CENTER);
      image(
        images.island1,
        this.mapX * width - player.mapX * width + this.x,
        this.mapY * height - player.mapY * height + this.y + 129
      );
      image(
        images.island2,
        this.mapX * width - player.mapX * width + this.x,
        this.mapY * height - player.mapY * height + this.y + 86
      );
      pop();
    }

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
