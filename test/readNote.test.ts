import { describe, expect, it } from 'vitest'
import { READ_NOTE_APPLESCRIPT } from '../src/notes/applescript'
import { parseReadNoteOutput } from '../src/notes/readNote'

describe('notes.read applescript', () => {
  it('returns JSON with id/name/html', () => {
    expect(READ_NOTE_APPLESCRIPT).toContain('return my toJson')
    expect(READ_NOTE_APPLESCRIPT).toContain('\\"html\\"')
  })
})

describe('notes.parseReadNoteOutput', () => {
  it('parses JSON output', () => {
    expect(parseReadNoteOutput('{"id":"1","name":"T","html":"<div/>"}\n')).toEqual({
      id: '1',
      name: 'T',
      html: '<div/>',
    })
  })
})
