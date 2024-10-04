
class Character {
    constructor() {
        this.newPosition = 1
        this.oldPosition = this.newPosition
    }

    draw() {
        const element = document.createElement('div')
        element.className = 'player' 
        return element
    }
}

class Player extends Character {
    constructor() {
        super()
    }

    controll() {
        window.addEventListener('keydown', e => {
            const key = e.key
            if(key === 'ArrowRight' && this.oldPosition < 2) {
                this.oldPosition = this.newPosition
                this.newPosition = this.newPosition + 1 
            }

            if(key === 'ArrowLeft' && this.oldPosition > 1) {
                this.oldPosition = this.newPosition
                this.newPosition = this.newPosition - 1 
            }
            console.log('old', this.oldPosition, 'new', this.newPosition)
        })
    }

    getPosition() {
        return { oldPosition: this.oldPosition, newPosition: this.newPosition }
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
        this.rerender = this.draw.bind(this)
        this.player = new Player()
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

        this.player.controll()

        this.draw()

    }

    draw() {
        this.game.innerHTML = ''
        const { oldPosition, newPosition } = this.player.getPosition()

        this.map[6][oldPosition] = '0'
        this.map[6][newPosition] = '1'

        this.map.flat().forEach(road => {
            const div = document.createElement('div')
            div.id = 'row'

            if(+road === 1) {
                div.append(this.player.draw())
            }

            this.game.append(div)
        }) 


        window.requestAnimationFrame(this.rerender)
    }

}

const core = new Core()
core.initialGame()
