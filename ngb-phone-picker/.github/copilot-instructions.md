# Copilot instructions for ngb-phone-picker

## Scope and references

- Run commands from the `ngb-phone-picker/` Angular workspace.
- The workspace contains the `ngb-phone-picker-demo` standalone app in `src/app` and the reusable `ngb-phone-picker` library in `projects/ngb-phone-picker`.
- Start with the workspace [README](../README.md) and [library README](../projects/ngb-phone-picker/README.md) for public usage and release details.
- The library public API is defined in [public-api.ts](../projects/ngb-phone-picker/src/public-api.ts); keep exports and package metadata in sync.

## Commands

- Install dependencies: `npm ci`
- Start the demo: `npm start`
- Build the library: `npm run build`
- Build the demo for GitHub Pages: `npm run build:demo`
- Run Vitest: `npm test`
- Run Vitest in watch mode: `npm run test:watch`
- There is no lint script. The `watch` package script is malformed; use the commands above instead.

## Architecture and conventions

- Use Angular 22 standalone components, strict TypeScript/templates, signals, and `@angular/forms/signals`.
- Follow the existing `input()`, `model()`, `signal()`, `computed()`, and `effect()` patterns rather than introducing decorator-based APIs for new code.
- `NgbPhonePicker` implements `FormValueControl<PhoneNumberValue>`; preserve the parent-form contract and keep invalid or empty values from being emitted as valid phone models.
- Keep parsing and validation based on `awesome-phonenumber`; keep pure helpers exportable and easy to test.
- Country names are localized by `RegionNameService`; filtering supports country name, ISO region code, and calling code, with preferred countries first.
- Preserve the public input spelling `prefferedCountries` for compatibility unless a deliberate migration path is added.
- Keep user-facing validation concise and friendly; do not expose raw parser or internal library errors.

## Testing

- Vitest discovers `tests/**/*.spec.ts` and `projects/**/*.spec.ts` in the jsdom environment; use a focused run while iterating, for example `npm test -- --run projects/ngb-phone-picker/src/lib/ngb-phone-picker.spec.ts`.
- Add or update tests for exported helpers, signal-form synchronization, validation branches, country ordering/filtering, localization, and focus behavior when those paths change.
- Import `@angular/compiler` at the top of specs that instantiate Angular components or otherwise require Angular JIT compilation.
- Check both library and demo builds for changes that cross the package boundary.

## Files to inspect first

- [NgbPhonePicker](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.ts)
- [picker template](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.html)
- [picker styles](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.scss)
- [picker unit tests](../projects/ngb-phone-picker/src/lib/ngb-phone-picker.spec.ts)
- [region name service](../projects/ngb-phone-picker/src/lib/region-names.ts)
- [demo app](../src/app/app.ts)
