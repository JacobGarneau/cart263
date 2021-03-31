class Map {
  constructor() {
    this.mapTargetX; // tile to which the map is currently scrolling horizontally
    this.mapTargetY; // tile to which the map is currently scrolling vertically
    this.mapScrollSpeed = 0.05; // speed at which the map scroll from one tile to another
    this.transitionX = 0;
    this.transitionY = 0;

    // generate the grid
    for (let i = 0; i < MAP_WIDTH; i++) {
      let row = []; // create the rows

      for (let j = 0; j < MAP_HEIGHT; j++) {
        let cell = {
          biome: random(BIOMES),
          template: undefined,
        };

        if (cell.biome === `sea`) {
          cell.template = random(terrainData.seaTiles);
        } else if (cell.biome === `snow`) {
          cell.template = random(terrainData.snowTiles);
        } else if (cell.biome === `mountains`) {
          cell.template = random(terrainData.mountainTiles);
        }

        row.push(cell); // fill the rows with cells
      }

      mapGrid.push(row); // put the rows in the map
    }
  }

  // display the terrain and the biomes
  displayTerrain() {
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        // set biome color
        if (mapGrid[i][j].biome === `sea`) {
          fill(0, 150, 150);
        } else if (mapGrid[i][j].biome === `snow`) {
          fill(255);
        } else if (mapGrid[i][j].biome === `mountains`) {
          fill(150);
        }

        // draw the map cells
        let cellX = i * width - player.mapX * width;
        let cellY = j * height - player.mapY * height;
        rect(cellX, cellY, width, height);
      }
    }
  }

  // display the contents of the map
  displayContents() {
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        let cellX = i * width - player.mapX * width;
        let cellY = j * height - player.mapY * height;

        // draw the glaciers
        for (let k = 0; k < mapGrid[i][j].template.glaciers.length; k++) {
          push();
          fill(0, 70, 255);
          ellipse(
            cellX + mapGrid[i][j].template.glaciers[k].x,
            cellY + mapGrid[i][j].template.glaciers[k].y,
            mapGrid[i][j].template.glaciers[k].size
          );
          pop();
        }
        // draw the trees
        for (let k = 0; k < mapGrid[i][j].template.trees.length; k++) {
          push();
          fill(150, 70, 0);
          ellipse(
            cellX + mapGrid[i][j].template.trees[k].x,
            cellY + mapGrid[i][j].template.trees[k].y,
            mapGrid[i][j].template.trees[k].size
          );
          pop();
        }
        // draw the mountains
        for (let k = 0; k < mapGrid[i][j].template.mountains.length; k++) {
          push();
          fill(200);
          ellipse(
            cellX + mapGrid[i][j].template.mountains[k].x,
            cellY + mapGrid[i][j].template.mountains[k].y,
            mapGrid[i][j].template.mountains[k].size
          );
          pop();
        }
      }
    }
  }

  // change the visible tile when the player exits the screen
  changeTile() {
    if (player.x <= 0) {
      // if player goes out of map, bring them back on the other side
      if (player.mapX === 0) {
        player.mapX = MAP_WIDTH - 1;
        this.mapTargetX = player.mapX;
      } else {
        this.mapTargetX = player.mapX - 1;
      }
      player.x = width; // reset player position
      this.transitionX = 1 / this.mapScrollSpeed; // set map scroll delay
    } else if (player.x >= width) {
      // if player goes out of map, bring them back on the other side
      if (player.mapX === MAP_HEIGHT - 1) {
        player.mapX = 0;
        this.mapTargetX = player.mapX;
      } else {
        this.mapTargetX = player.mapX + 1;
      }
      player.x = 0; // reset player position
      this.transitionX = 1 / this.mapScrollSpeed; // set map scroll delay
    } else if (player.y <= 0) {
      // if player goes out of map, bring them back on the other side
      if (player.mapY === 0) {
        player.mapY = MAP_HEIGHT - 1;
        this.mapTargetY = player.mapY;
      } else {
        this.mapTargetY = player.mapY - 1;
      }
      player.y = height; // reset player position
      this.transitionY = 1 / this.mapScrollSpeed; // set map scroll delay
    } else if (player.y >= height) {
      // if player goes out of map, bring them back on the other side
      if (player.mapY === MAP_HEIGHT - 1) {
        player.mapY = 0;
        this.mapTargetY = player.mapY;
      } else {
        this.mapTargetY = player.mapY + 1;
      }
      player.y = 0; // reset player position
      this.transitionY = 1 / this.mapScrollSpeed; // set map scroll delay
    }

    // gradually adjust horizontal position
    if (this.mapTargetX > player.mapX) {
      player.mapX += this.mapScrollSpeed;
    } else if (this.mapTargetX < player.mapX) {
      player.mapX -= this.mapScrollSpeed;
    }
    // gradually adjust vertical position
    if (this.mapTargetY > player.mapY) {
      player.mapY += this.mapScrollSpeed;
    } else if (this.mapTargetY < player.mapY) {
      player.mapY -= this.mapScrollSpeed;
    }

    // countdown the map scroll duration
    this.transitionX--;
    this.transitionY--;

    // snap to map position
    if (this.transitionX === 0) {
      player.mapX = this.mapTargetX;
    } else if (this.transitionY === 0) {
      player.mapY = this.mapTargetY;
    }
  }
}
