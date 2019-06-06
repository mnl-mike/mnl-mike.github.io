
export default class RenderController {

    constructor(stage) {

        this.stage = stage
        this.current = + new Date()
        this.fps = 60
        this.delta = 1 / this.fps
        this.ctx = stage.getContext("2d")
        this.loop = this.loop.bind(this)
        this.loopers = []
        this.loopStarted = false

    }

    addLooper(fn) {

        let looper = new Looper(fn)
        this.loopers.push(looper)

        if ( !this.loopStarted ) this.loop()

        return looper


    }

    loop() {

        let now = + new Date()

        // limit to fps
        if ( now - this.current >= this.delta ) {

            // call all loopers
            this.loopers.forEach(looper => { 
                
                if ( !looper.disabled ) looper.fn(this.delta) 

            })

            // re set current time
            this.current = now

            requestAnimationFrame(() => { this.loop() })

        }

    }

    clear() {

        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);

    }

    render(obj) {

        this.ctx.drawImage(obj.asset, obj.x, obj.y, obj.width, obj.height)

    }
    
    tween(obj, props, duration, cb) {

        // check if obj still truthy
        if ( obj ) {

            // get start
            let start = + new Date()

            // clone starting obj state
            let clone = Object.assign({}, obj)

            let looper = this.addLooper(delta => {

                // get current
                let current = + new Date()
                    
                // get time diff
                let timeDiff = current - start

                // iterate throuh props
                Object.keys(props).forEach(key => {

                    // percentage
                    let percentage = timeDiff / duration

                    // get difference from values
                    let valueDiff = props[key] - clone[key]
                    
                    // get the should be value
                    let value = clone[key] + ( percentage * valueDiff )

                    // set
                    obj[key] = value

                    // check if bounds already met, set the 'to' prop
                    if ( timeDiff >= duration ) {

                        obj[key] = props[key]

                    }
                    
                })

                // check if times up
                if ( timeDiff >= duration ) {

                    looper.disabled = true
                    cb()

                }

            })

        }

    }

}

class Looper {

    constructor(fn) {

        this.fn = fn
        this.disabled = false

    }

}