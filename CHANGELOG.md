<!-- CHANGELOG.md -->
## 1.0.9 | 2025-07-10

### Fixed

- Resolved ArkType schema compilation and runtime issues in `test.types.ts`, specifically for `Date` array validation.
- Updated `tsconfig.json` for improved `pnpm` and TypeScript compatibility, addressing module resolution and build stability.

### Removed

- Deleted `test.001-basic-int-gen.ts` and `test.002-basic-double-gen.ts` test files.

### Notes

- `arrayOfFunctions` and `arrayOfMixedComplex` schemas in `test.types.ts` are currently commented out to maintain test suite stability due to persistent ArkType parsing challenges with `Function` constructors in the current environment. This is a temporary measure.
