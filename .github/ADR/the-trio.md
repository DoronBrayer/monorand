# The trio
## 01. cryptoRandom
```typescript
// function.crypto-random.ts

/**
 * shuffrand - Cryptographically Secure Random Number Generation
 *
 * This file contains the core logic for generating cryptographically secure random numbers,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import types, constants, and ArkType schema from their respective dot-categorized files
import { RandomParams, randomParamsSchema } from './src.types.js'
import { Constants } from './src.constants.js'

/**
 * Generates a cryptographically secure random number within a specified range.
 *
 * @param {RandomParams} [rawParams={}] - The raw parameters for random number generation.
 * @param {number} [rawParams.lowerBound=0] - The lower bound (inclusive) of the random number.
 * @param {number} [rawParams.upperBound=2] - The upper bound (exclusive for doubles, inclusive for integers) of the random number.
 * @param {'integer'|'double'} [rawParams.typeOfNum='integer'] - The type of number to generate ('integer' (default) or 'double').
 * @param {'none'|'lower bound'|'upper bound'|'both'} [rawParams.exclusion='none'] - Specifies which bounds to exclude.
 * @param {number} [rawParams.maxFracDigits=3] - The maximum number of fractional digits for 'double' type numbers.
 * If specified, the generated double will be rounded to this many decimal places.
 * Must be a non-negative integer between 0 and 15. Defaults to `3`.
 * @returns {number} - A cryptographically secure random number.
 * @throws {TypeError} - If input parameters do not conform to the schema or if an invalid range is provided.
 */
export function cryptoRandom(rawParams: RandomParams = {}): number {
    // --- NEW CUSTOM VALIDATION FOR MAXFRACDIGITS (DX-focused) ---
    // This check provides a highly tailored and user-friendly error message for maxFracDigits,
    // explaining the reason for the limits (reliable precision).
    // It's placed before ArkType to ensure this custom message takes precedence.

    const effectiveMaxFracDigits = rawParams.maxFracDigits ?? 3 // Apply default for initial check

    if (
        typeof effectiveMaxFracDigits !== 'number' ||
        !Number.isInteger(effectiveMaxFracDigits) ||
        effectiveMaxFracDigits < Constants.MIN_FRACTIONAL_DIGITS ||
        effectiveMaxFracDigits > Constants.MAX_FRACTIONAL_DIGITS
    ) {
        throw new TypeError(
            `maxFracDigits (currently ${effectiveMaxFracDigits}) must be an integer between ${Constants.MIN_FRACTIONAL_DIGITS} and ${Constants.MAX_FRACTIONAL_DIGITS} (inclusive) to ensure reliable precision.`
        )
    }
    // --- END NEW CUSTOM VALIDATION ---

    // Step 1: Assert rawParams against the schema for runtime validation.
    // This ensures the input structure is valid, but properties are still optional.
    // NOTE: ArkType will now handle type/range validation for lowerBound/upperBound
    // (via src.types.ts schema) and other parameters, as the custom maxFracDigits
    // check is handled above.
    randomParamsSchema.assert(rawParams)

    // Step 2: Create the validatedParams object with default values using ?? operator.
    // Step 3: Explicitly cast the *entire object literal* to Required<RandomParams>.
    // This tells TypeScript that all properties are now guaranteed to be non-undefined
    // because of the defaults applied. This is the most direct way to resolve
    // the "possibly undefined" errors at compile time.
    const validatedParams: Required<RandomParams> = {
        lowerBound: rawParams.lowerBound ?? 0,
        upperBound: rawParams.upperBound ?? 2, // Corrected default upperBound to 2 as per test plan
        typeOfNum: rawParams.typeOfNum ?? 'integer',
        exclusion: rawParams.exclusion ?? 'none',
        maxFracDigits: rawParams.maxFracDigits ?? 3
    }

    // TRULY needed: Implement the new API rule: disallow maxFracDigits: 0 for double typeOfNum
    if (validatedParams.typeOfNum === 'double' && validatedParams.maxFracDigits === 0) {
        throw new TypeError(
            `Invalid cryptoRandom parameters: 'maxFracDigits' cannot be 0 when 'typeOfNum' is 'double'. Use 'typeOfNum: "integer"' for whole numbers.`
        )
    }

    // Ensure globalThis.crypto is available. This check is crucial for environments
    // where WebCrypto API might not be present (though highly unlikely in modern targets).
    if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.getRandomValues) {
        throw new Error(
            'Cryptographically secure random number generator (WebCrypto API) is not available in this environment.'
        )
    }

    // Destructure directly from the explicitly typed validatedParams constant.
    // TypeScript should now correctly infer all these as non-nullable.
    const { lowerBound, upperBound, typeOfNum, exclusion, maxFracDigits } = validatedParams

    // Ensure min is always the lower value and max is always the higher value
    const min = Math.min(lowerBound, upperBound)
    const max = Math.max(lowerBound, upperBound)

    // Handle edge case where lowerBound equals upperBound
    if (min === max) {
        // If typeOfNum === 'double' and exclusion is 'both', it's an invalid range
        if (typeOfNum === 'double' && exclusion === 'both') {
            throw new TypeError(
                `Invalid range for double with 'both' exclusion: lowerBound (${lowerBound}) equals upperBound (${upperBound}).`
            )
        }
        return min // Return the single possible value
    }

    let result: number
    let attempts = 0
    const maxAttempts = Constants.MAX_ATTEMPTS_TO_GENERATE_NUM

    do {
        let currentLowerBound = min
        let currentUpperBound = max

        // --- Integer Specific Logic & Exclusion Pre-checks ---
        if (typeOfNum === 'integer') {
            // FIX: For integer type, ensure bounds are rounded to integers first,
            // as random number generation for integers operates on integer ranges.
            currentLowerBound = Math.ceil(min) // Round up lower bound
            currentUpperBound = Math.floor(max) // Round down upper bound

            // Apply exclusion for integers by adjusting bounds
            if (exclusion === 'lower bound' || exclusion === 'both') {
                currentLowerBound++
            }
            if (exclusion === 'upper bound' || exclusion === 'both') {
                currentUpperBound--
            }

            // If currentLowerBound exceeds currentUpperBound after adjustments, it's an empty range.
            // This check replaces the problematic 'thresholds' logic from the old function,
            // as it correctly identifies truly impossible integer ranges after exclusions.
            if (currentLowerBound > currentUpperBound) {
                // Optimized message using en dash for range
                throw new TypeError(
                    `Invalid integer range after exclusions: the original range of [${lowerBound}\u2013${upperBound}] with exclusion '${exclusion}' results in an empty integer range.`
                )
            }

            const range = currentUpperBound - currentLowerBound + 1

            const bytesNeeded = Math.ceil(Math.log2(range) / 8)
            const maxValidValue = Math.pow(256, bytesNeeded) - (Math.pow(256, bytesNeeded) % range)

            let randomNumber: number
            const byteArray = new Uint8Array(bytesNeeded)

            do {
                globalThis.crypto.getRandomValues(byteArray)
                randomNumber = 0
                for (let i = 0; i < bytesNeeded; i++) {
                    randomNumber = randomNumber * 256 + byteArray[i]
                }
            } while (randomNumber >= maxValidValue)

            result = currentLowerBound + (randomNumber % range)
        } else {
            // typeOfNum === 'double' (and maxFracDigits is NOT 0, due to early validation)
            const BYTES_FOR_DOUBLE = 8
            const MAX_UINT64 = 2 ** (BYTES_FOR_DOUBLE * 8) // Max value for a 64-bit unsigned integer

            let rawDouble: number
            const byteArray = new Uint8Array(BYTES_FOR_DOUBLE)

            // Generate a random double between 0 (inclusive) and 1 (exclusive)
            do {
                globalThis.crypto.getRandomValues(byteArray)
                let randomNumber = 0
                for (let i = 0; i < BYTES_FOR_DOUBLE; i++) {
                    randomNumber = randomNumber * 256 + byteArray[i]
                }
                rawDouble = randomNumber / MAX_UINT64
            } while (rawDouble === 1) // Ensure it's strictly less than 1 to avoid issues with upperBound scaling

            // Scale to the desired range
            result = currentLowerBound + rawDouble * (currentUpperBound - currentLowerBound)

            // Apply maxFracDigits rounding if specified
            // maxFracDigits is now guaranteed to be > 0 by the new validation
            const actualMaxFracDigits = Number(maxFracDigits) // Robust conversion
            // The condition `actualMaxFracDigits >= 0` is now implicitly `actualMaxFracDigits > 0`
            // due to the validation above, so we can simplify or keep as is.
            // Keeping as `actualMaxFracDigits >= 0` is fine, as it's still true.
            if (!isNaN(actualMaxFracDigits) && actualMaxFracDigits >= 0) {
                const factor = Math.pow(10, actualMaxFracDigits)
                result = Math.round(result * factor) / factor
            }
        }

        // --- Exclusion checks with appropriate comparison method for both types ---
        let isExcluded = false

        if (typeOfNum === 'double') {
            // For doubles, use epsilon comparison (from OLD-but-good)
            if (exclusion === 'lower bound' && Math.abs(result - min) < Number.EPSILON) {
                isExcluded = true
            } else if (exclusion === 'upper bound' && Math.abs(result - max) < Number.EPSILON) {
                isExcluded = true
            } else if (
                exclusion === 'both' &&
                (Math.abs(result - min) < Number.EPSILON || Math.abs(result - max) < Number.EPSILON)
            ) {
                isExcluded = true
            }
        } else {
            // typeOfNum === 'integer'
            // For integers, use exact equality
            if (exclusion === 'lower bound' && result === min) {
                isExcluded = true
            } else if (exclusion === 'upper bound' && result === max) {
                isExcluded = true
            } else if (exclusion === 'both' && (result === min || result === max)) {
                isExcluded = true
            }
        }

        if (isExcluded) {
            attempts++
            continue // Re-roll
        }

        // Per design doctrine, a 'double' type must not be a whole number.
        // If we've generated one by chance, treat it as an invalid result and re-roll.
        if (typeOfNum === 'double' && Number.isInteger(result)) {
            attempts++
            continue // Re-roll
        }

        break // Exit loop if a valid number is found
    } while (attempts < maxAttempts)

    // Throw if max attempts reached without finding a valid number
    if (attempts >= maxAttempts) {
        // A more resilient and accurate error message.
        let reason = `the exclusion constraint: '${exclusion}'`
        if (typeOfNum === 'double') {
            reason += ` or the non-integer requirement`
        }
        throw new Error(
            `Unable to generate a random number within the range [${min}\u2013${max}] that satisfies ${reason}. Max attempts (${maxAttempts}) reached.`
        )
    }

    return result
}

```

