

import type Spring from './Spring'
import type SpringSystem from './SpringSystem'

export type Looper = {
    springSystem: SpringSystem,
    run: () => any,
}

export type SpringListener = {
    onSpringEndStateChange?: (spring: Spring) => void,
    onSpringActivate?: (spring: Spring) => void,
    onSpringUpdate?: (spring: Spring) => void,
    onSpringAtRest?: (spring: Spring) => void,
}

export type SpringSystemListener = {
    onBeforeIntegrate?: (springSystem: SpringSystem) => void,
    onAfterIntegrate?: (springSystem: SpringSystem) => void,
}