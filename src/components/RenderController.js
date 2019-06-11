
export default class RenderController {

    constructor(stage) {

        this.stage = stage
        this.current = + new Date()
        this.fps = 80
        this.delta = 1000 / this.fps
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
            for ( let i = this.loopers.length - 1; i >= 0; i-- ) {

                let looper = this.loopers[i]
                
                // remove looper if disabled, else run fn
                if ( looper.disabled ) this.loopers.splice(i, 1)
                else looper.fn(this.delta) 
            }

            // re set current time
            this.current = now

        }

        requestAnimationFrame(() => { this.loop() })

    }

    clear() {

        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);

    }

    render(obj, source) {

        // clone the obj, so it would not be mutable
        let clone = Object.assign({}, obj)

        // use source as origin of props
        if (source) {
            
            Object.keys(source).forEach(key => {

                if ( typeof clone[key] === 'number' ) clone[key] = ( clone[key] || 0 ) + source[key]

            })

        }

        this.ctx.globalAlpha = clone.opacity || 1
        this.ctx.drawImage(clone.asset, clone.x, clone.y, clone.width, clone.height)

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
                    if ( cb ) cb()

                }

            })

        }

    }

    keyframe(obj, frames = [], cb) {

        // check if have frames
        if ( frames.length ) {

            var self = this
            recursiveTween()

            function recursiveTween(index = 0) {
                
                let frame = frames[index]

                // lets utilise tween
                self.tween(obj, frame.props, frame.duration, () => {
                    
                    if ( index < frames.length - 1 ) recursiveTween(index + 1)
                    else if (cb) cb()

                })

            }

        }

    }

    graph(obj) {

        let self = this
        recursiveRender(obj)

        function recursiveRender(origin, source) {

            self.render(origin, source)

            if ( origin.children && origin.children.length ) {

                obj.children.forEach(child => { recursiveRender(child, origin) })

            }


        }

    }

}

class Looper {

    constructor(fn) {

        this.fn = fn
        this.disabled = false

    }

}