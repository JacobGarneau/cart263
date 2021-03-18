/**
Raving Redactionist ++
Jacob Garneau

Protect the secrets of the motherland!
*/

"use strict";

// Code goes here
const REVEAL_PROBABLILTY = 0.1;
const REVELATION_INTERVAL = 500;
let percentage = 100;

$(`.top-secret`).on(`click`, redact);

let revealText = setInterval(revelation, REVELATION_INTERVAL);

function revelation() {
  $(`.redacted`).each(attemptReveal);
}

function attemptReveal() {
  let rng = Math.random();

  if (rng < REVEAL_PROBABLILTY) {
    $(this).removeClass(`redacted`);
    $(this).addClass(`revealed`);
  }

  updateRedactionPrecent();
}

function redact() {
  $(this).removeClass(`revealed`);
  $(this).addClass(`redacted`);

  updateRedactionPrecent();
}

function updateRedactionPrecent() {
  percentage = Math.floor(
    ($(`.redacted`).length / $(`.top-secret`).length) * 100
  );

  if (percentage > 0) {
    $(`#percentage`).html(`Redaction percentage: <span>${percentage}%</span>`);
  } else {
    $(`#percentage`).html(`Redaction percentage: <span>REDACTED%</span>`);
    clearInterval(revealText);
    $(`.top-secret`).off(`click`);
  }
}
