<!-- PERFORMANCE.md -->
# The Performance of `shuffrand`: A Deliberate Architecture for Security
In software engineering, performance benchmarks are often viewed as a race, where faster is unequivocally better. The benchmark results for `shuffrand`, however, tell a different, more deliberate story. When measured against insecure, native JavaScript functions, `shuffrand` is orders of magnitude slower.

This document provides a brutally honest and technically detailed analysis of this performance profile. It will demonstrate that this slowness is not an oversight or a flaw, but rather the intended and measurable outcome of a security-first design philosophy.

### The Benchmark Data: An Unflinching Look
Let's begin with the facts. The following table represents the averaged performance from our benchmark suite, comparing `shuffrand` functions to their insecure `Math.random()`-based equivalents. The primary metric is operations per second (hz), where higher is better.

| Function | `shuffrand` (Avg. Ops/sec) | `Math.random` Equivalent (Avg. Ops/sec) | Performance Difference |
| :--- | :--- | :--- | :--- |
| **`cryptoRandom`** (Integer 1–100) | ~295,996 | ~13,826,083 | **~47x slower** |
| **`cryptoShuffle`** (1000 elements) | ~330 | ~106,961 | **~324x slower** |
| **`cryptoString`** (Length 16) | ~17,774 | ~2,513,482 | **~141x slower** |

These numbers are not a mark of shame. They are a **badge of honor**, and understanding why is key to understanding the core value of this library.

### The Foundational 'Why': A Tale of Two Generators
The immense performance gap originates from the fundamental difference between the source of randomness used by `shuffrand` versus its rivals.

*   **The Insecure Rival: `Math.random()`**  
    `Math.random()` is a Pseudo-Random Number Generator (PRNG). It is a simple, self-contained mathematical algorithm. When called, it performs a lightning-fast calculation entirely within the JavaScript engine's "user space." It produces a sequence of numbers that appear random but are, in reality, part of a deterministic and predictable series. If you know the algorithm and its internal starting state (the "seed"), you can predict every subsequent number. It is fast because its work is trivial and requires no interaction with the broader operating system.

*   **The `shuffrand` Engine: `globalThis.crypto.getRandomValues()`**  
    `shuffrand` exclusively uses a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). Unlike a PRNG, a CSPRNG cannot rely on a simple internal formula. To achieve genuine unpredictability, it makes a **system call** to the host operating system. This is a heavyweight operation that involves a **context switch** from your JavaScript code to the OS kernel. The kernel then gathers high-quality entropy from unpredictable physical sources, such as:
    *   The precise timing of hardware interrupts (keyboard, disk I/O).
    *   Tiny variations in fan speeds and CPU temperature.
    *   The exact arrival times of network packets.
    *   Electrical noise from system components.

    The performance slowdown you are measuring is the **unavoidable price of this system call**. `shuffrand` is deliberately paying a time-based tax to acquire genuinely unpredictable, secure random data instead of cheap, predictable mathematical noise. This is the difference between a bedroom door and a bank vault door; their disparity in weight and speed is directly proportional to their security function.

### The Compounding Cost of Correctness

The performance slowdown is not a flat cost; it compounds with each required secure operation, which explains the dramatic differences between the functions.

*   **`cryptoRandom` (~47x slower):** This is the baseline cost of making a single, secure request for entropy.
*   **`cryptoString` (~141x slower):** The source code for `cryptoString({ length: 16 })` confirms that its internal loop calls `cryptoRandom` **16 separate times**. It is paying the entropy tax for every single character to ensure each selection is independently secure.
*   **`cryptoShuffle` (~324x slower):** This is the most illustrative example. The Fisher–Yates shuffle algorithm, used to permute a 1000-element array, requires 999 swaps. `shuffrand`'s implementation makes a call to `cryptoRandom` **inside the loop for every single swap**. It pays the entropy tax nearly a thousand times to guarantee that every choice of which element to swap is cryptographically unpredictable, resulting in a verifiably secure permutation.

In addition to this core cost, `shuffrand` also pays a small, one-time performance tax at the start of each function call for its robust validation layers (ArkType schemas, custom checks) and bias-rejection algorithms—a negligible price for a safe, reliable, and feature-rich API.

### The Real-World Perspective: Relative vs. Absolute Performance

While "300x slower" is a terrifying relative metric, it is meaningless without absolute context.

The benchmark shows `cryptoShuffle` performing at ~330 operations per second. This means securely shuffling a 1000-item array takes roughly **3 milliseconds**. For `cryptoRandom`, the time is measured in microseconds.

For 99.9% of the applications `shuffrand` targets—shuffling a deck of cards for a game, generating a unique session token, randomizing a list of users for an A/B test, or picking a lottery winner—a 3-millisecond delay is **instantaneous and imperceptible**. The speed of the insecure alternative is irrelevant if the result is fundamentally untrustworthy.

### A Specialized Tool: When *Not* to Use `shuffrand`
Brutal honesty requires defining boundaries. `shuffrand` is a specialized, high-assurance tool. It is the **wrong tool** for specific jobs:

1.  **Non-Critical, High-Volume Visuals:** For generating millions of particle effects in an animation, where performance is paramount and predictability is irrelevant, the native `Math.random()` is the correct choice.
2.  **Seedable, Deterministic Output:** For procedural content generation (e.g., creating a repeatable game map from a seed), a dedicated, seedable PRNG library is required. `shuffrand` is intentionally designed for unpredictability and does not support seeding.

Using `shuffrand` in these scenarios would be a misapplication of its purpose. It is the perfect, calibrated instrument, but only for the nails that absolutely cannot be allowed to bend.

### The Final Verdict
The `shuffrand` benchmark results are not a sign of failure but a powerful testament to its success. The library is not "slow"; it is **professional and deliberate**. It makes the only responsible engineering trade-off for its domain: sacrificing imperceptible amounts of performance for a monumental gain in security, reliability, and developer experience.

This performance profile is the physical proof that the library is honoring its core promise, as stated in its doctrine: **Security is Non-Negotiable.**