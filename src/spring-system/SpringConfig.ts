
import * as OrigamiValueConverter from './OrigamiValueConverter'
import Bouncy from './BouncyConversion'


class SpringConfig {
    friction: number
    tension: number

    static DEFAULT_ORIGAMI_SPRING_CONFIG = SpringConfig.fromOrigamiTensionAndFriction(
        40,
        7,
    );


    static fromOrigamiTensionAndFriction(
        tension: number,
        friction: number,
    ): SpringConfig {
        return new SpringConfig(
            OrigamiValueConverter.tensionFromOrigamiValue(tension),
            OrigamiValueConverter.frictionFromOrigamiValue(friction),
        )
    }


    static fromBouncinessAndSpeed(
        bounciness: number,
        speed: number,
    ): SpringConfig {
        const bouncyConversion = new Bouncy(bounciness, speed)
        return SpringConfig.fromOrigamiTensionAndFriction(
            bouncyConversion.bouncyTension,
            bouncyConversion.bouncyFriction,
        )
    }

    /**
     * Create a SpringConfig with no tension or a coasting spring with some
     * amount of Friction so that it does not coast infininitely.
     * @public
     */
    static coastingConfigWithOrigamiFriction(friction: number): SpringConfig {
        return new SpringConfig(
            0,
            OrigamiValueConverter.frictionFromOrigamiValue(friction),
        )
    }

    constructor(tension: number, friction: number) {
        this.tension = tension
        this.friction = friction
    }
}

export default SpringConfig