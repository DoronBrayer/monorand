<!-- DOCTRINE.md -->
# The Doctrine of `shuffrand`

**Doc ver:** 2.3<br>
**Ver adherence**: 1.4.0<br>
**Status:** Canon<br>
**Author:** [Doron B.](https://github.com/DoronBrayer) and Gemini<br>

### Document Purpose & Audience
This Project Doctrine serves as the canonical, single source of truth for the `shuffrand` library and its ecosystem. It is an internal, professional-grade mandate for project maintainers and expert contributors.

It is distinct from the public-facing `README.md`.
-   The **`README.md`** is the "shop window": concise, welcoming, and focused on immediate value for the first-time user—what the library is and how to install and use it.
-   This **`DOCTRINE.md`** is the "engineering blueprint": comprehensive, precise, and authoritative. It details the project’s architecture, quality mandates, and operational workflows. For the project’s strategic roadmap and release history, please refer to our visionary **[`CHANGELOG.md`](CHANGELOG.md)** (serves also as a roadmap).

### 📜 Guiding Principles
*   **Security is Non-Negotiable.** We exclusively use cryptographically secure primitives. There will never be an option for insecure methods like `Math.random` or seeded generators. Our commitment is to provide a tool that is safe by default and by design.
*   **Developer Experience is a Core Feature.** A powerful API that is difficult to use is a failed API. We prioritize clear, intuitive function signatures, robust runtime validation, and descriptive error messages to make security the path of least resistance.
*   **Modern, Lean, and Performant.** The library is architected with a pure ESM, future-forward mindset. We leverage modern JavaScript features and optimize for performance, ensuring the library is a joy to use and efficient to bundle.
*   **Quality is Architected, Not Added.** Our professional-grade QA strategy is embedded in our workflows, from the "test the final product" philosophy to automated CI/CD pipelines. We do not bolt on quality at the end; we build upon its foundation.

---

## Part I: The Vision & The Product
*This section defines what `shuffrand` is, why it exists, and what it does. It is the core identity of the project.*

### 1. 🧭 The Six W’s
#### 👤 Who
This library is engineered for developers who refuse to compromise on the integrity and quality of randomness. Our target cohorts are professionals who understand the risks of insecure randomization.
-   **Security-Conscious Developers & Library Authors** building authentication systems, token generators, or other security-critical utilities.
-   **Game Developers** implementing fair, unbiased, and unpredictable mechanics (e.g., dice rolls, card shuffles, loot drops) for platforms from D&D/TTRPG tools to digital games.
-   **Data Scientists & Researchers** requiring genuinely unbiased random sampling for statistical simulations and analysis.
-   **Advanced TypeScript Users** who demand a lean, modern, and type-safe API with robust runtime validation.
#### 🦆 What
`shuffrand` (**shuff**le + **rand**om) is a zero-dependency, lightweight TypeScript utility library that provides a trio of cryptographically secure functions for randomization tasks. It is architected to be the definitive modern replacement for the insecure and insufficient native `Math.random()` and the non-secure utilities found in other common libraries.
#### 📅 When
`shuffrand` is the mandated choice in any scenario where the integrity of random data is non-negotiable and its failure would compromise security, fairness, or scientific validity.
-   **Security:** Generating session tokens, API keys, database salts, or unique identifiers.
-   **Gaming & Fairness:** Shuffling virtual card decks, rolling dice, determining critical hit chances, or running lotteries.
-   **Data Processing:** Creating randomized data samples, generating mock data, or performing unbiased array permutations.
-   **Automation:** Introducing unpredictable variability into scripts and automated processes.
#### 📍 Where
`shuffrand` is architected as a universal (isomorphic) JavaScript module with a clear focus on modern environments. This section defines both the ideal use-case environments and the technical runtime constraints.
**Application Environments:**
-   ✅ **Server-Side Applications:** Backend services requiring secure token generation or unique ID creation.
-   ✅ **Serverless Functions:** Cloud functions where performance and secure, stateless operations are key.
-   ✅ **Client-Side Web Applications:** Modern browsers where user-facing randomness (e.g., in a game) must be fair and unpredictable.
-   ✅ **CLI Tools & Scripts:** Any command-line utility requiring a source of secure randomness.
**Technical Environments:**
-   **Runtime:** Optimized for **Node.js v20+**.
-   **Browser Compatibility:** Fully browser-compatible thanks to its exclusive use of `globalThis.crypto`, which resolves correctly in all modern browsers.
-   **Compiler:** Built with **TypeScript v5+** in strict mode.
-   **Module System:** Pure **ESM** (`import`/`export`), with no support for legacy CommonJS.
#### 🧠 Why
The modern JavaScript ecosystem suffers from a dangerous legacy: the pervasive use of `Math.random()`. This insecure, predictable pseudo-random number generator is a ticking time bomb in applications that silently rely on it for sensitive operations. `shuffrand` was forged from the conviction that secure randomness should not be an afterthought; it should be the default. It addresses this critical pain point by providing a robust, developer-friendly API that makes leveraging a true Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) simple, safe, and standard.
#### ⚙️ How
The library is designed for a seamless developer experience, from installation to implementation.
-   **Installation:** `pnpm install shuffrand` (or `npm`/`yarn`/`bun`).
-   **Usage:**
    ```typescript
    import { cryptoRandom, cryptoShuffle, cryptoString } from 'shuffrand';
    // Get a secure random integer from 1 to 20.
    const diceRoll = cryptoRandom({ lowerBound: 1, upperBound: 20 });
    // Securely shuffle a deck of cards without modifying the original.
    const shuffledDeck = cryptoShuffle(['A', 'K', 'Q', 'J']);
    // Generate a 32-character secure alphanumeric token.
    const apiToken = cryptoString({ length: 32 });
    ```
