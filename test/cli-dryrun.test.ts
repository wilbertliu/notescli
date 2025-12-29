import { describe, expect, it, vi } from 'vitest'

vi.mock('../src/notes/createNote', () => ({
  createNote: vi.fn(async () => {
    throw new Error('createNote should not be called in --dry-run mode')
  }),
}))

import { runCli } from '../src/cli'
import { createNote } from '../src/notes/createNote'

describe('cli --dry-run', () => {
  it('does not call createNote', async () => {
    await runCli(['node', 'notescli', 'create', '--dry-run', '--text', '# Hi', '--json'])
    expect(createNote).not.toHaveBeenCalled()
  })
})

