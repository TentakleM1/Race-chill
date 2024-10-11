class NPC extends Character {
  constructor() {
    super();
    this.data = {
      id: Date.now(),
      type: this.skin(),
      position: {
        x: Math.floor(Math.random() * 4),
        y: -1,
      },
    };
  }

  skin() {
    const index = Math.floor(Math.random() * 4);
    const skins = ["police", "interference", "car", "kamaz"];

    return skins[index];
  }

}
