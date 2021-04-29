"use strict";

/**
Phoenix of the Arctic
Jacob Garneau

Find your way in the Arctic and defeat the cold!
*/

const WORK_WINDOW_SIZE = {
  x: 1536,
  y: 754,
}; // screen resolution used as a basis for the dyn() function

let mapGrid = []; // the current map's tile set

const MAP_WIDTH = 11;
const MAP_HEIGHT = 11;
const BIOMES = [`sea`, `snow`, `snow`, `snow`, `mountains`, `mountains`]; // weighted probabilites of each biome for tile generation

let playerSaved; // localStorage recuperation
let map, player, minimap, ui; // objects
let dataSaved; // localStorage recuperation
let playerData, terrainData, abilityData; // JSON data
let popup;
let superPopup; // popup that happens above the menu
let shrineCount; // localStorage recuperation
let greatSpirits = 5; // great spirits to defeat before summoning the final boss
let finalBossActivated = false;
let shrines = [];
let entityCount; // localStorage recuperation
let entities = [];
let projectiles = [];

let images = {};
let sounds = {};
let icons = []; // atack icons (used to interpret JSON data)
let attackFX = []; // visual effects of attacks (used to interpret JSON data)
let sfx = []; // sound effects from attacks (used to interpret JSON data)

let state = `title`; // game, dead, title, victory

let firstTimeOnMenu = true;
let seeFlashingText = true;
let flashingTextFrames = 0;
let flashingTextDuration = 40;

// p5: load JSON data and images
function preload() {
  // get saved ability unlocking data or generate new data from JSON
  dataSaved = localStorage.getItem("dataSaved");
  if (dataSaved) {
    abilityData = JSON.parse(localStorage.getItem("abilityData"));
  } else {
    abilityData = loadJSON("js/data/abilityData.json");
  }

  // generate new player and terrain data from JSON
  playerData = loadJSON("js/data/playerData.json");
  terrainData = loadJSON("js/data/terrainData.json");

  // load all project images
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
  images.strike2 = loadImage("assets/images/strike2.svg");
  images.map = loadImage("assets/images/map.svg");
  images.nova = loadImage("assets/images/nova.svg");
  images.nova2 = loadImage("assets/images/nova2.svg");
  images.nova3 = loadImage("assets/images/nova3.svg");
  images.upgrade = loadImage("assets/images/upgrade.svg");
  images.dash = loadImage("assets/images/dash.svg");
  images.shift = loadImage("assets/images/shift.svg");
  images.lake = loadImage("assets/images/lake.svg");
  images.island1 = loadImage("assets/images/island1.svg");
  images.island2 = loadImage("assets/images/island2.svg");

  // attribute icon images
  icons = [
    images.attack,
    images.feather,
    images.flame,
    images.map,
    images.nova,
    images.dash,
  ];

  // attribute attack visual effects
  attackFX = [images.strike, images.wind, images.fireball, images.nova3];

  // load all project sounds
  soundFormats("mp3");
  sounds.peck = loadSound("assets/sounds/peck");
  sounds.wingAttack = loadSound("assets/sounds/wingAttack");
  sounds.fireBreath = loadSound("assets/sounds/fireBreath");
  sounds.emberNova = loadSound("assets/sounds/emberNova");
  sounds.dash = loadSound("assets/sounds/dash");
  sounds.minimap = loadSound("assets/sounds/minimap");
  sounds.abilityPurchased = loadSound("assets/sounds/abilityPurchased");
  sounds.chimes = loadSound("assets/sounds/chimes");
  sounds.shrineDefeated = loadSound("assets/sounds/shrineDefeated");
  sounds.summon = loadSound("assets/sounds/summon");
  sounds.spiritDefeat = loadSound("assets/sounds/spiritDefeat");
  sounds.spiritDamage = loadSound("assets/sounds/spiritDamage");
  sounds.spiritHit = loadSound("assets/sounds/spiritHit");
  sounds.spiritShoot = loadSound("assets/sounds/spiritShoot");
  sounds.rotateHum = loadSound("assets/sounds/rotateHum");
  sounds.death = loadSound("assets/sounds/death");
  sounds.menu = loadSound("assets/sounds/menu");
  sounds.spawn = loadSound("assets/sounds/spawn");
  sounds.tick = loadSound("assets/sounds/tick");
  sounds.rabbitDamage = loadSound("assets/sounds/rabbitDamage");
  sounds.fishDamage = loadSound("assets/sounds/fishDamage");
  sounds.wind = loadSound("assets/sounds/wind");
  sounds.music = loadSound("assets/sounds/music");

  // attribute attack sound effects
  sfx = [sounds.peck, sounds.wingAttack, sounds.fireBreath, sounds.emberNova];

  // sets volume of sounds
  sounds.wind.setVolume(0.1);
  sounds.chimes.setVolume(0.1);
  sounds.peck.setVolume(0.5);
  sounds.spiritShoot.setVolume(0.5);
  sounds.spiritHit.setVolume(0.25);
  sounds.spiritDamage.setVolume(0.5);
  sounds.spiritDefeat.setVolume(0.25);
  sounds.abilityPurchased.setVolume(0.25);
  sounds.shrineDefeated.setVolume(0.25);
  sounds.rotateHum.setVolume(0.5);
  sounds.death.setVolume(0.25);
  sounds.music.setVolume(0.25);
}

