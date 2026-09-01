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

## Inputs

### `region`

Use the `region` input when you want to force country-name localization to a specific locale or region, for example `US`, `DE`, or `FR`.

```html
<ngb-phone-picker [region]="'US'"></ngb-phone-picker>
```

If this input is not set, the component falls back to the browser locale configuration for translated country names.

### `prefferedCountries`

Use `prefferedCountries` to prioritize a list of country codes at the top of the dropdown. These entries stay first in the list and the remaining countries are sorted alphabetically afterward.

```html
<ngb-phone-picker [prefferedCountries]="['US', 'GB', 'DE']"></ngb-phone-picker>
```

## Notes

The component exposes a clear public phone model shape and keeps the selected country / emitted value transitions consistent while filtering on the debounced search query.
