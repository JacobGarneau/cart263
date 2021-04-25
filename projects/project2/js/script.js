"use strict";

/**
Arctic Phoenix
Jacob Garneau

Find your way in the Arctic and survive the cold!
*/

const WORK_WINDOW_SIZE = {
  x: 1536,
  y: 754,
};

let mapGrid = [];

const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const BIOMES = [`sea`, `snow`, `snow`, `snow`, `mountains`, `mountains`];

let map, player, minimap, ui; // objects
let playerData, terrainData; // JSON data
let shrines = [];
let entities = [];

let images = {
  mountain: undefined,
  tree: undefined,
  glacier: undefined,
  fish: undefined,
  shrine: undefined,
  ghost: undefined,
  feather: undefined,
};
let icons = [];

// p5: load JSON data and images
function preload() {
  playerData = loadJSON("js/data/playerData.json");
  terrainData = loadJSON("js/data/terrainData.json");

  images.mountain = loadImage("assets/images/mountain.svg");
  images.tree = loadImage("assets/images/tree.svg");
  images.glacier = loadImage("assets/images/glacier.svg");
  images.fish = loadImage("assets/images/fish.svg");
  images.shrine = loadImage("assets/images/shrine.svg");
  images.ghost = loadImage("assets/images/ghost.svg");
  images.feather = loadImage("assets/images/feather.svg");
  images.attack = loadImage("assets/images/attack.svg");

  icons.push(images.attack);
}

// p5: creates the canvas and the object instances
function setup() {
  createCanvas(windowWidth, windowHeight);

  map = new Map();
  player = new Player();
  minimap = new Minimap();
  ui = new UI();

  // add the entities on each tile of the map
  for (let i = 0; i < MAP_WIDTH; i++) {
    for (let j = 0; j < MAP_HEIGHT; j++) {
      for (let k = 0; k < Math.floor(random(2, 6)); k++) {
        let game = new Game();
      }
    }
  }
}

// p5:
function draw() {
  map.displayTerrain();
  map.changeTile();

  for (let i = 0; i < entities.length; i++) {
    entities[i].display();
    entities[i].move();
  }

  player.display();
  player.move();
  player.handleActions();
  player.updateStats();

  map.displayContents();

  minimap.display();

  ui.display();

  for (let i = 0; i < shrines.length; i++) {
    shrines[i].display();
  }
}

// p5: handle mouse clicks
function mouseClicked() {
  player.attack(playerData.attacks.peck);
}

// p5: handle keyboard inputs
function keyPressed() {
  if (keyCode === 77) {
    // press M to open the minimap
    minimap.toggle();
  }
}

// dynamically converts position values to adapt to current screen size
function dyn(value, axis) {
  let result;
  if (axis === `x`) {
    result = (value / WORK_WINDOW_SIZE.x) * width;
  } else if (axis === `y`) {
    result = (value / WORK_WINDOW_SIZE.y) * height;
  }
  return result;
}
