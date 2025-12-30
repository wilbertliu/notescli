import { Command } from 'commander'
import { loadFileConfig, mergeConfig, parseEnvConfig } from './config'
import { deriveTitle, readMarkdown } from './input'
import type { MarkdownInputSource } from './input'
import { htmlToMarkdown } from './htmlToMarkdown'
import { markdownToHtml } from './markdown'
import { createNote } from './notes/createNote'
import { readNote } from './notes/readNote'

export async function runCli(argv: string[]): Promise<void> {
  const program = buildProgram()
  await program.parseAsync(argv)
}

function buildProgram(): Command {
  const program = new Command()

  program
    .name('notescli')
    .description('Create and Read Apple Notes via CLI')
    .showHelpAfterError()

  program
    .command('create', { isDefault: true })
    .description('Create a new note from Markdown input')
    .option('--folder <folder>', 'Notes folder name (default: "Quick Notes")')
    .option('--account <account>', 'Notes account name (optional)')
    .option('--file <path>', 'Read Markdown from a file')
    .option('--text <markdown>', 'Use Markdown text directly')
    .option('--stdin', 'Read Markdown from stdin (even if TTY)')
    .option('--json', 'Output machine-readable JSON')
    .option('--dry-run', 'Validate and render, but do not create a note')
    .action(async (opts: Record<string, unknown>) => {
      const config = await resolveConfig(opts)

      const source = selectMarkdownSource({
        file: typeof opts.file === 'string' ? opts.file : undefined,
        text: typeof opts.text === 'string' ? opts.text : undefined,
        stdin: Boolean(opts.stdin),
        isStdinTty: Boolean(process.stdin.isTTY),
      })

      const markdown = await readMarkdown(source)
      const title = deriveTitle(markdown)
      const html = markdownToHtml(markdown)

      const dryRun = Boolean((opts as { dryRun?: unknown }).dryRun) || Boolean(opts['dry-run'])
      if (dryRun) {
        const dryRun: { title: string; folder: string; account?: string } = {
          title,
          folder: config.folder,
        }
        if (config.account) dryRun.account = config.account
        outputDryRun(dryRun, Boolean(opts.json))
        return
      }

      const createParams: {
        title: string
        folder: string
        html: string
        account?: string
      } = {
        title,
        folder: config.folder,
        html,
      }
      if (config.account) createParams.account = config.account

      const created = await createNote(createParams)

      outputCreated(created, Boolean(opts.json))
    })

  program
    .command('read')
    .description('Read a note and output Markdown')
    .option('--id <id>', 'Read note by id')
    .option('--folder <folder>', 'Notes folder name (default: "Quick Notes")')
    .option('--account <account>', 'Notes account name (optional)')
    .option('--json', 'Output machine-readable JSON')
    .action(async (opts: Record<string, unknown>) => {
      const config = await resolveConfig(opts)
      const idTrimmed = typeof opts.id === 'string' ? opts.id.trim() : ''
      if (!idTrimmed) throw new Error('Missing selector. Provide --id.')
      const selector = { kind: 'id', id: idTrimmed } as const

      const readParams: { selector: typeof selector; folder: string; account?: string } = {
        selector,
        folder: config.folder,
      }
      if (config.account) readParams.account = config.account

      const note = await readNote(readParams)

      const markdown = htmlToMarkdown(note.html)
      outputRead(note, markdown, Boolean(opts.json))
    })

  return program
}

async function resolveConfig(
  opts: Record<string, unknown>,
): Promise<{ folder: string; account?: string }> {
  const fileConfig = await loadFileConfig()
  const envConfig = parseEnvConfig(process.env)
  const cliConfig: { folder?: string; account?: string } = {}
  if (typeof opts.folder === 'string') cliConfig.folder = opts.folder
  if (typeof opts.account === 'string') cliConfig.account = opts.account

  return mergeConfig({
    defaults: { folder: 'Quick Notes' },
    fileConfig,
    envConfig,
    cliConfig,
  })
}

export function selectMarkdownSource({
  file,
  text,
  stdin,
  isStdinTty,
}: {
  file: string | undefined
  text: string | undefined
  stdin: boolean
  isStdinTty: boolean
}): MarkdownInputSource {
  const specified = [file ? 'file' : null, text ? 'text' : null, stdin ? 'stdin' : null].filter(
    Boolean,
  )

  if (specified.length > 1) {
    throw new Error('Choose only one input source: --file, --text, or --stdin.')
  }

  if (text) return { kind: 'text', text }
  if (file) return { kind: 'file', filePath: file }
  if (stdin) return { kind: 'stdin' }
  if (!isStdinTty) return { kind: 'stdin' }

  throw new Error('No input provided. Use --file, --text, or pipe Markdown to stdin.')
}

function outputDryRun(
  input: { title: string; folder: string; account?: string },
  asJson: boolean,
): void {
  if (asJson) {
    process.stdout.write(
      `${JSON.stringify(
        {
          dryRun: true,
          title: input.title,
          folder: input.folder,
          account: input.account ?? null,
        },
        null,
        2,
      )}\n`,
    )
    return
  }

  process.stdout.write(
    `Dry run: would create note "${input.title}" in folder "${input.folder}"${
      input.account ? ` (account "${input.account}")` : ''
    }.\n`,
  )
}

function outputCreated(created: { id: string; name: string }, asJson: boolean): void {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(created, null, 2)}\n`)
    return
  }

  process.stdout.write(`${created.id}\t${created.name}\n`)
}

function outputRead(note: { id: string; name: string }, markdown: string, asJson: boolean): void {
  if (asJson) {
    process.stdout.write(
      `${JSON.stringify(
        {
          id: note.id,
          name: note.name,
          markdown,
        },
        null,
        2,
      )}\n`,
    )
    return
  }

  process.stdout.write(markdown.endsWith('\n') ? markdown : `${markdown}\n`)
}
