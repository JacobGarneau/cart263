class Player {
  constructor(attributes) {
    this.x = width / 2; // horizontal position on the screen
    this.y = height / 2 + dyn(32, `y`); // vertical position on the screen
    this.speed = 6;
    this.vx = 0;
    this.vy = 0;
    this.acceleration = 0.1;
    this.dashing = false; // current use of the dash ability
    this.rotation = 270;
    this.mapX = attributes.mapX; // horizontal position on the map tiles
    this.mapY = attributes.mapY; // vertical position on the map tiles
    this.movable = true;
    this.mapMovable = attributes.mapMovable;

    this.abilities = attributes.abilities; // list of all the player's abilities

    this.sunPoints = attributes.sunPoints;
    this.currentSunPoints = attributes.currentSunPoints;
    this.nearShrine = false; // current position of the playr relative to a shrine

    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.maxFrostbite = attributes.maxFrostbite;
    this.frostbite = attributes.frostbite;
    this.frostbiteTarget = attributes.frostbiteTarget;
    this.iFrames = 0; // frames of intangibility, often used to avoid taking the same attack multiple times

    this.currentAction = undefined; // currently activated action
    this.hitlag = 0; // time before you can make another attack
    this.active = 0; // time during which the current action is active
    this.attackSize = 0; // size of the hitbox on an attack
    this.attackX = 0; // horizontal position of the attack hitbox
    this.attackY = 0; // vertical position of the attack hitbox
    this.damage = 0; // damage dealt by the current attack
    this.attackFX; // visual effect of the current attack
    this.justEnded = true; // detects if the game is on the first frame after a move has ended

    let frostbiteLoss = setInterval(() => {
      // player loses Warmth every interval
      if (state === `game` && this.movable) {
        if (this.mapX === 5 && this.mapY === 5 && finalBossActivated) {
          // loses Warmth if the player is on the initial shrine tile and the inal boss has been summoned
          this.frostbiteTarget--;
          if (this.frostbiteTarget < 0) {
            this.frostbiteTarget = 0;
          }
        } else {
          if (
            mapGrid[this.mapX][this.mapY].hasShrine &&
            mapGrid[this.mapX][this.mapY].spiritDefeated
          ) {
            // regain Warmth if the player is on a defeated shrine tile
            this.frostbiteTarget += 5;
            if (this.frostbiteTarget > this.maxFrostbite) {
              // constrain the Warmth gain
              this.frostbiteTarget = this.maxFrostbite;
            }
          } else {
            if (mapGrid[this.mapX][this.mapY].biome === `sea`) {
              // lose more Warmth if the player is on a sea tile
              this.frostbiteTarget -= 2;
              if (this.frostbiteTarget < 0) {
                this.frostbiteTarget = 0;
              }
            } else {
              // lose Warmth if the player is on a plains or mountains tile
              this.frostbiteTarget--;
              if (this.frostbiteTarget < 0) {
                this.frostbiteTarget = 0;
              }
            }
          }
        }
      }
    }, 1000);
  }

  // displays the player
  display() {
    // draws the player's icon
    push();
    fill(255, 0, 0);
    translate(this.x, this.y);
    angleMode(DEGREES);
    rotate(this.rotation);

    // rotate the player according to their current direction
    if (this.rotation === 90) {
      scale(-1, 1);
    }

    imageMode(CENTER);
    image(images.bird, 0, 0);
    pop();
  }

  // moves the player
  move() {
    if (this.movable) {
      // go up
      if (keyIsDown(87)) {
        this.vxTarget = 0;
        this.vyTarget = -this.speed;
        this.rotation = 180;
      }
      // go down
      if (keyIsDown(83)) {
        this.vxTarget = 0;
        this.vyTarget = this.speed;
        this.rotation = 0;
      }
      // go left
      if (keyIsDown(65)) {
        this.vyTarget = 0;
        this.vxTarget = -this.speed;
        this.rotation = 90;
      }
      // go right
      if (keyIsDown(68)) {
        this.vyTarget = 0;
        this.vxTarget = this.speed;
        this.rotation = 270;
      }

      // gradually adjust horizontal speed
      if (this.vxTarget > this.vx) {
        this.vx += this.acceleration;
      } else if (this.vxTarget < this.vx) {
        this.vx -= this.acceleration;
      }
      // gradually adjust vertical speed
      if (this.vyTarget > this.vy) {
        this.vy += this.acceleration;
      } else if (this.vyTarget < this.vy) {
        this.vy -= this.acceleration;
      }

      // move the player
      this.x += this.vx;
      this.y += this.vy;
    }

    // prevent the player from exiting their current map tile if it is the initial shrine tile and the final boss has been summoned
    if (finalBossActivated && this.mapX === 5 && this.mapY === 5) {
      this.mapMovable = false;
    }
  }

  // handles the player's actions and attacks
  handleActions() {
    // tick down the player's hitlag
    if (this.hitlag > 0 && this.movable) {
      this.hitlag--;
    }

    // progressively recharge the player's used abilities
    for (let i = 0; i < player.abilities.attacks.length; i++) {
      if (player.abilities.attacks[i].currentRecharge > 0 && this.movable) {
        player.abilities.attacks[i].currentRecharge--;
      }
    }

    // clear the player's attack data if the attack's duration is up
    if (this.active > 0 && this.movable) {
      this.active--;
    } else {
      this.currentAction = undefined;
      this.attackSize = undefined;
      this.attackX = undefined;
      this.attackY = undefined;
      this.damage = 0;
    }

    if (this.currentAction !== undefined) {
      // set all of the attack's hitboxes' coordinates
      for (let i = 0; i < this.attackX.length; i++) {
        let hitboxX;
        let hitboxY;
        if (this.rotation === 0) {
          hitboxX = this.x + this.attackX[i];
          hitboxY = this.y + this.attackY[i];
        } else if (this.rotation === 90) {
          hitboxX = this.x - this.attackY[i];
          hitboxY = this.y - this.attackX[i];
        } else if (this.rotation === 180) {
          hitboxX = this.x - this.attackX[i];
          hitboxY = this.y - this.attackY[i];
        } else if (this.rotation === 270) {
          hitboxX = this.x + this.attackY[i];
          hitboxY = this.y - this.attackX[i];
        }

        // draw the attack's hitbox icons
        push();
        translate(hitboxX, hitboxY);
        angleMode(DEGREES);
        if (
          this.rotation === 0 ||
          this.rotation === 180 ||
          this.rotation === 270
        ) {
          // rotates the attack's hitbox icon depending on its position around the player
          if (i === 0) {
            rotate(this.rotation);
          } else if (i === 1) {
            rotate(this.rotation + 180);
          }
        } else {
          if (i === 0) {
            rotate(this.rotation + 180);
          } else if (i === 1) {
            rotate(this.rotation);
          }
        }

        if (this.currentAction === `emberNova`) {
          // make ember nova's icon spin on itself
          rotate(this.rotation - this.active);

          setInterval(function () {
            // stop ember nova's sound effect when the attack ends
            sounds.emberNova.stop();
          }, (playerData.attacks.emberNova.activeFrames / 60) * 1000);
        }

        if (i !== 2) {
          imageMode(CENTER);
          image(this.attackFX, 0, 0, this.attackSize[i], this.attackSize[i]);
        }
        pop();

        for (let j = 0; j < entities.length; j++) {
          // deal damage to entities that enter the current attack's hitbox
          if (
            dist(hitboxX, hitboxY, entities[j].x, entities[j].y) <=
              this.attackSize[i] / 2 + entities[j].size / 2 &&
            this.mapX === entities[j].mapX &&
            this.mapY === entities[j].mapY
          ) {
            if (this.currentAction === `emberNova`) {
              // give reduced invincibility frames if the attack is ember nova to cause repeating damage
              entities[j].takeDamage(this.damage, 2);
            } else {
              entities[j].takeDamage(this.damage, this.active);
            }
          }
        }
      }
    }
  }

  // performs attacks
  attack(attack) {
    // checks if player is still in hitlag, can move, and has enough Warmth left in their gauge
    if (
      this.hitlag === 0 &&
      this.movable &&
      this.frostbite >= attack.frostbite
    ) {
      // set the player's attack attributes to correspond to those of the inputted attack
      for (let i = 0; i < this.abilities.attacks.length; i++) {
        if (
          this.abilities.attacks[i].name === attack.name &&
          this.abilities.attacks[i].currentRecharge === 0
        ) {
          this.currentAction = attack.name;
          this.active = attack.activeFrames;
          this.hitlag = attack.hitlag;
          this.attackSize = attack.size;
          this.damage = attack.damage;
          this.abilities.attacks[i].currentRecharge = attack.recharge;

          // spends Warmth if the attack had a Warmth cost
          this.frostbiteTarget -= attack.frostbite;
          this.frostbiteTarget = constrain(
            this.frostbiteTarget,
            0,
            this.maxFrostbite
          );

          // plays the attack's sound effect
          sfx[attack.sfx].play();

          if (this.currentAction === `fireBreath`) {
            // if the attack is flame breath, creates a fireball instead of setting hiboxes
            this.attackX = [];
            this.attackY = [];

            // creates the fireball and adds it to the projectile array
            let fireball = new Fireball(this.rotation);
            projectiles.push(fireball);
          } else {
            // sets the attack's hitbox's size and position
            this.attackX = attack.posX;
            this.attackY = attack.posY;
            this.attackSize = attack.size;
            this.attackFX = attackFX[attack.attackFX];
          }
        }
      }
    }
  }

  // handles the dash ability
  dash() {
    if (this.abilities.dash && !this.dashing) {
      // if the player is not already dashing and has the dash ability, give them a speed boost in the direction they are currently moving
      sounds.dash.play();
      let speedFactor = 1.5;
      this.dashing = true;
      if (this.rotation === 0) {
        this.speed *= speedFactor;
        this.vy = this.speed;
      } else if (this.rotation === 90) {
        this.speed *= speedFactor;
        this.vx = -this.speed;
      } else if (this.rotation === 180) {
        this.speed *= speedFactor;
        this.vy = -this.speed;
      } else if (this.rotation === 270) {
        this.speed *= speedFactor;
        this.vx = this.speed;
      }

      setTimeout(function () {
        // after the timeout, stop the player's speed boost and bring their movement stats back to normal
        setTimeout(function () {
          // recharge the player's dash ability
          player.dashing = false;
        }, 2000);
        player.speed /= speedFactor;
      }, 500);
    }
  }

  // updates the player's health and other stats
  updateStats() {
    // ticks down intangibility frames
    this.iFrames--;

    // adjusts health according to current target
    if (this.health < this.healthTarget) {
      this.health++;
    } else if (this.health > this.healthTarget) {
      this.health--;
    }

    // adjusts Warmth according to current target
    if (this.frostbite < this.frostbiteTarget) {
      this.frostbite++;
    } else if (this.frostbite > this.frostbiteTarget) {
      this.frostbite--;
    }

    // if health reaches zero, moves on to the death screen
    if (this.health <= 0) {
      state = `dead`;
      this.movable = false;
      sounds.death.play();

      // if the Warmth gauge was empty at the moment of death, erases the current save data
      if (this.frostbite <= 0) {
        resetGame();
      }
    }
  }
}
