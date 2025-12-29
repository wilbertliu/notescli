import { describe, expect, it } from "vitest";
import { htmlToMarkdown } from "../src/htmlToMarkdown";

describe("htmlToMarkdown", () => {
  it("converts headings and paragraphs", () => {
    const md = htmlToMarkdown("<div><h1>Hello</h1><p>World</p></div>");
    expect(md).toContain("# Hello");
    expect(md).toContain("World");
  });

  it("converts line breaks", () => {
    const md = htmlToMarkdown("<div>Hello<br>World</div>");
    expect(md).toContain("Hello");
    expect(md).toContain("World");
  });
});

