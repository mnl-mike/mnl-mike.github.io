
import AssetManager from './components/AssetManager.js'
import RenderController from './components/RenderController.js'


export default class SimpleEngine {

    constructor(config = {}) {

        this.Assets = new AssetManager()
        this.Render = new RenderController()
        
    }

    loop(cb) {



    }

}



