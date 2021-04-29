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
    this.string = string;
    this.duration = duration;
    this.fadeOut = fadeOut;
    this.opacity = 0;
    this.superPopup = superPopup;
    this.textBox = textBox;
  }

  display() {
    this.duration--;
    if (this.duration * 2 <= this.opacity && this.fadeOut) {
      this.opacity -= 2;
    } else {
      this.opacity += 2;
      this.opacity = constrain(this.opacity, 0, 255);
    }

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
      if (this.textBox) {
        fill(199, 66, 66, this.opacity);
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y - 40, 180, 48, 12, 12, 12, 12);
      }
      fill(0, 255, 255, this.opacity);
      text(this.string, this.x, this.y - 40);
    } else {
      fill(246, 122, 51, this.opacity);
      text(this.string, this.x, this.y);
    }

    pop();
  }
}
