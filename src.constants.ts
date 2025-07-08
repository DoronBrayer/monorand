/**
 * shuffrand Constants
 *
 * This file defines various constants used throughout the shuffrand module,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

export const Constants = {
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
  MAX_SAFE_DOUBLE: 7_999_999_999_999.999, // Approx 8 trillion - 1 mill
  MIN_SAFE_DOUBLE: -7_999_999_999_999.999, // Approx -8 trillion + 1 mill
  UINT32_MAX_VALUE: 0xffffffff, // Maximum value for a 32-bit unsigned integer (2^32 - 1)
  UINT32_RANGE: 0x100000000, // Range of a 32-bit unsigned integer (2^32)
  MAX_FRACTIONAL_DIGITS: 15, // Max precision for doubles (standard JS float precision)
  MIN_FRACTIONAL_DIGITS: 0, // Allow 0 fractional digits for doubles (i.e., integer-like doubles)
  MAX_GENERATION_ATTEMPTS: 30 // Max retries for exclusion constraints
} as const;