### 2. 🧱 Functional Architecture
#### Core Functions
| Function | Description | Key Options / Flags |
| :--- | :--- | :--- |
| `cryptoRandom` | Generates a single, cryptographically secure number. | `lowerBound`, `upperBound`, `typeOfNum` ('integer'/'double'), `exclusion`, `maxFracDigits` |
| `cryptoShuffle`| Permutes an array using the secure Fisher–Yates algorithm. | `isDestructive` (in-place shuffle), `preventIdentical` (guarantees a different order), `startIndex: number` + `endIndex: number` (shuffles a subarray) |
| `cryptoString` | Generates a random string from a specified character set. | `length` (num of elements), `characterSet` (predefined or custom), `noRepeat` (avoids duplicates) |

#### Algorithms & Deep Logic
The library’s implementation is founded on provably correct and performant algorithms.
-   **Entropy Sourcing & Bias Rejection**: All randomness is sourced directly from the host environment’s CSPRNG via `globalThis.crypto.getRandomValues()`. For integer generation in a specific range `[min, max]`, it employs a bias-rejection algorithm. This is a critical step that prevents the subtle statistical biases that plague naive implementations, ensuring every integer in the range has a truly equal probability of being chosen.
-   **Permutation via Secure Fisher–Yates**: The implementation uses the modern, inside-out variant of the Fisher-Yates algorithm. It iterates from the end of the array to the beginning, swapping each element with an element at a random, cryptographically secure index from the remaining part of the array. This guarantees that every permutation is equally likely, a fundamental requirement for fairness.
-   **Optimized Construction via Pre-allocation**: String generation is highly optimized to avoid the common performance pitfalls of naive implementations. The function pre-allocates an array of the desired length, iterates to fill it with securely-selected characters, and then uses a single `Array.prototype.join('')` call to construct the final string. The process is fully Unicode-aware thanks to its use of `Array.from()` for character set manipulation.

#### 🔐 Cryptographic Integrity
The security guarantees of `shuffrand` are its most important feature.
-   ✅ **Exclusive Use of CSPRNG**: The library exclusively uses `crypto.getRandomValues()` and will never fall back to `Math.random()`.
-   ❌ **Rejection of Insecure Methods**: `Math.random()` is never used for any randomness generation.
-   ✅ **Collision Resistance**: String generation is as collision-resistant as its entropy allows. The `calculateStringEntropy` utility (`log2(charset_size) * length`) allows developers to quantify this strength.
-   ✅ **Entropy Guarantees**: All functions inherit their cryptographic guarantees directly from the host environment’s Web Crypto API implementation.
-   ⚠️ **Limitations**: While perfect for tokens, salts, and identifiers, `shuffrand` is not a full cryptographic suite and is not intended to be a replacement for dedicated cryptographic key generation tools like OpenSSL.
-   ❌ **Intentional Lack of Seeding**: The library **intentionally does not support seeding**. Providing a seed would violate the core promise of using an unpredictable, high-entropy source.