// p5: creates the canvas and the object instances
function setup() {
  createCanvas(windowWidth, windowHeight);

  // plays menu sounds if the menu has never been shown before
  if (firstTimeOnMenu) {
    getAudioContext().suspend();
    sounds.wind.play();
    sounds.wind.loop();
    sounds.chimes.play();
    sounds.chimes.loop();
    firstTimeOnMenu = false;
  }

  // gets the saved map data or generates new data
  mapGrid = JSON.parse(localStorage.getItem("mapGrid"));
  if (mapGrid === null) {
    mapGrid = [];
  }

  // creates a new map
  map = new Map(5, 5);

  // gets the saved player data or generates new data
  playerSaved = localStorage.getItem("playerSaved");
  if (playerSaved) {
    let playerData = JSON.parse(localStorage.getItem("player"));
    player = new Player(playerData);
  } else {
    player = new Player({
      mapX: 5, // horizontal player position on the map
      mapY: 5, // vertical player position on the map
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
      }, // list of unlocked player abilities
      sunPoints: 0,
      currentSunPoints: 0,
      mapMovable: false, // capacity of the player to move from one map tile to the other
    });
  }

  // creates new minimap and UI objects
  minimap = new Minimap();
  ui = new UI();

  // places the saved shrines on the map or creates new ones
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
      // places shrines on the map according to saved data
      let shrineData = JSON.parse(localStorage.getItem("shrine" + i));
      let shrine = new Shrine(shrineData);
    }
  }

  // adds the saved entities on each tile of the map or creates new ones
  entityCount = localStorage.getItem("entityCount");
  if (entityCount === null) {
    for (let i = 0; i < MAP_WIDTH; i++) {
      for (let j = 0; j < MAP_HEIGHT; j++) {
        // creates new game on each tile
        for (let k = 0; k < random([2, 5]); k++) {
          let game = new Game({
            mapX: i,
            mapY: j,
            maxHealth: 15,
            health: 15,
            healthTarget: 15,
          });
        }

        // has 2/3 chances of creating new spirits on the map
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
              // removes spirits from the map if there was already a shrine on their tile
              entities.splice(entities.indexOf(spirit), 1);
            }
          }
        }
      }
    }
  } else {
    for (let i = 0; i < entityCount; i++) {
      // retrieves saved entity data or generates new data
      let entityData = JSON.parse(localStorage.getItem("entity" + i));
      if (entityData.type === `game`) {
        // creates saved game-type entities
        let entity = new Game(entityData);
      } else if (entityData.type === `spirit`) {
        // creates saved spirit-type entities
        let entity = new Spirit(entityData);
      } else if (entityData.type === `greatSpirit`) {
        // creates saved great spirit-type entities
        let entity = new GreatSpirit(entityData);
      } else if (entityData.type === `finalBoss`) {
        // creates saved final boss-type entities
        let entity = new FinalBoss(entityData);
      }
    }
  }
}

// p5: draws the game elements on the canvas
function draw() {
  // handles the various states of the game
  if (state === `title`) {
    title();
  } else if (state === `game`) {
    game();
  } else if (state === `dead`) {
    dead();
  } else if (state === `victory`) {
    victory();
  }
}

