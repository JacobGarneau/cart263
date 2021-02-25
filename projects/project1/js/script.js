"use strict";

/**
Project 1 - A Night At The Movies
Jacob Garneau

The Truman Game - A game where you are the producer of the Truman Show. Make as much money as possible without the star of the show realizing that his entire life is fake!
*/

let pixelFont;
let data;
let images = {
  map: undefined,
  marker: undefined,
};

let state = `simulation`; //  title, simulation, management, ending
const WORK_WINDOW_SIZE = {
  x: 1536,
  y: 754,
};
const TRAVEL_INCREMENT = 6;

let currentRating = 0;
let ratings = [500, 500, 500, 500, 500];
let funds = 500;
let doubt = 0;

let currentLocation;
let targetLocation;
let travelledDistance;
let movable = true;
let truman = {
  x: 0,
  y: 0,
};

let action = [];

function preload() {
  pixelFont = loadFont("assets/fonts/04B_03__.TTF");

  data = loadJSON("js/data/map.json");

  images.map = loadImage("assets/images/map.png");
  images.marker = loadImage("assets/images/marker.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentLocation = data.locations[2];
  truman.x = currentLocation.x;
  truman.y = currentLocation.y;
  action[0] = data.events[currentLocation.events[0]];
  action[1] = data.events[currentLocation.events[1]];
}

function draw() {
  background(0);
  textFont(pixelFont);

  if (state === `title`) {
    title();
  } else if (state === `simulation`) {
    simulation();
  } else if (state === `management`) {
    management();
  } else if (state === `ending`) {
    ending();
  }
}

function simulation() {
  //  Draw the map
  push();
  fill(0, 127, 127);
  rectMode(CENTER);
  rect(width / 2, height / 2, dyn(900, `x`), dyn(600, `y`));
  imageMode(CENTER);
  image(images.map, width / 2, height / 2, dyn(900, `x`), dyn(600, `y`));
  pop();

  drawTruman();

  //  Draw the game UI
  drawDoubtMeter();
  drawRatingsGraph();
  drawCommandButtons();
  drawUIText();
}

//  Draws the doubt meter
function drawDoubtMeter() {
  push();
  stroke(255);
  strokeWeight(4);
  fill(127, 127, 255);
  rectMode(CENTER);
  rect(
    (width - dyn(900, `x`)) / 4,
    dyn(180, `y`) + 2,
    dyn(240, `x`),
    dyn(50, `y`)
  );
  pop();

  push();
  let doubtRect = {
    x: (width - dyn(900, `x`)) / 4 - dyn(240, `x`) / 2 + 2,
    y: dyn(155, `y`) + 4,
    width: map(doubt, 0, 100, 0, dyn(240, `x`) + 2),
    height: dyn(50, `y`) - 4,
  };

  noStroke(0);
  fill(255, 127, 127);
  rect(doubtRect.x, doubtRect.y, doubtRect.width, doubtRect.height);
  pop();
}

//  Draws the ratings graph
function drawRatingsGraph() {
  push();
  stroke(255);
  strokeWeight(4);
  fill(0);
  rectMode(CENTER);
  rect(
    (width - dyn(900, `x`)) / 4,
    dyn(570, `y`),
    dyn(240, `x`),
    dyn(180, `y`)
  );
  pop();

  push();
  noStroke();
  fill(0, 255, 0);

  for (let i = 0; i < ratings.length; i++) {
    let ratingsRect = {
      x: (width - dyn(900, `x`)) / 4 - dyn(120, `x`) + 2,
      y: map(ratings[i], 0, 1000, dyn(650, `y`), dyn(480, `y`) + 2),
      width: (dyn(240, `x`) - 4) / ratings.length,
      height: dyn(8, `y`),
    };

    rect(
      ratingsRect.x + i * ratingsRect.width,
      ratingsRect.y,
      ratingsRect.width,
      ratingsRect.height
    );
  }
  pop();
}

//  Draws the command buttons
function drawCommandButtons() {
  push();
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255, 0, 255);
  text(`[1]`, ((width - dyn(900, `x`)) / 4) * 3 + dyn(780, `x`), dyn(420, `y`));
  text(`[2]`, ((width - dyn(900, `x`)) / 4) * 3 + dyn(780, `x`), dyn(580, `y`));

  fill(255, 255, 0);
  text(
    action[0].type.toUpperCase(),
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(420, `y`)
  );
  text(
    action[1].type.toUpperCase(),
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(580, `y`)
  );
  pop();
}