### 3. 🔐 Validation Strategy
The project’s validation strategy is a two-layer defense system designed for maximum safety.
| Layer | Tool / Method | Responsibility | When it Runs |
| :--- | :--- | :--- | :--- |
| **Static** | TypeScript (`strict: true`) | Catches type errors, incorrect function calls, and logical issues that are visible at compile time. | During development and as a pre-build step in CI. |
| **Runtime**| ArkType Schemas | Validates the structure and values of function arguments *as the code is executing*. Catches invalid data from APIs, user input, etc. | Every time a core `shuffrand` function is called. |

### 4. 🥊 Rivals & Comparisons
#### `cryptoRandom`
| Feature | `shuffrand` | Vanilla JS (`Math.random()`) | Lodash (`_.random`) |
| :--- | :--- | :--- | :--- |
| **Entropy Source** | ✅ Cryptographic (CSPRNG) | ❌ **Insecure** (PRNG) | ❌ **Insecure** (PRNG) |
| **Bias** | ✅ Unbiased | ⚠️ Potentially biased | ✅ Unbiased (but insecure) |
| **Integer Range** | ✅ Inclusive `[min, max]` | ⚠️ Manual `floor` required | ✅ Inclusive `[min, max]` |
| **Exclusion Logic**| ✅ Built-in option | ❌ Manual logic required | ❌ Manual logic required |
| **Error Handling** | ✅ Robust runtime validation | ❌ None (fails silently) | ⚠️ Minimal type checks |

#### `cryptoShuffle`
| Feature | `shuffrand` | Vanilla JS | Lodash (`_.shuffle`) |
| :--- | :--- | :--- | :--- |
| **Underlying Algo**| ✅ Secure Fisher-Yates | ⚠️ Manual implementation needed | ✅ Fisher-Yates (insecure source) |
| **`preventIdentical`**| ✅ Built-in option | ❌ Manual logic required | ❌ Manual logic required |
| **In-Place Mode** | ✅ Built-in (`isDestructive`) | ⚠️ Manual implementation needed | ❌ Returns new array only |

#### `cryptoString`
| Feature | `shuffrand` | Vanilla JS | Lodash (`_.sampleSize`) |
| :--- | :--- | :--- | :--- |
| **Entropy Source** | ✅ Cryptographic (CSPRNG) | ❌ Insecure (PRNG) | ❌ Insecure (PRNG) |
| **Unicode Support** | ✅ Full Unicode Awareness | ⚠️ Potential errors | ✅ Full Unicode Awareness |
| **Entropy Calculation** | ✅ Built-in utility | ❌ Not available | ❌ Not available |
| **Predefined Sets** | ✅ `alphanumeric`, `hex`, etc. | ❌ Manual sets required | ❌ Manual sets required |

### 5. 📊 Benchmarks & Performance
While prioritizing security, `shuffrand` is highly performant. The current unpacked size is **~57 kB**, a figure deemed excellent given the robust runtime validation provided by the included `arktype` dependency. Aspiring for a significantly smaller footprint would require sacrificing this critical runtime safety layer, which is a trade-off we are unwilling to make.
Regarding benchmarking tools, while `tiny-bench` is a solid choice for 2025, the landscape is always evolving. `Bencho` is a promising alternative that offers impressive features like regression analysis and results visualization. A thorough evaluation will be conducted when the formal benchmark suite is implemented.
**(A formal benchmark suite will be implemented to provide concrete ops/sec metrics.)**

---

## Part II: The Process & The Craft
*This section details the machinery *behind* the product. It is for contributors and maintainers who need to understand our engineering culture, quality standards, and operational workflows.*

### 6. ✅ Quality Assurance
The project’s quality assurance (QA) strategy is not an afterthought; it is a core pillar of the development process, reflecting the creator’s more than a decade of experience as a QA and Automation Specialist in the software R&D industry. Quality is a non-negotiable mandate, and this philosophy is embedded in our tools and workflows.
-   **Philosophy: "Test the Final Product"**: We do not test our raw TypeScript source code. Instead, our CI/CD pipeline first performs a full production build using **Vite** (`vite.config.ts`), creating the final minified JavaScript artifacts. We then run our test suite against these compiled files, guaranteeing that what we publish is exactly what we’ve validated. This Ahead-of-Time (AOT) compilation and testing strategy is a deliberate choice for maximum safety and reliability over Just-in-Time (JIT) alternatives.
-   **Automated & Multi-Faceted Testing**:
    -   The entire test lifecycle is managed by **Vitest** (`vitest.config.ts`), configured to discover and run only the compiled test files located in the `dist/` directory.
    -   This process is orchestrated via the `pnpm test` script, which chains the `clean`, `build`, and `vitest` commands into a single, reliable workflow.
    -   This workflow is automatically executed on every push and pull request to the `main` branch by a **GitHub Actions** CI pipeline (`.github/workflows/main.yml`), preventing any regression from being merged.
