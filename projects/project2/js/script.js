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

let playerSaved;
let map, player, minimap, ui; // objects
let dataSaved;
let playerData, terrainData, abilityData; // JSON data
let popup;
let shrineCount;
let greatSpirits = 4;
let shrines = [];
let entityCount;
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

let state = `title`; // game, dead, title

let seeFlashingText = true;
let flashingTextFrames = 0;
let flashingTextDuration = 40;

// p5: load JSON data and images
function preload() {
  dataSaved = localStorage.getItem("dataSaved");
  if (dataSaved) {
    abilityData = JSON.parse(localStorage.getItem("abilityData"));
  } else {
    abilityData = loadJSON("js/data/abilityData.json");
  }

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
  images.map = loadImage("assets/images/map.svg");
  images.nova = loadImage("assets/images/nova.svg");
  images.nova2 = loadImage("assets/images/nova2.svg");
  images.nova3 = loadImage("assets/images/nova3.svg");
  images.upgrade = loadImage("assets/images/upgrade.svg");
  images.dash = loadImage("assets/images/dash.svg");
  images.shift = loadImage("assets/images/shift.svg");
  images.lake = loadImage("assets/images/lake.svg");

  icons = [
    images.attack,
    images.feather,
    images.flame,
    images.map,
    images.nova,
    images.dash,
  ];
  attackFX = [images.strike, images.wind, images.fireball, images.nova3];
}

// p5: creates the canvas and the object instances
function setup() {
  createCanvas(windowWidth, windowHeight);

  mapGrid = JSON.parse(localStorage.getItem("mapGrid"));

  if (mapGrid === null) {
    mapGrid = [];
  }

  map = new Map();

  playerSaved = localStorage.getItem("playerSaved");
  if (playerSaved) {
    let playerData = JSON.parse(localStorage.getItem("player"));
    player = new Player(playerData);
  } else {
    player = new Player({
      mapX: 5,
      mapY: 5,
      maxHealth: playerData.stats.health,
      health: playerData.stats.health,
      healthTarget: playerData.stats.health,
      maxFrostbite: playerData.stats.frostbite,
      frostbite: playerData.stats.frostbite,
      frostbiteTarget: playerData.stats.frostbite,
      abilities: {
        attacks: [playerData.attacks.peck],
        minimap: false,
        dash: false,
      },
      sunPoints: 0,
      currentSunPoints: 0,
      mapMovable: false,
    });
  }

  minimap = new Minimap();
  ui = new UI();

  // place the shrines on the map
  shrineCount = localStorage.getItem("shrineCount");

  if (shrineCount === null) {
    let shrine = new Shrine({
      mapX: 5,
      mapY: 5,
    });
    shrine = new Shrine({
      mapX: random([1, 2, 3]),
      mapY: random([1, 2, 3]),
    });
    shrine = new Shrine({
      mapX: random([1, 2, 3]),
      mapY: random([7, 8, 9]),
    });
    shrine = new Shrine({
      mapX: random([7, 8, 9]),
      mapY: random([1, 2, 3]),
    });
    shrine = new Shrine({
      mapX: random([7, 8, 9]),
      mapY: random([7, 8, 9]),
    });
  } else {
    for (let i = 0; i < shrineCount; i++) {
      let shrineData = JSON.parse(localStorage.getItem("shrine" + i));
      let shrine = new Shrine(shrineData);
    }
  }

  // add the entities on each tile of the map
  entityCount = localStorage.getItem("entityCount");

  if (entityCount === null) {
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        for (let k = 0; k < random([2, 5]); k++) {
          let game = new Game({
            mapX: i,
            mapY: j,
            maxHealth: 15,
            health: 15,
            healthTarget: 15,
          });
        }

        let spiritRoll = random([0, 1, 1]);
        if (spiritRoll === 1) {
          let spirit = new Spirit({
            mapX: i,
            mapY: j,
            maxHealth: 50,
            health: 50,
            healthTarget: 50,
          });

          for (let k = 0; k < shrines.length; k++) {
            if (i === shrines[k].mapX && j === shrines[k].mapY) {
              entities.splice(entities.indexOf(spirit), 1);
            }
          }
        }
      }
    }
  } else {
    for (let i = 0; i < entityCount; i++) {
      let entityData = JSON.parse(localStorage.getItem("entity" + i));
      if (entityData.type === `game`) {
        let entity = new Game(entityData);
      } else if (entityData.type === `spirit`) {
        let entity = new Spirit(entityData);
      }
    }
  }
}

// p5: draw the game elements on the canvas
function draw() {
  if (state === `title`) {
    title();
  } else if (state === `game`) {
    game();
  } else if (state === `dead`) {
    dead();
  }
}

