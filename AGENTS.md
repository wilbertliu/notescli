# Repository Guidelines

## Project Structure & Module Organization

- `src/`: TypeScript source (CLI entry at `src/index.ts`, command wiring in `src/cli.ts`, Apple Notes integration in `src/notes/`).
- `test/`: Vitest unit tests (e.g. `test/*.test.ts`).
- `dist/`: Build output (generated; do not edit by hand).
- `scripts/`: Release/packaging scripts (e.g. `scripts/package-release.sh`).
- `homebrew/`: Formula template used to populate the separate Homebrew tap repo.

## Build, Test, and Development Commands

- `bun install`: Install dependencies.
- `bun run dev`: Run the CLI from source via `tsx`.
- `bun run build`: Build JS output into `dist/` via `tsup`.
- `bun run test`: Run unit tests with Vitest.
- `bun run lint`: Lint with ESLint.
- `bun run format`: Format with Prettier.
- `bun run check`: Run `typecheck`, `lint`, and `test`.
- `bun run package:release`: Build macOS binaries and create `release/` tarballs for GitHub Releases.

## Coding Style & Naming Conventions

- Language: TypeScript (ESM).
- Formatting: Prettier (`prettier.config.js`); run `bun run format` before committing.
- Linting: ESLint (`eslint.config.js`); keep changes lint-clean.
- Naming: `camelCase` variables/functions, `PascalCase` types, `kebab-case` filenames only when already used.

## Testing Guidelines

- Framework: Vitest.
- Add/adjust tests for behavior changes (prefer unit tests; mock AppleScript/`osascript` boundaries).
- Naming: `test/<area>.test.ts`. Run targeted tests with `bun run test -- test/<file>.test.ts`.

## Commit & Pull Request Guidelines

- Commits: keep them small and atomic. Follow the existing convention: `feat: ...`, `fix: ...`, `chore(scope): ...`, `docs(scope): ...`.
- PRs: include a short description, how to validate (commands), and any user-facing behavior changes (e.g. new flags/output).

## macOS Notes Automation & Configuration

- First run may prompt for Automation permissions (Terminal/Node controlling “Notes”).
- Config via `cosmiconfig` module name `notescli` and env vars `NOTESCLI_FOLDER` / `NOTESCLI_ACCOUNT`.

