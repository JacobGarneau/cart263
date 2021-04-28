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
  }
}
