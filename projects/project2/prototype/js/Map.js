class Map {
  constructor() {
    // generate the grid
    for (let i = 0; i < MAP_WIDTH; i++) {
      let row = []; // create the rows

      for (let j = 0; j < MAP_HEIGHT; j++) {
        let cell = {
          biome: random(BIOMES),
        };
        row.push(cell); // fill the rows with cells
      }

      mapGrid.push(row); // put the rows in the map
    }
  }

  display() {
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        // set biome color
        if (mapGrid[i][j].biome === `lake`) {
          fill(0, 150, 150);
        } else if (mapGrid[i][j].biome === `snow`) {
          fill(255);
        } else if (mapGrid[i][j].biome === `mountains`) {
          fill(150);
        }

        // draw the map cells
        rect(
          i * width - player.mapX * width,
          j * height - player.mapY * height,
          width,
          height
        );
      }
    }
  }

  // chage the visible tile when the player exits the screen
  changeTile() {
    if (player.x <= 0) {
      // if player goes out of map, bring them back on the other side
      if (player.mapX === 0) {
        player.mapX = MAP_WIDTH - 1;
      } else {
        player.mapX--;
      }
      player.x = width; // reset player position
    } else if (player.x >= width) {
      // if player goes out of map, bring them back on the other side
      if (player.mapX === MAP_HEIGHT - 1) {
        player.mapX = 0;
      } else {
        player.mapX++;
      }
      player.x = 0; // reset player position
    } else if (player.y <= 0) {
      // if player goes out of map, bring them back on the other side
      if (player.mapY === 0) {
        player.mapY = MAP_HEIGHT - 1;
      } else {
        player.mapY--;
      }
      player.y = height; // reset player position
    } else if (player.y >= height) {
      // if player goes out of map, bring them back on the other side
      if (player.mapY === MAP_HEIGHT - 1) {
        player.mapY = 0;
      } else {
        player.mapY++;
      }
      player.y = 0; // reset player position
    }
  }
}
