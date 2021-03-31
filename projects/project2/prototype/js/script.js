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

let player, minimap;

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
  player = new Player();
  minimap = new Minimap();
}

// p5:
function draw() {
  drawMap();
  player.display();
  player.move();
  changeTile();
  minimap.display();
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
      // set biome color
      if (map[i][j].biome === `lake`) {
        fill(0, 150, 150);
      } else if (map[i][j].biome === `snow`) {
        fill(255);
      } else if (map[i][j].biome === `mountains`) {
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

function changeTile() {
  if (player.x <= 0) {
    // if player goes out of map, bring them back on the other side
    if (player.mapX === 0) {
      player.mapX = MAP_WIDTH - 1;
    } else {
      player.mapX--;
    }
    player.x = width;
  } else if (player.x >= width) {
    // if player goes out of map, bring them back on the other side
    if (player.mapX === MAP_HEIGHT - 1) {
      player.mapX = 0;
    } else {
      player.mapX++;
    }
    // reset player position
    player.x = 0;
  } else if (player.y <= 0) {
    // if player goes out of map, bring them back on the other side
    if (player.mapY === 0) {
      player.mapY = MAP_HEIGHT - 1;
    } else {
      player.mapY--;
    }
    player.y = height;
  } else if (player.y >= height) {
    // if player goes out of map, bring them back on the other side
    if (player.mapY === MAP_HEIGHT - 1) {
      player.mapY = 0;
    } else {
      player.mapY++;
    }

    player.y = 0;
  }
}