-   **Comprehensive Test Suite Structure**:
    -   The project’s test suite is a comprehensive validation harness, with granular test files meticulously targeting each function and validation category.
    -   It is organized into suites for `Core` (default behavior), `Basics` (common parameters), `Exclusion`/`Prevent Identical` (feature-specific), `Edge Cases` (stress tests), and `Error Handling` (validation). This structured approach ensures every feature and parameter is scrutinized from multiple angles for both correctness and resilience.

### 7. 🏛️ Our Taxonomy
A shared language is the foundation of quality. This project uses a bespoke, professional-grade taxonomy to classify all aspects of the software, ensuring that every defect and task can be tracked with precision and clarity.

The framework is built upon seven primary categories of quality, prioritized by essentiality: `Functionality` → `Resilience` → `Security` → `Surface` → `Performance` → `Compatibility` → `Maintainability`. Each primary category is assigned a unique, high-contrast color to serve as an instant visual identifier in our tooling. To ensure comprehensive coverage, each of these primary categories is further broken down into three distinct, non-overlapping subcategories, similar to how the "CIA triad" completely covers the domain of Security.

This system ensures that every issue is not only categorized but also sub-categorized with a high degree of specificity, using a formal `Category : Subcategory` label (e.g., `Security : Confidentiality`). This structured lexicon is a core part of our commitment to engineering excellence.

### 8. 🧰 Dev Env
#### Creator’s setup at the **beginning** of the journey (v1.4.0)
-   **Runtime**: Node.js v24.x
-   **Compiler**: TypeScript v5.x
-   **Package Manager**: pnpm v10.x
-   **VCS**: Git v2.x
-   **IDE**: Visual Studio Code v1.10# (e.g., v1.102)
-   **OS**: Windows 11 Pro (64-bit, 24H2)
-   **Hardware**: ThinkPad X1 Yoga Gen 8 (Intel® Core™ i7)

#### Enhancers
| Tool | In Use | Solid Alternatives (2025) |
| :--- | :--- | :--- |
| **Linter** | ESLint (to be replaced) | `Biome`, `oxc` (Oxlint) |
| **Formatter** | Prettier (to be replaced) | `Biome`, `dprint` |
| **Test Runner**| Vitest | `Jest`, `Playwright` |
| **Bundler** | Vite | `Rollup`, `esbuild` |
| **Cleaner** | `clean.mjs` (file) | `rimraf`, Native commands (`rm -rf`) |
| **AI Assistant**| Gemini | `Qwen`, `Kimi` |

### 9. 🗂️ File Structure & Naming Conventions
The project employs a unique and deliberate **root-based file structure** for the core `shuffrand` library. All source (`src.*.ts`) and test (`test.*.ts`) files reside directly in the project root. This minimalist, folderless approach is an intentional design choice to maximize development velocity by eliminating the need to traverse deep directory trees for core logic.
As the project expands, it is evolving into a **hybrid monorepo**. This approach maintains the flat structure for the core library while allowing the new synthetic-data library to scale independently within its own subdirectory. This "root + package" structure is still under consideration but is the leading architectural plan.
```plaintext
shuffrand/                   # The root of the monorepo that pottentialy holds at least 2 libs
├── datrand/               # The secondary lib — the sidekick/companion of "shuffrand" — project’s synthetic data maker
│   ├── src.*.ts
│   ├── test.*.ts
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── ADR/                # Architecture Decision Records (ADR)
│       └── 001-versioning-and-codename-strategy.md
├── index.ts                # Entry for "shuffrand" (the primary lib)
├── src.*.ts                # Source files for "shuffrand" (the primary lib)
├── test.*.ts               # Test files for "shuffrand" (the primary lib)
├── package.json            # Root workspace config
├── tsconfig.json           # Root TS config
└── ...
```
**(Action Item: Place the primary lib (`shuffrand`) in a dedicated directory.)**

