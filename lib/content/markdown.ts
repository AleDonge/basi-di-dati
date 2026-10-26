// JSON frontmatter only: no YAML tags, MDX, JSX or arbitrary evaluation.
export function parseLessonFile(text: string): { metadata: unknown; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(text);
  if (!match) throw new Error("Frontmatter JSON mancante");
  return { metadata: JSON.parse(match[1]) as unknown, body: match[2] };
}
export function headingId(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export function tableOfContents(body: string) {
  return [...body.matchAll(/^## (.+)$/gm)].map(m => ({ title: m[1], id: headingId(m[1]) }));
}
export function localContentUrl(url: string) {
  return /^(?:\/[a-zA-Z0-9][^\s\\]*|#[a-z0-9-]+)$/.test(url) && !url.startsWith("//") ? url : "";
}
