/**
Haiku Generator ++
Jacob Garneau

This is a program
That will generate random
Haikus as you wish
*/

"use strict";

// Variables and objects
let fiveSyllableLines = [
  "O, to be a tree",
  "The cat does not know",
  "We are all forests",
  "You have done your best",
  "They are all gone now",
];
let sevenSyllableLines = [
  "Say the things left unsaid",
  "Never believe the wind's lies",
  "The autumn stretches its legs",
  "Nothing can satisfy you",
  "They will not come back again",
];
let titles = [
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

let line1 = random(fiveSyllableLines);
let line2 = random(sevenSyllableLines);
let line3 = random(fiveSyllableLines);
let title = random(titles);

let line1P = document.getElementById("line-1");
let line2P = document.getElementById("line-2");
let line3P = document.getElementById("line-3");
let titleH1 = document.querySelector("h1");

//  Program
titleH1.innerText = title;
line1P.innerText = line1;
line2P.innerText = line2;
line3P.innerText = line3;

//  Function definitions
function random(array) {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}

function setNewLine(element) {
  if (element === line1P) {
    element.innerText = random(fiveSyllableLines);
  } else if (element === line2P) {
    element.innerText = random(sevenSyllableLines);
  } else if (element === line3P) {
    element.innerText = random(fiveSyllableLines);
  } else if (element === titleH1) {
    element.innerText = random(titles);
  }
}

function lineClicked() {
  if (
    event.target === line1P ||
    event.target === line2P ||
    event.target === line3P ||
    event.target === titleH1
  ) {
    event.target.style.transition = "none";
    fadeOut(event.target, 1);
  }
}

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

function readHaiku() {
  let haiku = `${titleH1.innerText}.\n${line1P.innerText}.\n${line2P.innerText}.\n${line3P.innerText}.`;
  responsiveVoice.speak(haiku, "UK English Male", {});
}

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

//  Event listeners
document.addEventListener(`click`, lineClicked);
document.addEventListener(`keydown`, alignText);
