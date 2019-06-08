
import SimpleEngine from '../src/index.js'

// game files array
const gameFiles = [
    {
        "name": "ship",
        "path": "demo/assets/ship.png",
        "type": "image"
    },
    {
        "name": "invader",
        "path": "demo/assets/invader.png",
        "type": "image"
    },
    {
        "name": "laser",
        "path": "demo/assets/laser.png",
        "type": "image"
    },
    {
        "name": "shoot",
        "path": "demo/assets/shoot.wav",
        "type": "audio"
    },
    {
        "name": "explosion",
        "path": "demo/assets/explosion.wav",
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

        // create bonus invader
        let invader = new Invader(-20, 20, 20, 20, true)

        this.invaders.push(invader)

        // add bonus invader movement
        Engine.Renderer.keyframe(invader, [
            {
                props: { x: stage.width }, 
                duration: 3000
            }, {
                props: { y: 80 },
                duration: 1000
            }, {
                props: { x: -20 }, 
                duration: 3000
            }
        ])

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

            this.laser.y -= delta

            // check hit
            for ( let i = this.invaders.length - 1; i >= 0; i-- ) {

                // if ((
                //     this.laser.x - this.laser.width >= this.invaders[i].x && 
                //     this.laser.x <= this.invaders[i].x + this.invaders[i].width &&
                //     this.laser.y >= this.invaders[i].y && 
                //     this.laser.y + this.laser.height <= this.invaders[i].y + this.invaders[i].height
                // )) {

                if ( this.isObjCollide(this.laser, this.invaders[i]) ) {

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
        if ( this.ship.movingLeft && !this.isObjOutOfBounds(this.ship, 'left') ) this.ship.x -= delta / 2
        if ( this.ship.movingRight && !this.isObjOutOfBounds(this.ship, 'right') ) this.ship.x += delta / 2

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

    isObjCollide(obj1, obj2) {

        return !(
            ((obj1.y + obj1.height) < (obj2.y)) ||
            (obj1.y > (obj2.y + obj2.height)) ||
            ((obj1.x + obj1.width) < obj2.x) ||
            (obj1.x > (obj2.x + obj2.width))
        )

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

    constructor(x, y = 40, width = 40, height = 40, debug = false) {

        this.asset = Engine.Assets.get('invader')
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.debug = debug

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