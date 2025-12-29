import { cosmiconfig } from 'cosmiconfig'

export type NotesCliConfig = {
  folder: string
  account?: string
}

export type NotesCliConfigInput = {
  folder?: string
  account?: string
}

export const DEFAULT_CONFIG: NotesCliConfig = {
  folder: 'Quick Notes',
}

export function parseEnvConfig(env: NodeJS.ProcessEnv): NotesCliConfigInput {
  const folder = env.NOTESCLI_FOLDER?.trim()
  const account = env.NOTESCLI_ACCOUNT?.trim()

  const config: NotesCliConfigInput = {}
  if (folder && folder.length > 0) config.folder = folder
  if (account && account.length > 0) config.account = account
  return config
}

export function mergeConfig({
  defaults,
  fileConfig,
  envConfig,
  cliConfig,
}: {
  defaults: NotesCliConfig
  fileConfig: NotesCliConfigInput
  envConfig: NotesCliConfigInput
  cliConfig: NotesCliConfigInput
}): NotesCliConfig {
  const merged: NotesCliConfig = {
    ...defaults,
    ...fileConfig,
    ...envConfig,
    ...cliConfig,
  }

  const folder = merged.folder?.trim()
  if (!folder) {
    throw new Error('Config error: folder must be a non-empty string.')
  }

  const account = merged.account?.trim()
  if (account && account.length > 0) return { folder, account }
  return { folder }
}

export async function loadFileConfig(): Promise<NotesCliConfigInput> {
  const explorer = cosmiconfig('notescli')
  const result = await explorer.search()
  if (!result) return {}

  if (typeof result.config !== 'object' || result.config === null) {
    throw new Error(`Config error: ${result.filepath} must export an object.`)
  }

  const config = result.config as Record<string, unknown>
  const folder = typeof config.folder === 'string' ? config.folder : undefined
  const account = typeof config.account === 'string' ? config.account : undefined

  const parsed: NotesCliConfigInput = {}
  if (folder) parsed.folder = folder
  if (account) parsed.account = account
  return parsed
}
