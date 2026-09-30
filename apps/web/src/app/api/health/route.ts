export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    app: "protouchtyping",
    timestamp: new Date().toISOString(),
  });
}
