// run-tests.ts

// ... (imports and comments)

import { testCryptoRandomTC001 } from './test.crypto-random.001-defaults.js';
import { testCryptoRandomTC002 } from './test.crypto-random.002-lowerbound.js';
import { testCryptoRandomTC003 } from './test.crypto-random.003-upperbound.js';
import { testCryptoRandomTC004 } from './test.crypto-random.004-type-of-num-double.js';
import { testCryptoShuffleTC001 } from './test.crypto-shuffle.001-defaults.js';
import { testCryptoShuffleTC002 } from './test.crypto-shuffle.002-nondestructive-shuff-with-arr-of-nums.js';
import { testCryptoShuffleTC003 } from './test.crypto-shuffle.003-destructive-shuff-with-arr-of-nums.js';
import { testCryptoShuffleTC004 } from './test.crypto-shuffle.004-destructive-shuff-with-empty-arr.js';

// ... (Add imports for other test files as they are created: section)

/**
 * Main function to run all shuffrand test suites.
 */
function runAllTests(): void {
    console.log('Starting shuffrand test suite...');
    console.log('--- Running all shuffrand tests ---');

    // Execute individual test functions for cryptoRandom
    testCryptoRandomTC001();
    testCryptoRandomTC002();
    testCryptoRandomTC003();
    testCryptoRandomTC004();

    // Execute individual test functions for cryptoShuffle
    testCryptoShuffleTC001();
    testCryptoShuffleTC002();
    testCryptoShuffleTC003();
    testCryptoShuffleTC004();
    // Call other test functions here as they are implemented:
    // ...
    // testCryptoShuffleTCXX();

    console.log('\n--- shuffrand test suite finished ---');
}

// Run the tests when the script is executed
runAllTests();