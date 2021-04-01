class Game extends Entity {
  constructor() {
    super();
    this.health = 16;
    this.staminaGain = 15;

    entities.push(this);
  }
}
