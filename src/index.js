
import AssetManager from './components/AssetManager.js'
import RenderController from './components/RenderController.js'
import InputManager from './components/InputManager.js'
import AudioController from './components/AudioController.js'


export default class SimpleEngine {

    constructor(stage) {

        this.Assets = new AssetManager()
        this.Renderer = new RenderController(stage)
        this.Input = new InputManager();
        this.Audio = new AudioController();
        
    }

}