function title() {
  background(0);

  flashingTextFrames++;

  if (flashingTextFrames >= flashingTextDuration && seeFlashingText) {
    seeFlashingText = false;
    flashingTextFrames = 0;
  } else if (flashingTextFrames >= flashingTextDuration && !seeFlashingText) {
    seeFlashingText = true;
    flashingTextFrames = 0;
  }

  fill(246, 122, 51);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(96);
  text(`PHOENIX`, width / 2, height / 2 - 80);
  fill(255);
  textSize(32);
  text(`OF THE`, width / 2, height / 2);
  fill(0, 255, 255);
  textSize(96);
  text(`ARCTIC`, width / 2, height / 2 + 80);

  if (seeFlashingText) {
    fill(0, 255, 255);
  } else {
    fill(246, 122, 51);
  }
  textStyle(NORMAL);
  textSize(24);
  text(`Press N to start a new game`, width / 2, height - 60);

  playerSaved = localStorage.getItem("playerSaved");
  if (playerSaved) {
    if (seeFlashingText) {
      fill(246, 122, 51);
    } else {
      fill(0, 255, 255);
    }
    text(`Press ENTER to continue your current game`, width / 2, height - 100);
  }
}

function game() {
  map.displayTerrain();
  map.changeTile();
  map.displayContents();
  player.handleActions();

  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].move();
    projectiles[i].display();
  }

  for (let i = 0; i < entities.length; i++) {
    entities[i].move();
    entities[i].display();

    if (entities[i].type === `spirit`) {
      entities[i].detectPlayer();
    }
  }

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
    if (d < shrines[i].interactionRange && shrines[i].cell.spiritDefeated) {
      player.nearShrine = true;
      break;
    } else {
      player.nearShrine = false;
    }
  }

  player.move();
  player.updateStats();
  player.display();

  if (popup !== undefined) {
    popup.display();
  }

  ui.display();
}

function dead() {
  background(0);

  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`You died.`, width / 2, height / 2 - 20);

  flashingTextFrames++;
  if (flashingTextFrames >= flashingTextDuration && seeFlashingText) {
    seeFlashingText = false;
    flashingTextFrames = 0;
  } else if (flashingTextFrames >= flashingTextDuration && !seeFlashingText) {
    seeFlashingText = true;
    flashingTextFrames = 0;
  }

  playerSaved = localStorage.getItem("playerSaved");
  if (player.frostbite > 0 && playerSaved) {
    fill(246, 122, 51);
    text(
      `But the Phoenix rises from its ashes to be born again.`,
      width / 2,
      height / 2 + 20
    );

    if (seeFlashingText) {
      fill(255);
    } else {
      fill(246, 122, 51);
    }

    text(
      `Press ENTER to respawn at the last shrine you visited`,
      width / 2,
      height - 60
    );
  } else {
    fill(0, 255, 255);
    text(`The cold of the Arctic consumes all.`, width / 2, height / 2 + 20);

    if (seeFlashingText) {
      fill(255);
    } else {
      fill(0, 255, 255);
    }

    text(`Press ENTER to return to the title screen`, width / 2, height - 60);
  }
}

function saveGame() {
  localStorage.setItem("mapGrid", JSON.stringify(mapGrid));

  localStorage.setItem("dataSaved", true);
  localStorage.setItem("abilityData", JSON.stringify(abilityData));

  localStorage.setItem("playerSaved", true);
  localStorage.setItem(
    "player",
    JSON.stringify({
      mapX: player.mapX,
      mapY: player.mapY,
      maxHealth: player.maxHealth,
      health: player.health,
      healthTarget: player.healthTarget,
      maxFrostbite: player.maxFrostbite,
      frostbite: player.frostbite,
      frostbiteTarget: player.frostbiteTarget,
      abilities: player.abilities,
      sunPoints: player.sunPoints,
      currentSunPoints: player.currentSunPoints,
      mapMovable: player.mapMovable,
    })
  );

  localStorage.setItem("shrineCount", shrines.length);
  for (let i = 0; i < shrines.length; i++) {
    localStorage.setItem(
      "shrine" + i,
      JSON.stringify({
        mapX: shrines[i].mapX,
        mapY: shrines[i].mapY,
      })
    );
  }

  localStorage.setItem("entityCount", entities.length);
  for (let i = 0; i < entities.length; i++) {
    localStorage.setItem(
      "entity" + i,
      JSON.stringify({
        mapX: entities[i].mapX,
        mapY: entities[i].mapY,
        maxHealth: entities[i].maxHealth,
        health: entities[i].health,
        healthTarget: entities[i].healthTarget,
        type: entities[i].type,
      })
    );
  }
}

