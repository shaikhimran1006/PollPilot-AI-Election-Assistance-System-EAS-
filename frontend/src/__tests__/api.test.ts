import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const resolveDemo = async <T,>(promise: Promise<T>) => {
  await vi.runAllTimersAsync();
  return promise;
};

describe("demo api behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubEnv("VITE_DEMO_MODE", "true");
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:9999/api");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("defaults to the balanced scenario", async () => {
    const { getDemoScenario } = await import("../services/api");
    expect(getDemoScenario()).toBe("balanced");
  });

  it("persists the selected demo scenario", async () => {
    const { getDemoScenario, setDemoScenario } = await import("../services/api");
    setDemoScenario("deadline");
    expect(getDemoScenario()).toBe("deadline");
  });

  it("returns demo timeline entries", async () => {
    const { default: api } = await import("../services/api");
    const response = await resolveDemo(api.get("/timeline"));
    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThanOrEqual(4);
  });

  it("returns polling locations for an address", async () => {
    const { default: api } = await import("../services/api");
    const response = await resolveDemo(api.post("/polling/search", { address: "123 Main" }));
    expect(response.data).toHaveLength(3);
    expect(response.data[0]).toHaveProperty("latitude");
  });

  it("rejects unknown demo endpoints", async () => {
    const { default: api } = await import("../services/api");
    await expect(resolveDemo(api.get("/unknown"))).rejects.toHaveProperty("response.status", 404);
  });

  it("responds with guidance to ID questions", async () => {
    const { default: api } = await import("../services/api");
    const response = await resolveDemo(api.post("/chat", { message: "Do I need an id?" }));
    expect(String(response.data)).toMatch(/id/i);
  });
});
