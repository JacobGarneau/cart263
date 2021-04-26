class Structure {
  constructor(mapX, mapY, x, y, icon) {
    this.mapX = mapX;
    this.mapY = mapY;
    this.x = x;
    this.y = y;
    this.fill = {
      r: 150,
      g: 150,
      b: 0,
    };
    this.icon = icon;
  }

  display() {
    push();
    imageMode(CENTER);
    image(
      this.icon,
      this.mapX * width - player.mapX * width + this.x,
      this.mapY * height - player.mapY * height + this.y
    );
    pop();
  }
}
