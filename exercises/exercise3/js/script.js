"use strict";

/**
Spy Profile Generator++
Jacob Garneau

[REDACTED]
*/

let spyProfile = {
  name: "[REDACTED]",
  alias: "[REDACTED]", // adjective + instrument
  secretWeapon: "[REDACTED]", // object
  country: "[REDACTED]", // country
  favouriteColor: "[REDACTED]", //  color
  affiliation: "[REDACTED]", // food
  password: "[REDACTED]", // card + number
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
p5: preloads the necessary variables and files
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
p5: sets up the canvas and the local storage data
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
p5: draws the content on the canvas
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
  text(`Press R to regenerate your agent information`, width / 2, height - 120);
  pop();
}

/*
generates a new spy profile
*/
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

/*
assigns the data from local storage into local variables
*/
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

/*
p5: handles keyboard inputs
*/
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
