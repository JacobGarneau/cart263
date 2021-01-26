class SausageDog extends Animal {
  constructor(x, y, image) {
    super(x, y, image);
    this.found = false;
    this.rotationSpeed = 0.25;
  }

  update() {
    super.update();
    if (found) {
      this.angle += this.rotationSpeed;
    }
  }

  mousePressed() {
    let distX = dist(mouseX, 0, this.x, 0);
    let distY = dist(mouseY, 0, this.y, 0);
    if (distX <= 10 && disyY <= 10) {
      this.found = true;
    }
  }
}
