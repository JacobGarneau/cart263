"use strict";

/**
Project 1 - A Night At The Movies
Jacob Garneau

The Truman Game - A game where you are the producer of the Truman Show. Make as much money as possible without the star of the show realizing that his entire life is fake!
*/

let pixelFont;
let data;
let images = {
  map: undefined,
  marker: undefined,
  alert: undefined,
  title: undefined,
};

let state = `title`; //  title, simulation, ending
let frames = 0;
let textVisible;
const WORK_WINDOW_SIZE = {
  x: 1536,
  y: 754,
};
const TRAVEL_INCREMENT = 6;

let currentRating = 500;
let refreshRatings;
let ratingsTarget;
let ratingsChange;
let ratings = [500, 500, 500, 500, 500, 500, 500, 500];
let funds = 500;
let fundsTarget = funds;
let doubt = 0;
let doubtTarget = doubt;

let currentLocation;
let targetLocation;
let travelledDistance;

let alerts = [];
let alertsPossibleLocations = [0, 1, 2, 3, 4, 5, 6];
const ALERT_CHANCE = 40;
const ALERT_COST = 150;
const ALERT_PENALTY = 50;

let readInputs = true;
let truman = {
  x: 0,
  y: 0,
};
let day = 0;

let action = [];

//  p5: Preloads necessary assets
function preload() {
  pixelFont = loadFont("assets/fonts/04B_03__.TTF");

  data = loadJSON("js/data/data.json");

  images.map = loadImage("assets/images/map.png");
  images.marker = loadImage("assets/images/marker.png");
  images.alert = loadImage("assets/images/alert.png");
  images.title = loadImage("assets/images/title.png");
}

//  p5: Sets up the necessary variables
function setup() {
  createCanvas(windowWidth, windowHeight);
  currentLocation = data.locations[0];
  truman.x = currentLocation.x;
  truman.y = currentLocation.y;
  action[0] = data.events[currentLocation.events[0]];
  action[1] = data.events[currentLocation.events[1]];
}

//  Handles the various game states
function draw() {
  background(0);
  textFont(pixelFont);

  if (state === `title`) {
    title();
  } else if (state === `simulation`) {
    simulation();
  } else if (state === `ending`) {
    ending();
  }
}

//  Displays the title screen
function title() {
  push();
  imageMode(CENTER);
  image(images.title, width / 2, height / 2);

  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text(`THE TRUMAN GAME`, width / 2, height / 2);
  pop();

  frames++;

  if (frames > 40 && !textVisible) {
    textVisible = true;
    frames = 0;
  } else if (frames > 40 && textVisible) {
    textVisible = false;
    frames = 0;
  }

  if (textVisible) {
    fill(255, 0, 255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`PRESS SPACERBAR TO START`, width / 2, height / 2 + dyn(300, `y`));
  }
}

//  Displays the simulation
function simulation() {
  //  Draw the map
  push();
  imageMode(CENTER);
  image(images.map, width / 2, height / 2, dyn(900, `x`), dyn(600, `y`));
  pop();

  drawTruman();
  drawAlerts();

  //  Draw the game UI
  drawDoubtMeter();
  drawRatingsGraph();
  drawCommandButtons();
  drawUIText();

  adjustValues();

  if (currentRating <= 0) {
    state = `ending`;
  }

  if (funds <= 0) {
    state = `ending`;
  }

  if (doubt >= 100) {
    state = `ending`;
  }
}

