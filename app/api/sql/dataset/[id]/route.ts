import { loadDataset } from "@/lib/sql/content";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return Response.json(loadDataset((await params).id)); }
  catch { return Response.json({ error: "Dataset non disponibile" },{ status: 404 }); }
}
