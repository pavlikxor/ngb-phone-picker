# Copilot instructions for this repo

## Project shape

- The app and library live under the nested folder `int-phone-num-picker/`.
- Main scripts: `npm start`, `npm run build`, `npm test`, and `npm run test:watch`.
- The demo app is under `src/app`.
- The reusable component is under `projects/ngb-phone-picker/src/lib`.
- Keep changes consistent with the actual `ngb-phone-picker` package, not older `phone-num-picker` naming.

## Coding conventions

- Prefer Angular 22 patterns: standalone components, signals, and `@angular/forms/signals`.
- Keep derived state in `computed()` and use `signal()` for local state.
- Avoid exposing raw library errors to users; validation messages should be short, clear, and friendly.
- Keep helper logic pure and testable.
- Prefer `input()` and `model()` over decorator-based APIs for new code.

## Validation guidance

- Use user-friendly text such as "Use only numbers, spaces, and dashes." or "Please enter a valid phone number for [country]."
- Do not leak internal `awesome-phonenumber` error strings into the UI.
- Keep message wording consistent across the component and any shared validation helpers.

## Testing

- Run focused Vitest specs with `npm test -- --run <path>` when validating a change.
- Add tests for helper functions and form-validation edge cases.
- If Angular JIT is needed in a unit test, import `@angular/compiler` at the top of the spec.

## Files to inspect first

- [README.md](../README.md)
- [projects/ngb-phone-picker/src/lib/ngb-phone-picker.ts](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.ts)
- [projects/ngb-phone-picker/src/lib/ngb-phone-picker.spec.ts](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.spec.ts)
