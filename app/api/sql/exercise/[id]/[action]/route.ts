import { loadSqlExercise, loadGradingFixtures, loadSolution } from "@/lib/sql/content";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await params;
  if(!["solution", "grading"].includes(action)) return Response.json({ error: "Operazione non disponibile" },{ status: 404 });
  try {
    const exercise = loadSqlExercise(id); const solution = loadSolution(exercise);
    return Response.json(action === "solution" ? { query: solution, attribution: "Soluzione prodotta per Database Academy · needs-review. Non fornita dal docente." } : { query: solution, fixtures: loadGradingFixtures(exercise) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Esercizio non disponibile" },{ status: 404 }); }
}
