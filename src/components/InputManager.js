
export default class InputManager {

    keypress(code, cb) {

        document.addEventListener('keypress', e => {
            
            if (e.code === code) cb()

        })
        
    }

    keydown(code, cb) {

        document.addEventListener('keydown', e => {
            
            if (e.code === code) cb()

        })

    }

    keyup(code, cb) {

        document.addEventListener('keyup', e => {
            
            if (e.code === code) cb()

        })

    }
    
}