class Minimap {
  constructor() {}

  // display the minimap
  display() {
    // draw the minimap
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        // set the appropriate biome color
        if (mapGrid[i][j].biome === `lake`) {
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
          width - 320 + (i * width) / 40,
          height - 210 + (j * height) / 40,
          width / 40,
          height / 40
        );
        pop();
      }
    }

    // draw the player's icon
    fill(255, 0, 0);
    ellipse(
      width - 320 + (player.mapX * width) / 40,
      height - 210 + (player.mapY * height) / 40,
      10
    );
  }
}
