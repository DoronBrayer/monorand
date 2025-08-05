// inspection.util.consume.ts

/**
 * A consumer function that prevents the JS engine from optimizing away
 * benchmarked code, satisfying the 'no-unused-expressions' ESLint rule.
 * This is a local implementation of the "blackbox" pattern.
 * @param _value - The value to consume.
 */
export function consume(_value: any): void {
    // This function intentionally does nothing.
}
