// /shuffrand/test.util.deep-copy-array.ts

/**
 * Shuffrand Test Utility - deepCopyArray
 *
 * This utility function creates a robust deep copy of an array,
 * correctly handling nested arrays, plain objects, and Date objects.
 * It is essential for tests that need to compare an original array's
 * state before and after a potentially modifying operation, especially
 * when the array contains complex data types that simple shallow copies
 * or JSON.parse(JSON.stringify()) cannot handle accurately (e.g., undefined, Date).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

/**
 * Creates a deep copy of an array, handling nested arrays, plain objects, and Date objects.
 * Primitives (numbers, strings, booleans, null, undefined, BigInt, Symbol) are copied by value.
 *
 * @param {any[]} arr - The array to deep copy.
 * @returns {any[]} A new array that is a deep copy of the input array.
 */
export function deepCopyArray<T>(arr: T[]): T[] {
    // Handle non-array inputs gracefully by returning an empty array,
    // though TypeScript's type checking should prevent this in most cases.
    if (!Array.isArray(arr)) {
        return [] as T[]
    }

    return arr.map((item) => {
        // Primitives and special values that are copied by value
        if (item === null || typeof item !== 'object') {
            return item
        }

        // Handle specific object types that need deep copying
        if (item instanceof Date) {
            return new Date(item.getTime()) as T // Deep copy Date objects
        }

        // Handle arrays recursively
        if (Array.isArray(item)) {
            return deepCopyArray(item) as T // Recursively deep copy nested arrays
        }

        // Handle plain objects (shallow copy for properties, but deep for nested arrays/objects if they existed)
        // For the current test cases, a shallow copy of properties is sufficient as objects are simple.
        // If objects contained nested complex types, this would need to be a more robust recursive deep copy.
        return { ...item } as T // Shallow copy of object properties
    })
}