//  Displays the ending screen
function ending() {
  clearInterval(refreshRatings);

  push();
  fill(255, 0, 0);
  textSize(60);
  textAlign(CENTER, CENTER);
  text(`THE SHOW IS CANCELLED`, width / 2, height / 2 - dyn(180, `y`));

  fill(255);
  textSize(32);
  textAlign(CENTER, TOP);
  if (doubt >= 100) {
    text(
      `TRUMAN REALIZED THAT HIS ENTIRE LIFE WAS A LIE. HE ESCAPED.\n\n(DOUBT METER REACHED 100%)`,
      width / 2,
      height / 2 - dyn(80, `y`)
    );
  } else if (funds <= 0) {
    text(
      `THE PRODUCTION COMPANY WAS LOSING MONEY. THEY WENT BANKRUPT.\n\n(FUNDS REACHED 0$)`,
      width / 2,
      height / 2 - dyn(80, `y`)
    );
  } else if (currentRating <= 0) {
    text(
      `THE TV RATINGS WERE TERRIBLE. NO ONE WAS WATCHING IT.\n\n(RATINGS REACHED 0)`,
      width / 2,
      height / 2 - dyn(80, `y`)
    );
  }

  fill(255, 255, 0);
  textSize(60);
  text(`YOU LASTED FOR: ${day} DAYS`, width / 2, height / 2 + dyn(120, `y`));
  pop();

  frames++;

  if (frames > 40 && !textVisible) {
    textVisible = true;
    frames = 0;
  } else if (frames > 40 && textVisible) {
    textVisible = false;
    frames = 0;
  }

  if (textVisible) {
    fill(255, 0, 255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(
      `PRESS SPACERBAR TO RETURN TO THE MAIN MENU`,
      width / 2,
      height / 2 + dyn(300, `y`)
    );
  }
}

//  Draws the doubt meter
function drawDoubtMeter() {
  push();
  stroke(255);
  strokeWeight(4);
  fill(127, 127, 255);
  rectMode(CENTER);
  rect(
    (width - dyn(900, `x`)) / 4,
    dyn(180, `y`) + 2,
    dyn(240, `x`),
    dyn(50, `y`)
  );
  pop();

  push();
  let doubtRect = {
    x: (width - dyn(900, `x`)) / 4 - dyn(240, `x`) / 2 + 2,
    y: dyn(155, `y`) + 4,
    width: map(doubt, 0, 100, 0, dyn(240, `x`) - 4),
    height: dyn(50, `y`) - 4,
  };

  noStroke(0);
  fill(255, 127, 127);
  rect(doubtRect.x, doubtRect.y, doubtRect.width, doubtRect.height);
  pop();
}

//  Draws the ratings graph
function drawRatingsGraph() {
  push();
  stroke(255);
  strokeWeight(4);
  fill(0);
  rectMode(CENTER);
  rect(
    (width - dyn(900, `x`)) / 4,
    dyn(570, `y`),
    dyn(240, `x`),
    dyn(180, `y`)
  );
  pop();

  push();
  noStroke();
  fill(0, 255, 0);

  for (let i = 0; i < ratings.length; i++) {
    let ratingsRect = {
      x: (width - dyn(900, `x`)) / 4 - dyn(120, `x`) + 2,
      y: map(ratings[i], 0, 1000, dyn(650, `y`), dyn(480, `y`) + 2),
      width: (dyn(240, `x`) - 4) / ratings.length,
      height: dyn(8, `y`),
    };

    rect(
      ratingsRect.x + i * ratingsRect.width,
      ratingsRect.y,
      ratingsRect.width,
      ratingsRect.height
    );
  }
  pop();
}

//  Draws the command buttons
function drawCommandButtons() {
  push();
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255, 0, 255);
  text(`[1]`, ((width - dyn(900, `x`)) / 4) * 3 + dyn(780, `x`), dyn(420, `y`));
  text(`[2]`, ((width - dyn(900, `x`)) / 4) * 3 + dyn(780, `x`), dyn(580, `y`));

  if (readInputs) {
    fill(255, 255, 0);
  } else {
    fill(127, 127, 127);
  }

  text(
    action[0].type.toUpperCase(),
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(420, `y`)
  );
  text(
    action[1].type.toUpperCase(),
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(580, `y`)
  );
  pop();

  //  Draw action details

  let string = [];
  let white = [255, 255, 255];
  let green = [0, 255, 0];
  let red = [255, 0, 0];
  let gainSign = [];
  let gainModifier = [];
  let lossSign = [];
  let lossModifier = [];

  if (!readInputs) {
    white = green = red = [127, 127, 127];
  }

  for (let i = 0; i < action.length; i++) {
    if (action[i].gain === `money`) {
      gainModifier[i] = `+`;
      gainSign[i] = `$`;
    } else if (action[i].gain === `ratings`) {
      gainModifier[i] = `+`;
      gainSign[i] = ` RTG`;
    } else if (action[i].gain === `doubt`) {
      gainModifier[i] = `-`;
      gainSign[i] = `% DBT`;
    }

    if (action[i].loss === `money`) {
      lossModifier[i] = `-`;
      lossSign[i] = `$`;
    } else if (action[i].loss === `ratings`) {
      lossModifier[i] = `-`;
      lossSign[i] = ` RTG`;
    } else if (action[i].loss === `doubt`) {
      lossModifier[i] = `+`;
      lossSign[i] = `% DBT`;
    }

    string[i] = [
      [`${gainModifier[i]}${action[i].gainAmount}${gainSign[i]}`, green],
      [` / `, white],
      [`${lossModifier[i]}${action[i].lossAmount}${lossSign[i]}`, red],
    ];
  }

  push();
  textAlign(LEFT);
  textSize(24);
  drawCompositeText(
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(500, `y`),
    string[0]
  );
  drawCompositeText(
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(660, `y`),
    string[1]
  );
  pop();
}

