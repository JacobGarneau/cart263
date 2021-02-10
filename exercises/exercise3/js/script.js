"use strict";

/**
Spy Profile Generator++
Jacob Garneau

This is a template. You must fill in the title,
author, and this description to match your project!
*/

let spyProfile = {
  name: "[REDACTED]",
  alias: "[REDACTED]",
  secretWeapon: "[REDACTED]",
  password: "[REDACTED]",
};

let tarotData = undefined;
let objectData = undefined;
let instrumentData = undefined;
let data;

/**
Description of preload
*/
function preload() {
  tarotData = loadJSON(
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json"
  );
  objectData = loadJSON(
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/objects.json"
  );
  instrumentData = loadJSON(
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json"
  );
}

/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  data = JSON.parse(localStorage.getItem("spy-profile-data"));

  if (data !== null) {
    setSpyData();
  } else {
    generateSpyProfile();
  }
}

/**
Description of draw()
*/
function draw() {
  background(219, 252, 255);

  push();
  textAlign(CENTER, CENTER);
  textSize(40);
  text(
    `NAME: ${spyProfile.name}\nALIAS: ${spyProfile.alias}\nSECRET WEAPON: ${spyProfile.secretWeapon}\nPASSWORD: ${spyProfile.password}`,
    width / 2,
    height / 2
  );
  pop();

  push();
  textAlign(CENTER, CENTER);
  textSize(24);
  text(`Press C to clear the current profile`, width / 2, height - 80);
  text(
    `Press R to regenerate your alias and secret weapon`,
    width / 2,
    height - 120
  );
  pop();
}

function generateSpyProfile() {
  spyProfile.name = prompt("ENTER AGENT NAME");

  let card = random(tarotData.tarot_interpretations);

  spyProfile.alias = random(instrumentData.instruments);
  spyProfile.secretWeapon = random(objectData.objects);
  spyProfile.password = random(card.keywords);

  localStorage.setItem("spy-profile-data", JSON.stringify(spyProfile));
}

function setSpyData() {
  let password = prompt("ENTER AGENT PASSWORD");

  if (password === data.password) {
    spyProfile.name = data.name;
    spyProfile.alias = data.alias;
    spyProfile.secretWeapon = data.secretWeapon;
    spyProfile.password = data.password;
  }
}

function keyPressed() {
  if (keyCode === 67) {
    let resetCmd = prompt(
      `Type "CLEAR" to confirm\nType anything else to cancel`
    );
    if (resetCmd === "CLEAR" || resetCmd === "clear" || resetCmd === "Clear") {
      generateSpyProfile();
    }
  } else if (keyCode === 82) {
    spyProfile.alias = random(instrumentData.instruments);
    spyProfile.secretWeapon = random(objectData.objects);

    localStorage.setItem("spy-profile-data", JSON.stringify(spyProfile));
  }
}
