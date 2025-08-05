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
 * @template T - The type of elements in the array.
 * @param {T[]} [arr=[]] - The array to shuffle. Defaults to an empty array if omitted.
 * @param {object} [options={}] - Optional parameters for shuffling.
 * @param {boolean} [options.isDestructive=false] - Whether to shuffle the array in place (destructive) or create a new shuffled array (non-destructive).
 * @param {boolean} [options.preventIdentical=false] - If true, and the initial shuffle results in an array identical to the original input,
 * the first and last elements will be swapped to guarantee a different result.
 * This introduces a statistical bias by excluding the original permutation. Do not use in cryptographic or
 * fairness-critical contexts where absolute unbiased randomness is required.
 * @param {number} [options.startIndex=0] - The starting index of the subarray to shuffle (inclusive).
 * Defaults to 0, shuffling from the beginning of the array.
 * Must be a non-negative integer within the array bounds.
 * If greater than or equal to `endIndex`, no shuffling occurs on the subarray.
 * @param {number} [options.endIndex=arr.length] - The ending index of the subarray to shuffle (exclusive).
 * Defaults to the array's length, shuffling to the end of the array.
 * Must be a non-negative integer within the array bounds (0 to arr.length).
 * If less than or equal to `startIndex`, no shuffling occurs on the subarray.
 * @returns {T[]} - The shuffled array.
 * @throws {TypeError} - If input parameters do not conform to the schema or if array serialization fails.
 * @since 1.0.0
 * @since 1.6.0 Added `startIndex` and `endIndex` for subarray shuffling.
 */
