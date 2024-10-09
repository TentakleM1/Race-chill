class NPC extends Character {
  constructor() {
    super();
    this.data = {
      id: Date.now(),
      type: 'kamaz',
      position: {
        x: Math.floor(Math.random() * 4),
        y: -1,
      },
      double: true
    };
  }

  skin() {
    const index = Math.floor(Math.random() * 3);
    const skins = ["police", "interference", "car"];

    return skins[index];
  }

  getXPosition() {
    return this.xPosition;
  }

  getId() {
    return this.id;
  }
}
