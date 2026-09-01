# IntNgbPhonePicker

Angular-based phone number picker demo app with a library package for reusable country selection and validation.

## Local development

Start the app:

```bash
npm start
```

The app serves locally on `http://localhost:4200/`.

## Build

Generate the production bundle:

```bash
npm run build
```

## Run tests

This project uses [Vitest](https://vitest.dev/) for unit tests.

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

## Project structure

- `src/app` — demo application
- `projects/ngb-phone-picker/src/lib` — reusable phone picker component and related logic
- `projects/ngb-phone-picker` — library package project

## Notes

The project is built around Angular signals and the `@angular/forms/signals` API, with custom country filtering and highlighting logic for the search list.
