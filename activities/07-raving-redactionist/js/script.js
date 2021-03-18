/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// Code goes here
const REVEAL_PROBABLILTY = 0.1;
const REVELATION_INTERVAL = 500;

$(`.top-secret`).on(`click`, redact);

setInterval(revelation, REVELATION_INTERVAL);

function revelation() {
  $(`.redacted`).each(attemptReveal);
}

function attemptReveal() {
  let rng = Math.random();

  if (rng < REVEAL_PROBABLILTY) {
    $(this).removeClass(`redacted`);
    $(this).addClass(`revealed`);
  }
}

function redact() {
  $(this).removeClass(`revealed`);
  $(this).addClass(`redacted`);
}
