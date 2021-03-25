/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// Code goes here

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

$(`.secret`).draggable({ helper: "clone" });

$(`#answer`).droppable({
  drop: function (event, ui) {
    let character = ui.draggable.text();

    $(this).append(character);

    ui.draggable.draggable(`disable`);
    ui.draggable.removeClass(`found`);

    if ($(this).text() === `Theremin`) {
      $(`#solved-dialog`).dialog(`open`);
    }
  },
});
