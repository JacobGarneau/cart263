class Shrine extends Structure {
  constructor(attributes) {
    super(attributes);
    this.interactionRange = 200; // range at which the player can interact with the shrine
    this.icon = images.shrine;
    this.cell.hasShrine = true;

    entityCount = localStorage.getItem("entityCount");
    if (!this.cell.spiritDefeated && entityCount === null) {
      // if there was no entity data saved and this shrine had not been defeated, creates a new great spirit
      let spirit = new GreatSpirit({
        mapX: this.mapX,
        mapY: this.mapY,
        maxHealth: 150,
        health: 150,
        healthTarget: 150,
      });
    }

    // adds the shrine to the shrine array
    shrines.push(this);
  }

  // displays the shrine
  display() {
    if (this.cell.biome === `sea`) {
      // if the shrine is in a sea biome, draws an island for it to stand on
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
      // if the shrine's great spirit has been defeated, display a sun icon inside the shrine
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

  // handles player interaction with the shrine
  interact() {
    let d = dist(
      this.mapX * width - player.mapX * width + this.x,
      this.mapY * height - player.mapY * height + this.y,
      player.x,
      player.y
    );

    // if the player is close enough to the shrine, display a popup in the UI
    if (d < this.interactionRange && this.cell.spiritDefeated) {
      ui.shrinePopup = true;
    } else {
      ui.shrinePopup = false;
    }
  }
}
