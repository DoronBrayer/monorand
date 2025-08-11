// /shuffrand/inspection.util.shuffle.ts

/**
 * Standard (but cryptographically-insecure!) in-place shuffle just for performance comparison.
 * @param array The array to shuffle.
 * @returns A new, shuffled array.
 */
export function standardInplaceShuffle<T>(array: T[]): T[] {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }
    return shuffledArray
}
