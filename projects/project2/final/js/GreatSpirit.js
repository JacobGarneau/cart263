class GreatSpirit extends Spirit {
  constructor(attributes) {
    super(attributes);
    this.size = 80;
    this.healthBarShift = 20; // vertical displacement of the health bar
    this.type = `greatSpirit`;

    // stats for the spirit's melee attack
    this.meleeTimer = 0;
    this.meleeChargeup = 40; // time the player has to spend in the attack's range for it to trigger
    this.meleeRange = 90; // range of the attack
    this.meleeDamage = 12;
    this.meleeX = 0;
    this.meleeY = 0;
    this.meleeHit = false;

    // stats for the spirit's ranged attack
    this.rangedTimer = 0;
    this.rangedChargeup = 90; // time the player has to spend in the attack's range for it to trigger
    this.rangedRange = 150; // range of the attack
    this.rangedDamage = 8;

    // stats for the spirit's rotating attack
    this.rotateRange = 120; // range of the attack
    this.rotateDamage = 1;
    this.rotateX = [-this.rotateRange, this.rotateRange]; // horizontal position of each iteration of the attack
    this.rotateY = [-this.rotateRange, this.rotateRange]; // vertical position of each iteration of the attack
    this.rotateSpeed = 4;
    this.rotateSpin = 0;
    this.rotateSize = 44;

    // lower health if this spirit is the first one the player encounters at the first shrine
    if (this.mapX === 5 && this.mapY === 5) {
      this.health = 50;
      this.maxHealth = 50;
      this.healthTarget = 50;
    }
  }

  // check the player's position for attacks
  detectPlayer() {
    if (
      this.mapX === player.mapX &&
      this.mapY === player.mapY &&
      player.movable
    )
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
          if (d < this.rotateSize / 2 && player.iFrames <= 0) {
            // deal repeated damage to the player if they stand in the rotating attack's hitbox
            player.healthTarget -= this.rotateDamage;
            player.iFrames = 3;
            sounds.tick.play();
          }
        }
      }

    // spin the rotating attack on itself
    this.rotateSpin += this.rotateSpeed;
    if (this.rotateSpin >= 360) {
      this.rotateSpin = 0;
    }

    super.detectPlayer();
  }

  // kills the spirit
  die() {
    greatSpirits--;

    // increase the player's maximum health
    player.maxHealth += 10;
    sounds.shrineDefeated.play();
    sounds.rotateHum.stop();

    if (greatSpirits === 0) {
      // if this was the last great spirit, summon the final boss
      finalBossActivated = true;
      // change the death quote to announce the final boss
      this.deathQuotes = [
        `The Phoenix has defeated the Great Ones, but it stands no chance against the Ancient.\nIt lies in wait at the place of the Firebird's birth.`,
      ];
      // summon the final boss
      let finalBoss = new FinalBoss({
        mapX: 5,
        mapY: 5,
        maxHealth: 500,
        health: 500,
        healthTarget: 500,
      });
    } else if (greatSpirits === 1) {
      // change the death quote to adapt to the number of remaining great spirits
      this.deathQuotes = [`The last Great One stands alone.`];
    } else if (greatSpirits === 2) {
      // change the death quote to adapt to the number of remaining great spirits
      this.deathQuotes = [
        `Another Great One has fallen. Only ${greatSpirits} remain against the Light.`,
      ];
    } else if (greatSpirits === 3) {
      // change the death quote to adapt to the number of remaining great spirits
      this.deathQuotes = [
        `Three of the Great Ones remain, guarding their Shrines.`,
      ];
    } else if (greatSpirits === 4) {
      // change the death quote to adapt to the number of remaining great spirits
      this.deathQuotes = [
        `Great Ones in all four corners of the world beware.\nThe Phoenix is coming.`,
      ];
    }
    super.die();
  }
}
