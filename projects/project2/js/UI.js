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
  }

  // display the UI
  display() {
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
}
