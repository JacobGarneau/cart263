class Player {
  constructor() {
    this.x = width / 2; // horizontal position on the screen
    this.y = height / 2; // vertical position on the screen
    this.speed = 6;
    this.vx = 0;
    this.vy = -this.speed;
    this.acceleration = 0.1;
    this.rotation = 180;
    this.mapX = 5; // horizontal position on the map tiles
    this.mapY = 5; // vertical position on the map tiles
    this.movable = true;

    this.abilities = {
      attacks: [playerData.attacks.peck],
      minimap: false,
    };

    this.sunPoints = 500;
    this.currentSunPoints = 500;
    this.nearShrine = false;

    this.maxHealth = playerData.stats.health;
    this.health = this.maxHealth;
    this.healthTarget = this.health;
    this.maxFrostbite = playerData.stats.frostbite;
    this.frostbite = this.maxFrostbite;
    this.frostbiteTarget = this.frostbite;

    this.currentAction = undefined; // currently activated action
    this.hitlag = 0; // time before you can make another attack
    this.active = 0; // time during which the current action is active
    this.attackSize = 0; // size of the hitbox on an attack
    this.attackX = 0; // horizontal position of the attack hitbox
    this.attackY = 0; // vertical position of the attack hitbox
    this.damage = 0;
    this.attackFX;

    let frostbiteLoss = setInterval(() => {
      if (this.movable) {
        this.frostbiteTarget--;
        if (this.frostbiteTarget < 0) {
          this.frostbiteTarget = 0;
        }
      }
    }, 3500);
  }

  // display the player icon
  display() {
    push();
    fill(255, 0, 0);
    translate(this.x, this.y);
    angleMode(DEGREES);
    rotate(this.rotation);

    if (this.rotation === 90) {
      scale(-1, 1);
    }

    imageMode(CENTER);
    image(images.bird, 0, 0);
    pop();
  }

  // move the player
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
  }

  // handle the player's actions and attacks
  handleActions() {
    if (this.hitlag > 0 && this.movable) {
      this.hitlag--;
    }

    for (let i = 0; i < player.abilities.attacks.length; i++) {
      if (player.abilities.attacks[i].currentRecharge > 0 && this.movable) {
        player.abilities.attacks[i].currentRecharge--;
      }
    }

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
      push();
      fill(255, 255, 0);
      translate(this.x, this.y);
      angleMode(DEGREES);
      rotate(this.rotation);
      // ellipse(this.attackX[0], this.attackY[0], this.attackSize[0]);
      pop();

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
        // ellipse(hitboxX, hitboxY, this.attackSize[i]); // display the peck attack's hitbox

        push();
        translate(hitboxX, hitboxY);
        angleMode(DEGREES);
        if (i === 0) {
          rotate(this.rotation);
        } else if (i === 1) {
          rotate(this.rotation + 180);
        }
        imageMode(CENTER);
        image(this.attackFX, 0, 0, this.attackSize[i], this.attackSize[i]);
        pop();

        for (let j = 0; j < entities.length; j++) {
          if (
            dist(hitboxX, hitboxY, entities[j].x, entities[j].y) <=
              this.attackSize[i] / 2 + entities[j].size / 2 &&
            this.mapX === entities[j].mapX &&
            this.mapY === entities[j].mapY
          ) {
            entities[j].takeDamage(this.damage, this.active);
          }
        }
      }
    }
  }

  // perform attacks
  attack(attack) {
    if (this.hitlag === 0 && this.movable) {
      for (let i = 0; i < player.abilities.attacks.length; i++) {
        if (
          player.abilities.attacks[i].name === attack.name &&
          player.abilities.attacks[i].currentRecharge === 0
        ) {
          this.currentAction = attack.name;
          this.active = attack.activeFrames;
          this.hitlag = attack.hitlag;
          this.attackSize = attack.size;
          this.damage = attack.damage;

          this.frostbiteTarget -= attack.frostbite;
          this.frostbiteTarget = constrain(
            this.frostbiteTarget,
            0,
            this.maxFrostbite
          );

          if (this.currentAction === `fireBreath`) {
            this.attackX = [];
            this.attackY = [];

            let fireball = new Projectile(this.rotation);
            projectiles.push(fireball);
          } else {
            this.attackX = attack.posX;
            this.attackY = attack.posY;
            this.attackSize = attack.size;
            this.attackFX = attackFX[attack.attackFX];

            player.abilities.attacks[i].currentRecharge = attack.recharge;
          }
        }
      }
    }
  }

  updateStats() {
    if (this.health < this.healthTarget) {
      this.health++;
    } else if (this.health > this.healthTarget) {
      this.health--;
    }

    if (this.frostbite < this.frostbiteTarget) {
      this.frostbite++;
    } else if (this.frostbite > this.frostbiteTarget) {
      this.frostbite--;
    }
  }
}