// displays the title screen
function title() {
  background(0);

  // handles the flashing text
  flashingTextFrames++;
  if (flashingTextFrames >= flashingTextDuration && seeFlashingText) {
    seeFlashingText = false;
    flashingTextFrames = 0;
  } else if (flashingTextFrames >= flashingTextDuration && !seeFlashingText) {
    seeFlashingText = true;
    flashingTextFrames = 0;
  }

  // draws the game title
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

  // changes the flashing text's fill color
  if (seeFlashingText) {
    fill(0, 255, 255);
  } else {
    fill(246, 122, 51);
  }

  // displays the "new game" command prompt
  textStyle(NORMAL);
  textSize(24);
  text(`Press N to start a new game`, width / 2, height - 60);

  // if there is currently saved player data, displays the "resume game" command prompt
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

// displays the game
function game() {
  map.displayTerrain(); // displays the map cells
  map.changeTile(); // changes map tiles if the player reached the end of their current one
  map.displayContents(); // displays the map eements (trees, mountains, lakes, glaciers)
  player.handleActions(); // handles the player's inputted actions

  // displays the shrines
  for (let i = 0; i < shrines.length; i++) {
    shrines[i].display();
    shrines[i].interact();

    let d = dist(
      shrines[i].mapX * width - player.mapX * width + shrines[i].x,
      shrines[i].mapY * height - player.mapY * height + shrines[i].y,
      player.x,
      player.y
    );

    // checks if the player is close to a defeated shrine to allow them to interact with it
    if (d < shrines[i].interactionRange && shrines[i].cell.spiritDefeated) {
      player.nearShrine = true;
      break;
    } else {
      player.nearShrine = false;
    }
  }

  // displays the projectiles (fireballs and spirit projectiles)
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].move();
    projectiles[i].display();
  }

  // displays the entities (game and spirits)
  for (let i = 0; i < entities.length; i++) {
    entities[i].move();
    entities[i].display();
  }

  // displays the player and updates their stats
  player.move();
  player.updateStats();
  player.display();

  // allows the entities to detect the player's presence
  for (let i = 0; i < entities.length; i++) {
    if (entities[i] !== undefined && entities[i].type !== `game`) {
      entities[i].detectPlayer();
    }
  }

  // displays regular popups
  if (popup !== undefined) {
    popup.display();
  }

  // displays the minimap and the rest of the UI
  minimap.display();
  ui.display();

  // displays super popups
  if (superPopup !== undefined) {
    superPopup.display();
  }
}

// displays the death screen
function dead() {
  background(0);

  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`You died.`, width / 2, height / 2 - 20);

  // handles the flashing text
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
    // if the player had some Warmth left and there is saved player data, allows the player to respawn
    fill(246, 122, 51);
    text(
      `But the Phoenix rises from its ashes to be born again.`,
      width / 2,
      height / 2 + 20
    );

    // changes the color of the flashing text
    if (seeFlashingText) {
      fill(255);
    } else {
      fill(246, 122, 51);
    }

    // displays the "respawn" command prompt
    text(
      `Press ENTER to respawn at the last shrine you visited`,
      width / 2,
      height - 60
    );
  } else {
    // if the player had no Warmth left or there is no saved player data, ends the game
    fill(0, 255, 255);
    text(`The cold of the Arctic consumes all.`, width / 2, height / 2 + 20);

    // changes the color of the flashing text
    if (seeFlashingText) {
      fill(255);
    } else {
      fill(0, 255, 255);
    }

    // displays the "return to title screen" command prompt
    text(`Press ENTER to return to the title screen`, width / 2, height - 60);
  }
}

