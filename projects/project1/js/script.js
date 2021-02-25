"use strict";

/**
Project 1 - A Night At The Movies
Jacob Garneau

The Truman Game - A game where you are the producer of the Truman Show. Make as much money as possible without the star of the show realizing that his entire life is fake!
*/

let pixelFont;
let mapData;
let state = `simulation`; //  title, simulation, management, ending
let workWindowSize = {
  x: 1536,
  y: 754,
};

let ratings = [0, 25, 50, 75, 100];
let funds = 500;
let doubt = 0;

function preload() {
  pixelFont = loadFont("assets/fonts/04B_03__.TTF");

  mapData = loadJSON("js/data/map.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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
  pop();

  //  Draw the doubt meter
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

  //  Draw the ratings graph
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

  //  Draw the info text
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(`DOUBT`, (windowWidth - dyn(900, `x`)) / 4, dyn(120, `y`));
  text(`FUNDS`, (windowWidth - dyn(900, `x`)) / 4, dyn(280, `y`));
  text(`RATINGS`, (windowWidth - dyn(900, `x`)) / 4, dyn(440, `y`));

  textSize(48);
  text(doubt + `%`, (windowWidth - dyn(900, `x`)) / 4, dyn(180, `y`));
  text(funds + `$`, (windowWidth - dyn(900, `x`)) / 4, dyn(340, `y`));
  pop();

  //  Draw the command buttons
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
