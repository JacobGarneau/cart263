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
    image(this.image, this.x, this.y);
    pop();
  }

  update() {
    display();
  }
}
