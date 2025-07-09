// src.function.crypto-random.ts

/**
 * shuffrand - Cryptographically Secure Random Number Generation
 *
 * This file contains the core logic for generating cryptographically secure random numbers,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import Node.js built-in modules for cryptographic randomness and assertions
import { webcrypto } from 'node:crypto'
import { strict as assert } from 'node:assert'

// Import types, constants, and ArkType schema from their respective dot-categorized files
import { RandomParams, randomParamsSchema } from './src.types.js'
import { Constants } from './src.constants.js'

/**
 * Generates a cryptographically secure random number within a specified range.
 *
 * @param {RandomParams} [rawParams={}] - The raw parameters for random number generation.
 * @param {number} [rawParams.lowerBound=0] - The lower bound (inclusive) of the random number.
 * @param {number} [rawParams.upperBound=1] - The upper bound (exclusive for doubles, inclusive for integers) of the random number.
 * @param {'integer'|'double'} [rawParams.typeOfNum='integer'] - The type of number to generate ('integer' (default) or 'double').
 * @param {'none'|'lower bound'|'upper bound'|'both'} [rawParams.exclusion='none'] - Specifies which bounds to exclude.
 * @param {number} [rawParams.maxFracDigits=3] - The maximum number of fractional digits for 'double' type numbers.
 * If specified, the generated double will be rounded to this many decimal places.
 * Must be a non-negative integer between 0 and 15. Defaults to `3`.
 * @returns {number} - A cryptographically secure random number.
 * @throws {TypeError} - If input parameters do not conform to the schema or if an invalid range is provided.
 */
