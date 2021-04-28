class Popup {
  constructor(string, duration, fadeOut = true) {
    this.x = width / 2;
    this.y = height / 4;
    this.string = string;
    this.duration = duration;
    this.fadeOut = fadeOut;
    this.opacity = 0;
  }

  display() {
    this.duration--;
    if (this.duration * 2 <= this.opacity && this.fadeOut) {
      this.opacity -= 2;
    } else {
      this.opacity += 2;
      this.opacity = constrain(this.opacity, 0, 255);
    }
    push();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(24);
    fill(246, 122, 51, this.opacity);
    text(this.string, this.x, this.y);
    pop();
  }
}