//  Draws the text in the static UI
function drawUIText() {
  //  Draw the map text
  push();
  textSize(24);
  textAlign(CENTER, CENTER);
  fill(255);
  for (let i = 0; i < data.locations.length; i++) {
    text(
      data.locations[i].description.toUpperCase(),
      width / 2 - dyn(data.locations[i].x, `x`),
      height / 2 - dyn(data.locations[i].y, `y`)
    );
  }
  pop();

  //  Draw the info text
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(`DOUBT`, (width - dyn(900, `x`)) / 4, dyn(120, `y`));
  text(`FUNDS`, (width - dyn(900, `x`)) / 4, dyn(280, `y`));
  text(`RATINGS`, (width - dyn(900, `x`)) / 4, dyn(440, `y`));
  text(
    `LOCATION`,
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(120, `y`)
  );

  textSize(48);
  text(doubt + `%`, (width - dyn(900, `x`)) / 4, dyn(180, `y`));

  text(`THE TRUMAN GAME`, width / 2, dyn(36, `y`));

  fill(0, 255, 0);
  text(funds + `$`, (width - dyn(900, `x`)) / 4, dyn(340, `y`));

  textAlign(CENTER, TOP);
  text(
    currentLocation.description.toUpperCase(),
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(160, `y`)
  );
  pop();
}

//  Draws the main character
function drawTruman() {
  imageMode(CENTER);
  image(
    images.marker,
    width / 2 - dyn(truman.x, `x`),
    height / 2 - dyn(truman.y, `y`)
  );
}

//  Moves the character from one region of town to another
function moveTruman() {
  movable = false;
  targetLocation = data.locations[random(currentLocation.destinations)];

  let travelX = dist(currentLocation.x, 0, targetLocation.x, 0);
  let travelY = dist(0, currentLocation.y, 0, targetLocation.y);
  travelledDistance = 0;

  console.log(travelX + `, ` + travelY);

  let travelTime = setInterval(() => {
    if (travelledDistance < TRAVEL_INCREMENT) {
      if (currentLocation.x < targetLocation.x) {
        truman.x += travelX / TRAVEL_INCREMENT;
      } else if (currentLocation.x > targetLocation.x) {
        truman.x -= travelX / TRAVEL_INCREMENT;
      }

      if (currentLocation.y < targetLocation.y) {
        truman.y += travelY / TRAVEL_INCREMENT;
      } else if (currentLocation.y > targetLocation.y) {
        truman.y -= travelY / TRAVEL_INCREMENT;
      }

      travelledDistance++;
    } else if (travelledDistance === TRAVEL_INCREMENT) {
      currentLocation = targetLocation;
      truman.x = currentLocation.x;
      truman.y = currentLocation.y;
      action[0] = data.events[currentLocation.events[0]];
      action[1] = data.events[currentLocation.events[1]];
      movable = true;
      clearInterval(travelTime);
    }
  }, 150);
}

function mousePressed() {
  if (movable) {
    moveTruman();
  }
}

function keyPressed() {
  let key;

  if (keyCode === 49) {
    key = 0;
  } else if (keyCode === 50) {
    key = 1;
  }

  if (action[key].gain === `doubt`) {
    doubt -= action[key].gainAmount;
  } else if (action[key].gain === `money`) {
    funds += action[key].gainAmount;
  } else if (action[key].gain === `ratings`) {
    currentRating += action[key].gainAmount;
  }

  if (action[key].loss === "doubt") {
    doubt += action[key].lossAmount;
    if (doubt > 100) {
      doubt = 100;
      state = `ending`;
    }
  } else if (action[key].loss === `money`) {
    funds -= action[key].lossAmount;
  } else if (action[key].loss === `ratings`) {
    currentRating -= action[key].lossAmount;
  }
}

//  Converts the inputted numbers so that they fit to any screen
function dyn(number, axis) {
  let result;
  if (axis === `x`) {
    result = (number / WORK_WINDOW_SIZE.x) * width;
  } else if (axis === `y`) {
    result = (number / WORK_WINDOW_SIZE.y) * height;
  }
  return result;
}
