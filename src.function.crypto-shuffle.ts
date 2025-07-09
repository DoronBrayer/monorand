// src.function.crypto-shuffle.ts

/**
 * shuffrand - Cryptographically Secure Array Shuffling
 *
 * This file contains the core logic for shuffling arrays using a cryptographically secure method,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import types and the cryptoRandom function from their respective dot-categorized files
import { ShuffleParams, shuffleParamsSchema } from './src.types.js'
import { cryptoRandom } from './src.function.crypto-random.js'
// REMOVED: import { Constants } from './src.constants.js' // No longer needed for MAX_SHUFFLE_ATTEMPTS

// REMOVED: const MAX_SHUFFLE_ATTEMPTS = 12; // This constant is no longer needed

/**
 * Shuffles an array using the cryptographically secure Fisher–Yates algorithm.
 * Wikipedia.org/wiki/Fisher–Yates_shuffle
 *
 * @param {ShuffleParams<T>} [rawParams={}] - The raw parameters for shuffling the array.
 * @param {T[]} [rawParams.arr=[]] - The array to shuffle.
 * @param {boolean} [rawParams.isDestructive=false] - Whether to shuffle the array in place (destructive) or create a new shuffled array (non-destructive).
 * @param {boolean} [rawParams.preventIdentical=false] - If true, and the initial shuffle results in an array identical to the original input,
 * the first and last elements will be swapped to guarantee a different result.
 * This introduces a statistical bias by excluding the original permutation. Do not use in cryptographic or
 * fairness-critical contexts where absolute unbiased randomness is required.
 * @returns {T[]} - The shuffled array.
 * @throws {TypeError} - If input parameters do not conform to the schema.
 */
export function cryptoShuffle<T>(rawParams: ShuffleParams<T> = {}): T[] {
    let validatedParams: Required<ShuffleParams<T>>

    // --- ArkType Input Validation and Default Application ---
    try {
        shuffleParamsSchema.assert(rawParams)

        validatedParams = {
            arr: rawParams.arr ?? [],
            isDestructive: rawParams.isDestructive ?? false,
            preventIdentical: rawParams.preventIdentical ?? false,
        } as Required<ShuffleParams<T>>;
    } catch (e: any) {
        throw new TypeError(`Invalid cryptoShuffle parameters: ${e.summary || e.message}`)
    }
    // --- END ArkType Input Validation and Default Application ---

    const { arr, isDestructive, preventIdentical } = validatedParams

    let workingArray = isDestructive ? arr : [...arr]
    const length = workingArray.length

    // Store a copy of the original array for comparison if preventIdentical is true
    // This is only needed if preventIdentical is true AND the shuffle is non-destructive
    const originalArrayCopy = preventIdentical && !isDestructive ? JSON.stringify(arr) : null;

    // --- Standard Fisher-Yates Shuffle Logic (single pass) ---
    for (let i = length - 1; i > 0; i--) {
        const j = cryptoRandom({
            lowerBound: 0,
            upperBound: i,
            typeOfNum: 'integer',
            exclusion: 'none',
        })

        ;[workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]]
    }
    // --- End Standard Fisher-Yates Shuffle Logic ---

    // HERE: Conditional swap logic for preventIdentical
    // If preventIdentical is true, and the shuffled array is identical to the original,
    // and the array has at least 2 elements, perform the swap.
    if (preventIdentical && originalArrayCopy !== null && JSON.stringify(workingArray) === originalArrayCopy && length > 1) {
        // Swap the first and last elements to guarantee a different result
        [workingArray[0], workingArray[length - 1]] = [workingArray[length - 1], workingArray[0]];
    }

    return workingArray
}