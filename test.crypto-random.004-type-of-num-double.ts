// test.crypto-random.004-type-of-num-double.ts

/**
 * shuffrand Test Suite - TC004: Single Parameter: typeOfNum (Double)
 *
 * This file tests the cryptoRandom function with only typeOfNum set to 'double',
 * expecting a double in the default range [0.000, 1.000] with <=3 fractional digits.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert'
import { cryptoRandom } from './index.js' // Import the function from your library's barrel file

/**
 * Runs test case TC04 for cryptoRandom: Single Parameter: typeOfNum (Double).
 * @returns {void}
 */
export function testCryptoRandomTC004(): void {
    const testID = 'TC004'
    console.log(`\n--- Running cryptoRandom Test Case ${testID}: Single Parameter: typeOfNum (Double) ---`)

    try {
        const typeOfNum = 'double'
        const result = cryptoRandom({ typeOfNum })
        const decimalPlaces = result.toString().split('.')[1]?.length || 0

        // The default upperBound is 1 for integers, but for doubles, it's 1.
        // The default maxFracDigits is 3.
        // The range for default double is [0, 1] inclusive.
        // With maxFracDigits=3, this means [0.000, 1.000]

        assert(
            result >= 0.0 && result <= 1.0 && decimalPlaces <= 3,
            `[${testID}] Failed: Expected double in [0.000, 1.000] with <=3 frac digits, got ${result} (${decimalPlaces} digits)`
        )
        assert(
            !Number.isInteger(result) || result === 0 || result === 1, // It should be a double unless it's exactly 0 or 1
            `[${testID}] Failed: Expected a non-integer double (unless 0 or 1), got integer ${result}`
        )

        console.log(`[${testID}] Passed: Single Parameter: typeOfNum (Double). Result: ${result}`)
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`)
    }
}