//  Draws the text in the static UI
function drawUIText() {
  //  Draw the map text
  push();
  textSize(24);
  textAlign(CENTER, CENTER);
  fill(255);
  for (let i = 0; i < data.locations.length; i++) {
    text(
      data.locations[i].description.toUpperCase(),
      width / 2 - dyn(data.locations[i].x, `x`),
      height / 2 - dyn(data.locations[i].y, `y`)
    );
  }
  pop();

  //  Draw the info text
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(`DOUBT`, (width - dyn(900, `x`)) / 4, dyn(120, `y`));
  text(`FUNDS`, (width - dyn(900, `x`)) / 4, dyn(280, `y`));
  text(`RATINGS`, (width - dyn(900, `x`)) / 4, dyn(440, `y`));
  text(
    `LOCATION`,
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(240, `y`)
  );

  textSize(48);
  text(doubt + `%`, (width - dyn(900, `x`)) / 4, dyn(180, `y`));

  text(`THE TRUMAN GAME`, width / 2, dyn(36, `y`));

  //  Draw the alert notification text
  push();
  if (alerts.length === 0) {
    text(`NO ACTIVE ALERTS`, width / 2, height - dyn(40, `y`));
  } else {
    textAlign(LEFT, CENTER);

    let red = [255, 0, 0];
    let yellow = [255, 255, 0];
    let pink = [255, 0, 255];
    if (alerts.length === 1) {
      let string = [
        [`${alerts.length} ACTIVE ALERT. PRESS `, yellow],
        [`[F]`, pink],
        [` TO FIX `, yellow],
        [`(-${alerts.length * ALERT_COST}$)`, red],
      ];
      drawCompositeText(width / 2, height - dyn(40, `y`), string);
    } else if (alerts.length > 1) {
      let string = [
        [`${alerts.length} ACTIVE ALERTS. PRESS `, yellow],
        [`[F]`, pink],
        [` TO FIX `, yellow],
        [`(-${alerts.length * ALERT_COST}$)`, red],
      ];
      drawCompositeText(width / 2, height - dyn(40, `y`), string);
    }
  }
  pop();

  fill(0, 255, 0);
  text(funds + `$`, (width - dyn(900, `x`)) / 4, dyn(340, `y`));

  if (readInputs) {
    fill(0, 255, 0);
  } else {
    fill(127, 127, 127);
  }
  textAlign(CENTER, TOP);
  text(
    currentLocation.description.toUpperCase(),
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(280, `y`)
  );

  fill(255, 255, 0);
  textSize(60);
  text(
    `DAY ${day + 1}`,
    ((width - dyn(900, `x`)) / 4) * 3 + dyn(900, `x`),
    dyn(100, `y`)
  );
  pop();
}

//  Draws text wth multiple colors in a single sentence
function drawCompositeText(x, y, textArray) {
  let totalWidth = 0;

  for (let i = 0; i < textArray.length; i++) {
    let part = textArray[i];
    let textString = part[0];
    totalWidth += textWidth(textString);
  }

  let posX = x;
  for (let i = 0; i < textArray.length; i++) {
    let part = textArray[i];
    let textString = part[0];
    let textColor = part[1];
    let textW = textWidth(textString);
    fill(textColor);
    text(textString, posX - totalWidth / 2, y);
    posX += textW;
  }
}

//  Draws the main character
function drawTruman() {
  imageMode(CENTER);
  image(
    images.marker,
    width / 2 - dyn(truman.x, `x`),
    height / 2 - dyn(truman.y, `y`)
  );
}

//  Moves the character from one region of town to another
function moveTruman() {
  readInputs = false;
  targetLocation = data.locations[random(currentLocation.destinations)];

  let travelX = dist(currentLocation.x, 0, targetLocation.x, 0);
  let travelY = dist(0, currentLocation.y, 0, targetLocation.y);
  travelledDistance = 0;

  let travelTime = setInterval(() => {
    if (travelledDistance < TRAVEL_INCREMENT) {
      if (currentLocation.x < targetLocation.x) {
        truman.x += travelX / TRAVEL_INCREMENT;
      } else if (currentLocation.x > targetLocation.x) {
        truman.x -= travelX / TRAVEL_INCREMENT;
      }

      if (currentLocation.y < targetLocation.y) {
        truman.y += travelY / TRAVEL_INCREMENT;
      } else if (currentLocation.y > targetLocation.y) {
        truman.y -= travelY / TRAVEL_INCREMENT;
      }

      travelledDistance++;
    } else if (travelledDistance === TRAVEL_INCREMENT) {
      currentLocation = targetLocation;
      truman.x = currentLocation.x;
      truman.y = currentLocation.y;
      action[0] = data.events[currentLocation.events[0]];
      action[1] = data.events[currentLocation.events[1]];

      for (let i = 0; i < alerts.length; i++) {
        if (alerts[i].description === currentLocation.description) {
          doubtTarget += ALERT_PENALTY;
        }
      }

      readInputs = true;
      clearInterval(travelTime);
    }
  }, 200);
}