### 10. 🚀 Task, Contribution, & Release Workflow
The project follows a disciplined, automated workflow for all development and release activities to ensure quality and consistency.

#### Task Management Doctrine
All work is tracked exclusively via **GitHub Issues** to ensure transparency, traceability, and community engagement. `TODO.md` files or other external trackers are not used.
-   🐞 **Defect-Related Tasks**:
    -   **Defect Report (`DR`):** An issue is reported with a plain-text title (e.g., `Tooltip text contains a typo`), a system ID (`DR0092`), and a severity (`S0`-`S3`). This documents the problem only.
    -   **Defect Elimination Task:** A developer creates a task to fix the defect, titled with the format `DR0092:S3 → Fix the typo in the tooltip`. It must link back to the `DR`. Upon completion, the `DR` is updated with a link to the fix and then closed.
-   🔧 **Modification Tasks**:
    -   All other work (features, refactoring, chores) is a Modification Task.
    -   The title is formatted with a chess icon indicating priority: `♖ Replace cdnjs.cloudflare.com URLs with {identifier}.azureedge.net`.
    -   **Priorities**: ♔ King (≤0.5d) → ♕ Queen (≤14d) → ♖ Rook (≤28d) → ♗ Bishop (≤42d) → ♘ Knight (≤56d) → ♙Pawn (≤70d)

#### Contribution & Release Workflow
-   **Contribution Guidelines:** All contributions must adhere to the `CONTRIBUTING.md`, which includes the project’s core `Architectural Principles`.
-   **Doctrine & ADRs:** Changes to this `DOCTRINE.md` or the creation of a new Architecture Decision Record (`ADR`) are significant events that require a formal proposal and review process via a dedicated GitHub Issue.
-   **Architectural Decision Records (ADRs):** Significant decisions about the project’s architecture, tooling, or workflow are documented in **Architecture Decision Records**. These are stored in the `.github/ADR/` directory and follow the format `[###]-[kebab-case-title].md`. The number provides a stable, chronological reference, while the title provides context. This process ensures our strategic decisions are transparent and well-documented.
-   **Conventional Commits**: Commits must adhere to the Conventional Commits specification for a clear and machine-readable history.
-   **Pull Request (PR) Standards**: PRs are expected to include relevant tests, pass all CI checks, and receive approval before being merged.
-   **Release Process (for Maintainers):** The release process is a streamlined, tag-triggered workflow.
    1.  **Pre-Release Validation**: Locally run `pnpm test`, `pnpm format`, and `pnpm lint`.
    2.  **Commit & Tag**: Commit all changes, then create and push a new Git tag (e.g., `git tag v1.4.0 && git push origin v1.4.0`).
    3.  **Automated Publishing**: Pushing the tag initiates the `publish.yml` GitHub Actions workflow, which re-validates, checks for duplicates, and securely publishes the new version to npm.

---
## Part III: The Future & The Community
*This section outlines the strategic roadmap and how the project will grow and engage with the wider ecosystem.*

### 11. 📖 Documentation Strategy
A project’s documentation is a direct reflection of its quality and user empathy.

#### Documentation Formats
There are several standard approaches to documentation in modern development:
1.  **Dedicated Docs Website:** A full site built with a static site generator (SSG) like VitePress, Docusaurus, or Astro. This offers search, navigation, interactive examples, and a professional user experience.
2.  **`docs/` Folder with Markdown:** A simpler, repository-native approach using a collection of inter-linked Markdown files.
3.  **Auto-generated from Code:** Using tools like TypeDoc to generate HTML or Markdown directly from TSDoc comments in the source code.
4.  **AI-Generated:** Using emerging AI tools to summarize and explain the codebase.

#### The `shuffrand` Decision
The project will adopt **Option 1: A dedicated documentation website built with VitePress.**
**Rationale:** Given the project’s ambition to be an enterprise-grade, de facto standard, only a full documentation site can provide the necessary level of professionalism and usability. This also offers the strategic opportunity to expand the site beyond simple API documentation into a larger resource hub with articles, recipes, and community showcases.

