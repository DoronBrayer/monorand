// run-tests.ts
/**
 * Shuffrand Test Suite - Orchestrator
 *
 * This file serves as the central hub for the Shuffrand test suite.
 * It imports individual test files, leveraging Node.js's native `node:test` runner
 * for structuring and executing tests defined within those files.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import the native Node.js test runner
import { test } from 'node:test';

// Define the main test suite structure using `test()` as the top-level describe
test('Shuffrand Test Suite', async () => {
    console.log('\n--- Starting shuffrand test suite (using Node.js native test runner) ---');

    // --- cryptoRandom Test Cases ---
    // Import consolidated test files for cryptoRandom.
    // Each imported file contains its own `test()` calls, which `node:test`
    // will automatically discover and run.

    // I. Core Functionality & Basic Parameters (TC01-TC10)
    await import('./test.crypto-random.001-core-and-basic.js');

    // All other cryptoRandom test groups will be added here as they are converted
    // For now, they remain commented out.
    // await import('./test.crypto-random.002-exclusion-logic.js'); // TC11-TC19
    // await import('./test.crypto-random.003-edge-cases.js'); // TC20-TC36
    // await import('./test.crypto-random.004-error-handling.js'); // TC37-TC48

    // --- cryptoShuffle Test Cases ---
    // All cryptoShuffle test groups will be added here as they are converted
    // For now, they remain commented out.
    // await import('./test.crypto-shuffle.001-core-and-basic.js'); // TC49-TC53
    // await import('./test.crypto-shuffle.002-array-types-and-edge-cases.js'); // TC54-TC67
    // await import('./test.crypto-shuffle.003-prevent-identical.js'); // TC68-TC71
    // await import('./test.crypto-shuffle.004-error-handling.js'); // TC72-TC77

    console.log('--- Shuffrand test suite finished ---');
});
