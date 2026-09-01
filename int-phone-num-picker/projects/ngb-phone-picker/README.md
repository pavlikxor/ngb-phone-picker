# NgbPhonePicker

Standalone Angular phone picker component built with signals and debounced country filtering.

## Features

- country selection via dropdown
- localized region names
- search by country name, prefix, or code
- query highlighting for matching text
- form integration with `@angular/forms/signals`

## Development

From the repo root, run:

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Test

This package uses [Vitest](https://vitest.dev/) for unit tests:

```bash
npm run test
```

For an interactive watch session:

```bash
npm run test:watch
```

## Notes

The component exposes a clear public phone model shape and keeps the selected country / emitted value transitions consistent while filtering on the debounced search query.
