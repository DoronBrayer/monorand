
<!-- CHANGELOG.md -->
# Changelog
- All notable alterations — [past](#PAST), [present](#PRESENT) and [future](#FUTURE) — are documented here.
- The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- This project adheres to [Semantic Versioning (SemVer)](https://semver.org/spec/v2.0.0.html) for the time being.
- This also serves as a roadmap, while dates for [FUTURE](#FUTURE) releases are merely placeholders and certainly **subject to change**.
- Patch versions (e.g., `1.4.1`, `1.5.2`) are reserved for bugfixes — thus do not appear here.

---

[PRESENT](#PRESENT)&nbsp;&nbsp;_The 3 most recent releases_<br>
[PAST](#PAST)&nbsp;&nbsp;_All releases preceding the 3 most recent_<br>
[FUTURE](#FUTURE)&nbsp;&nbsp;_All releases succeeding the most recent one_<br>
[Template](#Template)&nbsp;&nbsp;_Not to be removed_<br>

---

## <a name="PRESENT"></a>PRESENT
The 3 most recent releases — essentially a news section:
### [1.4.0] 2025-08-2#: **THE FOUNDATION**
The first stable, fully-documented, and professionally architected version of the library. This release establishes the **core trio** of functions (`cryptoRandom`, `cryptoShuffle`, `cryptoString`) and the foundational principles of security, quality, and craftsmanship.

### [1.3.0] 2025-07-14
[no info]

### [1.2.0] 2025-07-11
[no info]

## <a name="PAST"></a>PAST
Old versions — all releases preceding the 3 most recent — essentially an archive outline:
### [1.1.0] 2025-07-10
[no info]

### [1.0.0] 2025-07-09
The inception.

## <a name="FUTURE"></a>FUTURE
Upcoming versions — all releases **succeeding** the most recent one — essentially a **roadmap**:
### [2.0.0] ~2025-10-##: Ecosystem
This version represents a fundamental architectural shift, preparing `shuffrand` for its future as the core of a larger ecosystem. It is a major, breaking change that solidifies the project’s long-term vision.
#### Added
-   **BREAKING CHANGE** :The repository is officially a **monorepo** to support multiple packages/libraries:
  - github.com/USERNAME`/shuffrand` → github.com/USERNAME`/monorand`
  - `shuffrand/[nada]` → `monorand/shuffrand`
  - `shuffrand/[nada]` → `monorand/datrand`
-   The foundational codebase for the secondary package/library — the companion of "shuffrand" — `datrand`.
-   A finalized and documented **thematic codenaming system** to bring a unique identity to future releases.

### [1.8.0] ~2025-09-##: DX & infrastructure
This version focuses on radically improving the developer experience for both users and contributors by providing a world-class documentation site and modernizing the project’s internal toolchain.
#### Added
-   A dedicated **documentation website** built with VitePress, providing searchable, interactive, and in-depth guides.
#### Changed
-   The project’s linting and formatting toolchain is migrated from **ESLint + Prettier to Biome**, simplifying configuration and improving performance.
-   The project’s configuration source of truth is migrated from `package.json` to **`package.jsonc`**, allowing for inline comments and improved maintainability.

### [1.7.0] ~2025-08-##: Proof of quality
This version is dedicated to providing undeniable, quantitative proof of the library's quality, performance, and reliability for its core features.
#### Added
-   A comprehensive **performance benchmark suite**. The `README.md` is populated with concrete ops/sec metrics, comparing `shuffrand` to its rivals.
-   A browser-based **End-to-End test suite**, formally guaranteeing browser compatibility.
-   Formal **browser support declarations** in `package.json`.

### [1.6.0] ~2025-08-##: Even more flexibility
This version introduces another powerful feature to the core `shuffrand` API, giving developers more granular control and enabling new use cases.
#### Added
-   `startIndex: number` & `endIndex: number` together as a "subarray shuffle" feature to `cryptoShuffle`, allowing for the randomization of a specific slice of an array.
-   A dedicated testsuite (`test.crypto-shuffle.00#-subarray-shuffle.ts`) to inspect the recently-added flag/option.

### [1.5.0] ~2025-08-##: Flexibility
This version introduces a powerful feature to the core `shuffrand` API, giving developers more granular control and enabling new use cases.
#### Added
-   A `noRepeat: true` flag/option to `cryptoString`, allowing for the generation of a string with no duplicates.
-   A dedicated testsuite (`test.crypto-string.00#-no-repeat.ts`) to inspect the recently-added flag/option.

---

## <a name="Template"></a>Template&nbsp;&nbsp;_not to be removed_
### [855.0.0] 2098-12-03: Optional Title
#### Added
-   `[Project’s upcoming Feature/File here]`
-   `[Project’s upcoming Feature/File here]`
#### Changed
-   `[Project’s upcoming Change here]`
-   `[Project’s upcoming Change here]`
#### Deprecated 
-   `[Project’s upcoming Deprecated Thing here]`
-   `[Project’s upcoming Deprecated Thing here]`
#### Removed
-   `[Project’s upcoming Removal here]`
-   `[Project’s upcoming Removal here]`
#### Changed
-   `[Project’s upcoming Change here]`
-   `[Project’s upcoming Change here]`