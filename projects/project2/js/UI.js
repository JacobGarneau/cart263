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
        r: 0,
        g: 127,
        b: 255,
      },
    };
    this.staminaBar = {
      x: 20,
      y: 68,
      height: 16,
      width: 3,
      fill: {
        r: 0,
        g: 255,
        b: 127,
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
  }

  drawGauges() {
    // draw health bar container
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

    // draw stamina bar container
    fill(0);
    rect(
      this.staminaBar.x,
      this.staminaBar.y,
      this.staminaBar.width * player.maxStamina,
      this.staminaBar.height
    );

    // draw stamina bar fill
    fill(
      this.staminaBar.fill.r,
      this.staminaBar.fill.g,
      this.staminaBar.fill.b
    );
    rect(
      this.staminaBar.x,
      this.staminaBar.y,
      this.staminaBar.width * player.stamina,
      this.staminaBar.height
    );
  }

  drawAbilities() {
    // draw abilities
    for (let i = 0; i < player.abilities.length; i++) {
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
        (360 / player.abilities[i].recharge) *
          -player.abilities[i].currentRecharge -
          90
      );

      if (player.abilities[i].currentRecharge > 0) {
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
        ellipse(
          this.abilities.x,
          this.abilities.y - i * (this.abilities.size + this.abilities.spacing),
          this.abilities.size
        );
      }

      imageMode(CENTER);
      image(
        icons[player.abilities[i].icon],
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
      text(
        player.abilities[i].command,
        this.abilities.x + this.abilities.commandShift,
        this.abilities.y +
          this.abilities.commandShift -
          i * (this.abilities.size + this.abilities.spacing)
      );
      pop();
    }
  }
}
