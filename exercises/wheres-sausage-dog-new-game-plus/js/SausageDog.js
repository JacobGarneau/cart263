class SausageDog extends Animal {
  constructor(x, y, image) {
    super(x, y, image);
    this.found = false;
    this.rotationSpeed = 0.25;
    this.sausageDog = true;
  }

  update() {
    super.update();
    if (this.found) {
      this.angle += this.rotationSpeed;

      setTimeout(function () {
        state = `goodEnding`;
      }, 2000);
    }
  }
}
