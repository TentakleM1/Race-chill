class Core {
  map = [
    [{ type: "nope" }, { type: "nope" }, { type: "nope" }, { type: "nope" }],
    [{ type: "nope" }, { type: "nope" }, { type: "nope" }, { type: "nope" }],
    [{ type: "nope" }, { type: "nope" }, { type: "nope" }, { type: "nope" }],
    [{ type: "nope" }, { type: "nope" }, { type: "nope" }, { type: "nope" }],
    [{ type: "nope" }, { type: "nope" }, { type: "nope" }, { type: "nope" }],
    [{ type: "nope" }, { type: "nope" }, { type: "nope" }, { type: "nope" }],
    [
      { type: "nope" },
      { type: "player", color: "red", position: { x: 1, y: 5 } },
      { type: "nope" },
      { type: "nope" },
    ],
    [{ type: "nope" }, { type: "nope" }, { type: "nope" }, { type: "nope" }],
  ];

  constructor() {
    this.game = document.getElementById("game");
    this.start = document.getElementById("start");
    this.title = document.getElementById("title");
    this.scoreElement = document.getElementById("score");
    this.record = document.getElementById("record");
    this.background = document.getElementById("background");
    this.levelElement = document.getElementById("level");

    this.endgame = false;

    this.rerender = this.update.bind(this);
    this.loopTemp = this.temp.bind(this);
    this.respawn = this.spawn.bind(this);

    this.player = new Player();
    this.npc = [];

    this.score = 0;
    this.speed = 200;
    this.speedBackgorund = 3;
    this.speedSpawn = 700;
    this.level = 1

    this.checkUpdate;
    this.checkEvent = [];
  }

  initRender() {
    this.draw();
    this.checkRecord();
  }

  initialGame() {
    this.endgame = true;

    this.scoreElement.innerHTML = this.score;

    this.checkAndRemoveListenEvent();

    this.player.addEvent();

    this.checkEvent.push(setInterval(this.respawn, this.speedSpawn));

    this.checkEvent.push(setInterval(this.changeRoad.bind(this), 5000));

    this.checkEvent.push(setInterval(this.loopTemp, this.speed));

    this.update();
  }

  scoreCount() {
    if (localStorage.getItem("recordRaceChill") <= this.score) {
      this.record.innerHTML = this.score;
    }
    this.scoreElement.innerHTML = this.score;
    this.score = this.score + 1;
    this.checkScore();
  }

  checkScore() {
    const RemainderOfDivisionTeen = this.score % 10;
    if (RemainderOfDivisionTeen) {
      return;
    }
    this.player.speed = this.speed - 10;
  }

  checkAndRemoveListenEvent() {
    if (this.checkEvent.length && this.checkUpdate) {
      this.player.removeEvent();

      this.checkEvent.forEach((eventTime) => {
        clearInterval(eventTime);
      });

      this.checkEvent = [];

      cancelAnimationFrame(this.checkUpdate);
    }
  }

  spawn() {
    if (this.npc.length < 4) {
      const newNpc = new NPC();

      const data = newNpc.data;

      const checkRoad = this.map[data.position.y + 1][data.position.x];

      if (checkRoad.type === "block" || checkRoad.type === "none") {
        return;
      }

      this.npc.push(data.id);

      this.map[data.position.y + 1][data.position.x] = data;
    }
  }

  temp() {
    this.map.flat().forEach((car) => {
      if (car.id) {
        if (car.position.y !== 8) {
          car.position.y = car.position.y + 1;
        }
      }

      if (car.type === "block") {
        if (car.position.y !== 8) {
          car.position.y = car.position.y + 1;
        }
      }

      if (car.type === "road") {
        if (car.position.y !== 8) {
          car.position.y = car.position.y + 1;
        }
      }
    });
  }

  changeRoad() {
    const leftOrRight = Math.floor(Math.random() * 2);

    if (leftOrRight === 0) {
      const road = this.map[0][0];

      if (road.type !== "none") {
        return (this.map[0][0] = { type: "block", position: { x: 0, y: -1 } });
      }
      return (this.map[0][0] = { type: "road", position: { x: 0, y: -1 } });
    }

    if (leftOrRight === 1) {
      const road = this.map[0][3];
      this.npc.shift();
      if (road.type !== "none") {
        return (this.map[0][3] = { type: "block", position: { x: 3, y: -1 } });
      }
      return (this.map[0][3] = { type: "road", position: { x: 3, y: -1 } });
    }
  }

  moveAndCheckCrash(element, col, row) {
    const { id, type } = element;
    if (type === "player") {
      const data = this.player.data;
      const { position } = data;

      this.map[col][row] = { type: "nope" };

      const road = this.map[position.y][position.x];

      if (road.id || road.type === "kamaz-front") {
        return this.endGame();
      }

      this.player.data.xRoad = this.map[position.y];
      return (this.map[position.y][position.x] = data);
    }

    if (id) {
      const car = element;

      if (car.position.y !== -1) {
        if (car.type === "kamaz") {
          this.map[col][row] = { type: "kamaz-front" };
          if (col > 1) {
            this.map[col - 2][row] = { type: "nope" };
          }

          if (car.position.y !== 8) {
            const player = this.map[car.position.y][car.position.x];

            if (player.type === "player") {
              return this.endGame();
            }

            return (this.map[car.position.y][car.position.x] = car);
          } 
            this.map[col][row] = { type: "kamaz-front" };
            this.map[col - 1][row] = { type: "nope" };
            setTimeout(() => {
              this.map[col][row] = { type: "nope" };
            }, this.speed);
            this.scoreCount();
            return this.npc.shift();
        }

        this.map[col][row] = { type: "nope" };

        if (car.position.y !== 8) {
          const player = this.map[car.position.y][car.position.x];

          if (player.type === "player") {
            return this.endGame();
          }

          return (this.map[car.position.y][car.position.x] = car);
        }
          this.scoreCount();

          return this.npc.shift();
      }
    }

    if (type === "block") {
      const block = element;
      if (block.position.y !== -1) {
        this.map[col][row] = { type: "none" };

        if (block.position.y !== 8) {
          const player = this.map[block.position.y][block.position.x];

          if (player.type === "player") {
            return this.endGame();
          }

          this.map[block.position.y][block.position.x] = block;
        }
      }
    }

    if (type === "road") {
      const road = element;
      if (road.position.y !== -1) {
        this.map[col][row] = { type: "nope" };

        if (road.position.y !== 8) {
          this.map[road.position.y][road.position.x] = road;
        }
      }
    }
  }

  checkMap() {
    for (let row = 0; row < this.map[0].length; row++) {
      for (let col = 0; col < this.map.length; col++) {
        const element = this.map[col][row];
        this.moveAndCheckCrash(element, col, row);
      }
    }
  }

  levelUp(speed) {
    this.endgame = false;
    this.speed = speed;
    this.level = this.level + 1;
    this.levelElement.innerHTML = this.level;
    if(this.speedBackgorund > 1) {
      this.speedBackgorund = this.speedBackgorund - 0.5;
      this.background.style.animationDuration = `${this.speedBackgorund.toFixed(1)}s`;
    } 

    if (this.speed < 200) {
      this.speedSpawn = 500;
    } else {
      this.speedSpawn = 700;
    }

    this.initialGame();
  }

  checkSpeed() {
    const speed = this.player.speed;
    if (speed === this.speed) {
      return;
    }
    this.levelUp(speed);
  }

  draw() {
    this.game.innerHTML = "";

    this.checkMap();

    this.map.flat().forEach((road) => {
      const div = document.createElement("div");
      div.id = "row";

      if (road.type !== "nope") {
        const car = document.createElement("div");

        car.id = road.type;
        div.append(car);
      }

      if (road.type === "block") {
        const endRoad = document.createElement("div");

        div.id = road.type;
        div.append(endRoad);
      }

      if (road.type === "none") {
        const noneRoad = document.createElement("div");
        noneRoad.id = road.type;
        div.id = road.type;
        div.append(noneRoad);
      }

      this.game.append(div);
    });
  }

  update() {
    if (!this.endgame) {
      return;
    }

    this.checkSpeed();
    this.draw();
    this.checkUpdate = requestAnimationFrame(this.rerender);
  }

  endGame() {
    this.checkAndRemoveListenEvent();

    this.endgame = false;

    this.background.style.animationDuration = "3s";
    this.speedBackgorund = 3;

    this.levelElement.innerHTML = 1;
    this.level = 1;
    
    this.start.style.visibility = "visible";

    this.title.innerHTML = "End Game";

    this.checkRecord();

    this.score = 0;

    this.map = this.map.reduce((result, element, col) => {
      result.push([]);
      element.forEach((road, row) => {
        if (col === 6 && row === 1) {
          result[col].push({
            type: "player",
            color: "red",
            position: { x: 1, y: 6 },
          });
        } else {
          result[col].push({ type: "nope" });
        }
      });
      return result;
    }, []);

    this.npc = [];

    this.player = new Player();
  }

  checkRecord() {
    let recordOutLocal = localStorage.getItem("recordRaceChill");
    if (recordOutLocal === null) {
      localStorage.setItem("recordRaceChill", 0);
      this.record.innerHTML = this.score;
      return;
    }

    if (this.score > recordOutLocal) {
      localStorage.setItem("recordRaceChill", this.score - 1);
      recordOutLocal = this.score - 1;
    }

    this.record.innerHTML = recordOutLocal;
  }
}
