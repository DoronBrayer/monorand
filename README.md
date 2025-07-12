<!-- README.md -->
# `shuffrand`
**shuff**le + **rand**om = shuffrand. This perfectly encapsulates the library’s initial core functionalities:

🎲 Cryptographically secure randomness and shuffling — with **soul**.

<small>_cryptoString (cryptographically secure string) was actually added later in the project’s development._</small>
## Features
✔️ **Cryptographically secure RNG**: leverages `globalThis.crypto.getRandomValues()` (CSPRNG) for **truly** unpredictable numbers.<br>
✔️ **Precise number generation**: generates integers and doubles with configurable bounds, fractional digits, and advanced exclusion logic (`none`, `lower bound`, `upper bound`, `both`).<br>
✔️ **Secure Fisher–Yates shuffle**: implements the industry-standard Fisher–Yates algorithm for cryptographically strong array permutations.<br>
✔️ **Flexible shuffle modes**: supports both destructive (in-place) and non-destructive (returns a new array) shuffling.<br>
✔️ **`preventIdentical` option**: guarantees a different permutation for small arrays (with a clear statistical bias caveat for non-critical use).<br>
✔️ **Secure string generation**: creates random strings from predefined (`alphanumeric`, `numeric`, `hex`, etc.) or custom Unicode-aware character sets.<br>
✔️ **Entropy calculation**: provides a utility to quantify the cryptographic strength (bits of entropy) of generated strings.<br>
✔️ **Fully typed with TypeScript**: offers a superior developer experience with comprehensive type definitions for seamless integration.<br>
✔️ **Robust runtime validation**: utilizes ArkType for rigorous runtime input validation, enhancing reliability and preventing unexpected behavior.<br>
✔️ **ESM-first & Node.js v20+**: built with a future-forward architecture for optimal tree-shaking and modern environment compatibility.
## Installation
• <small>[<small>RECOMMENDED</small>]</small> **pnpm**: `pnpm install shuffrand`<br>• **pnpm**: `npm install shuffrand`<br>• **Yarn**: `yarn add shuffrand`
## Usage
Using `shuffrand` is straightforward, designed to be intuitive while providing powerful cryptographic capabilities.
### The trio
• <small>cryptoRandom( { … } )<br>• cryptoShuffle( { … } )<br>• cryptoString( { … } )</small>

### Generating true random numbers via `cryptoRandom`
```js
import { cryptoRandom } from  'shuffrand';

// Generate a random integer between 1 and 10 (inclusive)
const randomInt = cryptoRandom({ lowerBound: 1, upperBound: 10, typeOfNum: 'integer' });
console.log(`Random Integer: ${randomInt}`); // e.g., 7

// Generate a random double between 0 and 1 (exclusive of 1), with 5 fractional digits
const randomDouble = cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 5 });
console.log(`Random Double: ${randomDouble}`); // e.g., 0.45678

// Generate a random integer from 5 to 10, excluding the lower bound (i.e., 6-10)
const randomIntExcludingLower = cryptoRandom({ lowerBound: 5, upperBound: 10, typeOfNum: 'integer', exclusion: 'lower bound' });
console.log(`Random Integer (excluding lower): ${randomIntExcludingLower}`); // e.g., 8
```
### Shuffling arrays via `cryptoShuffle`
```js
import { cryptoShuffle } from  'shuffrand';

// Non-destructive shuffle (default behavior)
const originalArray = [1, 2, 3, 4, 5];
const shuffledArray = cryptoShuffle(originalArray);
console.log(`Original Array: ${originalArray}`); // [1, 2, 3, 4, 5] (unchanged)
console.log(`Shuffled Array: ${shuffledArray}`); // e.g., [3, 1, 5, 2, 4] (new array)

// Destructive shuffle
const mutableArray = ['alpha', 'beta', 'gamma'];
cryptoShuffle(mutableArray, { isDestructive: true });
console.log(`Mutated Array: ${mutableArray}`); // e.g., ['gamma', 'alpha', 'beta'] (original array modified)

// Shuffle with preventIdentical (for small arrays where identical shuffles might annoy users)
const smallArray = ['A', 'B'];
const guaranteedDifferentShuffle = cryptoShuffle(smallArray, { preventIdentical: true });
console.log(`Guaranteed Different Shuffle: ${guaranteedDifferentShuffle}`); // Will always be ['B', 'A']
```
### Generating random strings via `cryptoString`
```js
import { cryptoString, calculateStringEntropy } from  'shuffrand';

// Generate a 16-character alphanumeric string (default)
const token = cryptoString();
console.log(`Secure Token: ${token}`); // e.g., "aBc1XyZ7pQ2rS9tU"

// Generate a 10-digit numeric passcode
const passcode = cryptoString({ length: 6, characterSet: 'numeric' });
console.log(`Numeric Passcode: ${passcode}`); // e.g., "823019"

// Generate a string using a custom character set (e.g., emojis!)
const emojiSequence = cryptoString({ length: 5, characterSet: '😀😂😇😈✨' });
console.log(`Emoji Sequence: ${emojiSequence}`); // e.g., "😇✨😂😀😈"

// Calculate the entropy of a generated string
const customCharset = 'abcdefghijklmnopqrstuvwxyz0123456789'; // 36 unique characters
const entropy = calculateStringEntropy({ length: 20, characterSet: customCharset });
console.log(`Entropy of a 20-char string from this set: ${entropy.toFixed(2)} bits`); // e.g., 103.58 bits
```
If you’re building applications where **true** unpredictability, fairness, and security are non-negotiable, you've found your essential utility. We believe that in today’s digital landscape, the integrity of your random data is paramount, and `shuffrand` is built to meet that challenge without compromise.

