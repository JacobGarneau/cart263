class FinalBoss extends Spirit {
  constructor(attributes) {
    super(attributes);
    this.maxHealth = attributes.maxHealth;
    this.health = attributes.health;
    this.healthTarget = attributes.healthTarget;
    this.mapX = attributes.mapX;
    this.mapY = attributes.mapY;
    this.type = `finalBoss`;

    this.size = 120;
    this.healthBarShift = 40;
    this.deathQuotes = [
      `The cold has been defeated. The Phoenix has reclaimed the Arctic.`,
    ];

    this.maxSpeed = 1;

    this.meleeTimer = 0;
    this.meleeChargeup = 30;
    this.meleeRange = 60;
    this.meleeDamage = 20;

    this.rangedTimer = 0;
    this.rangedChargeup = 120;
    this.rangedRange = 180;
    this.rangedDamage = 12;

    this.rotateRange = 100;
    this.rotateDamage = 1;
    this.rotateX = [
      -this.rotateRange,
      this.rotateRange,
      -this.rotateRange,
      this.rotateRange,
    ];
    this.rotateY = [
      -this.rotateRange,
      this.rotateRange,
      this.rotateRange,
      -this.rotateRange,
    ];
    this.rotateSpeed = 2;
    this.rotateSpin = 0;
    this.rotateSize = 40;

    this.summonTimer = 0;
    this.summonChargeup = 180;
    this.summonRange = 280;
    this.summonCooldown = 1200;
    this.currentCooldown = this.summonCooldown;
  }

  detectPlayer() {
    if (player.mapX === this.mapX && player.mapY === this.mapY) {
      let d = dist(this.x, this.y + 20, player.x, player.y);

      push();
      noFill();
      strokeWeight(6);
      stroke(0, 0, 255, 100);
      ellipse(this.x, this.y + 20, this.summonRange * 2);
      pop();

      if (this.health < this.maxHealth / 2) {
        push();
        noFill();
        strokeWeight(6);
        stroke(255, 0, 255, 100);
        rectMode(CENTER);
        // rect(this.x, this.y + 20, this.rotateRange * 2, this.rotateRange * 2);
        pop();

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
          if (
            d < this.rotateSize / 2 &&
            this.mapX === player.mapX &&
            this.mapY === player.mapY
          ) {
            player.healthTarget -= this.rotateDamage;
          }
        }
      }

      this.rotateSpin += this.rotateSpeed;
      if (this.rotateSpin >= 360) {
        this.rotateSpin = 0;
      }

      if (d > this.summonRange) {
        this.summonTimer++;

        if (
          this.summonTimer >= this.summonChargeup &&
          this.currentCooldown <= 0
        ) {
          this.attackSummon();
          this.currentCooldown = this.summonCooldown;
          this.summonTimer = 0;
        }
      } else {
        this.currentCooldown = 0;
      }
    }

    this.currentCooldown--;

    super.detectPlayer();
  }

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
  }
}
