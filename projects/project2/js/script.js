"use strict";

/**
Phoenix of the Arctic
Jacob Garneau

Find your way in the Arctic and survive the cold!
*/

const WORK_WINDOW_SIZE = {
  x: 1536,
  y: 754,
};

let mapGrid = [];

const MAP_WIDTH = 11;
const MAP_HEIGHT = 11;
const BIOMES = [`sea`, `snow`, `snow`, `snow`, `mountains`, `mountains`];

let map, player, minimap, ui; // objects
let playerData, terrainData; // JSON data
let shrines = [];
let entities = [];
let projectiles = [];

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
let attackFX = [];

// p5: load JSON data and images
function preload() {
  playerData = loadJSON("js/data/playerData.json");
  terrainData = loadJSON("js/data/terrainData.json");

  images.mountain = loadImage("assets/images/mountain.svg");
  images.tree = loadImage("assets/images/tree.svg");
  images.glacier = loadImage("assets/images/glacier.svg");
  images.fish = loadImage("assets/images/fish.svg");
  images.rabbit = loadImage("assets/images/rabbit.svg");
  images.shrine = loadImage("assets/images/shrine.svg");
  images.ghost = loadImage("assets/images/ghost.svg");
  images.feather = loadImage("assets/images/feather.svg");
  images.attack = loadImage("assets/images/attack.svg");
  images.sun = loadImage("assets/images/sun.svg");
  images.sun2 = loadImage("assets/images/sun2.svg");
  images.flame = loadImage("assets/images/flame.svg");
  images.fireball = loadImage("assets/images/fireball.svg");
  images.bird = loadImage("assets/images/bird.svg");
  images.wind = loadImage("assets/images/wind.svg");
  images.strike = loadImage("assets/images/strike.svg");

  icons = [images.attack, images.feather, images.flame];
  attackFX = [images.strike, images.wind, images.fireball];
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
        let game = new Game(i, j);
      }
      let spirit = new Spirit(i, j);
      let shrine = new Shrine(i, j, width / 2, height / 2, images.shrine);
    }
  }
}

// p5: draw the game elements on the canvas
function draw() {
  map.displayTerrain();
  map.changeTile();

  for (let i = 0; i < entities.length; i++) {
    entities[i].move();
    entities[i].display();
  }

  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].move();
    projectiles[i].display();
  }

  player.move();
  player.handleActions();
  player.updateStats();
  player.display();

  map.displayContents();

  minimap.display();

  for (let i = 0; i < shrines.length; i++) {
    shrines[i].display();
    shrines[i].interact();

    let d = dist(
      shrines[i].mapX * width - player.mapX * width + shrines[i].x,
      shrines[i].mapY * height - player.mapY * height + shrines[i].y,
      player.x,
      player.y
    );
    if (d < shrines[i].interactionRange) {
      player.nearShrine = true;
      break;
    } else {
      player.nearShrine = false;
    }
  }

  ui.display();
}

// p5: handle mouse clicks
function mouseClicked() {
  player.attack(playerData.attacks.peck);
}

// p5: handle keyboard inputs
function keyPressed() {
  if (keyCode === 77 && player.abilities.minimap && player.movable) {
    // press M to open the minimap
    minimap.toggle();
  } else if (keyCode === 81) {
    // press Q to perform a wing attack
    player.attack(playerData.attacks.wingAttack);
  } else if (keyCode === 69) {
    // press E to shoot a fireball
    player.attack(playerData.attacks.fireBreath);
  } else if (keyCode === 32 && player.nearShrine) {
    // press SPACEBAR to interact with a shrine
    ui.toggleMenu();
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
