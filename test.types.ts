// test.types.ts
import { type } from 'arktype' // Import ArkType for schema definitions

/**
 * This file contains types specifically used within the test suite,
 * which are not part of the public library API defined in src.types.ts.
 * These schemas are used for robust runtime validation of test inputs
 * and for defining expected structures in test assertions.
 */

// --- Array Schemas ---

// By Length/Cardinality
export const arrayOfNada = type('unknown[]').atMostLength(0) // An empty array
export const arrayOfOneElement = type('unknown[]').atLeastLength(1).atMostLength(1) // An array containing exactly one element
export const arrayOfTwoOrThreeElements = type('unknown[]').atLeastLength(2).atMostLength(3) // An array containing exactly two or three elements

// Define re-usable ArkType schemas for Date and Function to avoid parsing issues
const dateSchema = type('Date') // Corrected: Use simple string literal "Date"
// const functionSchema = type({ domain: "function" }) // Keep this commented out

// By Content Type (General) - All with default length constraints (4-100 elements)
export const arrayOfArrays = type('unknown[]').array().atLeastLength(4).atMostLength(100) // An array where each element is itself an array (of unknown content)
export const arrayOfBigInts = type('bigint').array().atLeastLength(4).atMostLength(100) // An array containing only BigInt values
export const arrayOfBooleans = type('boolean').array().atLeastLength(4).atMostLength(100) // An array containing only boolean values
export const arrayOfDates = dateSchema.array().atLeastLength(4).atMostLength(100) // Corrected: Use defined dateSchema (now type("Date"))
// export const arrayOfFunctions = functionSchema.array().atLeastLength(4).atMostLength(100) // Keep this commented out
export const arrayOfNumbers = type('number').array().atLeastLength(4).atMostLength(100) // An array containing only numbers
export const arrayOfPlainObjects = type('object').array().atLeastLength(4).atMostLength(100) // An array containing only plain JavaScript objects
export const arrayOfStrings = type('string').array().atLeastLength(4).atMostLength(100) // An array containing only string values
export const arrayOfSymbols = type('symbol').array().atLeastLength(4).atMostLength(100) // An array containing only symbol values

// By Content Type (Special Values)
// arrayOfFalsyValues is temporarily skipped due to ArkType BigInt literal parsing issues.
export const arrayOfNullishValues = type('null | undefined').array().atLeastLength(4).atMostLength(100) // An array that can contain either null or undefined values
export const arrayOfNulls = type('null').array() // An array that can contain only null values
export const arrayOfUndefineds = type('undefined').array() // An array that can contain only undefined values

// By Content Type (Mixed)
export const arrayOfMixedPrimitives = type('string | number | boolean | bigint | symbol')
    .array()
    .atLeastLength(4)
    .atMostLength(100) // An array containing a mix of primitive types
// export const arrayOfMixedComplex = type('object | unknown[]').or(dateSchema).or(functionSchema).array().atLeastLength(4).atMostLength(100) // Keep this commented out

// --- Number Schemas ---

// Basic Numeric Types
export const numberInteger = type('number.integer') // Any integer (positive, negative, or zero)

// Corrected: Any finite floating-point number that is not a whole number (e.g., 1.5, -0.75)
// Defined as a number that excludes integers.
export const numberDouble = type('number').exclude(type('number.integer'))
export const numberFloat = numberDouble // Nickname for numberDouble

// Corrected: Any finite number (integer or float)
// Defined as a number that is not infinite.
export const numberFinite = type('number')
    .exclude(type('number').atLeast(Infinity))
    .exclude(type('number').atMost(-Infinity))

// Corrected: Infinite numbers (positive or negative infinity)
export const numberInfinite = type('number').atLeast(Infinity).or(type('number').atMost(-Infinity))

// Sign & Zero
export const numberZero = type('0') // The number zero
export const numberPositive = type('number>0') // Any positive number (integer or float, excluding zero)
export const numberNonnegative = type('number>=0') // Any number greater than or equal to zero
export const numberNegative = type('number<0') // Any negative number (integer or float, excluding zero)
export const numberNonpositive = type('number<=0') // Any number less than or equal to zero

// Corrected: A non-zero number (integer or float)
// Defined as a number that is either positive or negative.
export const numberNonzero = type('number>0').or('number<0')

// Specific Integer Subtypes
export const numberNatural = type('number.integer>0') // Natural numbers (positive integers: 1, 2, 3...)
export const intPositive = numberNatural // Nickname for numberNatural
export const numberWhole = type('number.integer>=0') // Whole numbers (non-negative integers: 0, 1, 2, 3...)

// Corrected: A single digit (0-9, inclusive)
// Defined with explicit atLeast and atMost bounds.
export const digit = type('number.integer').atLeast(0).atMost(9)

// A number within JavaScript's safe integer range (inclusive)
export const numberSafeInteger = type('number.integer').atLeast(Number.MIN_SAFE_INTEGER).atMost(Number.MAX_SAFE_INTEGER)

// Corrected: A number outside JavaScript's safe integer range (for integer type checks)
// Defined with explicit atMost and atLeast bounds on integer types.
export const numberUnsafeInteger = type('number.integer')
    .atMost(Number.MIN_SAFE_INTEGER - 1)
    .or(type('number.integer').atLeast(Number.MAX_SAFE_INTEGER + 1))
export const intUnsafe = numberUnsafeInteger // Nickname for numberUnsafeInteger

// Specific Float Subtypes
// Corrected: A positive floating-point number
// Defined as a positive number that excludes integers.
export const numberPositiveFloat = type('number>0').exclude(type('number.integer'))

// Corrected: A negative floating-point number
// Defined as a negative number that excludes integers.
export const numberNegativeFloat = type('number<0').exclude(type('number.integer'))

// Corrected: A positive floating-point number very close to zero (e.g., 0.0001 to 0.9999)
// Defined as a number between 0 and 1 (exclusive of 0, inclusive of 1) that excludes integers.
export const numberExtrasmallPositiveFloat = type('number>0').atMost(1).exclude(type('number.integer'))

// Extreme Values
export const numberExtralargePositive = type(`number>${Number.MAX_SAFE_INTEGER}`) // A positive number larger than MAX_SAFE_INTEGER (but not necessarily integer)
export const numberExtralargeNegative = type(`number<${Number.MIN_SAFE_INTEGER}`) // A negative number smaller than MIN_SAFE_INTEGER (but not necessarily integer)

// --- String Schemas (for Enums/Literals) ---
export const exclusionString = type("'none' | 'lower bound' | 'upper bound' | 'both'") // A schema for valid exclusion strings in cryptoRandom
export const typeOfNumString = type("'integer' | 'double'") // A schema for valid typeOfNum strings in cryptoRandom

// Example: If you needed a specific interface for a test result object
// export interface TestResult {
//     id: string;
//     passed: boolean;
//     message?: string;
// }
