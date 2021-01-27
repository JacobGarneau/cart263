/**************************************************
Activity 2: Where's Sausage Dog?
Jacob Garneau

Find the sausage dog, or else.
**************************************************/
"use strict";

const ANIMAL_IMAGE_PATH = "assets/images/animal";
const SAUSAGE_DOG_IMAGE_PATH = "assets/images/sausage-dog.png";

const NUM_ANIMAL_IMAGES = 10;
const NUM_ANIMALS = 100;

let animalImages = [];
let animals = [];

let sausageDogImage;
let sausageDog;

let flashingText = 255;
let flashingTextDelay = 0;

let frames = 0;
let timeRemaining = 10;

let state = `title`; // title, game, ending

//  preload()
//  p5: Loads the necessary assets
function preload() {
  for (let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(`${ANIMAL_IMAGE_PATH}${i}.png`);
    animalImages.push(animalImage);
  }

  sausageDogImage = loadImage(SAUSAGE_DOG_IMAGE_PATH);
}

//  setup()
//  p5: Sets up the necessary variables
function setup() {
  createCanvas(windowWidth, windowHeight);

  createAnimals();
  createSausageDog();
}

//  createAnimals()
//  Creates the animals to be display on the canvas
function createAnimals() {
  for (let i = 0; i < NUM_ANIMALS; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let animalImage = random(animalImages);
    let animal = new Animal(x, y, animalImage);
    animals.push(animal);
  }
}

//  createSausageDog()
//  Creates the sausage dog
function createSausageDog() {
  let x = random(0, width);
  let y = random(0, height);
  sausageDog = new SausageDog(x, y, sausageDogImage);
}

//  draw
//  p5: Handles the states
function draw() {
  if (state === `title`) {
    title();
  } else if (state === `game`) {
    game();
  } else if (state === `goodEnding`) {
    goodEnding();
  } else if (state === `badEnding`) {
    badEnding();
  }
}

//  title()
//  Displays the title screen
function title() {
  animateFlashingText();

  background(0);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text(`Find the sausage dog, or else...`, width / 2, height / 2 - 40);

  textSize(24);
  text(`(You have 10 seconds)`, width / 2, height / 2 + 40);

  fill(flashingText);
  textSize(24);
  text(`Click anywhere to start the game`, width / 2, height - 80);
}

//  game()
//  Displays the game screen
function game() {
  background(255);

  updateAnimals();
  updateSausageDog();
  countdownTimer();
}

//  goodEnding()
//  Displays the good ending screen
function goodEnding() {
  animateFlashingText();

  background(0);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(
    `You found the sausage dog!\n\nYou won't have to suffer through the punishment.`,
    width / 2,
    height / 2 - 80
  );

  fill(flashingText);
  textSize(24);
  text(`Click anywhere to return to the title screen`, width / 2, height - 80);
}

//  badEnding()
//  Displays the bad ending screen
function badEnding() {
  animateFlashingText();

  background(0);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(
    `There's no real punishment, here's the sausage dog you couldn't find:`,
    width / 2,
    height / 2 - 80
  );

  imageMode(CENTER);
  image(sausageDogImage, width / 2, height / 2 + 80);

  fill(flashingText);
  textSize(24);
  text(`Click anywhere to return to the title screen`, width / 2, height - 80);
}

//  updateAnimals()
//  Updates the state of the animals every frame
function updateAnimals() {
  for (let i = 0; i < animals.length; i++) {
    animals[i].update();
  }
}

//  updateSausageDog()
//  Updates the state of the sausage dog every frame
function updateSausageDog() {
  sausageDog.update();
}

//  countdownTimer()
//  Handles and displays the countdown timer
function countdownTimer() {
  if (!sausageDog.found) {
    frames++;
  }

  if (frames >= 60) {
    timeRemaining--;
    frames = 0;
  }

  if (timeRemaining <= 0) {
    state = `badEnding`;
  }

  push();
  fill(255);
  stroke(0);
  strokeWeight(6);
  textStyle(BOLD);
  textSize(64);
  text(`${timeRemaining} seconds left`, width / 2, 80);
  pop();
}

//  animateFlashingText()
//  Handles the flshing text on the title and ending screens
function animateFlashingText() {
  flashingTextDelay++;

  if (flashingTextDelay >= 40) {
    if (flashingText === 0) {
      flashingText = 255;
    } else if (flashingText === 255) {
      flashingText = 0;
    }

    flashingTextDelay = 0;
  }
}

//  returnToTitle()
//  Resets the necessary variables to start the game over
function returnToTitle() {
  state = `title`;

  animals = [];
  sausageDog = undefined;
  timeRemaining = 10;

  createAnimals();
  createSausageDog();
}

//  mousePressed()
//  p5: Handles clicks
function mousePressed() {
  if (state === `title`) {
    state = `game`;
  } else if (state === `game`) {
    if (!sausageDog.found) {
      for (let i = 0; i < animals.length; i++) {
        animals[i].mousePressed();
      }

      sausageDog.mousePressed();
    }
  } else if (state === `goodEnding` || state === `badEnding`) {
    returnToTitle();
  }
}
