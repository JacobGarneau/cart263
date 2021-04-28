class GreatSpirit extends Spirit {
  constructor(attributes) {
    super(attributes);
    this.size = 80;
    this.healthBarShift = 20;
    this.type = `greatSpirit`;
    this.deathQuotes = [
      `Another Great One has fallen. Only ${
        greatSpirits - 1
      } remain against the Light.`,
    ];

    this.meleeTimer = 0;
    this.meleeChargeup = 30;
    this.meleeRange = 90;
    this.meleeDamage = 20;

    this.rangedTimer = 0;
    this.rangedChargeup = 120;
    this.rangedRange = 240;
    this.rangedDamage = 12;

    this.rotateRange = 120;
    this.rotateDamage = 4;
    this.rotateX = [-this.rotateRange, this.rotateRange];
    this.rotateY = [-this.rotateRange, this.rotateRange];
    this.rotateSpeed = 2;
    this.rotateSpin = 0;
    this.rotateSize = 44;
  }

  detectPlayer() {
    if (this.mapX === player.mapX && this.mapY === player.mapY)
      if (this.health > this.maxHealth / 2) {
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
            player.iFrames = 10;
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

    if (greatSpirits === 0) {
      this.deathQuotes = [
        `The Phoenix has defeated the Ancients. But it stands not chance against the Protector.`,
      ];
      let finalBoss = new FinalBoss({
        mapX: 5,
        mapY: 5,
        maxHealth: 420,
        health: 420,
        healthTarget: 420,
      });
    }
    super.die();
  }
}
