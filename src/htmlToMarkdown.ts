import TurndownService from 'turndown'
import {
  gfm,
  highlightedCodeBlock,
  strikethrough,
  tables,
  taskListItems,
} from 'turndown-plugin-gfm'
import { normalizeGfmMarkdown } from './gfm'

export function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
  })

  turndown.use(gfm)
  turndown.use([highlightedCodeBlock, strikethrough, tables, taskListItems])

  const markdown = turndown.turndown(html)
  return normalizeGfmMarkdown(normalizeMarkdown(markdown))
}

function normalizeMarkdown(markdown: string): string {
  return markdown.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
}
