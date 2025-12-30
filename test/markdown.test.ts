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

  it('renders GFM task list items as checkboxes', () => {
    const html = markdownToHtml('- [ ] one\n- [x] two\n')
    expect(html).toContain('type="checkbox"')
    expect(html).toContain('one')
    expect(html).toContain('two')
  })

  it('preserves paragraph breaks under list items', () => {
    const html = markdownToHtml('- item\n\n b\n')
    const bIndex = html.indexOf('<p>b</p>')
    const liCloseIndex = html.indexOf('</li>')
    expect(bIndex).toBeGreaterThan(-1)
    expect(liCloseIndex).toBeGreaterThan(-1)
    expect(bIndex).toBeLessThan(liCloseIndex)
  })
})
