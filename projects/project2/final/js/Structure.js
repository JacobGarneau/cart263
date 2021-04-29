class Structure {
  constructor(attributes) {
    this.mapX = attributes.mapX;
    this.mapY = attributes.mapY;
    this.x = width / 2;
    this.y = height / 2;
    this.fill = {
      r: 150,
      g: 150,
      b: 0,
    };

    // attributes this structure to a specific map tile
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        if (i === this.mapX && j === this.mapY) {
          this.cell = mapGrid[i][j];
        }
      }
    }
  }

  // displays the structure
  display() {
    // draws the structure's icon
    push();
    imageMode(CENTER);
    image(
      this.icon,
      this.mapX * width - player.mapX * width + this.x,
      this.mapY * height - player.mapY * height + this.y
    );
    pop();
  }
}
