class GreatSpirit extends Spirit {
  constructor(attributes) {
    super(attributes);
    this.size = 80;
    this.healthBarShift = 20;
    this.deathQuotes = [
      `Another Great One has fallen. Only ${
        greatSpirits - 1
      } remain against the Light.`,
    ];
  }

  die() {
    greatSpirits--;

    if (greatSpirits === 0) {
      this.deathQuotes = [
        `The Phoenix has defeated the Ancients. But it stands not chance against the Protector.`,
      ];
    }
    super.die();
  }
}
