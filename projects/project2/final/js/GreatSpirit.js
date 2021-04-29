class GreatSpirit extends Spirit {
  constructor(attributes) {
    super(attributes);
    this.size = 80;
    this.healthBarShift = 20;
    this.type = `greatSpirit`;

    this.meleeTimer = 0;
    this.meleeChargeup = 40;
    this.meleeRange = 90;
    this.meleeDamage = 12;
    this.meleeX = 0;
    this.meleeY = 0;
    this.meleeHit = false;

    this.rangedTimer = 0;
    this.rangedChargeup = 90;
    this.rangedRange = 150;
    this.rangedDamage = 8;

    this.rotateRange = 120;
    this.rotateDamage = 1;
    this.rotateX = [-this.rotateRange, this.rotateRange];
    this.rotateY = [-this.rotateRange, this.rotateRange];
    this.rotateSpeed = 4;
    this.rotateSpin = 0;
    this.rotateSize = 44;

    if (this.mapX === 5 && this.mapY === 5) {
      this.health = 50;
      this.maxHealth = 50;
      this.healthTarget = 50;
    }
  }

  detectPlayer() {
    if (
      this.mapX === player.mapX &&
      this.mapY === player.mapY &&
      player.movable
    )
      if (this.health < this.maxHealth / 2) {
        for (let i = 0; i < this.rotateX.length; i++) {
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
            player.healthTarget -= this.rotateDamage;
            player.iFrames = 3;
            sounds.tick.play();
          }
        }
      }

    this.rotateSpin += this.rotateSpeed;
    if (this.rotateSpin >= 360) {
      this.rotateSpin = 0;
    }

    super.detectPlayer();
  }

  die() {
    greatSpirits--;
    player.maxHealth += 10;
    sounds.shrineDefeated.play();

    sounds.rotateHum.stop();

    if (greatSpirits === 0) {
      finalBossActivated = true;
      this.deathQuotes = [
        `The Phoenix has defeated the Great Ones, but it stands no chance against the Ancient.\nIt lies in wait at the place of the Firebird's birth.`,
      ];
      let finalBoss = new FinalBoss({
        mapX: 5,
        mapY: 5,
        maxHealth: 500,
        health: 500,
        healthTarget: 500,
      });
    } else if (greatSpirits === 1) {
      this.deathQuotes = [`The last Great One stands alone.`];
    } else if (greatSpirits === 2) {
      this.deathQuotes = [
        `Another Great One has fallen. Only ${greatSpirits} remain against the Light.`,
      ];
    } else if (greatSpirits === 3) {
      this.deathQuotes = [
        `Three of the Great Ones remain, guarding their Shrines.`,
      ];
    } else if (greatSpirits === 4) {
      this.deathQuotes = [
        `Great Ones in all four corners of the world beware.\nThe Phoenix is coming.`,
      ];
    }
    super.die();
  }
}
