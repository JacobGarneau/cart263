class Animal {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.angle = random(0, 360);
    this.sausageDog = false;
  }

  //  display()
  //  Displays the animals on the canvas
  display() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.image, 0, 0);
    pop();
  }

  //  overlap()
  //  Checks if the mouse position and the image overlap
  overlap() {
    let distance = 64;
    let distX = dist(mouseX, 0, this.x, 0);
    let distY = dist(mouseY, 0, this.y, 0);

    if (distX <= distance && distY <= distance) {
      return true;
    }
  }

  //  mousePressed()
  //  Handles the clicks
  mousePressed() {
    if (this.overlap() && this.sausageDog === true) {
      this.found = true;
    }
  }

  //  update()
  //  Updates the state of the animals on the canvas
  update() {
    this.display();
  }
}