// displays the victory screen
function victory() {
  background(0);

  // handles the flashing text
  flashingTextFrames++;
  if (flashingTextFrames >= flashingTextDuration && seeFlashingText) {
    seeFlashingText = false;
    flashingTextFrames = 0;
  } else if (flashingTextFrames >= flashingTextDuration && !seeFlashingText) {
    seeFlashingText = true;
    flashingTextFrames = 0;
  }

  // displays the ending quote
  fill(0, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(`The cold is defeated`, width / 2, height / 2 - 120);
  fill(255);
  text(`Spirits consumed by the Light`, width / 2, height / 2 - 40);
  text(`Burn the flame of the mighty`, width / 2, height / 2 + 40);
  fill(246, 122, 51);
  text(`Phoenix of the Arctic`, width / 2, height / 2 + 120);

  // changes the color of the flashing text
  if (seeFlashingText) {
    fill(0, 255, 255);
  } else {
    fill(246, 122, 51);
  }

  // displays the "return to title screen" command prompt
  textStyle(NORMAL);
  textSize(24);
  text(`Press ENTER to return to the title screen`, width / 2, height - 60);
}

// saves the game in localStorage
function saveGame() {
  // saves map data
  localStorage.setItem("mapGrid", JSON.stringify(mapGrid));

  // saves ability data
  localStorage.setItem("dataSaved", true);
  localStorage.setItem("abilityData", JSON.stringify(abilityData));

  // saves player data
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

  // saves shrine data
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

  // saves entity data
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

  // saves spirits defeated progress data
  localStorage.setItem("greatSpirits", greatSpirits);
  localStorage.setItem("finalBossActivated", finalBossActivated);

  // displays a popup to notify the player that the game has been saved
  superPopup = new Popup(`Game saved.`, 60, false, true);
}

// after death, sends the player back to the last shrine they visited
function respawn() {
  let playerData = JSON.parse(localStorage.getItem("player"));

  // resets the player's stats to what they were when the last interacted with a shrine
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

  // resets the amount of great spirits and the final boss activation
  greatSpirits = 0;
  finalBossActivated = false;
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].type === `greatSpirit`) {
      greatSpirits++;
    } else if (entities[i].type === `finalBoss`) {
      finalBossActivated = true;
    }
  }

  // returns to the game
  state = `game`;
}

// erases saved game data
function resetGame() {
  // erases arrays and resets amuont of great spirits to be defeated
  mapGrid = [];
  projectiles = [];
  entities = [];
  shrines = [];
  greatSpirits = 5;
  finalBossActivated = false;

  // clears the data saved in localStorage
  abilityData = loadJSON("js/data/abilityData.json");
  localStorage.removeItem("abilityData");
  localStorage.removeItem("dataSaved");
  localStorage.removeItem("mapGrid");
  localStorage.removeItem("entityCount");
  localStorage.removeItem("shrineCount");
  localStorage.removeItem("player");
  localStorage.removeItem("playerSaved");
  localStorage.removeItem("greatSpirits");
  localStorage.removeItem("finalBossActivated");

  // clears saved entity data
  for (let i = 0; i < entityCount; i++) {
    localStorage.removeItem("entity" + i);
  }

  // clears saved shrine data
  for (let i = 0; i < shrineCount; i++) {
    localStorage.removeItem("shrine" + i);
  }
}

// starts a new game by resetting and rebooting
function newGame() {
  resetGame();
  setup();

  // returns to the game
  state = `game`;
}

// p5: handles mouse clicks
function mouseClicked() {
  userStartAudio();
  if (state === `game`) {
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      // performs a peck attack when the player clicks with the mouse
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
      // buys abilities and saves the game when the player clicks on an ability icon inside the ability purchase menu
      for (let i = 0; i < abilityData.abilities.length; i++) {
        if (abilityData.abilities[i].hover) {
          saveGame();
          ui.buyAbility(abilityData.abilities[i]);
        }
      }
    }
  }
}

// p5: handles mouse movement
function mouseMoved() {
  userStartAudio();
  if (state === `game` && ui.menuOpen) {
    // handles hovering on ability icons inside the ability purchase menu
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

// p5: handles keyboard inputs
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
    sounds.minimap.play();
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
    sounds.menu.play();
    saveGame();
  } else if (state === `game` && keyCode === 27 && ui.menuOpen) {
    // press ESCAPE to close the ability menu
    ui.toggleMenu();
    sounds.menu.play();
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
      sounds.spawn.play();
      sounds.music.play();
      sounds.music.loop();
    } else {
      state = `title`;
      sounds.menu.play();
      sounds.chimes.play();
      sounds.chimes.loop();
    }
  } else if (state === `title` && keyCode == 13 && playerSaved) {
    // press ENTER to continue your current game
    respawn();
    sounds.chimes.stop();
    sounds.spawn.play();
    sounds.music.play();
    sounds.music.loop();
  } else if (state === `title` && keyCode == 78) {
    // press N to start a new game
    newGame();
    sounds.chimes.stop();
    sounds.spawn.play();
    sounds.music.play();
    sounds.music.loop();
  } else if (state === `victory` && keyCode === 13) {
    // press ENTER to return to the main menu
    state = `title`;
    sounds.menu.play();
    sounds.chimes.play();
    sounds.chimes.loop();
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
