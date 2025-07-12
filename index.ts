// index.ts

/**
 * shuffrand - Main Entry Point
 *
 * This file serves as the main entry point for the shuffrand module,
 * re-exporting all public APIs from its dot-categorized source files.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Re-export constants
export { Constants } from './src.constants.js'

// Re-export types
export type { RandomParams, ShuffleParams, CryptoStringParams } from './src.types.js' // Added CryptoStringParams

// Re-export functions
export { cryptoRandom } from './src.function.crypto-random.js'
export { cryptoShuffle } from './src.function.crypto-shuffle.js'
export { cryptoString, calculateStringEntropy } from './src.function.crypto-string.js' // Added cryptoString and calculateStringEntropy
// export { processArray } from './src.util.process-array.js'; // Example for future src.util
