import { describe, expect, it } from 'vitest'
import { markdownToHtml } from '../src/markdown'

describe('markdown.markdownToHtml', () => {
  it('wraps rendered HTML in a div', () => {
    const html = markdownToHtml('# Title')
    expect(html.startsWith('<div>')).toBe(true)
    expect(html.endsWith('</div>')).toBe(true)
    expect(html).toContain('<h1')
    expect(html).toContain('Title')
  })
})
