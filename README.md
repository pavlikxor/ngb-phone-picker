# NgbPhonePicker

Standalone Angular phone picker component built with signals and debounced country filtering.

## Features

- country selection via dropdown
- localized region names
- search by country name, prefix, or code
- query highlighting for matching text
- ready for Angular forms in Reactive, Template-driven, and Signal-based patterns

## Form usage

This component is designed to work with Angular forms in all three common styles:

- Reactive forms via `formControl`
- Template-driven forms via `ngModel`
- Signal-based forms via `formField`

Example usage with a reactive form:

```ts
import { FormControl, FormGroup } from "@angular/forms";

phoneControl = new FormControl({
  countryCode: 1,
  phoneNumber: "5551234567",
});
```

```html
<ngb-phone-picker [formControl]="phoneControl"></ngb-phone-picker>
```

Example usage with a signal-based form field:

```ts
import { signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

preferredCountries = ['ua', 'dk', 'us', 'de'];

phone = signal<PhoneNumberModel | null>({
    countryCode: 45,
    phoneNumber: '26668888',
  });

phoneForm = form(this.phone);
```

```html
<ngb-phone-picker [formField]="phoneForm.phone"></ngb-phone-picker>
```

This is the correct Signal Forms pattern for custom controls like `ngb-phone-picker`, because it implements the `FormValueControl` contract and can be bound directly to a `Field` via `formField`.

The component exposes a stable phone value model shaped as:

```ts
{
  countryCode: number;
  phoneNumber: string;
}
```

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
