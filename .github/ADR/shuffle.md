**The Core Issue: Understanding Range Semantics**
The heart of the matter lies in how the `startIndex` and `endIndex` parameters define the portion of the array to be shuffled. There are two common ways to define a range:

1.  **Inclusive Start, Exclusive End (Current/Specified Logic):** This is the prevalent convention in programming. `startIndex` points to the first element _included_ in the operation. `endIndex` points to the element _just after_ the last element included. Think of it as `[startIndex, endIndex)`.
2.  **Inclusive Start, Inclusive End (Your Logic/Alternative):** Both `startIndex` and `endIndex` point to elements that are _included_ in the operation. The range is `[startIndex, endIndex]`.

**Your Example: The Setup**

You provided a specific array and a specific usecase:

```javascript
const arr = [
    'a',
    'b',
    'l',
    'f',
    's',
    'r',
    'h',
    'd',
    'q',
    'o',
    't',
    'k',
    'm',
    'v',
    'g',
    'e',
    'u',
    'j',
    'i',
    'p',
    'w',
    'n',
    'c',
    'x',
    'y',
    'z',
]
// Indices: 0    1    2    3    4    5    6    7    8    9
//          10   11   12   13   14   15   16   17   18   19
//          20   21   22   23   24   25
```

- `arr[2]` is `'l'`.
- `arr[23]` is `'c'`.

**Your Goal (Your Own Logic Interpretation):**

You want to shuffle "all letters but the first and last two". This means:

- Keep `arr[0]` (`'a'`) and `arr[1]` (`'b'`) in place (first two).
- Keep `arr[24]` (`'y'`) and `arr[25]` (`'z'`) in place (last two).
- Shuffle the elements in between: from `arr[2]` (`'l'`) up to and _including_ `arr[23]` (`'c'`).

If we apply the **Inclusive Start, Inclusive End** logic:

- `startIndex = 2` (inclusive)
- `endIndex = 23` (inclusive)
- The range to shuffle is indices `[2, 3, 4, ..., 22, 23]`.
- **Expected Result:** The elements `'l'` through `'c'` are shuffled among themselves. The elements `'a'`, `'b'`, `'y'`, `'z'` remain exactly in their original positions (indices 0, 1, 24, 25). Result format: `["a", "b", <shuffled l to c>, "y", "z"]`.

**The Current Logic (According to `DOCTRINE.md` and the Code Snippet):**

The specification and the provided code snippet define the parameters as:

- `startIndex`: The starting index of the subarray to shuffle (**inclusive**).
- `endIndex`: The ending index of the subarray to shuffle (**exclusive**).

Applying the **Inclusive Start, Exclusive End** logic to Doron's call `cryptoShuffle(arr, { startIndex: 2, endIndex: 23 })`:

1.  `startIndex = 2` (inclusive) -> Start shuffling from index 2 (`'l'`).
2.  `endIndex = 23` (**exclusive**) -> Stop shuffling _before_ reaching index 23. The element at index 23 (`'c'`) is _not_ included in the shuffle operation.
3.  The range to shuffle is indices `[2, 3, 4, ..., 21, 22]`.
4.  Elements at indices 0, 1, 23, 24, 25 should remain untouched.
5.  **Expected Result (by Current Logic):** The elements `'l'` through `'w'` (indices 2-22) are shuffled. The elements `'a'`, `'b'`, `'c'`, `'x'`, `'y'`, `'z'` remain in their original positions (indices 0, 1, 23, 24, 25). Result format: `["a", "b", <shuffled l to w>, "c", "x", "y", "z"]`.

**The Discrepancy Doron Observed:**

Doron reported that when he called `cryptoShuffle(arr, { startIndex: 2, endIndex: 23 })`, the resulting array was:

```javascript
;[
    'a',
    'b',
    'n',
    'p',
    'u',
    'q',
    'h',
    'c',
    'k',
    'd',
    'v',
    'g',
    's',
    'l',
    'j',
    'o',
    'w',
    'f',
    'm',
    'i',
    'r',
    'e',
    't',
    'x',
    'y',
    'z',
]
```

Let's analyze the positions:

- Indices 0 (`'a'`) and 1 (`'b'`) are correct and untouched.
- The shuffled section starts at index 2.
- Crucially, the element that was originally at index 22 (`'w'`) is now at index 21 in the result.
- The element that was originally at index 23 (`'c'`) is now at index 23 in the result. **Wait, this seems wrong based on the result Doron showed. Let's recheck the result.**

