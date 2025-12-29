import { describe, expect, it } from "vitest";
import { deriveTitle } from "../src/input";

describe("input.deriveTitle", () => {
  it("prefers first H1", () => {
    expect(deriveTitle("# Hello\n\nBody")).toBe("Hello");
  });

  it("falls back to first non-empty line", () => {
    expect(deriveTitle("\n\nHello there\n\n# Later")).toBe("Hello there");
  });

  it("strips some inline markdown", () => {
    expect(deriveTitle("# **Hello** [`world`](https://example.com)")).toBe(
      "Hello world",
    );
  });

  it("returns Untitled for empty input", () => {
    expect(deriveTitle("\n\n")).toBe("Untitled");
  });
});
