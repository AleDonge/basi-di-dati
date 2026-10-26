import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { manifest } from "@/lib/content";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Allowlist of studied documents; never arbitrary paths or Book.pdf.
  const source = manifest.sources.find(s => s.id === id && ["intro-source", "relational-source", "algebra-source", "algebra-self-source", "algebra-scan-source", "er-source", "sql-source", "tools-source"].includes(s.id));
  if (!source) return new Response("Fonte non disponibile", { status: 404 });
  const bytes = await readFile(join(process.cwd(), "source-material", source.file));
  return new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline", "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff" } });
}
