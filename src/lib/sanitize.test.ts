import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it("allows safe HTML tags", () => {
    const input = "<p>Hello <strong>world</strong></p>";
    expect(sanitizeHtml(input)).toContain("<p>");
    expect(sanitizeHtml(input)).toContain("<strong>");
  });

  it("removes script tags", () => {
    const input = '<p>Safe</p><script>alert("xss")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
    expect(result).toContain("<p>Safe</p>");
  });

  it("removes style tags", () => {
    const input = "<style>body { display: none }</style><p>Content</p>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<style>");
    expect(result).toContain("<p>Content</p>");
  });

  it("removes iframe tags", () => {
    const input = '<iframe src="https://evil.com"></iframe><p>Safe</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<iframe>");
    expect(result).toContain("<p>Safe</p>");
  });

  it("removes javascript: URLs", () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("javascript:");
  });

  it("removes event handler attributes", () => {
    const input = '<p onclick="evil()">text</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onclick");
    expect(result).toContain("text");
  });

  it("allows img with safe attributes", () => {
    const input = '<img src="https://example.com/img.png" alt="photo" />';
    const result = sanitizeHtml(input);
    expect(result).toContain("<img");
    expect(result).toContain('alt="photo"');
  });

  it("allows headings", () => {
    const input = "<h1>Title</h1><h2>Subtitle</h2>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<h1>");
    expect(result).toContain("<h2>");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
  });
});
