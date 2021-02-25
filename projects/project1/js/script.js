"use strict";

/**
Project 1 - A Night At The Movies
Jacob Garneau

The Truman Game - A game where you are the producer of the Truman Show. Make as much money as possible without the star of the show realizing that his entire life is fake!
*/

let pixelFont;
let state = `simulation`; //  title, simulation, management, ending

function preload() {
  pixelFont = loadFont("assets/fonts/04B_03__.TTF");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

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
  //  draw the map
  fill(0, 127, 127);
  rect();

  //  draw the info

  //  draw the command buttons
}
