type ListContext = {
  markerIndent: number
  contentIndent: number
}

type NormalizedListMarker = {
  tokenLen: number
  normalizedTrimmedLine: string
}

function isFence(line: string): boolean {
  const trimmed = line.trimStart()
  return trimmed.startsWith('```') || trimmed.startsWith('~~~')
}

function leadingIndentWidth(line: string): number {
  let width = 0
  for (const ch of line) {
    if (ch === ' ') width += 1
    else if (ch === '\t') width += 2
    else break
  }
  return width
}

function stripLeadingIndent(line: string): string {
  let i = 0
  while (i < line.length && (line[i] === ' ' || line[i] === '\t')) i += 1
  return line.slice(i)
}

function normalizeListMarker(trimmed: string): NormalizedListMarker | null {
  const task = trimmed.match(/^([-+*])\s+\[([ xX])\]\s+(.*)$/)
  if (task) {
    const bullet = task[1]!
    const state = task[2]!.toLowerCase() === 'x' ? 'x' : ' '
    const rest = (task[3] ?? '').trimStart()
    const normalizedTrimmedLine = `${bullet} [${state}] ${rest}`
    return { tokenLen: `${bullet} [${state}] `.length, normalizedTrimmedLine }
  }

  const ul = trimmed.match(/^([-+*])\s+(.*)$/)
  if (ul) {
    const bullet = ul[1]!
    const rest = (ul[2] ?? '').trimStart()
    const normalizedTrimmedLine = `${bullet} ${rest}`
    return { tokenLen: `${bullet} `.length, normalizedTrimmedLine }
  }

  const ol = trimmed.match(/^(\d+)\.\s+(.*)$/)
  if (ol) {
    const num = ol[1]!
    const rest = (ol[2] ?? '').trimStart()
    const normalizedTrimmedLine = `${num}. ${rest}`
    return { tokenLen: `${num}. `.length, normalizedTrimmedLine }
  }

  return null
}

export function normalizeGfmMarkdown(markdown: string): string {
  const lines = markdown.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n')

  const out: string[] = []
  const stack: ListContext[] = []
  let inFence = false

  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i] ?? ''

    if (isFence(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }

    if (inFence) {
      out.push(line)
      continue
    }

    if (line.trim().length === 0) {
      line = ''
    }

    const normalizedMarker = normalizeListMarker(stripLeadingIndent(line))
    if (normalizedMarker) {
      let indent = leadingIndentWidth(line)

      while (stack.length > 0 && indent < stack[stack.length - 1]!.markerIndent) {
        stack.pop()
      }

      if (stack.length > 0) {
        const parent = stack[stack.length - 1]!
        const maxAdjust = parent.contentIndent + 4
        if (indent > parent.contentIndent && indent <= maxAdjust) {
          line = `${' '.repeat(parent.contentIndent)}${stripLeadingIndent(line)}`
          indent = parent.contentIndent
        }
      }

      line = `${' '.repeat(indent)}${normalizedMarker.normalizedTrimmedLine}`

      const contentIndent = indent + normalizedMarker.tokenLen
      const ctx = { markerIndent: indent, contentIndent }

      if (stack.length > 0 && stack[stack.length - 1]!.markerIndent === indent) {
        stack[stack.length - 1] = ctx
      } else {
        stack.push(ctx)
      }

      out.push(line)
      continue
    }

    const prev = out[out.length - 1]
    const prevWasBlank = prev !== undefined && prev.trim().length === 0

    if (
      prevWasBlank &&
      stack.length > 0 &&
      line.trim().length > 0 &&
      normalizeListMarker(stripLeadingIndent(line)) === null
    ) {
      const indent = leadingIndentWidth(line)
      const ctx = stack[stack.length - 1]!

      // Preserve non-indented paragraphs outside lists. Only normalize
      // continuation blocks that were already indented (spaces or tabs).
      if (indent > 0 && indent <= ctx.contentIndent + 4 && indent !== ctx.contentIndent) {
        line = `${' '.repeat(ctx.contentIndent)}${stripLeadingIndent(line)}`
      }
    }

    out.push(line)
  }

  return out.join('\n')
}
