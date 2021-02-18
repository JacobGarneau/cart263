"use strict";

/*
Bubble Popper++
Jacob Garneau

Pop them bubbles, yo!
*/

let video;
let handpose;
let predictions = [];
let modelLoaded = false;
let bubble;
let bubblesPopped = 0;
let sounds = {
  pop: undefined,
  inflate: undefined,
};
let images = {
  bubble: undefined,
  sky: undefined,
};
let baseIndexFinger;
let tipIndexFinger;

/*
p5: preloads sound files
*/
function preload() {
  soundFormats("wav");
  sounds.pop = loadSound("assets/sounds/pop");
  sounds.inflate = loadSound("assets/sounds/inflate");

  images.bubble = loadImage("assets/images/bubble.png");
  images.sky = loadImage("assets/images/sky.jpg");
}

/*
p5: sets up variables and objects
*/
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  handpose = ml5.handpose(
    video,
    { flipHorizontal: true, detectionConfidence: 0.2 },
    function () {
      console.log("Model ready");
      modelLoaded = true;
    }
  );

  handpose.on(`predict`, (results) => {
    predictions = results;
    console.log(results);
  });

  bubble = {
    x: random(0, width),
    y: height,
    maxSize: 100,
    size: 100,
    vx: 0,
    vy: -10,
  };
}

/*
p5: draws on the canvas
*/
function draw() {
  background(0);
  image(images.sky, 0, 0, width, height);

  // DISPLAY VIDEO FOR DEBUGGING
  // if (modelLoaded) {
  //   image(ml5.flipImage(video), 0, 0, width, height);
  // }

  if (predictions.length > 0) {
    for (let i = 0; i < predictions.length; i++) {
      tipIndexFinger = {
        x: predictions[i].annotations.indexFinger[3][0],
        y: predictions[i].annotations.indexFinger[3][1],
        z: predictions[i].annotations.indexFinger[3][2],
      };
      baseIndexFinger = {
        x: predictions[i].annotations.indexFinger[0][0],
        y: predictions[i].annotations.indexFinger[0][1],
        z: predictions[i].annotations.indexFinger[0][2],
      };

      drawPin();
      checkBubblePop();
      displayBubble();
      displayText();

      //  HAND TRACKING DOTS DISPLAY
      // for (let j = 0; j < predictions[i].annotations.thumb.length; j++) {
      //   push();
      //   noStroke();
      //   fill(0, 255, 0);
      //   ellipse(
      //     predictions[i].annotations.thumb[j][0],
      //     predictions[i].annotations.thumb[j][1],
      //     predictions[i].annotations.thumb[j][2],
      //     10
      //   );
      //   pop();
      // }
      //
      // for (let j = 0; j < predictions[i].annotations.indexFinger.length; j++) {
      //   push();
      //   noStroke();
      //   fill(0, 255, 0);
      //   ellipse(
      //     predictions[i].annotations.indexFinger[j][0],
      //     predictions[i].annotations.indexFinger[j][1],
      //     predictions[i].annotations.indexFinger[j][2],
      //     10
      //   );
      //   pop();
      // }
      //
      // for (let j = 0; j < predictions[i].annotations.middleFinger.length; j++) {
      //   push();
      //   noStroke();
      //   fill(0, 255, 0);
      //   ellipse(
      //     predictions[i].annotations.middleFinger[j][0],
      //     predictions[i].annotations.middleFinger[j][1],
      //     predictions[i].annotations.middleFinger[j][2],
      //     10
      //   );
      //   pop();
      // }
      //
      // for (let j = 0; j < predictions[i].annotations.ringFinger.length; j++) {
      //   push();
      //   noStroke();
      //   fill(0, 255, 0);
      //   ellipse(
      //     predictions[i].annotations.ringFinger[j][0],
      //     predictions[i].annotations.ringFinger[j][1],
      //     predictions[i].annotations.ringFinger[j][2],
      //     10
      //   );
      //   pop();
      // }
      //
      // for (let j = 0; j < predictions[i].annotations.pinky.length; j++) {
      //   push();
      //   noStroke();
      //   fill(0, 255, 0);
      //   ellipse(
      //     predictions[i].annotations.pinky[j][0],
      //     predictions[i].annotations.pinky[j][1],
      //     predictions[i].annotations.pinky[j][2],
      //     10
      //   );
      //   pop();
      // }
    }
  }
}

/*
draws the pin on the index finger
*/
function drawPin() {
  push();
  stroke(255);
  strokeWeight(4);
  line(
    baseIndexFinger.x,
    baseIndexFinger.y,
    tipIndexFinger.x,
    tipIndexFinger.y
  );
  pop();

  push();
  noStroke();
  fill(255, 0, 0);
  ellipse(baseIndexFinger.x, baseIndexFinger.y, 10, 10);
  pop();
}

/*
checks if the pin touches the bubble and makes it pop if so
*/
function checkBubblePop() {
  let d = dist(tipIndexFinger.x, tipIndexFinger.y, bubble.x, bubble.y);

  if (d <= bubble.size / 2) {
    bubble.y = height;
    bubble.x = random(0, width);
    if (bubble.maxSize > 20) {
      bubble.maxSize -= 5;
      bubble.speed -= 2;
    }

    bubble.size = 0;
    bubblesPopped++;

    sounds.pop.play();
    sounds.inflate.play();
  }
}

/*
displays and moves the bubble
*/
function displayBubble() {
  bubble.x += bubble.vx;
  bubble.y += bubble.vy;

  if (bubble.y < 0) {
    bubble.y = height;
    bubble.x = random(0, width);
  }

  if (bubble.size < bubble.maxSize) {
    bubble.size += 5;
  }

  push();
  imageMode(CENTER);
  image(images.bubble, bubble.x, bubble.y, bubble.size, bubble.size);
  pop();
}

/*
displays the text and counts the amount of bubbles popped
*/
function displayText() {
  push();
  stroke(0);
  strokeWeight(3);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(`Bubbles popped: ${bubblesPopped}`, width / 2, 24);
  pop();
}