### 12. 📣 Community & Adoption
Engagement with the developer community is key to the project’s long-term success.
-   **Contribution Guidelines**: A comprehensive `CONTRIBUTING.md` file, including the project’s core `Architectural Principles`, guides contributors to make meaningful and aligned contributions.
-   **Issue & Feature Reporting**: Clear templates for bug reports and feature requests are provided via GitHub Issues.
-   **Ecosystem Positioning**: The vision for the `monorand` ecosystem is a two-pronged approach. First, for `shuffrand` (core) to be the undisputed, go-to utility for **cryptographically secure randomness** in the JavaScript ecosystem—a trusted, stable, and lean foundation. Second, to build a companion **synthetic-data library** (`datrand`) on top of that trusted foundation, providing developers with a rich and reliable toolset for generating everything from simple UUIDs to complex mock data, all powered by the security guarantees of the core library.
-   **Outreach**: We will encourage adoption by creating "recipes" and articles, and by positioning `shuffrand` as the secure dependency for other libraries that require a source of randomness.

#### Ideal Team Composition
The project is optimized for a small, focused team that can maintain high velocity without architectural drift.
-   **Recommended Size:** 1 Lead Maintainer and 1-2 core contributors.
-   **Rationale:** The high degree of automation, strict quality gates, and clear architectural vision are best served by a small team with tight communication, avoiding the overhead and potential for conflicting ideas that can arise in larger groups.

### 13. ⚜️ A Note on Craftsmanship
This repository is intentionally structured to serve not only as a high-quality library but also as a reference implementation—a template for how modern, enterprise-grade TypeScript libraries can be built. From the rigorous, AOT-based CI/CD pipelines and the dual-layer validation strategy to the detailed task management workflow and this very doctrine, every aspect has been designed with professional-grade software engineering principles in mind. Developers are encouraged to study this repository as a reference for building their own high-quality, maintainable libraries.

---

## Appendix
### 14. ❓ Q&A
A curated list of high-quality questions to address common user queries and concerns, reinforcing the library’s design principles.

#### Security & Philosophy
**Why does `shuffrand` avoid `Math.random()` entirely?**  
Because `Math.random()` is a Pseudo-Random Number Generator (PRNG), not a CSPRNG. Its output is mathematically predictable and should never be used for security-sensitive applications, games of chance, or unbiased statistical sampling. `shuffrand` exclusively uses `globalThis.crypto` to guarantee cryptographic security, a non-negotiable principle of this library.

**Why doesn’t `shuffrand` support a seed for repeatable results?**  
Providing a seed would fundamentally violate the library’s core promise. Seeding allows for predictable, repeatable sequences, which is the exact opposite of what a *cryptographically secure* generator is for. Its purpose is unpredictability. If you need repeatable "randomness" for testing or other procedural generation, you should be using a standard, seedable PRNG library, not a CSPRNG wrapper.

**Are there any known security vulnerabilities in `shuffrand`?**  
No. The library has no known vulnerabilities. Its attack surface is deliberately minimal; it is a thin, robust wrapper around the host environment’s native `globalThis.crypto` implementation. We delegate the core cryptographic work to the battle-tested code provided by Node.js and modern browsers. Any security concerns should be reported via our `SECURITY.md` policy.

#### Functionality & Usage
**Can I use `shuffrand` in the browser?**  
Yes. The library is fully browser-compatible out of the box because it uses `globalThis.crypto`, which is supported in all modern browsers. Our `README.md` provides a guide on how to use it directly in HTML with an import map for environments without a bundler.

**What is the performance impact compared to `Math.random()`?**  
`crypto.getRandomValues()` is inherently slower than `Math.random()` because it must source entropy from the operating system, which is a more complex operation than the simple mathematical algorithm used by `Math.random()`. However, for the vast majority of applications, this difference is negligible (measured in microseconds). The immense security benefit far outweighs the minor performance cost.

**Why does `preventIdentical` swap the first and last elements specifically?**  
This is a simple, deterministic, and computationally cheap way to guarantee a different permutation. While other methods exist (like re-shuffling until a different result is found), they are non-deterministic and could theoretically lead to long loops. The first/last swap is a pragmatic solution that is predictable and efficient.

**Why is the max length (`cryptoString`) set to 16 characters only?**
The default of `16` (`const effectiveLength = params.length ?? 16`) is a professional, "sensible default" that provides a strong baseline of security for common use cases.

#### Testing & Quality
**How is the randomness actually tested?**  
We test for correctness, not for randomness itself, as you cannot truly "test" a CSPRNG’s output for entropy. Instead, we validate that our functions correctly *use* the CSPRNG to produce values that fall within the requested bounds (e.g., a number between 1 and 10), are of the correct type (integer/double), and respect all exclusion rules. Our confidence in the randomness itself comes from delegating to the host environment’s `crypto` implementation.

