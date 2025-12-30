import { describe, expect, it } from 'vitest'
import { normalizeGfmMarkdown } from '../src/gfm'

describe('gfm.normalizeGfmMarkdown', () => {
  it('normalizes nested list indentation to align with parent content', () => {
    expect(normalizeGfmMarkdown('- a\n    - b\n')).toBe('- a\n  - b\n')
  })

  it('normalizes indented continuation paragraphs under list items', () => {
    expect(normalizeGfmMarkdown('- a\n\n b\n')).toBe('- a\n\n  b\n')
  })
})