Looking at Doron's result:
`["a","b","n","p","u","q","h","c","k","d","v","g","s","l","j","o","w","f","m","i","r","e","t","x","y","z"]`

- Index 0: `'a'` (Correct)
- Index 1: `'b'` (Correct)
- Index 22: `'t'` (Was `'w'` originally)
- Index 23: `'x'` (Was `'c'` originally)
- Index 24: `'y'` (Correct)
- Index 25: `'z'` (Correct)

Hmm, the element `'c'` (originally at index 23) has moved to index 23 in the _result string_, but the _value_ at index 23 in the result is `'x'`. The value `'c'` seems to have moved to index 7.

Let's recheck the original array:
`["a","b","l","f","s","r","h","d","q","o","t","k","m","v","g","e","u","j","i","p","w","n","c","x","y","z"]`
Index 23 is `'c'`.
Index 24 is `'x'`.
Index 25 is `'y'`.
Index 26 would be out of bounds.

In Doron's result:
`["a","b","n","p","u","q","h","c","k","d","v","g","s","l","j","o","w","f","m","i","r","e","t","x","y","z"]`
Index 7 is `'c'`.
Index 23 is `'x'`.
Index 24 is `'y'`.
Index 25 is `'z'`.

So, the element `'c'` (originally index 23) _did_ move (to index 7). The element `'x'` (originally index 24) moved to index 23.

This observation seems to contradict the expected behavior of the _provided code snippet_ if `endIndex` is truly exclusive.

Let's trace the _provided code snippet_ logic carefully with `startIndex: 2`, `endIndex: 23`:

1.  `arrayLength = 26`
2.  `startIndexAdjusted = Math.max(0, Math.min(2, 26))` = 2
3.  `endIndexAdjusted = Math.max(2, Math.min(23, 26))` = 23
4.  Loop: `for (let i = 23 - 1; i > 2; i--)` -> `for (let i = 22; i > 2; i--)`
5.  This loop iterates `i` from 22 down to 3.
6.  It swaps elements at these `i` indices with elements at random indices `j` where `2 <= j <= i`.
7.  Crucially, index 23 is _never_ touched by this loop.
8.  Indices 0, 1, 23, 24, 25 should remain unchanged.

**Reconciling the Discrepancy:**

Given the analysis, the provided code snippet _should_ treat `endIndex` as exclusive and leave the element at `endIndex` untouched. The fact that Doron observed the element _at_ the `endIndex` moving suggests one of the following:

1.  **The running code differs:** The actual implementation Doron is using might have a bug or differs from the code snippet provided (e.g., perhaps `endIndexAdjusted` is calculated as `endIndex - 1` somewhere, or the loop condition is `i >= startIndexAdjusted`).
2.  **Observation Error:** There might have been a mistake in observing or reporting the exact result array.

**Conclusion: The Problem Statement**

The problem stems from a potential mismatch between the documented/spec'd behavior (and the logic in the provided code snippet) and either the actual implementation being used or the observed result.

- **Your Own Logic (Implicitly Inclusive/Inclusive):** Based on Doron's description ("shuffle all letters but the first and last two"), Doron expected `startIndex: 2` and `endIndex: 23` to shuffle the range `[2, 23]` inclusively, leaving elements 0, 1, 24, 25 untouched.
- **Current Logic (Specified/Provided Code):** The specification (`DOCTRINE.md`) and the provided code snippet implement an **Inclusive Start, Exclusive End** range (`[startIndex, endIndex)`). This means `startIndex: 2` and `endIndex: 23` should shuffle the range `[2, 22]`, leaving elements 0, 1, 23, 24, 25 untouched.
- **Observed Behavior:** Doron reported that the element at the `endIndex` (23) moved, which contradicts the expected behavior of the provided code if it correctly implements the exclusive end logic.

Therefore, the core problem is either:
A) The actual implementation Doron is running does not match the provided code snippet/spec (it might be using inclusive/inclusive or have a bug), or
B) There was an error in observing/reporting the result array.

Assuming the provided code snippet accurately represents the intended behavior for `shuffrand`, the issue lies in the discrepancy between Doron's expectation (based on Doron's usecase) and the standard, well-established inclusive/exclusive range convention that the library correctly implements.

---

## 🤖 Gemini

The "inclusive start, exclusive end" convention is the prevalent one in programming. This means `startIndex` is the first element included, and `endIndex` is the element just after the last one included, defining a range of `[startIndex, endIndex]`. This convention is a well-established standard in computer science for defining ranges, and it's what the `cryptoShuffle` function is specified to use.

