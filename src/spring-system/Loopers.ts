
import type SpringSystem from './SpringSystem'
import { onFrame } from './util'
import { Looper } from './types'


export class LooperAnimation implements Looper {
    springSystem!: SpringSystem

    run() {
        const springSystem = getSpringSystem.call(this)

        onFrame(() => {
            springSystem.loop(Date.now())
        })
    }
}

export class LoopSimulation {
    springSystem!: SpringSystem
    timestep: number
    time: number = 0;
    running: boolean = false;

    constructor(timestep: number) {
        this.timestep = timestep || 16.667
    }

    run() {
        const springSystem = getSpringSystem.call(this)

        if (this.running) {
            return
        }
        this.running = true
        while (!springSystem.getIsIdle()) {
            springSystem.loop((this.time += this.timestep))
        }
        this.running = false
    }
}


export class SteppingSimulationLooper {
    springSystem!: SpringSystem
    timestep?: number
    time: number = 0;
    running: boolean = false;

    run() {
        // this.run is NOOP'd here to allow control from the outside using
        // this.step.
    }

    // Perform one step toward resolving the SpringSystem.
    step(timestep: number) {
        const springSystem = getSpringSystem.call(this)
        springSystem.loop((this.time += timestep))
    }
}


interface WithSystem {
    springSystem: SpringSystem
}

function getSpringSystem<T extends WithSystem>(this: T): SpringSystem {
    if (!this.springSystem) {
        throw new Error('cannot run looper without a springSystem')
    }
    return this.springSystem
}