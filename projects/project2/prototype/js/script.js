"use strict";

/**
Arctic Phoenix
Jacob Garneau

This is a template. You must fill in the title,
author, and this description to match your project!
*/

let mapGrid = [];

const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const BIOMES = [`lake`, `snow`, `snow`, `snow`, `mountains`, `mountains`];

let map, player, minimap, ui;
let data;

/**
Description of preload
*/
function preload() {
  data = loadJSON("js/data/data.json");
}

/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  map = new Map();
  player = new Player();
  minimap = new Minimap();
  ui = new UI();
}

// p5:
function draw() {
  map.display();
  map.changeTile();

  player.display();
  player.move();

  minimap.display();

  ui.display();
}

function mouseClicked() {
  if (mouseButton === LEFT) {
    console.log(`left`);
  } else if (mouseButton === RIGHT) {
    console.log(`right`);
    rect(25, 25, 50, 50);
  }
}