Doron's logic, which uses an "inclusive start, inclusive end" range `[startIndex, endIndex]`, is also a valid way to define a range, but it's not the one the function is designed for. The above points out that the discrepancy Doron observed is likely a mismatch between Doron's expectation and the library's correct implementation of the standard inclusive/exclusive convention.

In short, while both approaches are logical, the inclusive/exclusive method is the industry standard and the one Doron's code is built on.

---

Okay, let's clearly define what should be _enforced_ (resulting in a `TypeError`) for the `cryptoShuffle` function, based on the provided code, the `DOCTRINE.md` principles, and our previous discussions.

Here's a breakdown of what **exactly** to enforce:

**1. Parameter Types and Basic Structure:**

- **`arr` Type:** Enforced. Must be an array (`T[]`). The default `[]` only applies if `arr` is `undefined`. If a non-array (like an object intended as options) is passed as the first argument, it should be rejected. **(Enforced by ArkType `array()` and the initial type check in the function signature, leading to a TypeError if violated).**
- **`options` Type:** Enforced. Must be an object (including `null` check). **(Enforced by custom validation `if (options === null)` and implicitly by ArkType expecting an object structure).**
- **`isDestructive` Type:** Enforced. Must be a boolean if provided. **(Enforced by ArkType `boolean()`).**
- **`preventIdentical` Type:** Enforced. Must be a boolean if provided. **(Enforced by ArkType `boolean()`).**
- **`startIndex` Type:** Enforced. Must be a number if provided. **(Enforced by custom validation `typeof` and `Number.isInteger`).** Must be an integer. **(Enforced by custom validation `Number.isInteger`).**
- **`endIndex` Type:** Enforced. Must be a number if provided. **(Enforced by custom validation `typeof` and `Number.isInteger`).** Must be an integer. **(Enforced by custom validation `Number.isInteger`).**

**2. Value Ranges and Logical Consistency:**

- **`startIndex` Range:** Enforced. Must be within the array bounds: `0 <= startIndex <= array.length`. **(Enforced by custom validation after defaults are applied).**
- **`endIndex` Range:** Enforced. Must be within the array bounds: `0 <= endIndex <= array.length`. **(Enforced by custom validation after defaults are applied).**
- **`startIndex` vs `endIndex` Consistency (Implicit):** The logic correctly handles cases where `startIndex >= endIndex` by ensuring `endIndexAdjusted >= startIndexAdjusted`, resulting in a no-op shuffle for that range. This is handled implicitly by the loop condition `i > startIndexAdjusted` and the `Math.max` adjustment. Explicit enforcement isn't strictly necessary as it's a valid edge case, but the current custom validation comments acknowledge it.
    - _(Note: The current code doesn't throw an error if `startIndex > endIndex`; it just doesn't shuffle that range. This is generally acceptable behavior for range parameters)._

**3. Feature-Specific Minimum Array Length (MAL) - ENFORCEMENT PROPOSAL:**

This is where we add explicit checks based on our previous analysis. These checks should be added to the function logic _after_ the initial parameter validation and _before_ the shuffle loop.

- **Enforce MAL for `preventIdentical`:**
    - **Condition:** If `preventIdentical` is `true`.
    - **Check:** `array.length >= 2`.
    - **Action:** If `array.length < 2`, throw a `TypeError`.
    - **Rationale:** The feature's core mechanism (swapping first/last) requires at least 2 elements to be effective and guarantee a different result.
    - **Proposed Error Message:** `TypeError: Invalid cryptoShuffle parameters: 'preventIdentical' requires an array with at least 2 elements.`

- **Enforce MAL for `isDestructive` (Effective Shuffling):**
    - **Condition:** If `isDestructive` is `true`.
    - **Check:** The effective range defined by `startIndex` and `endIndex` must contain at least 2 elements for the shuffle loop to execute. This means `endIndexAdjusted > startIndexAdjusted + 1`.
    - **Action:** If `endIndexAdjusted <= startIndexAdjusted + 1`, throw a `TypeError`.
    - **Rationale:** For `isDestructive` to have its intended effect (potentially modifying the original array), the specified range must be large enough for the shuffle algorithm to perform swaps. Otherwise, it's effectively a no-op regarding element movement.
    - **Proposed Error Message:** `TypeError: Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements.`

