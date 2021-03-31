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

let player = {
  x: 0, // horizontal position on the screen
  y: 0, // vertical position on the screen
  mapX: 0, // horizontal position on the map tiles
  mapY: 0, // vertical position on the map tiles
  speed: 6,
  movable: true,
};

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
  setupPlayer();
  console.log(map);
}

// p5:
function draw() {
  drawMap();
  drawPlayer();
  movePlayer();
}

function setupPlayer() {
  player.x = width / 2;
  player.y = height / 2;
  player.mapX = 5;
  player.mapY = 5;
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
        i * width - player.mapX * width,
        j * height - player.mapY * height,
        width,
        height
      );
    }
  }
}

function drawPlayer() {
  fill(255, 0, 0);
  ellipse(player.x, player.y, 100);
}

function movePlayer() {
  if (player.movable) {
    if (keyIsDown(87)) {
      player.y -= player.speed;
    }
    if (keyIsDown(83)) {
      player.y += player.speed;
    }
    if (keyIsDown(65)) {
      player.x -= player.speed;
    }
    if (keyIsDown(68)) {
      player.x += player.speed;
    }
  }
}
