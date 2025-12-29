import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { CREATE_NOTE_APPLESCRIPT } from "./applescript";
import { runOsaScript } from "./osascript";

export type CreateNoteParams = {
  title: string;
  folder: string;
  html: string;
  account?: string;
};

export type CreatedNote = {
  id: string;
  name: string;
};

export async function createNote(
  params: CreateNoteParams,
): Promise<CreatedNote> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "notescli-"));
  const bodyPath = path.join(tempDir, "body.html");

  try {
    await writeFile(bodyPath, params.html, "utf8");
    const output = runOsaScript(CREATE_NOTE_APPLESCRIPT, [
      params.title,
      params.folder,
      params.account ?? "",
      bodyPath,
    ]);
    return parseCreateNoteOutput(output);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export function parseCreateNoteOutput(output: string): CreatedNote {
  const trimmed = output.trimEnd();
  const [id, name] = trimmed.split("\n", 2);
  if (!id || !name) {
    throw new Error(`Unexpected osascript output: ${JSON.stringify(output)}`);
  }
  return { id, name };
}
