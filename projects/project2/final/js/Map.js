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
        // generate a new cell with its attributes
        let cell = {
          biome: random(BIOMES),
          template: undefined,
          spiritDefeated: false,
        };

        // assign a tile set depending on the cell's biome
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
        // sets the cell's color depending on its biome
        if (mapGrid[i][j].biome === `sea`) {
          fill(165, 233, 255);
        } else if (mapGrid[i][j].biome === `snow`) {
          fill(243, 253, 255);
        } else if (mapGrid[i][j].biome === `mountains`) {
          fill(214);
        }

        // draw the map cells
        let cellX = i * width - player.mapX * width;
        let cellY = j * height - player.mapY * height;
        push();
        noStroke();
        rect(cellX, cellY, width, height);
        pop();
      }
    }
  }

  // display the contents of the map
  displayContents() {
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        let cellX = i * width - player.mapX * width;
        let cellY = j * height - player.mapY * height;

        // draw the lakes
        for (let k = 0; k < mapGrid[i][j].template.lakes.length; k++) {
          image(
            images.lake,
            cellX + dyn(mapGrid[i][j].template.lakes[k].x, `x`),
            cellY + dyn(mapGrid[i][j].template.lakes[k].y, `y`)
          );
        }
        // draw the glaciers
        for (let k = 0; k < mapGrid[i][j].template.glaciers.length; k++) {
          image(
            images.glacier,
            cellX + dyn(mapGrid[i][j].template.glaciers[k].x, `x`),
            cellY + dyn(mapGrid[i][j].template.glaciers[k].y, `y`)
          );
        }
        // draw the trees
        for (let k = 0; k < mapGrid[i][j].template.trees.length; k++) {
          image(
            images.tree,
            cellX + dyn(mapGrid[i][j].template.trees[k].x, `x`),
            cellY + dyn(mapGrid[i][j].template.trees[k].y, `y`)
          );
        }
        // draw the mountains
        for (let k = 0; k < mapGrid[i][j].template.mountains.length; k++) {
          image(
            images.mountain,
            cellX + dyn(mapGrid[i][j].template.mountains[k].x, `x`),
            cellY + dyn(mapGrid[i][j].template.mountains[k].y, `y`)
          );
        }
      }
    }
  }

  // change the visible tile when the player exits the screen
  changeTile() {
    if (player.mapMovable) {
      if (player.x <= 0) {
        player.mapMovable = false;
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
        player.mapMovable = false;
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
        player.mapMovable = false;
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
        player.mapMovable = false;
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
    } else {
      // if the player cannot currently move out of their current map tile, make them bounce at the border
      if (player.x <= 0) {
        player.x = 0;
        player.vx *= -1;
      } else if (player.x >= width) {
        player.x = width;
        player.vx *= -1;
      }
      if (player.y <= 0) {
        player.y = 0;
        player.vy *= -1;
      } else if (player.y >= height) {
        player.y = height;
        player.vy *= -1;
      }
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
      // check if tile is an undefeated shrine tile
      for (let i = 0; i < shrines.length; i++) {
        if (
          player.mapX === shrines[i].mapX &&
          player.mapY === shrines[i].mapY &&
          !shrines[i].cell.spiritDefeated
        ) {
          // if it is, prevent the player from exiting the tile
          player.mapMovable = false;
          break;
        } else {
          player.mapMovable = true;
        }
      }
    } else if (this.transitionY === 0) {
      player.mapY = this.mapTargetY;
      // check if tile is an undefeated shrine tile
      for (let i = 0; i < shrines.length; i++) {
        if (
          player.mapX === shrines[i].mapX &&
          player.mapY === shrines[i].mapY &&
          !shrines[i].cell.spiritDefeated
        ) {
          // if it is, prevent the player from exiting the tile
          player.mapMovable = false;
          break;
        } else {
          player.mapMovable = true;
        }
      }
    }
  }
}
