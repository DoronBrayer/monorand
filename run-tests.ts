// run-tests.ts

/**
 * Shuffrand Test Runner
 *
 * This file orchestrates the execution of all Shuffrand test suites using Node.js's
 * native `node:test` runner. It imports and awaits the top-level test suites
 * to ensure all tests complete before the runner exits, preventing 'cancelledByParent'
 * errors in CI environments.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { test } from 'node:test'
// Import the exported test suite from its file
import { cryptoRandomCoreAndBasicTests } from './test.crypto-random.001-core-and-basic.js'

// Fix L15: Delete ';'
console.log(`--- Starting shuffrand test suite (using Node.js native test runner) ---`)

// Define the absolute top-level test suite for Shuffrand.
// This test will explicitly await the completion of all individual test files/suites.
// Fix L26, L27, L28, L29: Insert '`' and ensure template literal
test(`Shuffrand Test Suite`, async (t) => {
    // Await the execution of the cryptoRandom core and basic tests.
    // This ensures that the parent 'Shuffrand Test Suite' waits for all
    // subtests within cryptoRandomCoreAndBasicTests to complete.
    // Fix L30, L32: Replace '...await cryptoRandomCoreAndBasicTests;' with '...await cryptoRandomCoreAndBasicTests'
    // Fix L29: Insert '`'
    await cryptoRandomCoreAndBasicTests

    // Add more test suites here as they are created, awaiting each one:
    // await cryptoRandomExclusionLogicTests;
    // await cryptoShuffleTests;
})

// Fix L17, L20, L22: Delete ';'
// The final console log will only appear after the top-level 'Shuffrand Test Suite' completes.
console.log(`--- Shuffrand test suite finished ---`)
