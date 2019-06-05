
export default class AssetManager {

    constructor() {

        this.assets = {}   

    }

    preload(files, cb, index = 0) {

        if ( index < files.length ) {

            this.add(files[index], () => {

                // callback the percentage of preloaded files
                cb( ( index + 1 ) / files.length )

                this.preload(files, cb, index + 1)

            })

        }

    }

    add(fileObj, cb) {

        // loaded file event listener
        let onFileLoaded = () => {

            // add to assets obj
            this.assets[fileObj.name] = fileObj.path

            // next
            cb()

        }

        // preload and cache
        switch(fileObj.type) {
            case 'image':

                let img = new Image()
                img.onload = onFileLoaded
                img.src = fileObj.path

            break
            case 'audio':
                
                let audio = new Audio()
                audio.addEventListener('canplaythrough', onFileLoaded)
                audio.src = fileObj.path

            break
        }

    }

    get(name) {

        return this.assets[name]

    }

}