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

    this.maxHealth = playerData.stats.health;
    this.health = this.maxHealth;
    this.healthTarget = this.health;
    this.maxFrostbite = playerData.stats.frostbite;
    this.frostbite = this.maxFrostbite;
    this.frostbiteTarget = this.frostbite;
    this.maxStamina = playerData.stats.stamina;
    this.stamina = this.maxStamina;
    this.staminaTarget = this.stamina;

    this.currentAction = undefined; // currently activated action
    this.hitlag = 0; // time before you can make another attack
    this.active = 0; // time during which the current action is active
    this.attackSize = 0; // size of the hitbox on an attack
    this.attackX = 0; // horizontal position of the attack hitbox
    this.attackY = 0; // vertical position of the attack hitbox

    let staminaLoss = setInterval(() => {
      this.staminaTarget--;
      if (this.staminaTarget < 0) {
        this.staminaTarget = 0;
      }
    }, 2000);

    let frostbiteLoss = setInterval(() => {
      this.frostbiteTarget--;
      if (this.frostbiteTarget < 0) {
        this.frostbiteTarget = 0;
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
    triangle(0, 24, 24, -16, -24, -16);
    triangle(0, 24, 12, 4, -12, 4);
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

  // handle the player's actions and attacks
  handleActions() {
    if (this.hitlag > 0) {
      this.hitlag--;
    }

    if (this.active > 0) {
      this.active--;
    } else {
      this.currentAction = undefined;
      this.attackSize = undefined;
    }

    if (this.currentAction === `peck`) {
      push();
      fill(255, 255, 0);
      translate(this.x, this.y);
      angleMode(DEGREES);
      rotate(this.rotation);
      ellipse(0, 32, this.attackSize);
      pop();
    }
  }

  // perform attacks
  attack(attack) {
    if (this.hitlag === 0) {
      this.currentAction = attack.name;
      this.active = attack.activeFrames;
      this.attackX = attack.posX;
      this.attackY = attack.posY;
      this.attackSize = attack.size;
      this.hitlag = attack.hitlag;

      this.staminaTarget -= attack.stamina;
      if (this.staminaTarget < 0) {
        this.staminaTarget = 0;
      }

      console.log(this.staminaTarget);

      this.frostbiteTarget -= attack.frostbite;
      if (this.frostbiteTarget < 0) {
        this.frostbiteTarget = 0;
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

    if (this.stamina < this.staminaTarget) {
      this.stamina++;
    } else if (this.stamina > this.staminaTarget) {
      this.stamina--;
    }
  }
}
