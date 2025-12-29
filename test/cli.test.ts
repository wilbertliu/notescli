import { describe, expect, it } from "vitest";
import { selectMarkdownSource } from "../src/cli";

describe("cli.selectMarkdownSource", () => {
  it("prefers explicit text", () => {
    expect(
      selectMarkdownSource({
        file: undefined,
        text: "hi",
        stdin: false,
        isStdinTty: true,
      }),
    ).toEqual({ kind: "text", text: "hi" });
  });

  it("falls back to stdin when not a TTY", () => {
    expect(
      selectMarkdownSource({
        file: undefined,
        text: undefined,
        stdin: false,
        isStdinTty: false,
      }),
    ).toEqual({ kind: "stdin" });
  });

  it("errors when multiple input sources are set", () => {
    expect(() =>
      selectMarkdownSource({
        file: "a.md",
        text: "hi",
        stdin: false,
        isStdinTty: true,
      }),
    ).toThrow(/only one input source/i);
  });
});
