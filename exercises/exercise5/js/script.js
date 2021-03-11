/**
Haiku Generator ++
Jacob Garneau

This is a program
That will generate random
Haikus as you wish
*/

"use strict";

// VARIABLES AND OBJECTS

const FIVE_SYLLABLE_LINES = [
  "O, to be a tree",
  "The cat does not know",
  "We are all forests",
  "You have done your best",
  "They are all gone now",
];
const SEVEN_SYLLABLE_LINES = [
  "Say the things left unsaid",
  "Never believe the wind's lies",
  "The autumn stretches its legs",
  "Nothing can satisfy you",
  "They will not come back again",
];
const TITLES = [
  "Dandelion-Colored Underwater Vehicle",
  "I Am the Seal",
  "Here Arrives the Star",
  "With a Bit of Support from My Compatriots",
  "The Day Before Today",
  "Let It Exist",
  "A Period of 24 Hours in Existence",
  "Coin Street",
  "All You Require Is Affection",
  "Ellen Rugby",
  "Lou In the Firmament With Precious Gemstones",
];

let line1 = random(FIVE_SYLLABLE_LINES);
let line2 = random(SEVEN_SYLLABLE_LINES);
let line3 = random(FIVE_SYLLABLE_LINES);
let title = random(TITLES);

const LINE_1P = document.getElementById("line-1");
const LINE_2P = document.getElementById("line-2");
const LINE_3P = document.getElementById("line-3");
const TITLE_H1 = document.querySelector("h1");

//  PROGRAM

TITLE_H1.innerText = title;
LINE_1P.innerText = line1;
LINE_2P.innerText = line2;
LINE_3P.innerText = line3;

//  FUNCTION DEFINITIONS

//  Picks a random element from an array
function random(array) {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}

//  Randomly generates a new line from the list
function setNewLine(element) {
  if (element === LINE_1P) {
    element.innerText = random(FIVE_SYLLABLE_LINES);
  } else if (element === LINE_2P) {
    element.innerText = random(SEVEN_SYLLABLE_LINES);
  } else if (element === LINE_3P) {
    element.innerText = random(FIVE_SYLLABLE_LINES);
  } else if (element === TITLE_H1) {
    element.innerText = random(TITLES);
  }
}

//  Fades out a line when clicked
function lineClicked() {
  if (
    event.target === LINE_1P ||
    event.target === LINE_2P ||
    event.target === LINE_3P ||
    event.target === TITLE_H1
  ) {
    event.target.style.transition = "none";
    fadeOut(event.target, 1);
  }
}

//  Fades out the selected line and calls the function to regenerate it
function fadeOut(element, opacity) {
  opacity -= 0.02;
  element.style.opacity = opacity;
  if (opacity > 0) {
    requestAnimationFrame(() => {
      fadeOut(element, opacity);
    });
  } else {
    setNewLine(element);
    fadeIn(element, 0);
  }
}

//  Fades the erased line back in once regenerated
function fadeIn(element, opacity) {
  opacity += 0.02;
  element.style.opacity = opacity;
  if (opacity < 1) {
    requestAnimationFrame(() => {
      fadeIn(element, opacity);
    });
  } else {
    element.style.transition = "0.4s all";
  }
}

//  Makes a synthesized voice read the haiku
function readHaiku() {
  let haiku = `${TITLE_H1.innerText}.\n${LINE_1P.innerText}.\n${LINE_2P.innerText}.\n${LINE_3P.innerText}.`;
  responsiveVoice.speak(haiku, "UK English Male", {});
}

//  Changes the alignment of the text and the background color
function alignText() {
  let body = document.querySelector("body");
  let section = document.querySelector("section");

  if (event.keyCode === 76) {
    body.classList = "";
    body.classList.add("left");
  } else if (event.keyCode === 67) {
    body.classList = "";
    body.classList.add("center");
  } else if (event.keyCode === 82) {
    body.classList = "";
    body.classList.add("right");
  }
}

//  EVENT LISTNERS
document.addEventListener(`click`, lineClicked);
document.addEventListener(`keydown`, alignText);