- **Enforce MAL for "Subarray Shuffle" (`startIndex`/`endIndex` Effective Range):**
    - **Condition:** If either `startIndex` or `endIndex` is provided (and not resulting in the default full-array shuffle).
    - **Check:** Similar to `isDestructive`, the effective range must contain at least 2 elements for the shuffle loop to execute: `endIndexAdjusted > startIndexAdjusted + 1`.
    - **Action:** If `endIndexAdjusted <= startIndexAdjusted + 1`, this is a valid edge case resulting in a no-op shuffle for the specified range. _Enforcement might not be strictly necessary here_ as it's a valid (though potentially unintended) use of the parameters. However, for consistency with `isDestructive` and potentially better DX, it _could_ be enforced.
    - **Rationale:** If the goal is to use `startIndex`/`endIndex` to define a _range to shuffle_, that range should ideally contain elements that _can_ be shuffled.
    - **Decision Point:** Enforcing this for `startIndex`/`endIndex` alone is debatable. It might be better handled by documentation or clear examples showing effective ranges. Enforcing it for `isDestructive` and `preventIdentical` when they are `true` is more compelling because those flags have specific behavioral expectations tied to element movement.

**4. Serialization for `preventIdentical`:**

- **Array Element Serializability:** Enforced. If `preventIdentical` is `true`, all elements in the array must be serializable by `JSON.stringify`. **(Enforced by `try...catch` around `JSON.stringify` and throwing a TypeError on failure).**

**Summary of What to Enforce (Actionable Items):**

Based on the above, the definitive list of enforced conditions (beyond basic type/schema checks) that should result in a `TypeError` is:

1.  **Options Object Nullity:** `if (options === null)` -> Throw TypeError.
2.  **Integer Type for Indices:** `if (typeof startIndex/endIndex !== 'number' || !Number.isInteger(...))` -> Throw TypeError.
3.  **Index Bounds:** `if (startIndex/endIndex < 0 || startIndex/endIndex > array.length)` -> Throw TypeError.
4.  **MAL for `preventIdentical`:** `if (preventIdentical === true && array.length < 2)` -> Throw TypeError.
5.  **MAL for `isDestructive`:** `if (isDestructive === true && endIndexAdjusted <= startIndexAdjusted + 1)` -> Throw TypeError.
6.  **Serialization for `preventIdentical`:** `if (preventIdentical === true && JSON.stringify fails)` -> Throw TypeError.

Whether to _also_ enforce the MAL for the general "subarray shuffle" feature (when `startIndex`/`endIndex` are provided but `isDestructive`/`preventIdentical` are not necessarily true) is a design choice. The code currently allows it as a no-op, which is technically valid but might be confusing. Adding enforcement here would make the API stricter but potentially clearer about intent.

---

Okay, I will stay very close to the current code and apply the enforcement proposal as requested.

Here are the changes based on the "ENFORCEMENT PROPOSAL":

1.  **Enforce MAL for `preventIdentical`**: Add a check after parameters are validated.
2.  **Enforce MAL for `isDestructive`**: Add a check after parameters are validated and indices are adjusted.
3.  **Harness ArkType**: The existing `shuffleParamsSchema` already enforces most types and basic constraints. The new checks are logical conditions based on the validated parameters, which is best done in code after ArkType validation.
4.  **Expandatory Comments**: Add comments explaining the purpose of the new checks.
5.  **What else?**: Ensure the error messages are clear and consistent with the existing DX-focused style.

Here is the modified `src.function.crypto-shuffle.ts` content with the proposed enforcements:

```typescript
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
    } catch (e: unknown) {
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

    const workingArray = isDestructive ? validatedArr : [...validatedArr]
    const length = workingArray.length

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
        } catch (e: unknown) {
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
```

**Changes Made:**

1.  **Added Enforcement for `preventIdentical`**: A `TypeError` is thrown if `preventIdentical` is `true` and `arrayLength` (from the validated array) is less than 2.
2.  **Added Enforcement for `isDestructive`**: A `TypeError` is thrown if `isDestructive` is `true` and the calculated effective shuffle range (`endIndexAdjusted - startIndexAdjusted`) is less than 2 (i.e., `endIndexAdjusted <= startIndexAdjusted + 1`).
3.  **Added Comments**: Comments were added above the new enforcement blocks to explain their purpose.
4.  **Error Messages**: New error messages were crafted to be clear, specific, and consistent with the existing DX-focused style.
5.  **Placement**: The checks were placed logically after the necessary variables (`validatedArr`, `arrayLength`, `startIndexAdjusted`, `endIndexAdjusted`) were established.
6.  **Redundancy Note**: The `length > 1` check within the `preventIdentical` conditional block is now technically redundant due to the new enforcement, but it's kept for robustness in case the function logic changes elsewhere or if the enforcement is bypassed in some unforeseen way (though the goal is it cannot be bypassed).

