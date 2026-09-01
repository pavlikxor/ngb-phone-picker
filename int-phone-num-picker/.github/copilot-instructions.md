
You are an expert in TypeScript, Angular v22+, and scalable component library development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Structure

This is a monorepo with two projects:
- **`ngb-phone-picker`** - Demo application (`src/app`)
- **`phone-num-picker`** - Publishable Angular library in `projects/phone-num-picker/` (built with ng-packagr)

Common build commands:
- `npm run build` or `npm run watch` - Builds the library to `dist/phone-num-picker`
- `npm start` - Serves the demo app on port 4200
- `npm test` - Runs Vitest unit tests
- `ng build phone-num-picker` - Build library only
- `ng build` - Build demo app only

## TypeScript Best Practices

- Use strict type checking (TypeScript 6.0.3)
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- For external libraries with limited types (e.g., awesome-phonenumber), define interfaces to wrap their functionality (see `CountryOption` and `Country` interfaces)

## Angular Best Practices (v22+)

- Always use standalone components (default in v22, no need to explicitly set `standalone: true`)
- Use signals for state management (not observables unless necessary)
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators; use `host` object in decorators instead
- Use `NgOptimizedImage` for static images (not for inline base64)

### Components

- Keep components small and focused on single responsibility
- Use `input()` and `output()` functions instead of decorators (signals-based APIs)
- Use `computed()` for derived state, not `get` accessors
- Set `changeDetection: ChangeDetectionStrategy.OnPush` (for performance)
- Prefer inline templates and styles for small components
- Prefer Signal forms instead of Reactive and Template-driven forms
- Do NOT use `ngClass` or `ngStyle`; use direct `class` and `style` bindings
- When using external templates/styles, use relative paths to the component TS file

**Component Migration Note:** `NgbPhonePicker` uses the modern signals API; `PhoneInputComponent` uses legacy Reactive Forms. When enhancing `PhoneInputComponent`, migrate patterns to signals where possible, but maintain backward compatibility as a `ControlValueAccessor` and `Validator`.

### State Management

- Use signals for local component state
- Use `computed()` for derived state calculations
- Keep state transformations pure and predictable
- Use `update()` or `set()` on signals, never `mutate()`
- Use `@angular/forms/signals` for form state management with the `form()` helper
- For async operations with legacy components, use `debounceTime()` and other RxJS operators, not polling

### Templates

- Keep templates simple; move complex logic to computed properties
- Use native control flow (`@if`, `@for`, `@switch`) instead of structural directives
- Use async pipe for observables
- Do not assume global objects like `new Date()`
- For Material Menu triggers: Use `matMenuTriggerFor` on button, focus input via template reference on `(menuOpened)`, and ensure menu content closes properly on selection

### Services

- Design services around a single responsibility
- Use `providedIn: 'root'` for singleton services
- Use `inject()` function instead of constructor injection
- Keep services focused on phone number utilities and region localization
- Use `Intl.DisplayNames` for localized country names (with browser language detection and SSR fallback to 'en')
- Handle both browser and SSR environments with `isPlatformBrowser()` checks

## Accessibility Requirements

- MUST pass all AXE checks
- MUST follow WCAG AA minimums: focus management, color contrast, semantic HTML, ARIA attributes
- Test with Material components to ensure keyboard navigation works
- Ensure phone input supports screen readers and keyboard-only access

## Testing with Vitest

- Run tests with `npm test`
- Unit tests use [Vitest](https://vitest.dev/) with jsdom environment
- Test signals using `computed()` and `signal()` directly in tests
- For Material components, test keyboard interactions and accessibility
- Test phone validation using `awesome-phonenumber` library's expected behavior
- Mock `navigator.language` for `RegionNameService` localization tests (set via `vi.stubGlobal`)
- Use `TestBed` for component testing with dependency injection


## Material Components

- Use Material components for UI (forms, menus, dialogs)
- Import specific modules (e.g., `MatFormFieldModule`, `MatInputModule`, `MatMenuModule`)
- Follow Material design guidelines for color, spacing, and typography

## Library-Specific Guidelines

- Export components through `public-api.ts`
- Keep library dependencies minimal; use peer dependencies for Angular and Material
- Ensure components work with awesome-phonenumber for phone parsing and validation via `parsePhoneNumber()` and `getCountryCodeForRegionCode()`
- Support country-flag-icons for flag displays (applied via CSS class: `flag:{prefix}`)
- Library builds to `dist/phone-num-picker` and is published to npm
- Both `NgbPhonePicker` and `PhoneInputComponent` should be exported; they serve different use cases

### Phone Number Validation
- Use `phoneValidator()` for Reactive Forms (accepts country code parameter, defaults to 'US')
- `PhoneInputComponent` implements `ControlValueAccessor` and `Validator` for framework integration
- Parse and validate using `parsePhoneNumber(value, { regionCode: countryCode })` from awesome-phonenumber
- Always normalize country codes to uppercase when filtering or comparing

## Common Development Patterns

- **Country List Filtering:** Sort preferred countries first (in input order), then remaining countries alphabetically by localized name
- **Material Menu Focus:** Use template references (`#countrySearchInput`) with `(menuOpened)` to programmatically focus inputs
- **Localization:** Use `Intl.DisplayNames` with browser language detection; fallback to 'en' for SSR
- **Form Control Integration:** Implement both Signal forms (new components) and Reactive Forms (backward-compatible for `PhoneInputComponent`)
