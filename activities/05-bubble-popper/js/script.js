"use strict";

/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

let video;
let handpose;
let predictions = [];

/**
Description of preload
*/
function preload() {}

/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();

  handpose = ml5.handpose(video, { flipHorizontal: false }, function () {
    console.log("Model ready");
  });

  handpose.on(`predict`, (results) => {
    predictions = results;
    console.log(results);
  });
}

/**
Description of draw()
*/
function draw() {
  background(0);

  imageMode(CENTER);
  image(video, width / 2, height / 2);

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
    }
  }
}