export function cryptoRandom(rawParams: RandomParams = {}): number {
  // Step 1: Assert rawParams against the schema for runtime validation.
  // This ensures the input structure is valid, but properties are still optional.
  randomParamsSchema.assert(rawParams);

  // Step 2: Create the validatedParams object with default values using ?? operator.
  // Step 3: Explicitly cast the *entire object literal* to Required<RandomParams>.
  // This tells TypeScript that all properties are now guaranteed to be non-undefined
  // because of the defaults applied. This is the most direct way to resolve
  // the "possibly undefined" errors at compile time.
  const validatedParams: Required<RandomParams> = {
    lowerBound: rawParams.lowerBound ?? 0,
    upperBound: rawParams.upperBound ?? 1,
    typeOfNum: rawParams.typeOfNum ?? 'integer',
    exclusion: rawParams.exclusion ?? 'none',
    maxFracDigits: rawParams.maxFracDigits ?? 3,
  };

  // Destructure directly from the explicitly typed validatedParams constant.
  // TypeScript should now correctly infer all these as non-nullable.
  const {
    lowerBound,
    upperBound,
    typeOfNum,
    exclusion,
    maxFracDigits,
  } = validatedParams;

  // Ensure min is always the lower value and max is always the higher value
  let min = Math.min(lowerBound, upperBound);
  let max = Math.max(lowerBound, upperBound);

  // Handle edge case where lowerBound equals upperBound
  if (min === max) {
    // If typeOfNum === 'double' and exclusion is 'both', it's an invalid range
    if (typeOfNum === 'double' && exclusion === 'both') {
      throw new TypeError(
        `Invalid range for double with 'both' exclusion: lowerBound (${lowerBound}) equals upperBound (${upperBound}).`
      )
    }
    return min; // Return the single possible value
  }

  let result: number;
  let attempts = 0;
  const maxAttempts = Constants.MAX_ATTEMPTS_TO_GENERATE_NUM; // CORRECTED: Constant name

  do {
    let currentLowerBound = min;
    let currentUpperBound = max;

    // --- Integer Specific Logic & Exclusion Pre-checks ---
    if (typeOfNum === 'integer') {
      // Apply exclusion for integers by adjusting bounds
      if (exclusion === 'lower bound' || exclusion === 'both') {
        currentLowerBound++;
      }
      if (exclusion === 'upper bound' || exclusion === 'both') {
        currentUpperBound--;
      }

      // Robust pre-check for integer exclusion (from OLD-but-good)
      const minInt = Math.ceil(currentLowerBound);
      const maxInt = Math.floor(currentUpperBound);
      const totalIntegers = maxInt - minInt + 1;

      const thresholds: { [key in Exclude<typeof exclusion, 'none'>]: number } = { // Explicitly type thresholds
        both: 2,
        "lower bound": 1,
        "upper bound": 1
      };

      // CORRECTED: Only check threshold if exclusion is not 'none'
      if (exclusion !== 'none') {
        const threshold = thresholds[exclusion];
        if (totalIntegers <= threshold) {
          throw new TypeError(
            `No valid integers exist within the range ${min}–${max} under the {exclusion:'${exclusion}'} constraint.`
          );
        }
      }

      // If currentLowerBound somehow exceeds currentUpperBound after adjustments, it's an empty range
      if (currentLowerBound > currentUpperBound) {
        throw new TypeError(`Invalid integer range after exclusions: lowerBound (${lowerBound}) to upperBound (${upperBound}) with exclusion '${exclusion}' results in an empty range.`);
      }

      const range = currentUpperBound - currentLowerBound + 1;
      assert(range > 0, 'Integer range must be positive after exclusions.');

      const bytesNeeded = Math.ceil(Math.log2(range) / 8);
      const maxValidValue = Math.pow(256, bytesNeeded) - (Math.pow(256, bytesNeeded) % range);

      let randomNumber: number;
      let byteArray = new Uint8Array(bytesNeeded);

      do {
        webcrypto.getRandomValues(byteArray);
        randomNumber = 0;
        for (let i = 0; i < bytesNeeded; i++) {
          randomNumber = randomNumber * 256 + byteArray[i];
        }
      } while (randomNumber >= maxValidValue);

      result = currentLowerBound + (randomNumber % range);

    } else { // typeOfNum === 'double'
      const BYTES_FOR_DOUBLE = 8;
      const MAX_UINT64 = 2 ** (BYTES_FOR_DOUBLE * 8); // Max value for a 64-bit unsigned integer

      let rawDouble: number;
      let byteArray = new Uint8Array(BYTES_FOR_DOUBLE);

      // Generate a random double between 0 (inclusive) and 1 (exclusive)
      do {
        webcrypto.getRandomValues(byteArray);
        let randomNumber = 0;
        for (let i = 0; i < BYTES_FOR_DOUBLE; i++) {
          randomNumber = randomNumber * 256 + byteArray[i];
        }
        rawDouble = randomNumber / MAX_UINT64;
      } while (rawDouble === 1); // Ensure it's strictly less than 1 to avoid issues with upperBound scaling

      // Scale to the desired range
      result = currentLowerBound + rawDouble * (currentUpperBound - currentLowerBound);

      // Apply maxFracDigits rounding if specified
      const actualMaxFracDigits = Number(maxFracDigits); // Robust conversion
      if (!isNaN(actualMaxFracDigits) && actualMaxFracDigits >= 0) {
        const factor = Math.pow(10, actualMaxFracDigits);
        result = Math.round(result * factor) / factor;
      }
    }

    // --- Exclusion checks with appropriate comparison method for both types ---
    let isExcluded = false;

    if (typeOfNum === 'double') {
      // For doubles, use epsilon comparison (from OLD-but-good)
      if (exclusion === "lower bound" && Math.abs(result - min) < Number.EPSILON) {
        isExcluded = true;
      } else if (exclusion === "upper bound" && Math.abs(result - max) < Number.EPSILON) {
        isExcluded = true;
      } else if (exclusion === "both" && (Math.abs(result - min) < Number.EPSILON || Math.abs(result - max) < Number.EPSILON)) {
        isExcluded = true;
      }
    } else { // typeOfNum === 'integer'
      // For integers, use exact equality
      if (exclusion === "lower bound" && result === min) {
        isExcluded = true;
      } else if (exclusion === "upper bound" && result === max) {
        isExcluded = true;
      } else if (exclusion === "both" && (result === min || result === max)) {
        isExcluded = true;
      }
    }

    if (isExcluded) {
      attempts++;
      continue; // Re-roll
    }

    break; // Exit loop if a valid number is found
  } while (attempts < maxAttempts);

  // Throw if max attempts reached without finding a valid number
  if (attempts >= maxAttempts) {
    throw new Error(
      `Unable to generate a random number within the range [${min}, ${max}] that satisfies the exclusion constraint: ${exclusion}. Max attempts (${maxAttempts}) reached.`
    );
  }

  return result;
}