**What makes the Fisher-Yates shuffle "secure"?**  
The security of our shuffle comes from its source of randomness. The algorithm itself is just a method for permutation. By using `cryptoRandom` to pick the indexes at every step, we ensure that the choice of which element to swap is cryptographically unpredictable, making the final shuffle order equally unpredictable. An insecure random source would make the shuffle insecure, regardless of the algorithm.

**How can you be sure the *quality* of the randomness is high?**  
We don’t guess; we delegate. By relying exclusively on `globalThis.crypto`, we are delegating the responsibility of high-quality entropy sourcing to the host environment (the Node.js runtime or the browser). These environments have teams of engineers dedicated to ensuring their crypto implementations are secure, robust, and compliant with web standards. We trust their expertise and build upon their secure foundation.

#### Architecture
**Why don’t you use standard `src/` and `test/` folders? What’s with the strange file structure?**  
This is a deliberate design choice for the core `shuffrand` library to maximize development velocity. By keeping all source and test files in a flat, root-based structure, we eliminate navigation overhead and keep core logic immediately accessible. It’s an uncommon but highly effective approach for a lean, focused library that prioritizes developer speed and simplicity for its core maintenance.

**Why does the library include ArkType? Doesn’t that increase bundle size?**  
Yes, and this is an intentional design decision. ArkType provides runtime validation that TypeScript cannot. It protects your application from invalid data coming from external sources (like APIs or user input), preventing crashes and security vulnerabilities. The modest increase in bundle size is a small price to pay for this critical layer of safety.

**Why does `shuffrand` use both custom validation and ArkType? Isn’t that redundant?**  
They serve two different purposes. Our **custom validation** (e.g., for `maxFracDigits`) runs first to provide highly specific, developer-friendly error messages for common mistakes. **ArkType** then acts as a comprehensive safety net, catching all other structural and type-related errors with its powerful schema validation. It’s a two-layer defense: tailored DX followed by total robustness.

#### Project & Vision
**What is the long-term vision for the `shuffrand` ecosystem?**  
The vision is a two-pronged approach. First, for `shuffrand` (core) to be the undisputed, go-to utility for **cryptographically secure randomness** in the JavaScript ecosystem—a trusted, stable, and lean foundation. Second, to build a new **synthetic-data library** on top of that trusted foundation, providing developers with a rich and reliable toolset for generating everything from simple UUIDs to complex mock data, all powered by the security guarantees of the core library.

**How does the project plan to maintain its quality as it grows?**  
Through disciplined adherence to the principles laid out in this doctrine. Our automated CI/CD pipelines, "test the final product" philosophy, and rigorous PR review process are designed to scale. New features will require comprehensive tests, and significant architectural changes will require a formal ADR (`.github/ADR/` _Architecture Decision Record_), ensuring quality is maintained regardless of the project’s size.

**What is the best way for me to contribute?**  
The best way is to start by reviewing our `CONTRIBUTING.md` file and our `Architectural Principles`. Then, look for open issues on GitHub, particularly those tagged with "help wanted" or "good first issue." Submitting a well-tested Pull Request for one of these is the ideal way to contribute.

### 15. 🧍🏻About the Creator
`shuffrand` was forged from the practical, real-world experience of its creator [Doron B.](https://github.com/DoronBrayer) . Its journey began with a simple wrapper script, `filler.ts`, built to tame and enhance synthetic data makers like `chance.js` for a team of automation developers. This pragmatic origin story is central to the library’s soul.

Doron’s career is a unique blend of formal front-end development and a deep, pre-existing passion for UX design, which he later formalized with professional certifications. This dual-focus was put to the test when he was tapped to build his former company’s entire QA automation infrastructure from the ground up, a role that demanded both engineering rigor and a profound empathy for the developer experience.

`shuffrand` is the natural product of this rare synthesis of skills. The library’s fanatical commitment to quality and robustness comes from the mind of a seasoned QA automation lead. Its clean, intuitive API is shaped by the principles of a UX designer. And its meticulous attention to detail—from the project structure to the task management system—is a direct reflection of its creator’s personal standard for high-quality craftsmanship. Driven by an ambitious vision to create a 10K-star repository that serves as a benchmark for quality in the open-source community, `shuffrand` is more than just a utility; it’s a statement of what is possible when engineering, design, and quality are treated as equal partners.