<!-- ./CHANGELOG.md -->
# Changelog
- All notable alterations — [past](#PAST), [present](#PRESENT) and [future](#FUTURE) — are documented here.
- The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- This project adheres to [Semantic Versioning (SemVer)](https://semver.org/spec/v2.0.0.html) for the time being.
- This also serves as a **roadmap**, while dates for [FUTURE](#FUTURE) releases are merely placeholders and certainly **subject to change**.
- Patch versions (e.g., `1.4.1`, `1.5.2`) are reserved for bugfixes — thus do not appear here.

---

[PRESENT](#PRESENT)&nbsp;&nbsp;_The 3 most recent releases_<br>
[PAST](#PAST)&nbsp;&nbsp;_All releases preceding the 3 most recent_<br>
[FUTURE](#FUTURE)&nbsp;&nbsp;_All releases succeeding the most recent one_<br><br>
[Template](#Template)&nbsp;&nbsp;_For you to copypaste and edit — not remove_<br>

---

## <a name="PRESENT"></a>PRESENT
The 3 most recent releases — essentially a **news section**:

### [[1.8.0](https://github.com/DoronBrayer/shuffrand/tags)] 2025-08-12: Monorepo
This version represents a **FUNDAMENTAL ARCHITECTURAL SHIFT**, preparing `shuffrand` for its future as the core of a larger ecosystem. It is a major, **breaking change** that solidifies the project’s long-term vision.

#### Added
- **BREAKING CHANGE** :The repository is officially a **monorepo** to support multiple packages/libraries:
- github.com/USERNAME`/shuffrand` → github.com/USERNAME`/monorand`
- `shuffrand/[nada]` → `monorand/shuffrand`
- `shuffrand/[nada]` → `monorand/datrand`

#### Notes
- For the time being—and **strictly as a safety measure**—the monorepository retains its original naming convention (`shuffrand`), yielding peculiar paths such as `./shuffrand/shuffrand` and `./shuffrand/datrand`.

### [[1.7.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.7.0)] 2025-08-06: Proof of quality
#### Added
- Performance-benchmark suite (`inspection.*.ts` files and `pnpm run benchmark` script) to provide quantitative performance metrics.
- Dedicated browser-based "real-world regression" tests using Playwright (`test.*-regression.ts` and `*.html` files) to formally guarantee browser compatibility and real-world functionality.
- [WORKFLOWS.md](WORKFLOWS.md): A new documentation file detailing the project's local development, testing (unit, browser, benchmark), and release workflows.
- [PERFORMANCE.md](PERFORMANCE.md): A new documentation file serving as the canonical source for public-facing performance analysis and benchmark results.

#### Changed
- [DOCTRINE.md](DOCTRINE.md): Updated to reflect the maturation of quality assurance processes, task management workflows, and documentation strategy related to the new E2E and benchmarking capabilities.
- **Core Automation Scripts:** The order of operations within the `preflight` script (`package.json`) was changed from `pnpm test && pnpm run format && pnpm run lint` to `pnpm run format && pnpm run lint && pnpm test`. This ensures code formatting and linting occur _before_ the build and test cycle, aligning the process with the "Test the Final Product" principle by testing the formatted and linted code.
- **GitHub Actions Workflows:**
    - The `main.yml` CI workflow now executes `pnpm run preflight` instead of `pnpm test`.
    - The `publish.yml` CD workflow now executes `pnpm run preflight` instead of `pnpm test`.
    - This change ensures that the comprehensive `preflight` check (format, lint, build, test) is the core validation gate for both continuous integration and publishing, providing a consistent and robust quality check.
- Internal project configuration and scripts (e.g., `package.json`, `playwright.config.ts`, `vitest.config.ts`) are refined to support the new E2E and benchmarking workflows.
- The `cryptoShuffle` function now enforces minimum array length requirements for the `preventIdentical` and `isDestructive` options, improving error handling and developer experience by providing clear feedback when these features cannot be applied.

### [[1.6.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.6.0)] 2025-08-03: Even more flexibility
This version introduces another powerful feature to the core `shuffrand` API, giving developers more granular control and enabling new use cases.

#### Added
- `startIndex: number` & `endIndex: number` together as a "subarray shuffle" feature to `cryptoShuffle`, allowing for the randomization of a specific slice of an array.
- A dedicated testsuite (`test.crypto-shuffle.004-subarray-shuffle.ts`) to inspect the recently-added flag/option.


## <a name="PAST"></a>PAST
Old versions — all releases preceding the 3 most recent — essentially an **archive outline**:

### [[1.5.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.5.0)] 2025-08-02: Flexibility
This version introduces a powerful feature to the core `shuffrand` API, giving developers more granular control and enabling new use cases.

#### Added
- A `noRepeat: true` flag/option to `cryptoString`, allowing for the generation of a string with no duplicates.
- A dedicated testsuite (`test.crypto-string.003-no-repeat.ts`) to inspect the recently-added flag/option.
- More edge-cases and error-handling testcases.

### [[1.4.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.4.0)] 2025-08-01: **THE FOUNDATION**
The first stable, fully-documented, and professionally architected version of the library. This release establishes the **core trio** of functions (`cryptoRandom`, `cryptoShuffle`, `cryptoString`) and the foundational principles of security, quality, and craftsmanship.

### [[1.3.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.3.0)] 2025-07-14
[no info]

### [[1.2.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.2.0)] 2025-07-11
[no info]

### [[1.1.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.1.0)] 2025-07-10
[no info]

### [[1.0.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v1.0.0)] 2025-07-09
The inception.

## <a name="FUTURE"></a>FUTURE
Upcoming versions — all releases **succeeding** the most recent one — essentially a **roadmap**:

### [[1.9.0](https://github.com/DoronBrayer/shuffrand/tags)] ~2025-10-##: DX & infrastructure
This version focuses on radically improving the developer experience for both users and contributors by providing a world-class documentation site and modernizing the project’s internal toolchain.

#### Added
- A dedicated **documentation website** built with VitePress, providing searchable, interactive, and in-depth guides.

#### Changed
- The project’s linting and formatting toolchain is migrated from **ESLint + Prettier to Biome**, simplifying configuration and improving performance.
- The project’s configuration source of truth is migrated from `package.json` to **`package.jsonc`**, allowing for inline comments and improved maintainability.

---

## <a name="Template"></a>Template
For you to **copypaste and edit** — not remove:

### [[855.0.0](https://github.com/DoronBrayer/shuffrand/releases/tag/v855.0.0)] 2098-12-03: Optional Title
#### Added
- `[Project’s upcoming Feature/File here]`
- `[Project’s upcoming Feature/File here]`

#### Changed
- `[Project’s upcoming Change here]`
- `[Project’s upcoming Change here]`

#### Deprecated
- `[Project’s upcoming Deprecated Thing here]`
- `[Project’s upcoming Deprecated Thing here]`

#### Removed
- `[Project’s upcoming Removal here]`
- `[Project’s upcoming Removal here]`

#### Changed
- `[Project’s upcoming Change here]`
- `[Project’s upcoming Change here]`
