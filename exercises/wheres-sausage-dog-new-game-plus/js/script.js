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
  background(255, 255, 255);

  updateAnimals();
  updateSausageDog();
}

function updateAnimals() {
  for (let i = 0; i < animals.length; i++) {
    animals[i].update();
  }
}

function updateSausageDog() {
  sausageDog.update();
}

function mousePressed() {
  sausageDog.mousePressed();
}
