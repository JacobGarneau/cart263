"use strict";

/**
Spy Profile Generator++
Jacob Garneau

This is a template. You must fill in the title,
author, and this description to match your project!
*/

let spyProfile = {
  name: "[REDACTED]",
  alias: "[REDACTED]", // adjectiveX + instrumentX
  secretWeapon: "[REDACTED]", // objectX
  country: "[REDACTED]", // countryX
  favouriteColor: "[REDACTED]", //  colorX
  affiliation: "[REDACTED]", // food
  password: "[REDACTED]", // cardX + number
};

let tarotData;
let objectData;
let instrumentData;
let adjData;
let countryData;
let colorData;
let affiliationData;

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
  adjData = loadJSON("js/data/adjectives.json");
  countryData = loadJSON(
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/geography/countries.json"
  );
  colorData = loadJSON(
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/crayola.json"
  );
  affiliationData = loadJSON(
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/governments/us_federal_agencies.json"
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
    `NAME: ${spyProfile.name}
    ALIAS: ${spyProfile.alias}
    SECRET WEAPONS: ${spyProfile.secretWeapon}
    FAVOURITE COLOUR: ${spyProfile.favouriteColor}
    COUNTRY OF ORIGIN: ${spyProfile.country}
    AFFILIATION: ${spyProfile.affiliation}
    PASSWORD: ${spyProfile.password}`,
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
  let favouriteColor = random(colorData.colors);

  spyProfile.alias = `${random(adjData.adjs)} ${random(
    instrumentData.instruments
  )}`;
  spyProfile.secretWeapon = `${random(objectData.objects)} and ${random(
    objectData.objects
  )}`;
  spyProfile.country = random(countryData.countries);
  spyProfile.favouriteColor = favouriteColor.color;
  spyProfile.affiliation = random(affiliationData.agencies);
  spyProfile.password = `${random(card.keywords)}${Math.floor(
    random(11, 100)
  )}`;

  localStorage.setItem("spy-profile-data", JSON.stringify(spyProfile));
}

function setSpyData() {
  let password = prompt("ENTER AGENT PASSWORD");

  if (password === data.password) {
    spyProfile.name = data.name;
    spyProfile.alias = data.alias;
    spyProfile.secretWeapon = data.secretWeapon;
    spyProfile.favouriteColor = data.favouriteColor;
    spyProfile.country = data.country;
    spyProfile.affiliation = data.affiliation;
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
    let favouriteColor = random(colorData.colors);

    spyProfile.alias = `${random(adjData.adjs)} ${random(
      instrumentData.instruments
    )}`;
    spyProfile.secretWeapon = `${random(objectData.objects)} and ${random(
      objectData.objects
    )}`;
    spyProfile.country = random(countryData.countries);
    spyProfile.favouriteColor = favouriteColor.color;
    spyProfile.affiliation = random(affiliationData.agencies);

    localStorage.setItem("spy-profile-data", JSON.stringify(spyProfile));
  }
}
