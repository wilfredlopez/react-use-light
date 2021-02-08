

import type { Looper, SpringSystemListener } from './types'

import { LooperAnimation } from './Loopers'
import Spring from './Spring'
import SpringConfig from './SpringConfig'
import { removeFirst } from './util'

class SpringSystem {
    listeners: Array<SpringSystemListener> = [];
    looper: Looper
    private _activeSprings: Array<Spring> = [];
    private _idleSpringIndices: Array<number> = [];
    private _isIdle: boolean = true;
    private _lastTimeMillis: number = -1;
    private _springRegistry: { [id: string]: Spring } = {};

    constructor(looper?: Looper) {
        this.looper = looper ?? new LooperAnimation()
        this.looper.springSystem = this
    }


    setLooper(looper: Looper) {
        this.looper = looper
        looper.springSystem = this
    }


    createSpring(tension: number, friction: number): Spring {
        let springConfig: typeof SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG
        if (tension === undefined || friction === undefined) {
            springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG
        } else {
            springConfig = SpringConfig.fromOrigamiTensionAndFriction(
                tension,
                friction,
            )
        }
        return this.createSpringWithConfig(springConfig)
    }

    createSpringWithBouncinessAndSpeed(
        bounciness: number,
        speed: number,
    ): Spring {
        let springConfig
        if (bounciness === undefined || speed === undefined) {
            springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG
        } else {
            springConfig = SpringConfig.fromBouncinessAndSpeed(bounciness, speed)
        }
        return this.createSpringWithConfig(springConfig)
    }

    createSpringWithConfig(springConfig: SpringConfig): Spring {
        const spring = new Spring(this)
        this.registerSpring(spring)
        spring.setSpringConfig(springConfig)
        return spring
    }

    getIsIdle(): boolean {
        return this._isIdle
    }

    getSpringById(id: string): Spring {
        return this._springRegistry[id]
    }

    getAllSprings(): Array<Spring> {
        const vals: Spring[] = []
        for (const id in this._springRegistry) {
            if (this._springRegistry.hasOwnProperty(id)) {
                vals.push(this._springRegistry[id])
            }
        }
        return vals
    }


    registerSpring(spring: Spring): void {
        this._springRegistry[spring.getId()] = spring
    }


    deregisterSpring(spring: Spring): void {
        removeFirst(this._activeSprings, spring)
        delete this._springRegistry[spring.getId()]
    }

    advance(time: number, deltaTime: number): void {
        while (this._idleSpringIndices.length > 0) {
            this._idleSpringIndices.pop()
        }
        for (let i = 0, len = this._activeSprings.length; i < len; i++) {
            const spring = this._activeSprings[i]
            if (spring.systemShouldAdvance()) {
                spring.advance(time / 1000.0, deltaTime / 1000.0)
            } else {
                this._idleSpringIndices.push(this._activeSprings.indexOf(spring))
            }
        }
        while (this._idleSpringIndices.length > 0) {
            const idx = this._idleSpringIndices.pop()!
            idx >= 0 && this._activeSprings.splice(idx, 1)
        }
    }


    loop(currentTimeMillis: number): void {
        let listener
        if (this._lastTimeMillis === -1) {
            this._lastTimeMillis = currentTimeMillis - 1
        }
        const ellapsedMillis = currentTimeMillis - this._lastTimeMillis
        this._lastTimeMillis = currentTimeMillis

        let i = 0
        const len = this.listeners.length
        for (i = 0; i < len; i++) {
            listener = this.listeners[i]
            listener.onBeforeIntegrate && listener.onBeforeIntegrate(this)
        }

        this.advance(currentTimeMillis, ellapsedMillis)
        if (this._activeSprings.length === 0) {
            this._isIdle = true
            this._lastTimeMillis = -1
        }

        for (i = 0; i < len; i++) {
            listener = this.listeners[i]
            listener.onAfterIntegrate && listener.onAfterIntegrate(this)
        }

        if (!this._isIdle) {
            this.looper.run()
        }
    }


    activateSpring(springId: string): void {
        const spring = this._springRegistry[springId]
        if (this._activeSprings.indexOf(spring) === -1) {
            this._activeSprings.push(spring)
        }
        if (this.getIsIdle()) {
            this._isIdle = false
            this.looper.run()
        }
    }

    addListener(listener: SpringSystemListener): void {
        this.listeners.push(listener)
    }

    removeListener(listener: SpringSystemListener): void {
        removeFirst(this.listeners, listener)
    }


    removeAllListeners(): void {
        this.listeners = []
    }
}

export default SpringSystem