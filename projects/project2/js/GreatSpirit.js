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
    this.meleeRange = 60;
    this.meleeDamage = 20;

    this.rangedTimer = 0;
    this.rangedChargeup = 120;
    this.rangedRange = 180;
    this.rangedDamage = 12;
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
