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
    // 'arr' is now guaranteed to be an array due to function signature default,
    // so ArkType will only validate its type if a non-array is explicitly passed.
    const fullParams: ShuffleParams<T> = {
        arr: arr,
        isDestructive: options.isDestructive ?? false,
        preventIdentical: options.preventIdentical ?? false,
    }

    let validatedParams: Required<ShuffleParams<T>>

    // --- ArkType Input Validation and Default Application ---
    try {
        shuffleParamsSchema.assert(fullParams) // Assert the constructed fullParams object

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

    // Destructure from validatedParams, now correctly typed
    const { arr: validatedArr, isDestructive, preventIdentical } = validatedParams

    const workingArray = isDestructive ? validatedArr : [...validatedArr]
    const length = workingArray.length

    // Store a copy of the original array for comparison if preventIdentical is true
    // This is only needed if preventIdentical is true AND the shuffle is non-destructive
    let originalArrayCopy: string | null = null
    if (preventIdentical && !isDestructive) {
        try {
            originalArrayCopy = JSON.stringify(validatedArr)
        } catch (e: any) {
            // --- NEW CUSTOM VALIDATION FOR JSON.stringify FAILURE (DX-focused) ---
            // Catches cases where array elements are not JSON-serializable (e.g., BigInt, Symbol, circular refs)
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

    // HERE: Conditional swap logic for preventIdentical
    // If preventIdentical is true, and the shuffled array is identical to the original,
    // and the array has at least 2 elements, perform the swap.
    if (preventIdentical && originalArrayCopy !== null && length > 1) {
        let shuffledArrayString: string
        try {
            shuffledArrayString = JSON.stringify(workingArray)
        } catch (e: any) {
            // --- NEW CUSTOM VALIDATION FOR JSON.stringify FAILURE (DX-focused) ---
            // Catches cases where array elements are not JSON-serializable during post-shuffle comparison
            throw new TypeError(
                `Invalid cryptoShuffle parameters: Shuffled array elements cannot be serialized for 'preventIdentical' comparison. Ensure all elements are JSON-serializable. Original error: ${e.message}`
            )
        }

        if (shuffledArrayString === originalArrayCopy) {
            // Swap the first and last elements to guarantee a different result
            ;[workingArray[0], workingArray[length - 1]] = [workingArray[length - 1], workingArray[0]]
        }
    }

    return workingArray
}
