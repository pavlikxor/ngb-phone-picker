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

## Release and deployment

### Publish the library to npm

1. Update the version in `projects/ngb-phone-picker/package.json`.
2. Commit and push the changes.
3. Create or trigger the GitHub Actions workflow in `.github/workflows/publish-npm.yml`.

```bash
cd /workspaces/int-phone-num-picker/ngb-phone-picker
npm ci
npm run build
```

Required GitHub secret:

- `NPM_TOKEN` — npm automation token used by the publish workflow.

### Deploy the demo app to GitHub Pages

1. Ensure GitHub Pages is enabled for the repository.
2. Commit and push to `main` or trigger the workflow manually.
3. The deployment workflow is in `.github/workflows/deploy-demo-pages.yml`.

```bash
cd /workspaces/int-phone-num-picker/ngb-phone-picker
npm ci
npm run build:demo
```

No additional secret is required for GitHub Pages deployment; the workflow uses the built-in GitHub Pages environment.

## Release checklist

- Bump the package version in `projects/ngb-phone-picker/package.json` or use:

```bash
npm version patch   # or minor / major
git push --follow-tags
```

- Run the smoke test locally:

```bash
cd /workspaces/int-phone-num-picker/ngb-phone-picker
npm ci
npm test
npm run build
npm run build:demo
```

- Create a Git tag for the release, for example:

```bash
git tag v1.0.1
git push origin v1.0.1
```

- Publish the library package via the GitHub Actions workflow in `.github/workflows/publish-npm.yml`.
- Confirm the demo app deployment finishes successfully in `.github/workflows/deploy-demo-pages.yml`.

## Notes

The project is built around Angular signals and the `@angular/forms/signals` API, with custom country filtering and highlighting logic for the search list.
