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
export type { RandomParams, ShuffleParams } from './src.types.js' // <-- CORRECTED: NumberType removed

// Re-export functions
export { cryptoRandom } from './src.function.crypto-random.js'
export { cryptoShuffle } from './src.function.crypto-shuffle.js'
// export { processArray } from './src.util.process-array.js'; // Example for future src.util
