

export function tensionFromOrigamiValue(oValue: number): number {
    return (oValue - 30.0) * 3.62 + 194.0
}

export function origamiValueFromTension(tension: number): number {
    return (tension - 194.0) / 3.62 + 30.0
}

export function frictionFromOrigamiValue(oValue: number): number {
    return (oValue - 8.0) * 3.0 + 25.0
}

export function origamiFromFriction(friction: number): number {
    return (friction - 25.0) / 3.0 + 8.0
}