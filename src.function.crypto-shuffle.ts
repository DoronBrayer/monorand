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

/**
 * Shuffles an array using the cryptographically secure Fisher–Yates algorithm.
 * Wikipedia.org/wiki/Fisher–Yates_shuffle
 *
 * @param {T[]} [arr=[]] - The array to shuffle. Defaults to an empty array if omitted.
 * @param {object} [options={}] - Optional parameters for shuffling.
 * @param {boolean} [options.isDestructive=false] - Whether to shuffle the array in place (destructive) or create a new shuffled array (non-destructive).
 * @param {boolean} [options.preventIdentical=false] - If true, and the initial shuffle results in an array identical to the original input,
 * the first and last elements will be swapped to guarantee a different result.
 * This introduces a statistical bias by excluding the original permutation. Do not use in cryptographic or
 * fairness-critical contexts where absolute unbiased randomness is required.
 * @returns {T[]} - The shuffled array.
 * @throws {TypeError} - If input parameters do not conform to the schema or if array serialization fails.
 */
export function cryptoShuffle<T>(
    arr: T[] = [],
    options: { isDestructive?: boolean; preventIdentical?: boolean } = {}
): T[] {
    // --- NEW CUSTOM VALIDATION FOR OPTIONS OBJECT (DX-focused) ---
    // Catches cases where 'options' itself is null, which bypasses default parameter assignment.
    if (options === null) {
        throw new TypeError(
            "Invalid cryptoShuffle parameters: 'options' cannot be null. Please provide an object or omit it."
        )
    }
    // --- END NEW CUSTOM VALIDATION ---

    // Construct the full parameters object for schema validation
    const fullParams: ShuffleParams<T> = {
        arr: arr,
        isDestructive: options.isDestructive ?? false,
        preventIdentical: options.preventIdentical ?? false,
    }

    let validatedParams: Required<ShuffleParams<T>>

    // --- ArkType Input Validation and Default Application ---
    try {
        shuffleParamsSchema.assert(fullParams)

        validatedParams = {
            arr: fullParams.arr,
            isDestructive: fullParams.isDestructive,
            preventIdentical: fullParams.preventIdentical,
        } as Required<ShuffleParams<T>>
    } catch (e: any) {
        // Wrap ArkType errors for consistent DX
        throw new TypeError(`Invalid cryptoShuffle parameters: ${e.summary || e.message}`)
    }
    // --- END ArkType Input Validation and Default Application ---

    const { arr: validatedArr, isDestructive, preventIdentical } = validatedParams

    const workingArray = isDestructive ? validatedArr : [...validatedArr]
    const length = workingArray.length

    // Store a stringified version of the original array state for comparison.
    // This must be done BEFORE the shuffle if preventIdentical is true.
    let originalStateString: string | null = null
    if (preventIdentical) {
        try {
            // We stringify 'validatedArr' which is the true original state,
            // before 'workingArray' is potentially mutated by the shuffle.
            originalStateString = JSON.stringify(validatedArr)
        } catch (e: any) {
            throw new TypeError(
                `Invalid cryptoShuffle parameters: Array elements cannot be serialized for 'preventIdentical' comparison. Ensure all elements are JSON-serializable. Original error: ${e.message}`
            )
        }
    }

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

    // Conditional swap logic for preventIdentical.
    // This now correctly uses the pre-shuffle state string for comparison.
    if (preventIdentical && originalStateString !== null && length > 1) {
        let shuffledStateString: string
        try {
            shuffledStateString = JSON.stringify(workingArray)
        } catch (e: any) {
            throw new TypeError(
                `Invalid cryptoShuffle parameters: Shuffled array elements cannot be serialized for 'preventIdentical' comparison. Ensure all elements are JSON-serializable. Original error: ${e.message}`
            )
        }

        if (shuffledStateString === originalStateString) {
            // Swap the first and last elements to guarantee a different result
            ;[workingArray[0], workingArray[length - 1]] = [workingArray[length - 1], workingArray[0]]
        }
    }

    return workingArray
}
