class Player extends Character {
  speed = 200;

  constructor() {
    super();
    this.data = {
      type: "player",
      color: "red",
      position: {
        x: 1,
        y: 6,
      },
      xRoad: [],
      left: 0,
      right: 3
    };
    this.eventControll = this.controll.bind(this);

  }

  checkXRoad() {
    
    this.data.xRoad.forEach((road, index) => {
      if(road.type !== "none") { 
        if(index === 0) {
          this.data.left = 0;
        } 
        
        if(index === 3) {
          this.data.right = 3;
        }
      }

      if(road.type === "none") { 
        if(index === 0) {
          this.data.left = 1;
        } 
        
        if(index === 3) {
          this.data.right = 2;
        }
      }
    })

  }

  controll(e) {
    const key = e.code;

    this.checkXRoad();

    switch(key) {
      case "ArrowRight": {
        if(this.data.position.x === this.data.right) { break; }
        this.data.position.x = this.data.position.x + 1;
        break;
      }

      case "ArrowLeft": {
        if(this.data.position.x === this.data.left) { break; }
        this.data.position.x = this.data.position.x - 1;
        break;
      }

      case "ArrowUp": {
        if(this.data.position.y === 1) { break; }
        this.data.position.y = this.data.position.y - 1;
        break;
      }

      case "ArrowDown": {
        if(this.data.position.y === 7) { break; }
        this.data.position.y = this.data.position.y + 1;
        break;
      }
      case "Space": {
        if(this.speed === 50) { break; }
        this.speed = this.speed -10
      }
    }
  }

  get speed() {
    return this.speed;
  }
  set speed(speed) {
    this.speed = speed;
  } 

  removeEvent() {
    window.removeEventListener("keydown", this.eventControll);
  }

  addEvent() {
    window.addEventListener("keydown", this.eventControll);
  }
}
