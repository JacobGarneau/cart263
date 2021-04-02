class Minimap {
  constructor() {
    this.x = width - 400;
    this.y = height - 210;
  }

  // display the minimap
  display() {
    // draw the minimap
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        // set the appropriate biome color
        if (mapGrid[i][j].biome === `sea`) {
          fill(0, 150, 150, 150);
        } else if (mapGrid[i][j].biome === `snow`) {
          fill(255, 255, 255, 150);
        } else if (mapGrid[i][j].biome === `mountains`) {
          fill(150, 150, 150, 150);
        }

        // draw the map cells
        push();
        rectMode(CENTER);
        rect(
          this.x + (i * width) / 40,
          this.y + (j * height) / 40,
          width / 40,
          height / 40
        );
        pop();
      }
    }

    // draw the player's icon
    fill(255, 0, 0);
    ellipse(
      this.x + (player.mapX * width) / 40,
      this.y + (player.mapY * height) / 40,
      10
    );
  }
}
