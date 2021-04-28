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
