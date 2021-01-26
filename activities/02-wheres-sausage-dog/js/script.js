/**************************************************
Activity 2: Where's Sausage Dog?
Jacob Garneau

Find the sausage dog, or else.
**************************************************/
"use strict";

const NUM_ANIMAL_IMAGES = 10;
const NUM_ANIMALS = 100;

let animalImages = [];
let animals = [];

let sausageDogImage;
let sausageDog;

function preload() {
  for (let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(`assets/images/animal${i}.png`);
    animalImages.push(animalImage);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < NUM_ANIMALS; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let animalImage = random(animalImages);

    new Animal(x, y, animalImage);
  }
}

function draw() {
  background(255, 255, 255);

  for (let i = 0; i < animals.length; i++) {
    animals[i].update();
  }
}
