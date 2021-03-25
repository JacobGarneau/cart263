/**
Code Taker++
Jacob Garneau

Crack the code and save the world!
*/

"use strict";

// Code goes here

const VICTORY_SOUND = new Audio("assets/sounds/victory.wav");

$(`#solved-dialog`).dialog({
  autoOpen: false,
  buttons: {
    "I know.": function () {
      $(this).dialog(`close`);
    },
  },
});

$(`.secret`).on(`mouseover`, function (event) {
  $(this).addClass(`found`, 500);
});

$(`body`).on(`keydown`, function (event) {
  if (event.keyCode === 69) {
    $(`section p, h2`).addClass(`hidden`, 500);
    $(`.secret`).addClass(`found`, 500);
  }
});

$(`.secret`).draggable({ helper: "clone" });

$(`#answer`).droppable({
  drop: function (event, ui) {
    let character = ui.draggable.text();

    $(this).append(character);

    ui.draggable.draggable(`disable`);
    ui.draggable.removeClass(`found`);

    if ($(this).text() === `Theremin`) {
      $(`#solved-dialog`).dialog(`open`);
      VICTORY_SOUND.play();
    }
  },
});
