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
