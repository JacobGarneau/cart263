"use strict";

/**
Arctic Phoenix
Jacob Garneau

This is a template. You must fill in the title,
author, and this description to match your project!
*/

let map = [];

const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const BIOMES = [`lake`, `snow`, `snow`, `snow`, `mountains`, `mountains`];

/**
Description of preload
*/
function preload() {}

/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  generateMap();
  console.log(map);
}

// p5:
function draw() {
  drawMap();
}

function generateMap() {
  for (let i = 0; i < MAP_WIDTH; i++) {
    let row = []; // create the rows

    for (let j = 0; j < MAP_HEIGHT; j++) {
      let cell = {
        biome: random(BIOMES),
      };
      row.push(cell); // fill the rows with cells
    }

    map.push(row); // put the rows in the map
  }
}

function drawMap() {
  for (let i = 0; i < MAP_WIDTH; i++) {
    for (let j = 0; j < MAP_HEIGHT; j++) {
      let currentTile = map[i][j];

      if (currentTile.biome === `lake`) {
        fill(0, 150, 150);
      } else if (currentTile.biome === `snow`) {
        fill(255);
      } else if (currentTile.biome === `mountains`) {
        fill(150);
      }

      // draw the map cells
      rect(
        (i * width) / MAP_WIDTH,
        (j * height) / MAP_HEIGHT,
        width / MAP_WIDTH,
        height / MAP_HEIGHT
      );
    }
  }
}
