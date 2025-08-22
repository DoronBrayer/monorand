// ./shuffrand/inspection.performance-benchmark.ts

/**
 * Performance Benchmark Suite for 'shuffrand'
 *
 * Contains performance benchmarks for the core functions of the 'shuffrand' library,
 * comparing them with their standard (but cryptographically-insecure!) JavaScript counterparts.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { cryptoRandom, cryptoShuffle, cryptoString } from 'shuffrand'
import { bench, describe } from 'vitest'
import { consume } from './inspection.util.consume.js'
import { standardInplaceShuffle } from './inspection.util.shuffle.js'
import { standardString } from './inspection.util.string-builder.js'
import { Constants } from './src.constants.js'

// --- 01. cryptoRandom ---
describe('cryptoRandom compared with JavaScript’s Math.random()', () => {
    bench('cryptoRandom (integer, 1–100)', () => {
        cryptoRandom({ lowerBound: 1, upperBound: 100 })
    })

    bench('Math.random() (integer, 1–100)', () => {
        consume(Math.floor(Math.random() * 100) + 1)
    })
})

// --- 02. cryptoShuffle ---
const largeArray = Array.from({ length: 1000 }, (_, i) => i)

describe('cryptoShuffle compared with the standard in-place shuffle function', () => {
    bench('cryptoShuffle (1000 elements, secure source)', () => {
        cryptoShuffle(largeArray)
    })

    bench('Standard in-place shuffle (1000 elements, insecure source)', () => {
        consume(standardInplaceShuffle(largeArray))
    })
})

// --- 03. cryptoString ---
describe('cryptoString compared with the standard string builder', () => {
    bench('cryptoString (16 characters, secure source)', () => {
        cryptoString({ length: 16, characterSet: 'alphanumeric' })
    })

    bench('Standard string (16 characters)', () => {
        consume(standardString(16, Constants.ALPHANUMERIC_CHARS))
    })
})
