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
          template: random(terrainData.snowTiles),
        };
        row.push(cell); // fill the rows with cells
      }

      mapGrid.push(row); // put the rows in the map
    }
  }

  // display the map
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
        let cellX = i * width - player.mapX * width;
        let cellY = j * height - player.mapY * height;
        rect(cellX, cellY, width, height);

        // draw the contents of each cell
        for (let k = 0; k < mapGrid[i][j].template.trees.length; k++) {
          fill(150, 70, 0);
          ellipse(
            cellX + mapGrid[i][j].template.trees[k].x,
            cellY + mapGrid[i][j].template.trees[k].y,
            mapGrid[i][j].template.trees[k].size
          );
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