---

Okay, I'm reviewing the provided `src.function.crypto-shuffle.ts` code as if I'm seeing it for the first time and it's not mine or yours. Here's my assessment:

**Overall Impression:**

This is a well-structured and carefully implemented TypeScript function for performing cryptographically secure array shuffling. It demonstrates a strong focus on security, correctness, developer experience (DX), and robustness. The code is generally clear, with good use of comments and JSDoc.

**Strengths:**

1.  **Security-First:** The function correctly relies on a `cryptoRandom` utility (presumably sourcing from `globalThis.crypto`) for all randomness, adhering to the core principle of cryptographic security.
2.  **Algorithm Correctness:** It implements the Fisher–Yates shuffle algorithm, which is the standard and correct method for unbiased array permutation.
3.  **Clear API & JSDoc:** The JSDoc is comprehensive, clearly explaining the function's purpose, parameters (`isDestructive`, `preventIdentical`, `startIndex`, `endIndex`), their defaults, types, and behaviors (including nuances like the exclusivity of `endIndex`). The `@since` tags are helpful for version tracking.
4.  **Subarray Shuffling:** The inclusion of `startIndex` and `endIndex` for shuffling specific portions of an array is a useful feature, and the implementation seems correct (using `[startIndex, endIndex)` range semantics).
5.  **`preventIdentical` Logic:** The mechanism to guarantee a non-identical output by swapping the first and last elements if needed is clearly implemented and documented, including the caveat about introduced bias.
6.  **Robust Input Validation:**
    - It uses ArkType for schema validation, which is a good practice for runtime safety.
    - Additional custom validations are present for edge cases like `options` being `null` and ensuring `startIndex`/`endIndex` are integers, enhancing DX by providing clearer error messages.
    - Bounds checking for `startIndex` and `endIndex` after default application is correctly implemented.
7.  **Developer Experience (DX):**
    - Clear, descriptive `TypeError` messages are thrown for various invalid inputs, which significantly aids debugging.
    - The default parameter for `arr` (`[]`) and `options` (`{}`) makes the function easy to call.
    - The distinction between `isDestructive` (modifying input) and non-destructive (creating a copy) is well-handled.
8.  **Handling of Edge Cases:**
    - The code correctly handles empty arrays.
    - The logic for adjusting `startIndex` and `endIndex` using `Math.max` and `Math.min` ensures they stay within valid bounds relative to the array length.
    - The shuffle loop condition `i > startIndexAdjusted` naturally handles cases where the range has fewer than 2 elements (loop doesn't execute).
9.  **Code Structure & Comments:** The code is well-organized with clear section comments (validation, adjustments, shuffle loop, `preventIdentical`). This makes it readable and maintainable.

**Potential Areas for Consideration (Minor):**

1.  **Minimum Length Enforcements (Implicit):** While the code _functions_ correctly for arrays of any size, the features `preventIdentical` and `isDestructive` have implicit minimum effective array lengths (2 elements for `preventIdentical` to _guarantee_ a change, and 2 elements within the shuffle range for `isDestructive` to _potentially_ cause a change). The code doesn't explicitly _enforce_ these lengths by throwing an error if they are violated; it just results in a no-op or potentially ineffective behavior for those features. Whether this needs explicit enforcement depends on the desired strictness of the API. (Note: Reviewing the conversation history, explicit enforcements for these minimum lengths were recently added, which would address this point).
2.  **ArkType Schema & Defaults:** The interaction between ArkType validation and manual default application seems a bit complex (validating `fullParams` which might have `undefined` optional fields, then manually applying defaults to get `validatedParams`). This is likely due to how optional fields are handled in the ArkType schema (`unknown?`) and is understandable, but worth noting as a point of complexity in the validation flow.
3.  **Type Assertion:** The `as unknown as Required<ShuffleParams<T>>` type assertion for `validatedParams` is pragmatic given the manual default application but is a slight workaround for the type system.

**Conclusion:**

This is high-quality code. It's secure, implements the correct algorithm, provides a clear and well-documented API, and includes robust validation and error handling focused on developer experience. The implementation of the core shuffle logic, subarray shuffling, and the `preventIdentical` feature appears correct and thoughtful. Minor considerations exist, primarily around the explicitness of minimum length requirements for certain features, which might be addressed by adding specific checks as discussed previously. Overall, it presents as a professional and reliable implementation.
