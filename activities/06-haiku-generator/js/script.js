/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
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

let line1 = random(fiveSyllableLines);
let line2 = random(sevenSyllableLines);
let line3 = random(fiveSyllableLines);

let line1P = document.getElementById("line-1");
let line2P = document.getElementById("line-2");
let line3P = document.getElementById("line-3");

//  Program
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
  }
}

function lineClicked() {
  if (
    event.target === line1P ||
    event.target === line2P ||
    event.target === line3P
  )
    fadeOut(event.target, 1);
}

function fadeOut(element, opacity) {
  opacity -= 0.01;
  element.style.opacity = opacity;
  if (opacity > 0) {
    requestAnimationFrame(() => {
      fadeOut(element, opacity);
    });
  }
}

//  Event listeners
document.addEventListener(`click`, lineClicked);