//  Randomly rolls the chance of an alert
function rollForAlert() {
  let roll = random(0, 100);
  let alertLocation = data.locations[random(alertsPossibleLocations)];
  if (roll < ALERT_CHANCE && alertLocation !== targetLocation) {
    alerts.push(alertLocation);
    alertsPossibleLocations.splice(alertLocation, 1);
  }
}

//  Displays the active alerts
function drawAlerts() {
  for (let i = 0; i < alerts.length; i++) {
    image(
      images.alert,
      width / 2 - dyn(alerts[i].x, `x`),
      height / 2 - dyn(alerts[i].y, `y`) - 50
    );
  }
}

//  Dynamically adjusts the doubt, funds and ratings values to their respective targets
function adjustValues() {
  if (funds < fundsTarget) {
    funds++;
  } else if (funds > fundsTarget) {
    funds--;
  }

  if (doubt < doubtTarget) {
    doubt++;
  } else if (doubt > doubtTarget) {
    doubt--;
  }

  if (ratingsTarget !== undefined) {
    if (currentRating < ratingsTarget) {
      ratingsChange = 10;
    } else if (currentRating > ratingsTarget) {
      ratingsChange = -10;
    } else if (currentRating === ratingsTarget) {
      ratingsChange = 0;
      ratingsTarget = undefined;
    }
  }
}

//  p5: Handles the events being triggered by key presses
function keyPressed() {
  if (state === `title` && keyCode === 32) {
    state = `simulation`;
    refreshRatings = setInterval(() => {
      if (ratingsTarget === undefined) {
        currentRating += random([10, -10]);
      }
      if (ratingsTarget !== undefined) {
        currentRating += ratingsChange;
      }

      if (currentRating < 0) {
        currentRating = 0;
      } else if (currentRating > 1000) {
        currentRating = 1000;
      }
      ratings.shift();
      ratings.push(currentRating);
    }, 200);
  }
  if (state === `ending` && keyCode === 32) {
    state = `title`;
  } else if (state === `simulation` && readInputs) {
    let key;

    if (keyCode === 49 || keyCode === 97) {
      //  Pick action 1
      key = 0;
      moveTruman();
      rollForAlert();
      day++;
    } else if (keyCode === 50 || keyCode === 98) {
      //  Pick action 2
      key = 1;
      moveTruman();
      rollForAlert();
      day++;
    } else if (keyCode === 70 && alerts.length >= 1) {
      //  Fix all alerts
      fundsTarget -= alerts.length * ALERT_COST;
      alerts = [];
      alertsPossibleLocations = [0, 1, 2, 3, 4, 5, 6];
      if (fundsTarget < 0) {
        fundsTarget = 0;
      }
    }

    if (key === 0 || key === 1) {
      if (action[key].loss === "doubt") {
        doubtTarget += action[key].lossAmount;
        if (doubtTarget > 100) {
          doubtTarget = 100;
        }
      } else if (action[key].loss === `money`) {
        fundsTarget -= action[key].lossAmount;
        if (fundsTarget < 0) {
          fundsTarget = 0;
        }
      } else if (action[key].loss === `ratings`) {
        if (ratingsTarget === undefined) {
          ratingsTarget = currentRating - action[key].lossAmount;
        } else {
          ratingsTarget -= action[key].lossAmount;
        }

        if (ratingsTarget < 0) {
          ratingsTarget = 0;
        }
        ratings.shift();
        ratings.push(currentRating);
      }

      if (action[key].gain === `doubt`) {
        doubtTarget -= action[key].gainAmount;
        if (doubtTarget < 0) {
          doubtTarget = 0;
        }
      } else if (action[key].gain === `money`) {
        fundsTarget += action[key].gainAmount;
      } else if (action[key].gain === `ratings`) {
        if (ratingsTarget === undefined) {
          ratingsTarget = currentRating + action[key].gainAmount;
        } else {
          ratingsTarget += action[key].gainAmount;
        }

        if (ratingsTarget > 1000) {
          ratingsTarget = 1000;
        }
        ratings.shift();
        ratings.push(currentRating);
      }
    }
  }
}

//  Converts the inputted numbers so that they fit to any screen
function dyn(number, axis) {
  let result;
  if (axis === `x`) {
    result = (number / WORK_WINDOW_SIZE.x) * width;
  } else if (axis === `y`) {
    result = (number / WORK_WINDOW_SIZE.y) * height;
  }
  return result;
}
