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
  video = createCapture(VIDEO);
  video.hide();

  handpose = ml5.handpose(video, { flipHorizontal: true }, () => {
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
function draw() {}
