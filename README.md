# notescli

Create and Read Apple Notes from Markdown via CLI (macOS).

## What it does

- Reads Markdown from `--text`, `--file`, or stdin
- Converts it to HTML
- Creates a new note in Apple Notes (background-only) via `osascript`

## Install (local dev)

```sh
cd notescli
bun install
bun run build
```

Run directly:

```sh
node dist/index.js create --help
```

## Install (Homebrew tap)

Once you have a tap repo with `Formula/notescli.rb` (see `homebrew/notescli.rb`), install with:

```sh
brew install <owner>/<tap>/notescli
```

To cut a release artifact for Homebrew:

```sh
bun run package:release
```

## Usage

Create a note from piped Markdown (defaults to folder `Quick Notes`):

```sh
echo "# Hello\n\nFrom an agent." | notescli create
```

Create a note from a file:

```sh
notescli create --file ./agent-output.md
```

Set title explicitly:

```sh
notescli create --title "Daily summary" --file ./summary.md
```

Machine-readable output:

```sh
echo "# Hello" | notescli create --json
```

Dry run:

```sh
echo "# Hello" | notescli create --dry-run
```

Read a note by id and output Markdown:

```sh
notescli read --id "x-coredata://..."
```

Read a note by exact title (within folder/account) and output Markdown:

```sh
notescli read --title "Daily summary"
```

## Folder + account behavior

- `--folder` is a single folder name (no nesting). Default: `Quick Notes`.
- If the folder does not exist (or is localized differently), the command fails with `Folder not found: ...`.
- If `--account` is omitted, the tool uses the first account returned by Notes’ AppleScript API (no UI scripting).

## Configuration

Config is loaded via `cosmiconfig` for the module name `notescli` (e.g. `.notesclirc`, `.notesclirc.json`, `notescli.config.json`, etc.).

Supported keys:

- `folder` (string)
- `account` (string, optional)

Environment variables:

- `NOTESCLI_FOLDER`
- `NOTESCLI_ACCOUNT`

Precedence:

1. CLI flags
2. Env vars
3. Config file
4. Defaults

## macOS permissions / troubleshooting

On first run, macOS may prompt you to allow automation control (e.g., “notescli would like to control Notes”).

If note creation fails due to permissions, check:

- System Settings → Privacy & Security → Automation → allow your terminal (or Node) to control “Notes”.
