class Game extends Entity {
  constructor() {
    super();
    this.maxHealth = 15;
    this.health = this.maxHealth;
    this.healthTarget = this.health;
    this.healthGain = 15;

    entities.push(this);
  }
}