At its core, `shuffrand` offers a lean yet powerful API. Our `cryptoRandom` function generates secure numbers (integers or doubles) with precise control over ranges and exclusions, while `cryptoShuffle` provides cryptographically strong array permutations, either destructively or non-destructively. Need secure identifiers? `cryptoString` crafts random strings from various character sets, including Unicode, and even helps you calculate their cryptographic entropy.

This entire library is built with a future-forward mindset: it’s ESM-first, TypeScript-native, and optimized for Node.js v20+, ensuring a modern, maintainable, and tree-shakable solution that aligns with contemporary JavaScript development.

What truly sets `shuffrand` apart is its unwavering commitment to quality. Every line of code is subjected to rigorous testing (Vitest), not just against its source, but against the final compiled JavaScript files that get shipped to npm. This "test the final product" philosophy, coupled with robust runtime input validation via [ArkType](https://arktype.io/), ensures an exceptionally dependable utility. Whether you’re generating secure tokens for authentication, ensuring fair play in a gaming application, conducting unbiased statistical simulations, or simply need truly unpredictable data, `shuffrand` provides the secure foundation you can trust.
## Practical applications
`shuffrand` isn’t just about theoretical cryptographic purity; it’s a powerful **utility** designed for real-world scenarios where **unpredictable** and **unbiased** randomness is paramount. Here are just a few areas where `shuffrand` becomes an **indispensable** tool:

### [01] Security & auth
• **Secure identifiers and tokens**: generate cryptographically strong **UUIDs**, session **tokens**, and unique **identifiers** for users, transactions, or resources. This is crucial for preventing brute-force attacks and ensuring **access** control.<br>
• **Cryptographic keys and salts**: while `shuffrand` doesn’t perform **encryption** or **decryption** directly, it provides the high-quality **randomness** needed to generate robust **keys** and **salts** for **hashing** algorithms, significantly enhancing security.<br>
• **Data masking**: create random, yet consistent, masked data for testing or development environments, ensuring sensitive information remains secure while maintaining data structure.
### [02] Gaming and simulations (TTRPG, D&D, etc.)
• **Fair play mechanics**: implement truly **fair** game mechanics, from **coin-flips** and **dice rolls** (think `d20` for **D&D** and **TTRPGs**) to shuffling virtual card decks in games like **Hearthstone**. This ensures a genuinely **probabilistic** and **unbiased** experience for players.<br>
• **Critical hits and chance events**: accurately model chance-based events, such as **critical-hit** probabilities or loot drops, ensuring the underlying **algorithm** is sound and **unpredictable**.<br>
• **Lottery and prize draws**: for applications requiring verifiable fairness, `shuffrand` can be the **generator** for **lottery** numbers or prize draw selections.
### [03] Data processing and automation
• **Randomized data samples**: select random subsets from large datasets for statistical analysis or **mock-data** generation.<br>
• **Array permutations**: efficiently **shuffle** or **scramble** arrays of any type, whether for presenting randomized content, creating survey variations, or processing data in a **nondestructive** or **in-place** (destructive) manner.<br>
• **Automation**: integrate **randomness** into **automation** scripts where variability is needed, such as randomized delays or orderings.
### [04] Scientific and probabilistic research
• **Statistical simulations**: conduct simulations that require genuinely **unbiased** random inputs to ensure the validity of results.<br>
• **Entropy measurement**: use `calculateStringEntropy` to quantify the strength of generated random strings, aiding in security audits and compliance.
## Mock it till you make it.
In the grand scheme of things, `shuffrand` is a lightweight chassis for those **synthetic data makers** — or whatever they’re called — floating around GitHub.

This ambitious endeavor will heavily rely on `shuffrand`’s robust and secure primitives to generate:

• **Secure UUIDs**: universally Unique Identifiers that are **truly** random and collision-resistant.<br>
• **Passcodes**: strong, unpredictable passcodes for various authentication and authorization needs.<br>
• **Other unique identifiers**: a broad spectrum of secure and unique identifiers for diverse application requirements.

The design principles guiding this balance are clear:<br>remain **focused** and provide **only the core** stuff. This ensures a **building block**, rather than a bloated lib with specialized features.
## Help us grow
[Code of Conduct](https://github.com/DoronBrayer/shuffrand/blob/main/CODE_OF_CONDUCT.md)<br>[Contributing Guidelines](https://github.com/DoronBrayer/shuffrand/blob/main/CONTRIBUTING.md)
