
class Character {
    constructor() {
        this.name = ''
        this.newPosition = 0
        this.oldPosition = this.newPosition
    }

    draw() {
        const element = document.createElement('div')
        element.className = this.name 
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
    }

    controll(e) {
        window.addEventListener('keydown', e => {
            const key = e.code
            if(key === 'ArrowRight' && this.newPosition + 1 <= 3) {
                this.oldPosition = this.newPosition
                this.newPosition = this.newPosition + 1 
            }

            if(key === 'ArrowLeft' && this.newPosition - 1 >= 0) {
                this.oldPosition = this.newPosition
                this.newPosition = this.newPosition - 1 
            }
        })
    }
}

class NPC extends Character {
    constructor(name, max) {
        super()
        this.name = name
        this.xPosition = Math.floor(Math.random() * max)
    }

    move() {
        if(this.newPosition === 7) return false
        this.oldPosition = this.newPosition
        this.newPosition = this.newPosition + 1
        return true
    }

    getXPosition() {
        return this.xPosition
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
        this.rerender = this.draw.bind(this)
        this.respawn = this.spawn.bind(this)
        this.player = new Player()
        this.npc = 0
    }

    // initialPlayer() {
    //     for(let row = 0; row < this.map[0].length; row++) {
    //         for(let col = 0; col < this.map.length; col++) {
    //             if(this.map[col][row] === '1') {
    //                 return row
    //             }
    //         }
    //     }
    // }

    initialGame() {
        // навнешиваем событие на управление машиной
        this.player.controll()
        this.draw()

    }

    spawn() {
        if(this.npc < 3) {
            console.log(this.npc)
            this.npc = this.npc + 1
            const newNpc = new NPC('police', 4)
            this.map[0][newNpc.getXPosition()] = newNpc
        } else {
            this.npc = this.npc - 1
        }
    }

    draw() {
        this.game.innerHTML = ''

        setInterval(this.respawn, 1000)

        // берем позицию игрока
        const { oldPosition, newPosition } = this.player.getPosition()

        // удаляем старую позицию с карты добовляем новую 
        this.map[6][oldPosition] = '0'
        this.map[6][newPosition] = '1'

        // отрисовываем дорогу с игроком 
        this.map.flat().forEach(road => {
            const div = document.createElement('div')
            div.id = 'row'

            if(+road === 1) {
                div.append(this.player.draw())
            }

            if(typeof road === 'object') {
                div.append(road.draw())

                const move = road.move()
                const { oldPosition, newPosition } = road.getPosition()

                if(move) {
                    this.map[oldPosition][road.getXPosition()] = '0'

                    this.map[newPosition][road.getXPosition()] = road

                } else {

                    this.map[newPosition][road.getXPosition()] = '0'
                }
            }

            this.game.append(div)
        })

        // при false  игра остановиться 
        if(this.endgame) {
            window.requestAnimationFrame(this.rerender)
        }
    }

}

const core = new Core()
core.initialGame()
