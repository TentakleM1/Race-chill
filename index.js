
class Character {
    constructor() {
        this.name = ''
        this.newPosition = 0
        this.oldPosition = this.newPosition
        this.id = Date.now()
    }

    draw() {
        const element = document.createElement('div')
        element.className = this.name 
        element.id = this.id
        return element
    }

    getPosition() {
        return { oldPosition: this.oldPosition, newPosition: this.newPosition }
    }
}

class Player extends Character {
    constructor() {
        super()
        this.name = 'player'
        this.speed = 200
        this.eventControll = this.controll.bind(this)
    }

    controll(e) {
        const key = e.code

        if(key === 'ArrowRight' && this.newPosition + 1 <= 3) {
            this.oldPosition = this.newPosition
            this.newPosition = this.newPosition + 1 
        }

        if(key === 'ArrowLeft' && this.newPosition - 1 >= 0) {
            this.oldPosition = this.newPosition
            this.newPosition = this.newPosition - 1 
        }

        if(key === 'ArrowUp' && this.speed > 100 ) {
            this.speed = this.speed - 50
        }
            
        if(key === 'ArrowDown' && this.speed < 200 ) {
            this.speed = this.speed + 50 
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
        ['0','0','0','0'],
        ['0','0','0','0'],
        ['0','0','0','0'],
        ['0','0','0','0'],
        ['0','0','0','0'],
        ['0','0','0','0'],
        ['0','0','0','0'],
        ['0','0','0','0']
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
        console.log(this.npc)
        // навнешиваем событие на управление машиной
        this.player.addEvent()
        this.checkSpawn = setInterval(this.respawn, this.speedSpawn)
        this.checkTemp = setInterval(this.loopTemp, this.speed)
        this.update()   

    }

    spawn() {
        if(this.npc.length < 3) {
            const newNpc = new NPC(4)
            this.npc.push(newNpc)

            this.map[0][newNpc.getXPosition()] = '#'
        } else {
            if(!this.npc[0].move()) {
                this.npc.shift()
            }
        }
    }

    temp() {
        if(this.speed !== this.player.getSpeed()) {

            this.speed = this.player.getSpeed()
            this.initialGame()
        }

        if(this.npc.length === 0) { return; }

        this.npc.forEach((npc) => {
            const move = npc.move()

            const { oldPosition, newPosition } = npc.getPosition()

            if(move) {

                this.map[oldPosition][npc.getXPosition()] = '0'

                this.map[newPosition][npc.getXPosition()] = '#'

            } else {
                this.map[newPosition][npc.getXPosition()] = '0'
            }

        })
        
    }

    draw() {
        this.game.innerHTML = ''

        // берем позицию игрока
        const { oldPosition, newPosition } = this.player.getPosition()

        // удаляем старую позицию с карты добовляем новую 

        if(this.map[6][oldPosition] !== '#') { this.map[6][oldPosition] = '0'; }

        this.map[6][newPosition] = '1';

        // отрисовываем дорогу с игроком 
        this.map.flat().forEach((road) => {
            const div = document.createElement('div')
            div.id = 'row'
            
            if(+road === 1) {
                div.append(this.player.draw())
            }

            if(road !== 0) {  
                console.log(this.npc)
                div.append(this.npc[0].draw())
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
