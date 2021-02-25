"use strict";

/**
Project 1 - A Night At The Movies
Jacob Garneau

The Truman Game - A game where you are the producer of the Truman Show. Make as much money as possible without the star of the show realizing that his entire life is fake!
*/

let pixelFont;
let mapData;
let images = {
  map: undefined,
  marker: undefined,
};

let state = `simulation`; //  title, simulation, management, ending
let workWindowSize = {
  x: 1536,
  y: 754,
};

let ratings = [0, 25, 50, 75, 100];
let funds = 500;
let doubt = 0;
let currentLocation;
let targetLocation;

function preload() {
  pixelFont = loadFont("assets/fonts/04B_03__.TTF");

  mapData = loadJSON("js/data/map.json");

  images.map = loadImage("assets/images/map.png");
  images.marker = loadImage("assets/images/marker.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentLocation = mapData.locations[0];
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
    (windowWidth - dyn(900, `x`)) / 4,
    dyn(180, `y`) + 2,
    dyn(240, `x`),
    dyn(50, `y`)
  );
  pop();

  push();
  let doubtRect = {
    x: (windowWidth - dyn(900, `x`)) / 4 - dyn(240, `x`) / 2 + 2,
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
    (windowWidth - dyn(900, `x`)) / 4,
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
      x: (windowWidth - dyn(900, `x`)) / 4 - dyn(120, `x`) + 2,
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
function drawCommandButtons() {}

//  Draws the text in the static UI
function drawUIText() {
  //  Draw the map text
  push();
  textSize(24);
  textAlign(CENTER, CENTER);
  fill(255);
  for (let i = 0; i < mapData.locations.length; i++) {
    text(
      mapData.locations[i].description.toUpperCase(),
      width / 2 - dyn(mapData.locations[i].x, `x`),
      height / 2 - dyn(mapData.locations[i].y, `y`)
    );
  }
  pop();

  //  Draw the info text
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(`DOUBT`, (windowWidth - dyn(900, `x`)) / 4, dyn(120, `y`));
  text(`FUNDS`, (windowWidth - dyn(900, `x`)) / 4, dyn(280, `y`));
  text(`RATINGS`, (windowWidth - dyn(900, `x`)) / 4, dyn(440, `y`));
  text(
    `LOCATION`,
    ((windowWidth - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(120, `y`)
  );

  textSize(48);
  text(doubt + `%`, (windowWidth - dyn(900, `x`)) / 4, dyn(180, `y`));
  text(funds + `$`, (windowWidth - dyn(900, `x`)) / 4, dyn(340, `y`));
  text(
    currentLocation.description.toUpperCase(),
    ((windowWidth - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(180, `y`)
  );
  pop();
}

//  Draws the main character
function drawTruman() {
  imageMode(CENTER);
  image(
    images.marker,
    width / 2 - dyn(currentLocation.x, `x`),
    height / 2 - dyn(currentLocation.y, `y`)
  );
}

function moveTruman() {
  targetLocation = mapData.locations[random(currentLocation.destinations)];
  currentLocation = targetLocation;
}

function mousePressed() {
  moveTruman();
}

//  Converts the inputted numbers so that they fit to any screen
function dyn(number, axis) {
  let result;
  if (axis === `x`) {
    result = (number / workWindowSize.x) * windowWidth;
  } else if (axis === `y`) {
    result = (number / workWindowSize.y) * windowHeight;
  }
  return result;
}
