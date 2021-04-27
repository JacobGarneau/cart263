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
    text(player.currentSunPoints, 60, 88);
    pop();
  }

  drawAbilities() {
    // draw abilities
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      if (player.abilities.attacks[i].upgrade) {
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

      if (player.abilities.attacks[i].upgrade) {
        image(
          images.upgrade,
          this.abilities.x + 36,
          this.abilities.y -
            i * (this.abilities.size + this.abilities.spacing) -
            36
        );
      }

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
    text(`ABILITIES`, width / 2, dyn(160, `y`));
    pop();

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

    // draw the ability icons
    for (let i = 0; i < abilityData.abilities.length; i++) {
      push();
      if (abilityData.abilities[i].hover) {
        stroke(255);
        strokeWeight(6);
      } else {
        noStroke();
      }

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

  buyAbility(ability) {
    if (ability.status === `unlockable`) {
      if (player.currentSunPoints >= ability.cost) {
        player.currentSunPoints -= ability.cost;
        ability.status = `unlocked`;

        for (let i = 0; i < ability.unlocks.length; i++) {
          for (let j = 0; j < abilityData.abilities.length; j++) {
            if (
              ability.unlocks[i] === abilityData.abilities[j].name &&
              abilityData.abilities[j].status === `locked`
            ) {
              abilityData.abilities[j].status = `unlockable`;
            }
          }
        }

        if (ability.name === `minimap`) {
          player.abilities.minimap = true;
        } else if (ability.name === `minimap2`) {
          player.abilities.minimap2 = true;
        } else if (ability.name === `wingAttack`) {
          player.abilities.attacks.push(playerData.attacks.wingAttack);
        } else if (ability.name === `fireBreath`) {
          player.abilities.attacks.push(playerData.attacks.fireBreath);
        } else if (ability.name === `emberNova`) {
          player.abilities.attacks.push(playerData.attacks.emberNova);
        } else if (ability.name === `improvedPeck`) {
          player.abilities.attacks.splice(
            player.abilities.attacks.indexOf(playerData.attacks.peck),
            1,
            playerData.attacks.improvedPeck
          );
        } else if (ability.name === `improvedWingAttack`) {
          player.abilities.attacks.splice(
            player.abilities.attacks.indexOf(playerData.attacks.wingAttack),
            1,
            playerData.attacks.improvedWingAttack
          );
        } else if (ability.name === `improvedFireBreath`) {
          player.abilities.attacks.splice(
            player.abilities.attacks.indexOf(playerData.attacks.fireBreath),
            1,
            playerData.attacks.improvedFireBreath
          );
        }
      } else {
        alert("Not enough Sun Points");
      }
    } else if (ability.status === `locked`) {
      alert("Lacking prerequisites");
    }
  }
}
