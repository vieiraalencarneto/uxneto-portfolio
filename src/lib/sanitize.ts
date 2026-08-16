import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5",
  "p", "strong", "em", "b", "i",
  "ul", "ol", "li",
  "blockquote",
  "a",
  "img",
  "br", "hr",
  "figure", "figcaption",
  "div", "span",
];

const ALLOWED_ATTR = ["href", "src", "alt", "title", "width", "height", "target", "rel"];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
  });
}
