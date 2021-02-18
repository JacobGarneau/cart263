"use strict";

/**
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

/**
Description of setup
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
    size: 100,
    vx: 0,
    vy: -10,
  };
}

/**
Description of draw()
*/
function draw() {
  background(0);

  if (modelLoaded) {
    image(ml5.flipImage(video), 0, 0, width, height);
  }

  push();
  noStroke();
  fill(255, 255, 0);
  ellipse(mouseX, mouseY, 10);
  pop();

  if (predictions.length > 0) {
    for (let i = 0; i < predictions.length; i++) {
      let tipIndexFinger = {
        x: predictions[i].annotations.indexFinger[3][0],
        y: predictions[i].annotations.indexFinger[3][1],
        z: predictions[i].annotations.indexFinger[3][2],
      };
      let baseIndexFinger = {
        x: predictions[i].annotations.indexFinger[0][0],
        y: predictions[i].annotations.indexFinger[0][1],
        z: predictions[i].annotations.indexFinger[0][2],
      };

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

      let d = dist(tipIndexFinger.x, tipIndexFinger.y, bubble.x, bubble.y);

      if (d <= bubble.size / 2) {
        bubble.y = height;
        bubble.x = random(0, width);
        if (bubble.size > 10) {
          bubble.size -= 10;
          bubble.speed -= 1;
        }

        bubblesPopped++;
      }

      //  hand trackng dots
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

  bubble.x += bubble.vx;
  bubble.y += bubble.vy;

  if (bubble.y < 0) {
    bubble.y = height;
    bubble.x = random(0, width);
  }

  push();
  noStroke();
  fill(127, 0, 127);
  ellipse(bubble.x, bubble.y, bubble.size);
  pop();

  push();
  stroke(0);
  strokeWeight(3);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(`Bubbles popped: ${bubblesPopped}`, width / 2, 24);
  pop();
}
