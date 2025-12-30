import { READ_NOTE_APPLESCRIPT } from './applescript'
import { runOsaScript } from './osascript'

export type ReadNoteSelector = { kind: 'id'; id: string }

export type ReadNoteParams = {
  selector: ReadNoteSelector
  folder: string
  account?: string
}

export type ReadNoteResult = {
  id: string
  name: string
  html: string
}

export async function readNote(params: ReadNoteParams): Promise<ReadNoteResult> {
  const output = runOsaScript(READ_NOTE_APPLESCRIPT, [
    params.selector.id,
    params.folder,
    params.account ?? '',
  ])

  return parseReadNoteOutput(output)
}

export function parseReadNoteOutput(output: string): ReadNoteResult {
  const trimmed = output.trim()
  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error(`Unexpected osascript output: ${JSON.stringify(output)}`)
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`Unexpected osascript output: ${JSON.stringify(output)}`)
  }

  const record = parsed as Record<string, unknown>
  const id = record.id
  const name = record.name
  const html = record.html

  if (typeof id !== 'string' || typeof name !== 'string' || typeof html !== 'string') {
    throw new Error(`Unexpected osascript output: ${JSON.stringify(output)}`)
  }

  return { id, name, html }
}
