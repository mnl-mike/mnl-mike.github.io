
import SimpleEngine from '../src/index.js'

// game files array
const gameFiles = [
    {
        "name": "ship",
        "path": "assets/ship.png",
        "type": "image"
    },
    {
        "name": "invader",
        "path": "assets/invader.png",
        "type": "image"
    },
    {
        "name": "laser",
        "path": "assets/laser.png",
        "type": "image"
    },
    {
        "name": "shoot",
        "path": "assets/shoot.wav",
        "type": "audio"
    },
    {
        "name": "explosion",
        "path": "assets/explosion.wav",
        "type": "audio"
    }
];

// setup stage
let stage = document.getElementById('c');
stage.width = 600
stage.height = 400

let Engine = new SimpleEngine(stage);

class Game {

    constructor() {

        this.invaders = []
        this.ship = null
        this.laser = null

        this.bounds = {
            left: 40,
            right: stage.width - 40
        }

    }

    loading(percentage) {

        console.log('loaded', percentage);

    }

    start() {

        this.initEntities()
        this.initEventListeners()
        this.draw()

    }

    initEntities() {

        // create ship
        this.ship = new Ship()

        // create invaders 
        for ( let i = 0; i < 4; i++ ) {
            
            let invader = new Invader( 40 + ( i * 60 ) );

            this.invaders.push(invader)

            // add sideways movement
            invaderSidewaysMovement(invader)
            
            function invaderSidewaysMovement(obj, direction = 'right') {

                Engine.Renderer.tween(obj, {
                    x: obj.x + ( direction === 'left' ? -300 : 300 )
                }, 2000, () => {

                    invaderSidewaysMovement(obj, direction === 'left' ? 'right' : 'left')

                })

            }

        }

    }

    initEventListeners() {

        // capture keyboard events
        Engine.Input.keypress("Space", () => { this.fire() })
        Engine.Input.keydown("ArrowLeft", () => { this.ship.movingLeft = true })
        Engine.Input.keyup("ArrowLeft", () => { this.ship.movingLeft = false })
        Engine.Input.keydown("ArrowRight", () => { this.ship.movingRight = true })
        Engine.Input.keyup("ArrowRight", () => { this.ship.movingRight = false })

    }

    draw() {

        let Renderer = Engine.Renderer

        Renderer.addLooper(delta => {

            Renderer.clear()

            // render ship
            Renderer.render(this.ship)

            // render invaders
            this.invaders.forEach(invader => {

                Renderer.render(invader)

            })

            // render laser
            if ( this.laser ) Renderer.render(this.laser) 

            this.update(delta)

        })

    }

    update(delta) {

        // update laser
        if ( this.laser ) {

            this.laser.y -= delta * 1000

            // check hit
            for ( let i = this.invaders.length - 1; i >= 0; i--) {

                if ((
                    this.laser.x - this.laser.width >= this.invaders[i].x && 
                    this.laser.x <= this.invaders[i].x + this.invaders[i].width &&
                    this.laser.y >= this.invaders[i].y && 
                    this.laser.y + this.laser.height <= this.invaders[i].y + this.invaders[i].height
                )) {

                    // remove invader
                    this.invaders.splice(i, 1)

                    // play explosion
                    Engine.Audio.play(Engine.Assets.get('explosion'))

                }

            }
            
            // destroy laser if out of bounds
            if ( this.laser.y + this.laser.height <= 0 ) {

                this.laser = null

            }

        }

        // update ship if moving
        if ( this.ship.movingLeft && !this.isObjOutOfBounds(this.ship, 'left') ) this.ship.x -= delta * 500
        if ( this.ship.movingRight && !this.isObjOutOfBounds(this.ship, 'right') ) this.ship.x += delta * 500

    }

    fire() {

        if ( !this.laser ) {

            // play laser audio
            Engine.Audio.play(Engine.Assets.get('shoot'))

            // start from ship's top middle
            this.laser = new Laser( 
                this.ship.x + ( this.ship.width / 2 ), 
                this.ship.y
            )

        }

    }

    isObjOutOfBounds(obj, bound) {

        if ( bound === 'left' ) { return obj.x <= this.bounds.left }
        if ( bound === 'right' ) { return obj.x + obj.width >= this.bounds.right }
        return obj.x <= this.bounds.left || obj.x + obj.width >= this.bounds.right

    }

}

class Ship {

    constructor() {

        this.asset = Engine.Assets.get('ship')
        this.width = 40
        this.height = 50
        this.x = ( stage.width / 2 ) - ( this.width / 2 )
        this.y = stage.height - this.height - 40
        this.moving = false;

    }

}

class Invader {

    constructor(x) {

        this.asset = Engine.Assets.get('invader')
        this.width = 40
        this.height = 40
        this.x = x
        this.y = 40

    }

}

class Laser {

    constructor(x, y) {

        this.asset = Engine.Assets.get('laser')
        this.width = 4
        this.height = 30
        this.x = x - this.width / 2
        this.y = y - this.height / 2

    }

}

// init game
let game = new Game()

// preload all assets
Engine.Assets.preload(gameFiles, onLoad => {

    // if all game files already loaded
    if ( onLoad === 1 ) {

        game.start()
        
    } else {

        game.loading(onLoad)
    
    }

})