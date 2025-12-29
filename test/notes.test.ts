import { describe, expect, it } from 'vitest'
import { CREATE_NOTE_APPLESCRIPT } from '../src/notes/applescript'
import { parseCreateNoteOutput } from '../src/notes/createNote'

describe('notes.applescript', () => {
  it('expects 4 argv items and talks to Notes', () => {
    expect(CREATE_NOTE_APPLESCRIPT).toContain('Expected 4 arguments')
    expect(CREATE_NOTE_APPLESCRIPT).toContain('tell application "Notes"')
    expect(CREATE_NOTE_APPLESCRIPT).toContain('make new note')
  })
})

describe('notes.parseCreateNoteOutput', () => {
  it('parses id and name', () => {
    const parsed = parseCreateNoteOutput('x-coredata://abc\nMy Note\n')
    expect(parsed).toEqual({ id: 'x-coredata://abc', name: 'My Note' })
  })
})