## 02. cryptoShuffle
```typescript
// function.crypto-shuffle.ts

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
        endIndex: options.endIndex // Will be undefined if not provided, which is valid per schema
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
            endIndex: fullParams.endIndex ?? fullParams.arr?.length ?? 0 // Default to array length or 0 if arr is undefined/empty
        } as unknown as Required<ShuffleParams<T>> // Type assertion is tricky with partials, this is a pragmatic approach
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new TypeError(`Invalid cryptoShuffle parameters: ${e.message}`)
        } else {
            // Fallback for non-Error objects
            throw new TypeError(`Invalid cryptoShuffle parameters: An unknown error occurred during validation.`)
        }
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
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new TypeError(`Invalid cryptoShuffle parameters: ${e.message}`)
            } else {
                // Fallback for non-Error objects
                throw new TypeError(`Invalid cryptoShuffle parameters: An unknown error occurred during validation.`)
            }
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
            exclusion: 'none'
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
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new TypeError(`Invalid cryptoShuffle parameters: ${e.message}`)
            } else {
                // Fallback for non-Error objects
                throw new TypeError(`Invalid cryptoShuffle parameters: An unknown error occurred during validation.`)
            }
        }
        if (shuffledStateString === originalStateString) {
            // Swap the first and last elements of the entire array to guarantee a different result
            ;[workingArray[0], workingArray[length - 1]] = [workingArray[length - 1], workingArray[0]]
        }
    }

    return workingArray
}

```

