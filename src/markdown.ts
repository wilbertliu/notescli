import MarkdownIt from 'markdown-it'
import taskLists from 'markdown-it-task-lists'
import { normalizeGfmMarkdown } from './gfm'

const md = new MarkdownIt({
  html: true,
  linkify: true,
})

md.use(taskLists, { enabled: true })

export function markdownToHtml(markdown: string): string {
  const inner = md.render(normalizeGfmMarkdown(markdown))
  return wrapNotesHtml(inner)
}

export function wrapNotesHtml(innerHtml: string): string {
  const inner = innerHtml.trim()
  return `<div>${inner}</div>`
}
