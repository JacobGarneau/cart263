class Minimap {
  constructor() {
    this.x = width - dyn(440, `x`);
    this.y = height - dyn(300, `y`);
    this.open = false;
  }

  // display the minimap
  display() {
    if (player.abilities.minimap) {
      if (this.open) {
        // draw the minimap if it is currently open
        for (let i = 0; i < MAP_WIDTH; i++) {
          for (let j = 0; j < MAP_HEIGHT; j++) {
            // set the appropriate biome color
            if (mapGrid[i][j].biome === `sea`) {
              fill(165, 233, 255, 150);
            } else if (mapGrid[i][j].biome === `snow`) {
              fill(243, 253, 255, 150);
            } else if (mapGrid[i][j].biome === `mountains`) {
              fill(196, 196, 196, 150);
            }

            // draw the map cells
            push();
            rectMode(CENTER);
            rect(
              this.x + (i * width) / 40,
              this.y + (j * height) / 30,
              width / 40,
              height / 30
            );
            pop();
          }
        }

        // draw the player's icon
        push();
        noStroke(0);
        fill(246, 122, 51);
        ellipse(
          this.x + (player.mapX * width) / 40,
          this.y + (player.mapY * height) / 30,
          10
        );

        for (let i = 0; i < MAP_WIDTH; i++) {
          for (let j = 0; j < MAP_HEIGHT; j++) {
            if (mapGrid[i][j].hasShrine && mapGrid[i][j].spiritDefeated) {
              // if the tile is a defeated shrine tile, add a marker on the minimap
              fill(199, 66, 66);
              ellipse(
                this.x + (i * width) / 40 + dyn(12, `x`),
                this.y + (j * height) / 30 - dyn(6, `y`),
                10
              );
            }
          }
        }
        pop();
      } else {
        // draw the command indication to open the minimap
        push();
        noStroke();
        fill(0);
        rectMode(CENTER);
        rect(this.x + dyn(320, `x`), ui.abilities.y, 100, 100, 18, 18, 18, 18);

        fill(255);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        textSize(36);
        text(`M`, this.x + dyn(320, `x`), ui.abilities.y - 10);
        textSize(16);
        text(`Minimap`, this.x + dyn(320, `x`), ui.abilities.y + 22);
        pop();
      }
    }
  }

  // toggle the minimap from open to closed and from closed to open
  toggle() {
    if (this.open) {
      this.open = false;
    } else {
      this.open = true;
    }
  }
}
