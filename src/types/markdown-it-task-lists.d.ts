declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it'

  export type MarkdownItTaskListsOptions = {
    enabled?: boolean
    label?: boolean
    labelAfter?: boolean
  }

  const plugin: (md: MarkdownIt, options?: MarkdownItTaskListsOptions) => void
  export default plugin
}

