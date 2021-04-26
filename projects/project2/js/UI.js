class UI {
  constructor() {
    this.healthBar = {
      x: 20,
      y: 20,
      height: 24,
      width: 4,
      fill: {
        r: 255,
        g: 0,
        b: 0,
      },
    };
    this.frostbiteBar = {
      x: 20,
      y: 48,
      height: 16,
      width: 3,
      fill: {
        r: 255,
        g: 143,
        b: 81,
      },
    };
    this.abilities = {
      x: 80,
      y: height - 80,
      size: 100,
      borderSize: 6,
      spacing: 20,
      commandShift: 38,
      commandSize: 32,
      commandBorderRadius: 6,
      fill: {
        r: 246,
        g: 122,
        b: 51,
      },
    };
  }

  // display the UI
  display() {
    this.drawGauges();
    this.drawAbilities();

    if (this.menuOpen) {
      this.drawMenu();
    }
  }

  drawGauges() {
    // draw health bar container
    push();
    noStroke();
    fill(0);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      this.healthBar.width * player.maxHealth,
      this.healthBar.height
    );

    // draw health bar fill
    fill(this.healthBar.fill.r, this.healthBar.fill.g, this.healthBar.fill.b);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      this.healthBar.width * player.health,
      this.healthBar.height
    );

    // draw frostbite bar container
    fill(0);
    rect(
      this.frostbiteBar.x,
      this.frostbiteBar.y,
      this.frostbiteBar.width * player.maxFrostbite,
      this.frostbiteBar.height
    );

    // draw frostbite bar fill
    fill(
      this.frostbiteBar.fill.r,
      this.frostbiteBar.fill.g,
      this.frostbiteBar.fill.b
    );
    rect(
      this.frostbiteBar.x,
      this.frostbiteBar.y,
      this.frostbiteBar.width * player.frostbite,
      this.frostbiteBar.height
    );

    // draw sun sun points
    image(images.sun, 20, 66, 30, 30);
    fill(0);
    textSize(24);
    textStyle(BOLD);
    text(player.sunPoints, 60, 88);
    pop();
  }

  drawAbilities() {
    // draw abilities
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      // draw the icon
      push();
      noStroke();
      fill(this.abilities.fill.r, this.abilities.fill.g, this.abilities.fill.b);
      arc(
        this.abilities.x,
        this.abilities.y - i * (this.abilities.size + this.abilities.spacing),
        this.abilities.size,
        this.abilities.size,
        -90,
        (360 / player.abilities.attacks[i].recharge) *
          -player.abilities.attacks[i].currentRecharge -
          90
      );

      if (player.abilities.attacks[i].currentRecharge > 0) {
        if (player.hitlag > 0) {
          fill(100);
        } else {
          fill(187);
        }

        ellipse(
          this.abilities.x,
          this.abilities.y - i * (this.abilities.size + this.abilities.spacing),
          this.abilities.size - this.abilities.borderSize * 2
        );
      } else {
        if (player.hitlag > 0) {
          fill(100);
        } else {
          fill(
            this.abilities.fill.r,
            this.abilities.fill.g,
            this.abilities.fill.b
          );
        }
        ellipse(
          this.abilities.x,
          this.abilities.y - i * (this.abilities.size + this.abilities.spacing),
          this.abilities.size
        );
      }

      imageMode(CENTER);
      image(
        icons[player.abilities.attacks[i].icon],
        this.abilities.x,
        this.abilities.y - i * (this.abilities.size + this.abilities.spacing)
      );
      pop();

      // draw the command indication
      push();
      fill(0);
      rectMode(CENTER);
      rect(
        this.abilities.x + this.abilities.commandShift,
        this.abilities.y +
          this.abilities.commandShift -
          i * (this.abilities.size + this.abilities.spacing),
        this.abilities.commandSize,
        this.abilities.commandSize,
        this.abilities.commandBorderRadius,
        this.abilities.commandBorderRadius,
        this.abilities.commandBorderRadius,
        this.abilities.commandBorderRadius
      );

      fill(255);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text(
        player.abilities.attacks[i].command,
        this.abilities.x + this.abilities.commandShift,
        this.abilities.y +
          this.abilities.commandShift -
          i * (this.abilities.size + this.abilities.spacing)
      );
      pop();
    }
  }

  toggleMenu() {
    if (this.menuOpen) {
      this.menuOpen = false;
      player.movable = true;

      for (let i = 0; i < entities.length; i++) {
        entities[i].movable = true;
      }
    } else {
      this.menuOpen = true;
      player.movable = false;

      for (let i = 0; i < entities.length; i++) {
        entities[i].movable = false;
      }
    }
  }

  drawMenu() {
    push();
    noStroke();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    fill(199, 66, 66);
    rectMode(CENTER);
    rect(width / 2, height / 2, dyn(900, `x`), dyn(600, `y`));

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    textStyle(BOLD);
    text(`abilities.attacks`, width / 2, dyn(160, `y`));
    pop();
  }
}
