<!-- README.md -->
# `shuffrand` by Doron B.
**shuff**le + **rand**om = shuffrand.

🎲 Cryptographically secure randomness and shuffling — with **soul**.

The modern JavaScript ecosystem suffers from a dangerous legacy: the pervasive use of `Math.random()`. This insecure, predictable pseudo-random number generator is a ticking time bomb in applications that silently rely on it for sensitive operations.

`shuffrand` was forged from the conviction that secure randomness should not be an afterthought; it should be the **default**. It provides a lean, powerful, and developer-friendly API that makes leveraging a true Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) simple, safe, and standard.

## An Uncompromising Approach to Randomness
`shuffrand` is built on a foundation of core principles that manifest as powerful, developer-friendly features.

#### ✔️ Secure by Default & Design
**Our Principle:** Security is non-negotiable. We exclusively use cryptographically secure primitives. There will never be an option for insecure methods like `Math.random` or seeded generators.<br>
**Your Feature:** Leverage `globalThis.crypto.getRandomValues()` (CSPRNG) for **truly** unpredictable numbers, strings, and array permutations. Our `calculateStringEntropy` utility even lets you quantify this cryptographic strength in bits.

#### ✔️ A Superior Developer Experience
**Our Principle:** A powerful API that is difficult to use is a failed API. We prioritize clarity and safety to make security the path of least resistance.<br>
**Your Features:** A fully-typed TypeScript API, plus robust runtime validation via **ArkType**, which provides clear, descriptive error messages and prevents unexpected behavior from invalid inputs.

#### ✔️ Modern, Lean, and Performant
**Our Principle:** We embrace the future of JavaScript. The library is architected with a pure ESM, future-forward mindset.<br>
**Your Features:** A pure ESM package that is optimized for Node.js v20+ and supports modern bundlers for optimal tree-shaking, keeping your application's footprint lean.

#### ✔️ Flexible & Precise by Design
**Our Principle:** A secure tool should also be a flexible one. We provide granular control over the output to fit your exact use case.<br>
**Your Features:**
- **Numbers:** Generate integers or doubles with precise bounds and advanced exclusion logic.
- **Strings:** Create random strings from predefined (`alphanumeric`, `hex`, etc.) or custom Unicode-aware character sets, with a powerful `noRepeat` option.
- **Arrays:** Perform secure Fisher-Yates shuffles, with support for both in-place (destructive) and non-destructive modes, as well as shuffling a specific **subarray**.

## `shuffrand` vs. The World
Why choose `shuffrand` over common alternatives? The difference is **security**.

| Feature | `shuffrand` | Vanilla JS (`Math.random()`) | Lodash (`_.random`, `_.shuffle`) |
| :--- | :--- | :--- | :--- |
| **Entropy Source** | ✅ Cryptographic (CSPRNG) | ❌ **Insecure** (PRNG) | ❌ **Insecure** (PRNG) |
| **Bias** | ✅ Unbiased | ⚠️ Potentially biased | ✅ Unbiased (but insecure) |
| **Error Handling** | ✅ Robust runtime validation | ❌ None (fails silently) | ⚠️ Minimal type checks |

## Installation
• **pnpm**: `pnpm install shuffrand`<br>• **npm**: `npm install shuffrand`<br>• **Deno**: `import { cryptoRandom, cryptoShuffle, cryptoString } from "npm:shuffrand@1.4.0"` — <small>no dedicated `install`/`add` command</small><br>• **Yarn**: `yarn add shuffrand`<br>• **Bun**: `bun add shuffrand`

## Quickstart Guide
Using `shuffrand` is designed to be lean and intuitive.

```js
import { cryptoRandom, cryptoShuffle, cryptoString } from 'shuffrand';

// A secure d20 dice roll for your TTRPG.
const diceRoll = cryptoRandom({ lowerBound: 1, upperBound: 20 });
// → e.g., 17

// A 6-character, unique hex code for a color.
const hexCode = cryptoString({ length: 6, characterSet: 'hex', noRepeat: true });
// → e.g., "3a9f0c"

// Securely shuffle a deck of cards, leaving the original unchanged.
const deck = ['A', 'K', 'Q', 'J', '10', '9'];
const shuffledDeck = cryptoShuffle(deck);
// → e.g., ['9', 'J', 'A', '10', 'Q', 'K']
```

## Use Cases
`shuffrand` is a powerful utility for real-world scenarios where unpredictability and fairness are paramount.

#### Security & Authentication
Generate cryptographically strong session tokens, API keys, verification codes, and unique identifiers. Create robust, high-entropy salts for hashing algorithms.

#### Gaming & Simulations
Implement truly fair dice rolls, coin flips, and virtual card shuffles. Create unpredictable loot drops, map layouts, or event sequences for games and statistical models.

#### Data Processing & Automation
Select unbiased random subsets from large datasets for analysis. Efficiently shuffle and assign users to different variations for A/B testing or randomized content.

## The `monorand` Ecosystem
`shuffrand` is the foundational engine of a larger, ambitious ecosystem named `monorand`. While `shuffrand` remains focused on providing the core, un-opinionated primitives of randomness, it will power a new companion library:

-   **`datrand`** (data-randomization): A future synthetic data maker that will heavily rely on `shuffrand`’s robust and secure primitives to generate everything from secure UUIDs and passcodes to complex, themed mock data.

## In the Browser (without a bundler)
`shuffrand` is a pure ES Module. To use it directly in a browser without a build step, you need an **Import Map** to tell the browser where to find the module on a CDN.

```html
<!DOCTYPE html>
<html>
<head>
    <title>shuffrand in the Browser</title>
    <!-- 1. Define the Import Map -->
    <script type="importmap">
    {
      "imports": {
        "shuffrand": "https://unpkg.com/shuffrand@1.4.0/dist/index.es.js",
        "arktype": "https://esm.sh/arktype@2.1.20",
        "@ark/schema": "https://esm.sh/@ark/schema@0.46.0",
        "@ark/util": "https://esm.sh/@ark/util@0.46.0"
      }
    }
    </script>
</head>
<body>
    <h1>Check the console (F12)</h1>
    <!-- 2. Use the import in your module script -->
    <script type="module">
        import { cryptoRandom } from 'shuffrand';
        const secureRoll = cryptoRandom({ lowerBound: 1, upperBound: 6 });
        console.log(`Your secure dice roll is: ${secureRoll}`);
    </script>
</body>
</html>
```
**Note:** Due to browser security (CORS), you must serve this HTML file from a local web server, not by opening the file directly. A simple way is to run `python -m http.server 8000` in the file's directory.

## A Note on Craftsmanship
This repository is intentionally structured to serve not only as a high-quality library but also as a reference implementation. From the rigorous, "test the final product" CI/CD pipelines to the dual-layer validation strategy and our comprehensive project **[DOCTRINE](DOCTRINE.md)**, every aspect has been designed with professional-grade software engineering principles in mind.

## Community & Contribution
-   **Found a defect? Have a good idea?** Please open an issue on our **[GitHub Issues](https://github.com/DoronBrayer/shuffrand/issues)**.
-   **Want to contribute code?** Please read our **[Contributing Guidelines](CONTRIBUTING.md)** and **[Code of Conduct](CODE_OF_CONDUCT.md)** first.