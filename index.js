
class Character {
    constructor() {
        this.data = {}
    }

    getData() {
        return this.data
    }
}

class Player extends Character {
    constructor() {
        super();
        this.data = {
            type: 'player',
            color: 'red',
            position: {
                x: 1,
                y: 5
            }
        };
        this.eventControll = this.controll.bind(this);
    }

    controll(e) {
        const key = e.code;

        if(key === 'ArrowRight' && this.data.position.x < 3) {
            this.data.position.x = this.data.position.x + 1
        }

        if(key === 'ArrowLeft' && this.data.position.x > 0) {
            this.data.position.x = this.data.position.x - 1
        } 
    }

    getSpeed() {
        return this.speed
    }

    removeEvent() {
        window.removeEventListener('keydown', this.eventControll)
    }

    addEvent() {
        window.addEventListener('keydown', this.eventControll)
    }
}

class NPC extends Character {
    constructor() {
        super()
        this.data = {
            id: Date.now(),
            type: 'car',
            color: 'green',
            position: {
                x: Math.floor(Math.random() * 3),
                y: 0
            }
        }
    }

    move() {
        if(this.newPosition === 7) return false
        this.oldPosition = this.newPosition
        this.newPosition = this.newPosition + 1

        return true
    }

    skin() {
        const random = Math.floor(Math.random() * 2)
        let skin
        switch(random) {
            case 0: 
                skin = 'police' 
                break;   
            case 1:
                skin = 'interference'
                break;
            case 2:
                skin = 'car'
                break;    
        }
        return skin
    }


    getXPosition() {
        return this.xPosition
    }

    getId() {
        return this.id
    }
}

class Core {

    map = [
        [{type: 'nope'}, {type: 'nope'}, {type: 'nope'}, {type: 'nope'}],
        [{type: 'nope'}, {type: 'nope'}, {type: 'nope'}, {type: 'nope'}],
        [{type: 'nope'}, {type: 'nope'}, {type: 'nope'}, {type: 'nope'}],
        [{type: 'nope'}, {type: 'nope'}, {type: 'nope'}, {type: 'nope'}],
        [{type: 'nope'}, {type: 'nope'}, {type: 'nope'}, {type: 'nope'}],
        [{type: 'nope'}, {type: 'player', color: 'red', position: { x: 1, y: 5 }}, {type: 'nope'}, {type: 'nope'}],
        [{type: 'nope'}, {type: 'nope'}, {type: 'nope'}, {type: 'nope'}],
    ]

    constructor() {
        this.game = document.getElementById('game')
        this.endgame = true
        this.rerender = this.update.bind(this)
        this.loopTemp = this.temp.bind(this)
        this.respawn = this.spawn.bind(this)
        this.player = new Player()
        this.npc = []

        this.speed = 200
        this.speedSpawn = 700

        this.checkSpawn
        this.checkTemp
        this.checkUpdate
        this.checkControll

    }

    initialGame() {  

        if(this.checkSpawn && this.checkTemp && this.update) {
            this.player.removeEvent()
            clearInterval(this.checkSpawn) 
            clearInterval(this.checkTemp) 
            cancelAnimationFrame(this.checkUpdate)
        } 

        // навнешиваем событие на управление машиной
        this.player.addEvent()
        this.checkSpawn = setInterval(this.respawn, this.speedSpawn)
        this.checkTemp = setInterval(this.loopTemp, this.speed)
        this.update()   

    }

    spawn() {
        if(this.npc.length < 3) {
            const newNpc = new NPC(); 
            const data = newNpc.getData();
            this.npc.push(data.id)
            this.map[newNpc.data.position.y][newNpc.data.position.x] = data;
        }
    }

    temp() {

        this.map.flat().forEach(car => {
            if(car.id) {
                if(car.position.y !== 7) {
                    car.position.y = car.position.y + 1;
                    
                }
            }
        })

    }

    checkMap() {
        for(let row = 0; row < this.map[0].length; row++) {

            for(let col = 0; col < this.map.length; col++) {

                const element = this.map[col][row];

                if(element.type === 'player') {

                    const data = this.player.getData();

                    const { position } = data;


                    this.map[col][row] = {type:'nope'};

                    this.map[position.y][position.x] = data; 

                }

                if(element.id) {
                    const car = element;

                    this.map[col][row] = {type: 'nope'};

                    if(car.position.y !== 7) {
                        this.map[car.position.y][car.position.x] = car;   
                    } else {
                        this.npc.shift()
                    }

                }
            };    
        };
    }

    draw() {
        this.game.innerHTML = ''

        this.checkMap()

        // отрисовываем дорогу с игроком 
        this.map.flat().forEach((road) => {
            const div = document.createElement('div')
            div.id = 'row'

            if(road.type !== 'nope') {
                const car = document.createElement('div')
                car.id = road.type
                car.style.backgroundColor = road.color
                div.append(car)
            }

            this.game.append(div)
        })
    }

    update() {
        // при false  игра остановиться 
        if(this.endgame) {
            this.draw()
            this.checkUpdate = requestAnimationFrame(this.rerender)
        }
    }
}

const core = new Core()
core.initialGame()
