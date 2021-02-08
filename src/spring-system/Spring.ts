
import type SpringSystem from './SpringSystem'
import type SpringConfig from './SpringConfig'
import type { SpringListener } from './types'

import PhysicsState from './PhysicsState'
import { removeFirst } from './util'

class Spring {
    static _ID: number = 0;
    static MAX_DELTA_TIME_SEC: number = 0.064;
    static SOLVER_TIMESTEP_SEC: number = 0.001;

    listeners: Array<SpringListener> = [];
    private _startValue: number = 0;
    private _id: string
    private _currentState = new PhysicsState();
    private _displacementFromRestThreshold: number = 0.001;
    private _endValue: number = 0;
    private _overshootClampingEnabled: boolean = false;
    private _previousState = new PhysicsState();
    private _restSpeedThreshold: number = 0.001;
    private _springConfig?: SpringConfig
    private _springSystem: SpringSystem
    private _tempState = new PhysicsState();
    private _timeAccumulator: number = 0;
    private _wasAtRest: boolean = true;

    constructor(springSystem: SpringSystem) {
        this._id = 's' + Spring._ID++
        this._springSystem = springSystem
    }

    /**
     * Remove a Spring from simulation and clear its listeners.
     * @public
     */
    destroy(): void {
        this.listeners = []
        this._springSystem.deregisterSpring(this)
    }

    /**
     * Get the id of the spring, which can be used to retrieve it from
     * the SpringSystems it participates in later.
     * @public
     */
    getId(): string {
        return this._id
    }

    /**
     * Set the configuration values for this Spring. A SpringConfig
     * contains the tension and friction values used to solve for the
     * equilibrium of the Spring in the physics loop.
     * @public
     */
    setSpringConfig(springConfig: SpringConfig) {
        this._springConfig = springConfig
        return this
    }

    /**
     * Retrieve the SpringConfig used by this Spring.
     * @public
     */
    getSpringConfig(): SpringConfig | undefined {
        return this._springConfig
    }

    setCurrentValue(currentValue: number, skipSetAtRest?: boolean) {
        this._startValue = currentValue
        this._currentState.position = currentValue
        if (!skipSetAtRest) {
            this.setAtRest()
        }
        this.notifyPositionUpdated(false, false)
        return this
    }


    getStartValue(): number {
        return this._startValue
    }

    /**
     * Retrieve the current value of the Spring.
     * @public
     */
    getCurrentValue(): number {
        return this._currentState.position
    }


    getCurrentDisplacementDistance(): number {
        return this.getDisplacementDistanceForState(this._currentState)
    }


    getDisplacementDistanceForState(state: PhysicsState) {
        return Math.abs(this._endValue - state.position)
    }


    setEndValue(endValue: number): this {
        if (this._endValue === endValue && this.isAtRest()) {
            return this
        }
        this._startValue = this.getCurrentValue()
        this._endValue = endValue
        this._springSystem.activateSpring(this.getId())
        for (let i = 0, len = this.listeners.length; i < len; i++) {
            const listener = this.listeners[i]
            const onChange = listener.onSpringEndStateChange
            onChange && onChange(this)
        }
        return this
    }


    getEndValue(): number {
        return this._endValue
    }


    setVelocity(velocity: number): this {
        if (velocity === this._currentState.velocity) {
            return this
        }
        this._currentState.velocity = velocity
        this._springSystem.activateSpring(this.getId())
        return this
    }


    getVelocity(): number {
        return this._currentState.velocity
    }

    setRestSpeedThreshold(restSpeedThreshold: number): this {
        this._restSpeedThreshold = restSpeedThreshold
        return this
    }


    getRestSpeedThreshold(): number {
        return this._restSpeedThreshold
    }


    setRestDisplacementThreshold(displacementFromRestThreshold: number): void {
        this._displacementFromRestThreshold = displacementFromRestThreshold
    }


    getRestDisplacementThreshold(): number {
        return this._displacementFromRestThreshold
    }


    setOvershootClampingEnabled(enabled: boolean): this {
        this._overshootClampingEnabled = enabled
        return this
    }


    isOvershootClampingEnabled(): boolean {
        return this._overshootClampingEnabled
    }


    isOvershooting(): boolean {
        const start = this._startValue
        const end = this._endValue
        return (
            (this._springConfig?.tension || 0) > 0 &&
            ((start < end && this.getCurrentValue() > end) ||
                (start > end && this.getCurrentValue() < end))
        )
    }