function respawn() {
  let playerData = JSON.parse(localStorage.getItem("player"));

  player.healthTarget = player.health = playerData.maxHealth;
  player.frostbiteTarget = player.frostbite = playerData.maxFrostbite;
  player.movable = true;
  player.x = width / 2;
  player.y = height / 2 + dyn(32, `y`);
  player.vx = 0;
  player.vy = 0;
  player.vxTarget = 0;
  player.vyTarget = 0;
  player.rotation = 270;
  player.mapX = playerData.mapX;
  player.mapY = playerData.mapY;
  map.mapTargetX = playerData.mapX;
  map.mapTargetY = playerData.mapY;
  player.abilities = playerData.abilities;
  player.sunPoints = playerData.sunPoints;
  player.currentSunPoints = playerData.currentSunPoints;
  player.mapMovable = playerData.mapMovable;

  state = `game`;
}

function resetGame() {
  mapGrid = [];
  projectiles = [];
  entities = [];
  shrines = [];

  abilityData = loadJSON("js/data/abilityData.json");
  localStorage.removeItem("abilityData");
  localStorage.removeItem("dataSaved");
  localStorage.removeItem("mapGrid");
  localStorage.removeItem("entityCount");
  localStorage.removeItem("shrineCount");
  localStorage.removeItem("player");
  localStorage.removeItem("playerSaved");

  for (let i = 0; i < entityCount; i++) {
    localStorage.removeItem("entity" + i);
  }

  for (let i = 0; i < entityCount; i++) {
    localStorage.removeItem("entity" + i);
  }

  for (let i = 0; i < shrineCount; i++) {
    localStorage.removeItem("shrine" + i);
  }
}

function newGame() {
  resetGame();
  setup();

  state = `game`;
}

// p5: handle mouse clicks
function mouseClicked() {
  for (let i = 0; i < player.abilities.attacks.length; i++) {
    if (
      player.abilities.attacks[i].command === playerData.attacks.peck.command
    ) {
      if (player.abilities.attacks[i].upgrade) {
        player.attack(playerData.attacks.improvedPeck);
      } else {
        player.attack(playerData.attacks.peck);
      }
    }
  }

  if (ui.menuOpen) {
    for (let i = 0; i < abilityData.abilities.length; i++) {
      if (abilityData.abilities[i].hover) {
        ui.buyAbility(abilityData.abilities[i]);
        saveGame();
      }
    }
  }
}

// p5: handles mouse movement
function mouseMoved() {
  if (ui.menuOpen) {
    for (let i = 0; i < abilityData.abilities.length; i++) {
      let d = dist(
        width / 2 + dyn(abilityData.abilities[i].x, `x`),
        height / 2 + dyn(abilityData.abilities[i].y, `y`),
        mouseX,
        mouseY
      );
      if (d < 50) {
        abilityData.abilities[i].hover = true;
      } else {
        abilityData.abilities[i].hover = false;
      }
    }
  }
}

// p5: handle keyboard inputs
function keyPressed() {
  playerSaved = localStorage.getItem("playerSaved");

  if (
    state === `game` &&
    keyCode === 77 &&
    player.abilities.minimap &&
    player.movable
  ) {
    // press M to open the minimap
    minimap.toggle();
  } else if (state === `game` && keyCode === 81) {
    // press Q to perform a wing attack
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      if (
        player.abilities.attacks[i].command ===
        playerData.attacks.wingAttack.command
      ) {
        if (player.abilities.attacks[i].upgrade) {
          player.attack(playerData.attacks.improvedWingAttack);
        } else {
          player.attack(playerData.attacks.wingAttack);
        }
      }
    }
  } else if (state === `game` && keyCode === 69) {
    // press E to shoot a fireball
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      if (
        player.abilities.attacks[i].command ===
        playerData.attacks.fireBreath.command
      ) {
        if (player.abilities.attacks[i].upgrade) {
          player.attack(playerData.attacks.improvedFireBreath);
        } else {
          player.attack(playerData.attacks.fireBreath);
        }
      }
    }
  } else if (state === `game` && keyCode === 32 && player.nearShrine) {
    // press SPACEBAR to interact with a shrine
    ui.toggleMenu();
    saveGame();
  } else if (state === `game` && keyCode === 27 && ui.menuOpen) {
    // press ESCAPE to close the ability menu
    ui.toggleMenu();
    saveGame();
  } else if (state === `game` && keyCode === 16) {
    // press SHIFT to dash
    player.dash();
  } else if (state === `game` && keyCode === 82) {
    // press R to use Ember Nova
    player.attack(playerData.attacks.emberNova);
  } else if (state === `dead` && keyCode == 13) {
    // press ENTER to respawn/reset the game
    if (player.frostbite > 0 && playerSaved) {
      respawn();
    } else {
      state = `title`;
    }
  } else if (state === `title` && keyCode == 13 && playerSaved) {
    // press ENTER to continue your current game
    respawn();
  } else if (state === `title` && keyCode == 78) {
    // press N to start a new game
    newGame();
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
