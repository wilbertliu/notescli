import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
})

export function markdownToHtml(markdown: string): string {
  const inner = md.render(markdown)
  return wrapNotesHtml(inner)
}

export function wrapNotesHtml(innerHtml: string): string {
  const inner = innerHtml.trim()
  return `<div>${inner}</div>`
}