    advance(_time: number, realDeltaTime: number): void {
        let isAtRest = this.isAtRest()

        if (isAtRest && this._wasAtRest) {
            return
        }

        let adjustedDeltaTime = realDeltaTime
        if (realDeltaTime > Spring.MAX_DELTA_TIME_SEC) {
            adjustedDeltaTime = Spring.MAX_DELTA_TIME_SEC
        }

        this._timeAccumulator += adjustedDeltaTime

        const tension = this._springConfig?.tension ?? 0
        const friction = this._springConfig?.friction ?? 0
        let position = this._currentState.position
        let velocity = this._currentState.velocity
        let tempPosition = this._tempState.position
        let tempVelocity = this._tempState.velocity
        let aVelocity
        let aAcceleration
        let bVelocity
        let bAcceleration
        let cVelocity
        let cAcceleration
        let dVelocity
        let dAcceleration
        let dxdt
        let dvdt

        while (this._timeAccumulator >= Spring.SOLVER_TIMESTEP_SEC) {
            this._timeAccumulator -= Spring.SOLVER_TIMESTEP_SEC

            if (this._timeAccumulator < Spring.SOLVER_TIMESTEP_SEC) {
                this._previousState.position = position
                this._previousState.velocity = velocity
            }

            aVelocity = velocity
            aAcceleration =
                tension * (this._endValue - tempPosition) - friction * velocity

            tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5
            tempVelocity =
                velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5
            bVelocity = tempVelocity
            bAcceleration =
                tension * (this._endValue - tempPosition) - friction * tempVelocity

            tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5
            tempVelocity =
                velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5
            cVelocity = tempVelocity
            cAcceleration =
                tension * (this._endValue - tempPosition) - friction * tempVelocity

            tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC
            tempVelocity = velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC
            dVelocity = tempVelocity
            dAcceleration =
                tension * (this._endValue - tempPosition) - friction * tempVelocity

            dxdt =
                1.0 / 6.0 * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity)
            dvdt =
                1.0 /
                6.0 *
                (aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration)

            position += dxdt * Spring.SOLVER_TIMESTEP_SEC
            velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC
        }

        this._tempState.position = tempPosition
        this._tempState.velocity = tempVelocity

        this._currentState.position = position
        this._currentState.velocity = velocity

        if (this._timeAccumulator > 0) {
            this._interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC)
        }

        if (
            this.isAtRest() ||
            (this._overshootClampingEnabled && this.isOvershooting())
        ) {
            if (this._springConfig && this._springConfig.tension > 0) {
                this._startValue = this._endValue
                this._currentState.position = this._endValue
            } else {
                this._endValue = this._currentState.position
                this._startValue = this._endValue
            }
            this.setVelocity(0)
            isAtRest = true
        }

        let notifyActivate = false
        if (this._wasAtRest) {
            this._wasAtRest = false
            notifyActivate = true
        }

        let notifyAtRest = false
        if (isAtRest) {
            this._wasAtRest = true
            notifyAtRest = true
        }

        this.notifyPositionUpdated(notifyActivate, notifyAtRest)
    }

    notifyPositionUpdated(notifyActivate: boolean, notifyAtRest: boolean): void {
        for (let i = 0, len = this.listeners.length; i < len; i++) {
            const listener = this.listeners[i]
            if (notifyActivate && listener.onSpringActivate) {
                listener.onSpringActivate(this)
            }

            if (listener.onSpringUpdate) {
                listener.onSpringUpdate(this)
            }

            if (notifyAtRest && listener.onSpringAtRest) {
                listener.onSpringAtRest(this)
            }
        }
    }

    systemShouldAdvance(): boolean {
        return !this.isAtRest() || !this.wasAtRest()
    }

    wasAtRest(): boolean {
        return this._wasAtRest
    }


    isAtRest(): boolean {
        return (
            Math.abs(this._currentState.velocity) < this._restSpeedThreshold &&
            (this.getDisplacementDistanceForState(this._currentState) <=
                this._displacementFromRestThreshold ||
                this._springConfig?.tension === 0)
        )
    }


    setAtRest(): this {
        this._endValue = this._currentState.position
        this._tempState.position = this._currentState.position
        this._currentState.velocity = 0
        return this
    }

    _interpolate(alpha: number): void {
        this._currentState.position =
            this._currentState.position * alpha +
            this._previousState.position * (1 - alpha)
        this._currentState.velocity =
            this._currentState.velocity * alpha +
            this._previousState.velocity * (1 - alpha)
    }

    getListeners(): Array<SpringListener> {
        return this.listeners
    }

    addListener(newListener: SpringListener): this {
        this.listeners.push(newListener)
        return this
    }

    removeListener(listenerToRemove: SpringListener): this {
        removeFirst(this.listeners, listenerToRemove)
        return this
    }

    removeAllListeners(): this {
        this.listeners = []
        return this
    }

    currentValueIsApproximately(value: number): boolean {
        return (
            Math.abs(this.getCurrentValue() - value) <=
            this.getRestDisplacementThreshold()
        )
    }
}

export default Spring