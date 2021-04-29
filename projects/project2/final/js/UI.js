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
    }; // attributes of the health bar
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
    }; // attributes of the Warmth gauge
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
    }; // attributes of the ability icons

    this.shrinePopup = false;
  }

  // displays the UI
  display() {
    // draws the ability icons
    this.drawAbilities();

    // draws a popup if the player is near a shrine
    if (this.shrinePopup) {
      this.drawShrinePopup();
    }

    // draws the ability purchase menu if it has been opened
    if (this.menuOpen) {
      this.drawMenu();
    }

    // draws the health and Warmth gauges
    this.drawGauges();
  }

  // draws the health and Warmth gauges
  drawGauges() {
    // draws the health bar container
    push();
    noStroke();
    fill(0);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      this.healthBar.width * player.maxHealth,
      this.healthBar.height
    );

    // draws the health bar
    fill(this.healthBar.fill.r, this.healthBar.fill.g, this.healthBar.fill.b);
    rect(
      this.healthBar.x,
      this.healthBar.y,
      this.healthBar.width * player.health,
      this.healthBar.height
    );

    // draws the health bar text
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(16);
    text(
      player.health + ` / ` + player.maxHealth,
      this.healthBar.x + (this.healthBar.width * player.maxHealth) / 2,
      this.healthBar.y + this.healthBar.height / 2 + 1
    );
    pop();

    // draws the Warmth gauge container
    fill(0);
    rect(
      this.frostbiteBar.x,
      this.frostbiteBar.y,
      this.frostbiteBar.width * player.maxFrostbite,
      this.frostbiteBar.height
    );

    // draws the Warmth gauge
    fill(this.abilities.fill.r, this.abilities.fill.g, this.abilities.fill.b);
    rect(
      this.frostbiteBar.x,
      this.frostbiteBar.y,
      this.frostbiteBar.width * player.frostbite,
      this.frostbiteBar.height
    );

    // draws the Warmth gauge text
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(14);
    text(
      player.frostbite + ` / ` + player.maxFrostbite,
      this.frostbiteBar.x + (this.frostbiteBar.width * player.maxFrostbite) / 2,
      this.frostbiteBar.y + this.frostbiteBar.height / 2 + 1
    );
    pop();

    // draws the flame breath and ember nova cost markers on the Warmth gauge
    push();
    stroke(255);
    strokeWeight(2);
    imageMode(CENTER);
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      if (
        player.abilities.attacks[i].command ===
        playerData.attacks.fireBreath.command
      ) {
        // draws the flame breath cost marker
        line(
          this.frostbiteBar.x +
            this.frostbiteBar.width * playerData.attacks.fireBreath.frostbite,
          this.frostbiteBar.y + 1,
          this.frostbiteBar.x +
            this.frostbiteBar.width * playerData.attacks.fireBreath.frostbite,
          this.frostbiteBar.y + this.frostbiteBar.height - 1
        );

        image(
          images.fireball,
          this.frostbiteBar.x +
            this.frostbiteBar.width * playerData.attacks.fireBreath.frostbite,
          this.frostbiteBar.y + 30,
          16,
          16
        );
      } else if (
        player.abilities.attacks[i].command ===
        playerData.attacks.emberNova.command
      ) {
        // draws the ember nova cost marker
        line(
          this.frostbiteBar.x +
            this.frostbiteBar.width * playerData.attacks.emberNova.frostbite,
          this.frostbiteBar.y + 1,
          this.frostbiteBar.x +
            this.frostbiteBar.width * playerData.attacks.emberNova.frostbite,
          this.frostbiteBar.y + this.frostbiteBar.height - 1
        );
        image(
          images.nova2,
          this.frostbiteBar.x +
            this.frostbiteBar.width * playerData.attacks.emberNova.frostbite,
          this.frostbiteBar.y + 30,
          16,
          16
        );
      }
    }
    pop();

    // draws the sun points
    image(images.sun, width - 50, 16, 30, 30);

    // changes the sun points' color if the menu is open
    if (this.menuOpen) {
      fill(255);
    } else {
      fill(0);
    }
    textSize(24);
    textAlign(RIGHT, CENTER);
    textStyle(BOLD);
    text(player.currentSunPoints, width - 60, 34);
    pop();
  }

  // draws the ability icons
  drawAbilities() {
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      if (player.abilities.attacks[i].upgrade) {
        // draws the ability
        push();
        fill(0);
        ellipse(
          this.abilities.x + 36,
          this.abilities.y -
            i * (this.abilities.size + this.abilities.spacing) -
            36,
          42
        );
        pop();
      }

      push();
      noStroke();
      fill(this.abilities.fill.r, this.abilities.fill.g, this.abilities.fill.b);
      // draws the ability's recharge progress bar
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

      // draws the ability icon's circle differently depending on if it is currently recharging or not
      if (player.abilities.attacks[i].currentRecharge > 0) {
        // changes the ability icon's circle color depending on if the player is still in hitlag or not
        if (player.hitlag > 0) {
          fill(100);
        } else {
          fill(187);
        }

        // draws the ability icon's circle
        ellipse(
          this.abilities.x,
          this.abilities.y - i * (this.abilities.size + this.abilities.spacing),
          this.abilities.size - this.abilities.borderSize * 2
        );
      } else {
        if (player.hitlag > 0) {
          // changes the ability icon's circle color depending on if the player is still in hitlag or not
          fill(100);
        } else {
          fill(
            this.abilities.fill.r,
            this.abilities.fill.g,
            this.abilities.fill.b
          );
        }

        // draws the ability icon's circle
        ellipse(
          this.abilities.x,
          this.abilities.y - i * (this.abilities.size + this.abilities.spacing),
          this.abilities.size
        );
      }

      // draws the ability's image icon
      imageMode(CENTER);
      image(
        icons[player.abilities.attacks[i].icon],
        this.abilities.x,
        this.abilities.y - i * (this.abilities.size + this.abilities.spacing)
      );

      if (player.abilities.attacks[i].upgrade) {
        // draws the "upgraded" icon if the ability has been upgraded
        image(
          images.upgrade,
          this.abilities.x + 36,
          this.abilities.y -
            i * (this.abilities.size + this.abilities.spacing) -
            36
        );
      }
      pop();

      // draws the ability's command indication
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
      textSize(14);
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

    // draws the dash icon
    if (player.abilities.dash) {
      push();
      // changes the dash icon's circle color depending on if the player is currently dashing or not
      if (player.dashing) {
        fill(100);
      } else {
        fill(
          this.abilities.fill.r,
          this.abilities.fill.g,
          this.abilities.fill.b
        );
      }

      // draws the dash icon's circle
      noStroke();
      ellipseMode(CENTER);
      ellipse(
        this.abilities.x + this.abilities.size + this.abilities.spacing,
        this.abilities.y,
        this.abilities.size
      );

      // draws dash's image icon
      imageMode(CENTER);
      image(
        images.dash,
        this.abilities.x + this.abilities.size + this.abilities.spacing,
        this.abilities.y
      );
      fill(0);

      // draws dash's command indication
      rectMode(CENTER);
      rect(
        this.abilities.x +
          this.abilities.size +
          this.abilities.spacing +
          this.abilities.commandShift,
        this.abilities.y + this.abilities.commandShift,
        this.abilities.commandSize,
        this.abilities.commandSize,
        this.abilities.commandBorderRadius,
        this.abilities.commandBorderRadius,
        this.abilities.commandBorderRadius,
        this.abilities.commandBorderRadius
      );
      image(
        images.shift,
        this.abilities.x +
          this.abilities.size +
          this.abilities.spacing +
          this.abilities.commandShift,
        this.abilities.y + this.abilities.commandShift
      );
      pop();
    }
  }

  // draws a popup if the player is near a shrine
  drawShrinePopup() {
    // draws the command prompt
    push();
    fill(246, 122, 51);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height - 60, 510, 40, 12, 12, 12, 12);
    textSize(24);
    textAlign(CENTER, CENTER);
    fill(255);
    text(
      `Press [SPACEBAR] to interact with the shrine`,
      width / 2,
      height - 59
    );
    pop();
  }

  // toggles the menu from open to closed and from closed to open
  toggleMenu() {
    if (this.menuOpen) {
      // if the menu is being closed, allows all entities to move again and resumes the game
      this.menuOpen = false;
      player.movable = true;

      for (let i = 0; i < entities.length; i++) {
        entities[i].movable = true;
      }

      for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].movable = true;
      }
    } else {
      // if the menu is being opened, prevents all entities from moving and freezes the game
      this.menuOpen = true;
      player.movable = false;

      for (let i = 0; i < entities.length; i++) {
        entities[i].movable = false;
      }

      for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].movable = false;
      }
    }
  }

  // draws the ability purchase menu
  drawMenu() {
    push();
    noStroke();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // draws the menu's background
    fill(199, 66, 66);
    rectMode(CENTER);
    rect(width / 2, height / 2, dyn(900, `x`), dyn(700, `y`));

    // draws the menu title and the commmand indication to close the menu
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    textStyle(BOLD);
    text(`ABILITIES`, width / 2, dyn(120, `y`));
    textSize(24);
    text(`[ESC]`, width / 2 + dyn(400, `x`), dyn(60, `y`));
    pop();

    // draws the lines that connect the ability icons to indicate prerequisites
    push();
    stroke(255);
    strokeWeight(2);
    line(
      width / 2 + dyn(abilityData.abilities[1].x, `x`),
      height / 2 + dyn(abilityData.abilities[1].y, `y`),
      width / 2 + dyn(abilityData.abilities[2].x, `x`),
      height / 2 + dyn(abilityData.abilities[2].y, `y`)
    );
    line(
      width / 2 + dyn(abilityData.abilities[0].x, `x`),
      height / 2 + dyn(abilityData.abilities[0].y, `y`),
      width / 2 + dyn(abilityData.abilities[3].x, `x`),
      height / 2 + dyn(abilityData.abilities[3].y, `y`)
    );
    line(
      width / 2 + dyn(abilityData.abilities[4].x, `x`),
      height / 2 + dyn(abilityData.abilities[4].y, `y`),
      width / 2 + dyn(abilityData.abilities[6].x, `x`),
      height / 2 + dyn(abilityData.abilities[6].y, `y`)
    );
    line(
      width / 2 + dyn(abilityData.abilities[4].x, `x`),
      height / 2 + dyn(abilityData.abilities[4].y, `y`),
      width / 2 + dyn(abilityData.abilities[5].x, `x`),
      height / 2 + dyn(abilityData.abilities[5].y, `y`)
    );
    line(
      width / 2 + dyn(abilityData.abilities[6].x, `x`),
      height / 2 + dyn(abilityData.abilities[6].y, `y`),
      width / 2 + dyn(abilityData.abilities[7].x, `x`),
      height / 2 + dyn(abilityData.abilities[7].y, `y`)
    );
    line(
      width / 2 + dyn(abilityData.abilities[5].x, `x`),
      height / 2 + dyn(abilityData.abilities[5].y, `y`),
      width / 2 + dyn(abilityData.abilities[7].x, `x`),
      height / 2 + dyn(abilityData.abilities[7].y, `y`)
    );
    pop();

    // draws the ability icons
    for (let i = 0; i < abilityData.abilities.length; i++) {
      push();
      if (abilityData.abilities[i].hover) {
        stroke(255);
        strokeWeight(6);

        // draws the hovered ability's name and description in the menu
        push();
        fill(255);
        noStroke();
        textAlign(CENTER, TOP);
        textStyle(BOLD);
        textSize(24);
        text(abilityData.abilities[i].displayName, width / 2, dyn(610, `y`));
        textStyle(NORMAL);
        text(abilityData.abilities[i].description, width / 2, dyn(650, `y`));
        pop();
      } else {
        noStroke();
      }

      // changes the ability icons' color depending on if the ability is unlocked, unlockable, or locked
      if (abilityData.abilities[i].status === `unlocked`) {
        fill(
          this.abilities.fill.r,
          this.abilities.fill.g,
          this.abilities.fill.b
        );
      } else if (abilityData.abilities[i].status === `unlockable`) {
        fill(150);
      } else {
        fill(100);
      }

      // draws the ability icons
      ellipse(
        width / 2 + dyn(abilityData.abilities[i].x, `x`),
        height / 2 + dyn(abilityData.abilities[i].y, `y`),
        100
      );
      imageMode(CENTER);
      image(
        icons[abilityData.abilities[i].icon],
        width / 2 + dyn(abilityData.abilities[i].x, `x`),
        height / 2 + dyn(abilityData.abilities[i].y, `y`)
      );

      if (
        abilityData.abilities[i].status === `unlockable` ||
        abilityData.abilities[i].status === `locked`
      ) {
        // if the abilities are not already unlocked, draw the sun point cost icon
        fill(255, 209, 47);
        noStroke();
        ellipse(
          width / 2 + dyn(abilityData.abilities[i].x, `x`) + 40,
          height / 2 + dyn(abilityData.abilities[i].y, `y`) + 40,
          28
        );

        imageMode(CENTER);
        image(
          images.sun,
          width / 2 + dyn(abilityData.abilities[i].x, `x`) + 40,
          height / 2 + dyn(abilityData.abilities[i].y, `y`) + 40
        );

        // draws the sun point cost number
        fill(0);
        textStyle(BOLD);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(
          abilityData.abilities[i].cost,
          width / 2 + dyn(abilityData.abilities[i].x, `x`) + 39,
          height / 2 + dyn(abilityData.abilities[i].y, `y`) + 41
        );
      }

      if (abilityData.abilities[i].upgrade) {
        // if the ability is an upgrade of a previous one, draw the upgrade icon next to it
        imageMode(CENTER);
        image(
          images.upgrade,
          width / 2 + dyn(abilityData.abilities[i].x, `x`) + 36,
          height / 2 + dyn(abilityData.abilities[i].y, `y`) - 36
        );
      }
      pop();
    }
  }

  // buys new abilities from the menu
  buyAbility(ability) {
    if (ability.status === `unlockable`) {
      if (player.currentSunPoints >= ability.cost) {
        // if the ability is unlockable and the player has enough sun points, unlocks the ability
        player.currentSunPoints -= ability.cost;
        ability.status = `unlocked`;
        sounds.abilityPurchased.stop();
        sounds.abilityPurchased.play(0, 2);

        for (let i = 0; i < ability.unlocks.length; i++) {
          for (let j = 0; j < abilityData.abilities.length; j++) {
            // changes abilities for which the purchased ability was a prerequisite from locked to unlockable
            if (
              ability.unlocks[i] === abilityData.abilities[j].name &&
              abilityData.abilities[j].status === `locked`
            ) {
              abilityData.abilities[j].status = `unlockable`;
            }
          }
        }

        if (ability.name === `minimap`) {
          // add the minimap to the player's abilities
          player.abilities.minimap = true;
        } else if (ability.name === `dash`) {
          // add dash to the player's abilities
          player.abilities.dash = true;
        } else if (ability.name === `wingAttack`) {
          // add wing attack to the player's abilities
          player.abilities.attacks.push(playerData.attacks.wingAttack);
        } else if (ability.name === `fireBreath`) {
          // add flame breath to the player's abilities
          player.abilities.attacks.push(playerData.attacks.fireBreath);
        } else if (ability.name === `emberNova`) {
          // add ember nova to the player's abilities
          player.abilities.attacks.push(playerData.attacks.emberNova);
        } else if (ability.name === `improvedPeck`) {
          // replace peck with its improved version in the player's abilities
          player.abilities.attacks.splice(
            player.abilities.attacks.indexOf(playerData.attacks.peck),
            1,
            playerData.attacks.improvedPeck
          );
        } else if (ability.name === `improvedWingAttack`) {
          // replace wing attack with its improved version in the player's abilities
          player.abilities.attacks.splice(
            player.abilities.attacks.indexOf(playerData.attacks.wingAttack),
            1,
            playerData.attacks.improvedWingAttack
          );
        } else if (ability.name === `improvedFireBreath`) {
          // replace flame breath with its improved version in the player's abilities
          player.abilities.attacks.splice(
            player.abilities.attacks.indexOf(playerData.attacks.fireBreath),
            1,
            playerData.attacks.improvedFireBreath
          );
        }
      } else {
        // shows a popup if the player does not have enough sun points to purchase the ability
        superPopup = new Popup(
          `Insufficient Sun Points.`,
          60,
          false,
          true,
          false
        );
      }
    } else if (ability.status === `locked`) {
      // shows a popup if the ability being purchased is still locked
      superPopup = new Popup(`Lacking prerequisites.`, 60, false, true, false);
    }
  }
}