## 03. cryptoString
```typescript
// function.crypto-string.ts (Final & Corrected)

/**
 * shuffrand - Cryptographically Secure Random String Generation
 *
 * This file contains the core logic for generating cryptographically secure random strings,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import types, Constants, and other shuffrand functions
import { CryptoStringParams, cryptoStringParamsSchema } from './src.types.js'
import { cryptoRandom } from './src.function.crypto-random.js'
import { cryptoShuffle } from './src.function.crypto-shuffle.js'
import { Constants } from './src.constants.js'

// Define standard character sets mapping to Constants for convenience and security
const CHARACTER_SETS_MAP = {
    alphanumeric: Constants.ALPHANUMERIC_CHARS,
    numeric: Constants.DIGITS,
    alpha: Constants.LATIN_LETTERS,
    hex: Constants.HEX_CHARS,
    uppercase: Constants.LATIN_UPPERCASE_LETTERS,
    lowercase: Constants.LATIN_LOWERCASE_LETTERS
} as const

/**
 * Generates a cryptographically secure random string of a specified length
 * from a given character set.
 *
 * @param {CryptoStringParams} [rawParams={}] - The raw parameters for random string generation.
 * @param {number} [rawParams.length=16] - The desired length of the random string.
 * @param {'alphanumeric'|'numeric'|'alpha'|'hex'|'uppercase'|'lowercase'|string} [rawParams.characterSet='alphanumeric'] - The character set to use.
 * @param {boolean} [rawParams.noRepeat=false] - If true, ensures no character appears more than once in the result.
 * @returns {string} - The cryptographically secure random string.
 * @throws {TypeError} - If input parameters are invalid.
 */
export function cryptoString(rawParams: CryptoStringParams = {}): string {
    // --- Initial Parameter Validation ---
    if (rawParams === null) {
        throw new TypeError(
            "Invalid cryptoString parameters: 'rawParams' cannot be null. Please provide an object or omit it."
        )
    }
    try {
        cryptoStringParamsSchema.assert(rawParams)
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new TypeError(`Invalid cryptoString parameters: ${e.message}`)
        } else {
            throw new TypeError(`Invalid cryptoString parameters: An unknown error occurred during validation.`)
        }
    }

    // Apply defaults
    const effectiveLength = rawParams.length ?? 16
    const effectiveCharacterSet = rawParams.characterSet ?? 'alphanumeric'
    const effectiveNoRepeat = rawParams.noRepeat ?? false

    // --- Custom Logic Validation ---
    if (effectiveLength > 1_000_000) {
        throw new TypeError(
            `Invalid cryptoString parameters: 'length' exceeds maximum safe limit of 1,000,000 characters.`
        )
    }

    let finalCharacterSet: string
    if (
        typeof effectiveCharacterSet === 'string' &&
        Object.prototype.hasOwnProperty.call(CHARACTER_SETS_MAP, effectiveCharacterSet)
    ) {
        finalCharacterSet = CHARACTER_SETS_MAP[effectiveCharacterSet as keyof typeof CHARACTER_SETS_MAP]
    } else {
        finalCharacterSet = effectiveCharacterSet as string
        // CORRECTED: A custom character set MUST NOT contain duplicates, ever.
        const charsArray = Array.from(finalCharacterSet)
        const uniqueChars = new Set(charsArray)
        if (uniqueChars.size !== charsArray.length) {
            throw new TypeError(
                'Invalid cryptoString parameters: Custom character set contains duplicate characters, which would skew randomness distribution.'
            )
        }
    }

    if (finalCharacterSet.length === 0 && effectiveLength > 0) {
        throw new TypeError("Invalid cryptoString parameters: The resolved 'characterSet' cannot be empty.")
    }

    const uniqueCharactersArray = Array.from(new Set(Array.from(finalCharacterSet)))

    if (uniqueCharactersArray.length < 2 && effectiveLength > 1) {
        throw new TypeError(
            'Invalid cryptoString parameters: Character set must contain at least 2 unique characters to generate a string longer than 1.'
        )
    }

    if (effectiveNoRepeat) {
        if (effectiveLength > uniqueCharactersArray.length) {
            throw new TypeError(
                `Invalid cryptoString parameters: Cannot generate a string of length ${effectiveLength} with no repeats from a character set with only ${uniqueCharactersArray.length} unique characters.`
            )
        }
    }

    if (effectiveLength === 0) {
        return ''
    }

    // --- Core Generation Logic ---
    if (effectiveNoRepeat) {
        const shuffledCharacters = cryptoShuffle(uniqueCharactersArray)
        return shuffledCharacters.slice(0, effectiveLength).join('')
    } else {
        const resultArray = new Array<string>(effectiveLength)
        const finalCharacterSetArray = Array.from(finalCharacterSet)
        const characterSetLength = finalCharacterSetArray.length
        for (let i = 0; i < effectiveLength; i++) {
            const randomIndex = cryptoRandom({
                lowerBound: 0,
                upperBound: characterSetLength - 1,
                typeOfNum: 'integer',
                exclusion: 'none'
            })
            resultArray[i] = finalCharacterSetArray[randomIndex]
        }
        return resultArray.join('')
    }
}

/**
 * ... (JSDoc for calculateStringEntropy) ...
 */
export function calculateStringEntropy(params: CryptoStringParams = {}): number {
    try {
        cryptoStringParamsSchema.assert(params)
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new TypeError(`Invalid cryptoString parameters: ${e.message}`)
        } else {
            throw new TypeError(`Invalid cryptoString parameters: An unknown error occurred during validation.`)
        }
    }

    const effectiveLength = params.length ?? 16
    const effectiveCharacterSet = params.characterSet ?? 'alphanumeric'
    const effectiveNoRepeat = params.noRepeat ?? false

    let finalCharacterSet: string
    if (
        typeof effectiveCharacterSet === 'string' &&
        Object.prototype.hasOwnProperty.call(CHARACTER_SETS_MAP, effectiveCharacterSet)
    ) {
        finalCharacterSet = CHARACTER_SETS_MAP[effectiveCharacterSet as keyof typeof CHARACTER_SETS_MAP]
    } else {
        finalCharacterSet = effectiveCharacterSet as string
    }

    const uniqueChars = new Set(Array.from(finalCharacterSet))
    const charsetSize = uniqueChars.size

    if (effectiveNoRepeat) {
        if (effectiveLength > charsetSize) {
            throw new TypeError(
                `Invalid calculateStringEntropy parameters: Cannot calculate entropy for a length of ${effectiveLength} with no repeats from a character set with only ${charsetSize} unique characters.`
            )
        }
        let totalEntropy = 0
        for (let i = 0; i < effectiveLength; i++) {
            const availableChoices = charsetSize - i
            if (availableChoices > 0) {
                totalEntropy += Math.log2(availableChoices)
            }
        }
        return totalEntropy
    }

    if (charsetSize < 2 && effectiveLength > 1) {
        throw new TypeError(
            'Invalid calculateStringEntropy parameters: Character set must contain at least 2 unique characters to calculate meaningful entropy.'
        )
    }

    if (charsetSize === 0) {
        return 0
    }

    return Math.log2(charsetSize) * effectiveLength
}
```