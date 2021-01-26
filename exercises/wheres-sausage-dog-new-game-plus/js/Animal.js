class Animal {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.angle = 0;
    this.sausageDog = false;
  }

  display() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.image, 0, 0);
    pop();
  }

  overlap() {
    let distance = 64;
    let distX = dist(mouseX, 0, this.x, 0);
    let distY = dist(mouseY, 0, this.y, 0);

    if (distX <= distance && distY <= distance) {
      return true;
    }
  }

  mousePressed() {
    if (this.overlap() && this.sausageDog === true) {
      this.found = true;
    }
  }

  update() {
    this.display();
  }
}
