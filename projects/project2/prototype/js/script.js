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
let playerData;
let shrines = [];

/**
Description of preload
*/
function preload() {
  playerData = loadJSON("js/data/playerData.json");
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
  player.handleActions();

  minimap.display();

  ui.display();

  for (let i = 0; i < shrines.length; i++) {
    shrines[i].display;
  }
}

function mouseClicked() {
  player.attack(playerData.attacks.peck);
}
