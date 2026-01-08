# Naologic ERP – Timeline Prototype

This project was created by **Brian Pilati** as part of the **Naologic ERP take-home exam**.

It demonstrates a production-quality Angular application focused on:

- Clean architecture
- Strong typing
- Deterministic date math
- High test coverage
- Enforced linting, formatting, and coverage gates

The core feature is an interactive **Work Order Timeline** with zoom levels, drag-free creation, and visual status representation.

---

## Tech Stack

- **Angular 20 (Standalone Components)**
- **TypeScript**
- **Angular Signals**
- **Angular Material**
- **SCSS (Design-token driven)**
- **Jasmine + Karma**
- **ESLint + Prettier**
- **Husky + lint-staged**

---

## Getting Started

### Install dependencies

```bash
npm install
```

> **Note:** Node 18+ recommended.

---

### Run the application

```bash
npm start
```

The app will be available at:

```
http://localhost:4200
```

---

### Build the application

```bash
npm run build
```

---

## Testing

### Run unit tests (watch mode)

```bash
npm test
```

### Run tests with coverage (CI-style)

```bash
npm run test:coverage
```

Coverage reports are generated in:

```
/coverage
```

### Clean coverage output

```bash
npm run test:coverage:clean
```

---

## Linting & Formatting

### Run ESLint

```bash
npm run lint
```

### Format all files

```bash
npm run format:all
```

### Check formatting only (CI-safe)

```bash
npm run format:check
```

### Auto-fix formatting on staged files

```bash
npm run format:fix
```

---

## Development Watch Mode

```bash
npm run watch
```

Rebuilds automatically on file changes.

---

## Clean Build Artifacts

```bash
npm run clean
```

Removes:

- `dist/`
- Angular cache
- Coverage output

---

## Git Hooks (Husky)

This project uses **Husky** to enforce quality gates **before code ever reaches CI**.

### Pre-Commit Hook

Runs on every commit:

```bash
echo "Running lint + format pre-commit..."

npx lint-staged || {
  printf "\n\nERROR: Lint issues were found in the committed files. Please address them before proceeding.\n\n\n\n"
  exit 1
}

npm run format:fix || {
  printf "\n\nERROR: Format:fix issues were found in the committed files. Please address them before proceeding.\n\n\n\n"
  exit 1
}

echo "Pre-commit checks complete."
```

Ensures:

- No lint violations
- Consistent formatting
- Only staged files are affected

---

### Pre-Push Hook

Runs before any push to a remote branch:

```bash
echo "Running library coverage before push..."

npm run test:coverage:clean

npm run test:coverage || {
  printf "\n\nERROR: Test Coverage issues were found in the committed files. Please address them before proceeding.\n\n\n\n"
  exit 1
}

echo "Pre-push checks complete."
```

Ensures:

- All tests pass
- Coverage is enforced
- Broken code never reaches shared branches

---

## Design Notes

- `TimelineService` centralizes all date math and pixel calculations
- Signals replace traditional RxJS state where appropriate
- Standalone components only
- No magic numbers – all layout values are tokenized
- 100% unit test coverage on core logic and components
- Explicit separation of layout vs. domain logic

---

## Final Notes

This project intentionally prioritizes:

- Pixel-Perfect over functionality
- Readability over cleverness
- Predictable behavior over abstraction
- Reviewability over framework complexity

Thank you for the opportunity to complete the Naologic ERP take-home exam.

— **Brian Pilati**
