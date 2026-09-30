import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("responde 200 con status ok", async () => {
    const response = GET();
    expect(response.status).toBe(200);

    const body = (await response.json()) as { status: string; app: string };
    expect(body.status).toBe("ok");
    expect(body.app).toBe("protouchtyping");
  });
});
