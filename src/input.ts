import { readFile } from "node:fs/promises";

export type MarkdownInputSource =
  | { kind: "text"; text: string }
  | { kind: "file"; filePath: string }
  | { kind: "stdin" };

export const MAX_MARKDOWN_BYTES = 1_000_000;

export async function readMarkdown(
  source: MarkdownInputSource,
): Promise<string> {
  if (source.kind === "text") {
    return normalizeMarkdown(source.text);
  }

  if (source.kind === "file") {
    const buffer = await readFile(source.filePath);
    if (buffer.byteLength > MAX_MARKDOWN_BYTES) {
      throw new Error(
        `Input too large: ${buffer.byteLength} bytes (max ${MAX_MARKDOWN_BYTES}).`,
      );
    }
    return normalizeMarkdown(buffer.toString("utf8"));
  }

  const buffer = await readStdin(MAX_MARKDOWN_BYTES + 1);
  if (buffer.byteLength > MAX_MARKDOWN_BYTES) {
    throw new Error(
      `Input too large: ${buffer.byteLength} bytes (max ${MAX_MARKDOWN_BYTES}).`,
    );
  }
  return normalizeMarkdown(buffer.toString("utf8"));
}

function normalizeMarkdown(markdown: string): string {
  return markdown.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

async function readStdin(maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of process.stdin) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    chunks.push(buffer);
    size += buffer.byteLength;
    if (size > maxBytes) break;
  }

  return Buffer.concat(chunks);
}

export function deriveTitle(markdown: string): string {
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const h1 = trimmed.match(/^#\s+(.+)$/);
    if (h1?.[1]) return truncateTitle(stripMarkdownInline(h1[1]).trim());

    return truncateTitle(stripMarkdownInline(trimmed).trim());
  }

  return "Untitled";
}

function stripMarkdownInline(text: string): string {
  return text
    .replaceAll(/`([^`]+)`/g, "$1")
    .replaceAll(/\*\*([^*]+)\*\*/g, "$1")
    .replaceAll(/\*([^*]+)\*/g, "$1")
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function truncateTitle(title: string): string {
  const maxLen = 120;
  return title.length > maxLen ? `${title.slice(0, maxLen - 1)}…` : title;
}
