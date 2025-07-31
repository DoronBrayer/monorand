// test.crypto-shuffle.004-subarray-shuffle.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Subarray Shuffle
 *
 * This file specifically tests the behavior of `cryptoShuffle` when shuffling a subarray,
 * ensuring it correctly handles the specified range and maintains array integrity.
 *
 * @author Doron Brayer
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoShuffle } from 'shuffrand' // Updated import
// Import the deepCopyArray utility directly from its compiled location in dist
import { deepCopyArray } from './test.util.deep-copy-array.js' // Updated import path for compiled utility

// Define a top-level group for these tests
describe('cryptoShuffle: Subarray Shuffle', () => {
    it('__PLACHOLDER__', () => {
        expect(0.99 + 0.01).toBe(1)
    })
})