export function cryptoShuffle<T>(
    arr: T[] = [],
    options: {
        isDestructive?: boolean
        preventIdentical?: boolean
        startIndex?: number
        endIndex?: number
    } = {}
): T[] {
    // --- NEW CUSTOM VALIDATION FOR OPTIONS OBJECT (DX-focused) ---
    // Catches cases where 'options' itself is null, which bypasses default parameter assignment.
    if (options === null) {
        throw new TypeError(
            "Invalid cryptoShuffle parameters: 'options' cannot be null. Please provide an object or omit it."
        )
    }
    // --- END NEW CUSTOM VALIDATION ---

    // --- EARLY TYPE VALIDATION FOR startIndex AND endIndex ---
    // Since we're using 'unknown?' in ArkType, we need to validate types manually
    if (options.startIndex !== undefined) {
        if (typeof options.startIndex !== 'number') {
            throw new TypeError(
                `Invalid cryptoShuffle parameters: startIndex must be a number (was ${typeof options.startIndex})`
            )
        }
        if (!Number.isInteger(options.startIndex)) {
            throw new TypeError(
                `Invalid cryptoShuffle parameters: startIndex must be an integer (was ${options.startIndex})`
            )
        }
    }
    if (options.endIndex !== undefined) {
        if (typeof options.endIndex !== 'number') {
            throw new TypeError(
                `Invalid cryptoShuffle parameters: endIndex must be a number (was ${typeof options.endIndex})`
            )
        }
        if (!Number.isInteger(options.endIndex)) {
            throw new TypeError(
                `Invalid cryptoShuffle parameters: endIndex must be an integer (was ${options.endIndex})`
            )
        }
    }
    // --- END EARLY TYPE VALIDATION ---

    // Construct the full parameters object for schema validation
    // Include new parameters in the object for validation
    const fullParams: ShuffleParams<T> = {
        arr: arr,
        isDestructive: options.isDestructive ?? false,
        preventIdentical: options.preventIdentical ?? false,
        startIndex: options.startIndex, // Will be undefined if not provided, which is valid per schema
        endIndex: options.endIndex, // Will be undefined if not provided, which is valid per schema
    }

    let validatedParams: Required<ShuffleParams<T>> // This will be incorrect for optional params, so we adjust below

    // --- ArkType Input Validation and Default Application ---
    try {
        shuffleParamsSchema.assert(fullParams)
        // Manually apply defaults after validation for optional parameters that might be undefined
        // ArkType 'optional()' sets them to undefined if missing, we need to apply our specific defaults
        validatedParams = {
            arr: fullParams.arr ?? [],
            isDestructive: fullParams.isDestructive ?? false,
            preventIdentical: fullParams.preventIdentical ?? false,
            // Apply defaults for startIndex and endIndex
            startIndex: fullParams.startIndex ?? 0,
            endIndex: fullParams.endIndex ?? fullParams.arr?.length ?? 0, // Default to array length or 0 if arr is undefined/empty
        } as unknown as Required<ShuffleParams<T>> // Type assertion is tricky with partials, this is a pragmatic approach
    } catch (e: any) {
        // Wrap ArkType errors for consistent DX
        throw new TypeError(`Invalid cryptoShuffle parameters: ${e.summary || e.message}`)
    }
    // --- END ArkType Input Validation and Default Application ---

    const { arr: validatedArr, isDestructive, preventIdentical, startIndex, endIndex } = validatedParams

    // --- NEW CUSTOM VALIDATION FOR startIndex AND endIndex (DX-focused) ---
    // Validate startIndex and endIndex after defaults are applied and types are known to be numbers.
    const arrayLength = validatedArr.length

    // Ensure startIndex and endIndex are within valid bounds [0, arrayLength]
    if (startIndex < 0 || startIndex > arrayLength) {
        throw new TypeError(
            `Invalid cryptoShuffle parameters: 'startIndex' (${startIndex}) must be between 0 and the array length (${arrayLength}), inclusive.`
        )
    }
    if (endIndex < 0 || endIndex > arrayLength) {
        throw new TypeError(
            `Invalid cryptoShuffle parameters: 'endIndex' (${endIndex}) must be between 0 and the array length (${arrayLength}), inclusive.`
        )
    }
    // Ensure logical consistency: startIndex should not be greater than endIndex.
    // If startIndex >= endIndex, the range is empty or invalid, so no shuffling should occur in the subarray.
    // This is handled naturally by the loop condition `i > startIndexAdjusted`, but explicit validation can be clearer.
    // We'll let the loop handle it implicitly as it's a valid edge case (no-op shuffle on subarray).
    // --- END NEW CUSTOM VALIDATION ---

    const workingArray = isDestructive ? validatedArr : [...validatedArr]
    const length = workingArray.length // Declare 'length' before it's used for adjusting indices.

    // --- NEW ENFORCEMENTS FOR FEATURE MINIMUM LENGTHS ---
    // Enforce minimum array length for preventIdentical feature.
    // Requires at least 2 elements to guarantee a different result via the first/last element swap.
    if (preventIdentical && arrayLength < 2) {
        throw new TypeError(
            "Invalid cryptoShuffle parameters: 'preventIdentical' requires an array with at least 2 elements to guarantee a different result."
        )
    }

    // Adjust effective start and end indices for the shuffle loop
    // This handles the default application and ensures they are within bounds relative to the array.
    const startIndexAdjusted = Math.max(0, Math.min(startIndex, length))
    const endIndexAdjusted = Math.max(startIndexAdjusted, Math.min(endIndex, length))

    // Enforce minimum effective range length for isDestructive feature to have an effect.
    // Requires at least 2 elements in the shuffle range for the Fisher–Yates loop to perform swaps.
    // This check uses the adjusted indices to evaluate the actual range that will be processed.
    if (isDestructive && endIndexAdjusted <= startIndexAdjusted + 1) {
        throw new TypeError(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )
    }
    // --- END NEW ENFORCEMENTS ---

    // Store a stringified version of the original array state for comparison.
    // This must be done BEFORE the shuffle if preventIdentical is true.
    // For preventIdentical, the comparison is ALWAYS against the full original array state,
    // regardless of which subarray was shuffled.
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

    // --- Modified Fisher–Yates Shuffle Logic (single pass, subarray aware) ---
    // The loop now shuffles indices from (endIndexAdjusted - 1) down to startIndexAdjusted.
    // Indices outside this range remain untouched.
    for (let i = endIndexAdjusted - 1; i > startIndexAdjusted; i--) {
        // Generate a cryptographically secure random index j where startIndexAdjusted <= j <= i
        const j = cryptoRandom({
            lowerBound: startIndexAdjusted,
            upperBound: i,
            typeOfNum: 'integer',
            exclusion: 'none',
        })
        // Swap elements at indices i and j within the working array
        ;[workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]]
    }
    // --- End Modified Fisher–Yates Shuffle Logic ---

    // Conditional swap logic for preventIdentical.
    // This now correctly uses the pre-shuffle state string for comparison.
    // The check is performed on the *entire* workingArray, not just the shuffled subarray.
    // This ensures preventIdentical works as designed: the final output must differ from the full input.
    if (preventIdentical && originalStateString !== null && length > 1) {
        // length > 1 check is now redundant due to enforcement, but kept for robustness
        let shuffledStateString: string
        try {
            shuffledStateString = JSON.stringify(workingArray)
        } catch (e: any) {
            throw new TypeError(
                `Invalid cryptoShuffle parameters: Shuffled array elements cannot be serialized for 'preventIdentical' comparison. Ensure all elements are JSON-serializable. Original error: ${e.message}`
            )
        }
        if (shuffledStateString === originalStateString) {
            // Swap the first and last elements of the entire array to guarantee a different result
            ;[workingArray[0], workingArray[length - 1]] = [workingArray[length - 1], workingArray[0]]
        }
    }

    return workingArray
}
