# Copilot instructions for ngb-phone-picker

## Project scope

- This workspace contains an Angular demo app plus a reusable library package, both rooted in the `ngb-phone-picker/` folder.
- The demo app lives in `src/app`, while the reusable component and helpers live in `projects/ngb-phone-picker/src/lib`.
- The published library package metadata is in `projects/ngb-phone-picker/package.json`; keep changes consistent with the actual Angular package name and structure.
- For local setup and project overview, start with [README.md](../README.md) and the library README at [projects/ngb-phone-picker/README.md](../projects/ngb-phone-picker/README.md).

## Commands

- Start the demo app: `npm start`
- Build the library: `npm run build`
- Build the demo app: `npm run build:demo`
- Run the test suite: `npm test`
- Watch tests while editing: `npm run test:watch`

## Architecture and conventions

- Prefer Angular 22 patterns: standalone components, signals, and the `@angular/forms/signals` API.
- Use `signal()` for local state and `computed()` for derived values; keep state transitions explicit and predictable.
- Prefer `input()` and `model()` over decorator-based APIs for new code.
- Keep helper functions pure and easy to unit-test; avoid spreading business logic across templates.
- The library should remain reusable and presentable: validation and user-facing copy must be friendly and short.

## Validation and UX

- Do not leak internal `awesome-phonenumber` or library-specific errors into the UI.
- Prefer user text such as: "Use only numbers, spaces, and dashes." or "Please enter a valid phone number for [country]."
- Keep validation wording consistent across the component and shared helper logic.
- Preserve country filtering, highlighting, and keyboard interaction behavior when editing the picker.

## Testing expectations

- Validate with focused Vitest runs when possible, for example: `npm test -- --run <path-to-spec>`.
- Add or update tests for helper functions, validation branches, and country/format edge cases.
- If a unit test requires Angular JIT compilation, import `@angular/compiler` at the top of the spec before using it.

## Files to inspect first

- [README.md](../README.md)
- [projects/ngb-phone-picker/src/lib/ngb-phone-picker.ts](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.ts)
- [projects/ngb-phone-picker/src/lib/phone-validation.ts](../projects/ngb-phone-picker/src/lib/phone-validation.ts)
- [projects/ngb-phone-picker/src/lib/ngb-phone-picker.spec.ts](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.spec.ts)
- [tests/ngb-phone-picker.spec.ts](../tests/ngb-phone-picker.spec.ts)
