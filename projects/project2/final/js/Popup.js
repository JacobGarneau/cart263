class Popup {
  constructor(
    string,
    duration,
    fadeOut = true,
    superPopup = false,
    textBox = false
  ) {
    this.x = width / 2;
    this.y = height / 4;
    this.string = string; // text string to be displayed
    this.duration = duration; // total duration of the popup
    this.fadeOut = fadeOut;
    this.opacity = 0;
    this.superPopup = superPopup; // affects the layer on which the popup will be displayed
    this.textBox = textBox; // displays a rectangular text bow around the text if true
  }

  display() {
    this.duration--;
    // handle the fade out if active
    if (this.duration * 2 <= this.opacity && this.fadeOut) {
      this.opacity -= 2;
    } else {
      this.opacity += 2;
      this.opacity = constrain(this.opacity, 0, 255);
    }

    // handle the text visibility if there is no fade out
    if (!this.fadeOut && this.duration > 0) {
      this.opacity = 255;
    } else if (!this.fadeOut && this.duration <= 0) {
      this.opacity = 0;
    }

    push();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(24);
    if (this.superPopup) {
      // draw the popup in blue if it is a super popup
      if (this.textBox) {
        // draw the text box around the text
        fill(199, 66, 66, this.opacity);
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y - 40, 180, 48, 12, 12, 12, 12);
      }
      fill(0, 255, 255, this.opacity);
      text(this.string, this.x, this.y - 40);
    } else {
      // draw the popup in orange if it is a regular popup
      fill(246, 122, 51, this.opacity);
      text(this.string, this.x, this.y);
    }
    pop();
  }
}
