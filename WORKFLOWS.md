<!-- ./WORKFLOWS.md -->

# Workflows
- **Doc ver**: 1.0 2025-08-05
- **Deciders**: [Doron B.](https://github.com/DoronBrayer)
- **Reference**: `DOCTRINE.md` (Sections: Philosophy, Quality, Part I, Part II, Part III)

#### Context & Problem Statement
This ADR documents the established workflows and automation scripts for the `shuffrand` library. These processes are critical for ensuring code quality ("Quality is Architected, Not Added"), preventing regressions ("Test the Final Product"), and managing reliable, automated releases. The workflows are intentionally strict ("fragile") to enforce high standards and catch issues early in the development cycle.

The core components are:

1.  Local development and pre-commit validation scripts (`package.json`).
2.  Continuous Integration (CI) workflow (`main.yml`).
3.  Continuous Deployment/Publishing workflow (`publish.yml`).
4.  The documented manual release process.

Understanding these interconnected parts is essential for maintainers and contributors.

#### Decision
The project adopts a multi-layered, automated approach to testing, quality assurance, and publishing, utilizing `pnpm` scripts and GitHub Actions workflows.

##### 01. Local Development & Validation (`package.json` scripts)
Scripts defined in `package.json` provide core functionalities for building, testing, and maintaining code quality. The order of operations within the `preflight` script (check out [03. Preflight](#PREFLIGHT).) is crucial to align with the "Test the Final Product" principle.

- **Core Build & Test**:
    - `clean` (`node clean.mjs`): Removes build artifacts (`dist/`, temporary files).
    - `prebuild` (`pnpm run clean`): Ensures a clean state before building.
    - `build` (`vite build`): Compiles the library source (`src.*.ts`) into distributable ESM files (`dist/*.js`) and generates TypeScript declaration files (`dist/*.d.ts`).
    - `test` (`pnpm run clean && pnpm run build && tsc --project tsconfig.test.json && vitest`): This is the central command for core functionality validation.
        - It enforces a clean build environment.
        - It compiles the library.
        - It compiles the test suite (`test.*.ts` files) using `tsconfig.test.json` (targeting `dist/`).
        - It runs the compiled tests against the compiled library output using Vitest (Node.js environment), adhering to the "Test the Final Product" doctrine.
- **Quality Assurance**:
    - `lint` (`eslint . --ext .ts`): Analyzes source and test code for potential errors, bugs, and style issues using ESLint.
    - `format` (`prettier --write "**/*.{ts,js,json,yml}"`): Automatically formats source, test, configuration, and documentation files according to project style rules using Prettier.
- **Composite Scripts**:
    - `preflight` (`pnpm run format && pnpm run lint && pnpm test`): Check out [03. Preflight](#PREFLIGHT).
    - `test:coverage` (`vitest run --coverage`): Runs the unit test suite and generates a code coverage report.
    - `test:browser` (`vitest run --browser`): Runs the unit test suite within a real browser environment (Chromium via Playwright).
    - `benchmark` (`vitest bench --run --browser.enabled=false`): Runs performance benchmarks defined in `inspection.*.ts` files. `--browser.enabled=false` prevents conflicts with the Playwright browser provider used for E2E tests.
    - `prepublishOnly` (`pnpm build`): Ensures the library is built before publishing to npm.

##### 02. Continuous Integration (`.github/workflows/main.yml`)
- **Actual name**: `Continuous Integration (CI) — validating the repository`
- **Trigger**: Runs automatically on every `push` and `pull_request` to the `main` branch.
- **Purpose**: To prevent regressions by ensuring the core functionality and code quality standards are met before changes are merged.
- **Key Steps**:
    1.  Checks out the code.
    2.  Sets up Node.js (v20) and `pnpm` (v9).
    3.  Installs dependencies using `pnpm install --frozen-lockfile`.
    4.  **Validation**: Executes `preflight`. Check out [03. Preflight](#PREFLIGHT).
- **Outcome**: If this workflow fails, the PR cannot be merged, or the push to `main` indicates a broken state.

##### <a name="PREFLIGHT"></a>03. Preflight
**Final Command**:
```json
"preflight": "pnpm run format && pnpm run lint && pnpm test"
```

**Execution Sequence**:
```
format → lint → [clean → build → compile (tsc) → test]
```

**a. "Test the Final Product" Principle**
- Formatting and linting may modify source code (whitespace, style fixes, potential auto-fixes)
- Testing should validate the exact version that gets committed and shipped
- Current order ensures the build/test cycle operates on the final, polished codebase

**b. Logical Workflow Consistency**
- Format first: Establishes consistent code style across all files
- Lint second: Validates the formatted code for errors and adherence to rules
- Test last: Verifies functionality of the clean, standardized codebase

**c. Fail-Fast Efficiency**
- Fast operations (format ~1-2s, lint ~2-3s) execute before expensive operations (clean/build/test ~10-30s)
- Developers get immediate feedback on style/quality issues without waiting for full build cycles
- CI resources are conserved by catching simple issues early

**d. Developer Experience**
- Matches intuitive workflow: "clean up code, then validate it works"
- Consistent behavior between local development and CI environments
- Reduces friction in the development cycle

**Implementation Notes**
- The `clean → build → compile → test` sequence remains atomic within the `test` script
- No redundant cleaning needed at preflight level (CI starts clean, test script includes clean)
- Order change maintains backward compatibility while improving logical correctness

##### 04. Continuous Deployment (`.github/workflows/publish.yml`)
- **Actual name**: `Continuous Deployment (CD) — publishing the package`
- **Trigger**: Runs automatically when a new Git tag matching `vX.Y.Z` is pushed, or manually via the GitHub Actions UI.
- **Purpose**: To automate the process of publishing a new, validated version of the library to npm.
- **Key Steps**:
    1.  Checks out the code.
    2.  Sets up Node.js (v20), `pnpm` (v9), and configures the npm registry.
    3.  Caches `pnpm` dependencies for faster builds.
    4.  **Pre-Publish Validation**: Executes `preflight`. Check out [03. Preflight](#PREFLIGHT).
    5.  Checks if the version specified in `package.json` already exists on npm.
    6.  **Publish**: If the version is new and all previous steps succeeded, it publishes the package to npm using `npm publish --access public`.
- **Outcome**: A new, validated version of the library is published to npm.

##### 05. Manual Release Process (Documentation)
Declare → `pnpm version…` → CHANGELOG.md → `git status` → [PREFLIGHT](#PREFLIGHT) → `git add .` → `git commit…` → `git tag…` → `git push…` → `git push…` (tag) → Manual verification<br>
Check out [Local + Manual workflow for the individual](#local-manual-workflow).

#### Consequences
- **Positive**:
    - **High Quality**: The strict "Test the Final Product" approach and comprehensive preflight checks ensure that only validated, correctly formatted, and linted code is merged or published.
    - **Prevents Regressions**: Automated CI on every PR/push catches breaking changes early.
    - **Consistency**: Using `preflight` (check out [03. Preflight](#PREFLIGHT)) locally and in CI/CD ensures a consistent validation process.
    - **Automation**: Publishing is fully automated and reliable once triggered by a tag.
    - **Transparency**: Workflows and scripts are clearly defined and documented.
- **Negative (Intentional Trade-offs)**:
    - **"Fragility"**: The workflows are designed to fail on any linting, formatting, or test error. This can make CI/CD checks appear "red" frequently for minor issues, which can be initially annoying for developers. However, this strictness is a deliberate choice to enforce quality and prevent technical debt from accumulating ("Fail-Fast Principle"). It is considered beneficial for long-term project health.
    - **Dependency on Tooling**: The process relies heavily on `pnpm`, `Vitest`, `Vite`, `ESLint`, `Prettier`, and GitHub Actions. Changes in these tools could require updates to the workflows or scripts.

#### Extras
Running the so-calld "real-world regression inspection" (Playwright) and the performance benchmark (vitest bench) is **done manually and locally by the individual** and is **not** part of the automated (`pnpm test`, `pnpm preflight`, etc.) or remote (GitHub Actions: `main.yml`, `publish.yml`, etc.) workflows.

- [secondary] **Real-world regression inspection**: Involves launching an actual browser (typically Chromium), loading a basic webpage (HTML Living Standard) from the project root, fetching the library (typically the latest stable) from a CDN (typically unpkg.com), and executing (typically `import { xxxx } from 'yyyy'`) it. This is inherently slower and tests a different layer than unit tests.<br>Tool: **Playwright**&nbsp;&nbsp;Command/Script: `pnpm run test:secondary` or `pnpm exec playwright test`
- [tertiary] **Performance benchmark**: Measures the elapsed time from the moment a function is triggered to the complete arrival of its output. Timing can vary and is primarily used for comparative analysis—either over time or against alternative implementations—rather than serving as a strict pass/fail criterion for code integration.<br>Tool: **vitest bench**&nbsp;&nbsp;Command/Script: `pnpm run test:tertiary` or `pnpm run benchmark`

#### Related Information
- `DOCTRINE.md`: Core project principles, especially "Test the Final Product" and "Quality is Architected, Not Added".
- `package.json`: Defines the `pnpm` scripts.
- `.github/workflows/main.yml`: CI workflow configuration.
- `.github/workflows/publish.yml`: CD/Publish workflow configuration.
- `vitest.config.ts`: Configuration for unit tests, browser tests, and benchmarks.
- `vite.config.ts`: Configuration for library building.
- `tsconfig.test.json`: TypeScript configuration for compiling test files.

---

# <a name="local-manual-workflow"></a>Local + Manual workflow for the individual
### 00. Pre-preflight
• Declare the upcoming version name/number to your teammate(s), manager(s), contributors(s), AI assistant, or even to yourself<br>
• Bump up the version: `pnpm version patch` / `pnpm version minor` / `pnpm version major`<br>
• Manually enrich CHANGELOG.md&nbsp;&nbsp;_No explanation needed_<br>
• Look at the (bigger) picture: `git status`<br>
• [OPTIONAL] Reset:<br>
&nbsp;◦&nbsp;`pnpm store prune`<br>
&nbsp;◦&nbsp;`Remove-Item -Path "node_modules", "pnpm-lock.yaml" -Recurse -Force`<br>
&nbsp;◦&nbsp;`node clean.mjs`<br>
&nbsp;◦&nbsp;`pnpm install`<br>
&nbsp;◦&nbsp;[VS Code] Press <small>Ctrl&hairsp;+&hairsp;Shift&hairsp;+&hairsp;P</small> → Type "relo" → Select _Developer: Reload Window_ → Wait 6 seconds<br>
&nbsp;◦&nbsp;`pnpm list --depth 0`<br>

### 01. Preflight
**format → lint → [clean → build → compile (tsc) → test]**<br>
• Apply code formatting: `pnpm run format`<br>
• Run linting checks: `pnpm run lint`<br>
• Run all tests: `pnpm test --run` (corresponds to `"test": "pnpm run clean && pnpm run build && tsc --project tsconfig.test.json && vitest"` from the `"scripts"`)&nbsp;&nbsp;_Excluding real-world regression tests (latest stable on browsers) and preformance-benchmark_<br>
• Alternative to all three above: Check out [PREFLIGHT](#PREFLIGHT)<br>

### 02. Commit Changes
• Stage all modifications/removals/additions: `git add .`<br>
• Commit changes with a descriptive message: `git commit -m "feat(cryptoShuffle): enable targeted shuffling of array slices"` (or your relevant commit message)<br>

### 03. Tag Management (to trigger our tag-depended `.github/workflows/*.yml` processes)
• [OPTIONAL] Delete the old local tag: `git tag -d v1.2.0`<br>
• [OPTIONAL] Delete the old remote tag: `git push origin :v1.2.0`<br>
• Accordingly, create a local tag with the same name/number, **OR**, with a **new** name/number: `git tag v1.2.0` or `git tag v1.2.1`<br>

### 04. Upload to GitHub
• Upload (`push`) your primary branch: `git push origin main`<br>
• Upload (`push`) the tag (triggers "publish" workflow): `git push origin v1.2.0` or `git push origin v1.2.1`<br>

### 05. Verify Release
• On [GitHub Actions](github.com/DoronBrayer/monorand/actions), confirm 'main' and 'publish' workflows are green.<br>
• Confirm a new/unread email message with the heading "Successfully published shuffrand@1.2.0" (or your new version) is in your inbox.<br>
• Breathe, slowly.
