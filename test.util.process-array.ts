/**
 * shuffrand Utility - processArray
 *
 * This utility function formats an array into a string representation,
 * truncating it if it exceeds a desired character count.
 * It's primarily intended for consistent logging and debugging in tests.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

/**
 * Processes an array into a string, truncating it if it exceeds a desired character count.
 *
 * @param {any[]} [arr=[]] - The array to process.
 * @param {number} [desiredCharCount=100] - The maximum number of characters for the string representation.
 * @returns {string} The processed string representation of the array.
 */
export function processArray(arr: any[] = [], desiredCharCount: number = 100): string {
    // Ensure 'arr' is an array
    if (!Array.isArray(arr)) {
        arr = []
    }

    // Ensure 'desiredCharCount' is a finite positive number
    if (typeof desiredCharCount !== 'number' || !Number.isFinite(desiredCharCount)) {
        desiredCharCount = 100
    } else if (desiredCharCount <= 4) {
        // Minimum for '...]'
        desiredCharCount = 3
    }

    // Stringify the array
    let stringifiedArr = JSON.stringify(arr)

    // Process the stringified array based on the desired character count
    // If the stringified array is longer than desiredCharCount, truncate and add '...]'
    if (stringifiedArr.length > desiredCharCount) {
        // Ensure we leave enough space for '...]'
        const truncateLength = Math.max(0, desiredCharCount - 4) // At least 0, but ideally leaving 4 for '...]'
        stringifiedArr = stringifiedArr.slice(0, truncateLength) + '...]'
    }

    return stringifiedArr
}
