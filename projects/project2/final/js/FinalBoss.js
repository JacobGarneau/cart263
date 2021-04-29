class FinalBoss extends Spirit {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.mapX = attributes.mapX;
    this.mapY = attributes.mapY;
    this.type = `finalBoss`;
    this.deathQuotes = [``]; // quotes that popup when the spirit is defeated

    this.size = 120;
    this.healthBarShift = 40; // vertical displacement of the health bar

    this.maxSpeed = 1;

    // stats for the spirit's melee attack
    this.meleeTimer = 0;
    this.meleeChargeup = 30; // time the player has to spend in the attack's range for it to trigger
    this.meleeRange = 60; // range of the attack
    this.meleeDamage = 12;
    this.meleeX = 0;
    this.meleeY = 0;
    this.meleeHit = false;

    // stats for the spirit's ranged attack
    this.rangedTimer = 0;
    this.rangedChargeup = 90; // time the player has to spend in the attack's range for it to trigger
    this.rangedRange = 120; // range of the attack
    this.rangedDamage = 8;

    // stats for the spirit's rotating attack
    this.rotateRange = 100; // range of the attack
    this.rotateDamage = 1;
    this.rotateX = [
      -this.rotateRange,
      this.rotateRange,
      -this.rotateRange,
      this.rotateRange,
    ]; // horizontal position of each iteration of the attack
    this.rotateY = [
      -this.rotateRange,
      this.rotateRange,
      this.rotateRange,
      -this.rotateRange,
    ]; // vertical position of each iteration of the attack
    this.rotateSpeed = 2;
    this.rotateSpin = 0;
    this.rotateSize = 44;

    // stats for the spirit's summon attack
    this.summonTimer = 0;
    this.summonChargeup = 120; // time the player has to spend in the attack's range for it to trigger
    this.summonRange = 240; // range of the attack
    this.summonCooldown = 600; // minimum time between each occurrence of this attack
    this.currentCooldown = this.summonCooldown;
  }

  // check the player's position for attacks
  detectPlayer() {
    if (
      player.mapX === this.mapX &&
      player.mapY === this.mapY &&
      player.movable
    ) {
      let d = dist(this.x, this.y + 20, player.x, player.y);

      // draw the range of the summon attack in blue
      push();
      noFill();
      strokeWeight(6);
      stroke(0, 0, 255, 100);
      ellipse(this.x, this.y + 20, this.summonRange * 2);
      pop();

      if (this.health < this.maxHealth / 2) {
        // trigger the rotating attack if the spirit's health is lower than half its maximum
        for (let i = 0; i < this.rotateX.length; i++) {
          // move the rotating attak around the spirit in a square pattern
          if (
            this.rotateX[i] < this.rotateRange &&
            this.rotateY[i] === -this.rotateRange
          ) {
            this.rotateX[i] += this.rotateSpeed;
          } else if (
            this.rotateX[i] === this.rotateRange &&
            this.rotateY[i] < this.rotateRange
          ) {
            this.rotateY[i] += this.rotateSpeed;
          } else if (
            this.rotateY[i] === this.rotateRange &&
            this.rotateX[i] > -this.rotateRange
          ) {
            this.rotateX[i] -= this.rotateSpeed;
          } else if (
            this.rotateY[i] > -this.rotateRange &&
            this.rotateX[i] === -this.rotateRange
          ) {
            this.rotateY[i] -= this.rotateSpeed;
          }
          this.rotateY[i] = constrain(
            this.rotateY[i],
            -this.rotateRange,
            this.rotateRange
          );
          this.rotateX[i] = constrain(
            this.rotateX[i],
            -this.rotateRange,
            this.rotateRange
          );

          // draw the rotating attack
          push();
          translate(this.x + this.rotateX[i], this.y + this.rotateY[i] + 20);
          angleMode(DEGREES);
          rotate(this.rotateSpin);
          imageMode(CENTER);
          image(images.nova3, 0, 0, this.rotateSize, this.rotateSize);
          pop();

          let d = dist(
            this.x + this.rotateX[i],
            this.y + this.rotateY[i] + 20,
            player.x,
            player.y
          );
          if (d < this.rotateSize && player.iFrames <= 0) {
            // deal repeated damage to the player if they stand in the rotating attack's hitbox
            player.healthTarget -= this.rotateDamage;
            player.iFrames = 2;
            sounds.tick.play();
          }
        }
      }

      // spin the rotating attack on itself
      this.rotateSpin += this.rotateSpeed;
      if (this.rotateSpin >= 360) {
        this.rotateSpin = 0;
      }

      // handle the summon attack
      if (d > this.summonRange) {
        this.summonTimer++;

        if (
          this.summonTimer >= this.summonChargeup &&
          this.currentCooldown <= 0
        ) {
          // if the player is outside the summon attack's range for too long, summon a new spirit
          this.attackSummon();
          this.currentCooldown = this.summonCooldown;
          this.summonTimer = 0;
        }
      } else {
        this.summonTimer = 0;
      }
    }

    this.currentCooldown--;

    super.detectPlayer();
  }

  // summons a new spirit
  attackSummon() {
    let minion = new Spirit({
      mapX: this.mapX,
      mapY: this.mapY,
      maxHealth: 50,
      health: 50,
      healthTarget: 50,
    });
    minion.x = this.x;
    minion.y = this.y;
    sounds.summon.play();
  }

  // kills the spirit
  die() {
    finalBossActivated = false;
    sounds.shrineDefeated.play();
    sounds.rotateHum.stop();

    // resets the game data and moves on to victory screen
    state = `victory`;
    resetGame();

    super.die();
  }
}
