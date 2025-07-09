// test.types.ts
import { type } from 'arktype' // Import ArkType for schema definitions

/**
 * This file contains types specifically used within the test suite,
 * which are not part of the public library API defined in src.types.ts.
 */

// Define an ArkType schema for an array containing only numbers,
// with at least 4 and at most 100 elements, using the programmatic API.
export const arrayOfNumbers = type("number")
  .array()               // -> number[]
  .atLeastLength(4)      // length >= 4
  .atMostLength(100)     // length <= 100

// Example: If you needed a specific interface for a test result object
// export interface TestResult {
//     id: string;
//     passed: boolean;
//     message?: string;
// }