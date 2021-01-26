class Animal {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.angle = 0;
  }

  display() {
    push();

    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.image, 0, 0);
    pop();
  }

  overlap(x, y) {
    let distance = 64;
    let distX = dist(mouseX, 0, x, 0);
    let distY = dist(mouseY, 0, y, 0);

    if (distX <= distance && distY <= distance) {
      return true;
    }
  }

  update() {
    this.display();
  }
}
