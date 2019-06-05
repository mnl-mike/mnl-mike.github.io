
import SimpleEngine from '../src/index.js'

// game files array
const gameFiles = [
    {
        "name": "ship",
        "path": "assets/ship.png",
        "type": "image"
    },
    {
        "name": "enemy",
        "path": "assets/enemy.png",
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

class Game {

    constructor(config) {

        this.config = config

    }

    start() {

        console.log('start!');

    }

    loading(percentage) {

        console.log('percentage', percentage);

    }

}

// game config
let config = {
    fps: 60
}

let game = new Game(config)
let Engine = new SimpleEngine();

Engine.Assets.preload(gameFiles, onLoad => {

    // if all game files already loaded
    if ( onLoad === 1 ) {

        game.start()
        
    } else {

        game.loading(onLoad)
    
    }

})