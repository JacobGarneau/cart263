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

let state = `title`; // title, game, ending

function preload() {
  for (let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(`${ANIMAL_IMAGE_PATH}${i}.png`);
    animalImages.push(animalImage);
  }

  sausageDogImage = loadImage(SAUSAGE_DOG_IMAGE_PATH);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  createAnimals();
  createSausageDog();
}

function createAnimals() {
  for (let i = 0; i < NUM_ANIMALS; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let animalImage = random(animalImages);
    let animal = new Animal(x, y, animalImage);
    animals.push(animal);
  }
}

function createSausageDog() {
  let x = random(0, width);
  let y = random(0, height);
  sausageDog = new SausageDog(x, y, sausageDogImage);
}

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

function game() {
  background(255);

  updateAnimals();
  updateSausageDog();
}

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

function updateAnimals() {
  for (let i = 0; i < animals.length; i++) {
    animals[i].update();
  }
}

function updateSausageDog() {
  sausageDog.update();
}

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
  }
}
