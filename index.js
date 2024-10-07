
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

        if(key === 'ArrowRight') {
            this.data.position.x = this.data.position.x + 1
        }

        if(key === 'ArrowLeft') {
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
    constructor(max) {
        super()
        this.name = 'car'
        this.xPosition = Math.floor(Math.random() * max)
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
        [{type: 'nope'}, {type: 'police', color: 'green', position: { x: 1, y: 2 }}, {type: 'nope'}, {type: 'nope'}],
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
        // if(this.npc.length < 3) {
        //     const newNpc = new NPC(4)
        //     this.npc.push(newNpc)

        //     this.map[0][newNpc.getXPosition()] = '#'
        // } else {
        //     if(!this.npc[0].move()) {
        //         this.npc.shift()
        //     }
        // }
    }

    temp() {
        // if(this.speed !== this.player.getSpeed()) {

        //     this.speed = this.player.getSpeed()
        //     this.initialGame()
        // }

        // if(this.npc.length === 0) { return; }

        // this.npc.forEach((npc) => {
        //     const move = npc.move()

        //     const { oldPosition, newPosition } = npc.getPosition()

        //     if(move) {

        //         this.map[oldPosition][npc.getXPosition()] = '0'

        //         this.map[newPosition][npc.getXPosition()] = '#'

        //     } else {
        //         this.map[newPosition][npc.getXPosition()] = '0'
        //     }

        // })
        
    }

    checkMap() {
        for(let row = 0; row < this.map[0].length; row++) {

            for(let col = 0; col < this.map.length; col++) {

                const element = this.map[col][row];

                if(element.type === 'player') {

                    const data = this.player.getData();
                    const { position } = data

                    if(element.position.x !== position.x) {
                        console.log('work')
                        this.map[col][row] = {type:'nope'}
                        this.map[position.y][position.x] = data  
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
