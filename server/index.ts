import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = Number(process.env.LABDECK_PORT ?? 8787);

app.use(cors());
app.use(express.json());

const env = {
  ollamaMac: process.env.OLLAMA_MAC_URL ?? "http://10.0.0.220:11434",
  ollamaGb10: process.env.OLLAMA_GB10_URL ?? "http://10.0.0.150:11434",
  scheduler: process.env.GB10_SCHEDULER_URL ?? "http://10.0.0.150:11435",
  llamaCpp: process.env.LLAMA_CPP_URL ?? "http://10.0.0.150:11436",
  prometheus: process.env.PROMETHEUS_URL ?? "http://10.0.0.139:9090",
  pihole: process.env.PIHOLE_URL ?? "http://10.0.0.104/admin/api.php",
  inkypi: process.env.INKYPI_HOST ?? "10.0.0.175",
};

async function getJson(url: string, timeoutMs = 2500) {
  try {
    const res = await axios.get(url, { timeout: timeoutMs });
    return { ok: true, data: res.data };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "request failed" };
  }
}

function modelFromOllamaTag(model: any, providerId: string) {
  return {
    id: model.name,
    providerId,
    name: model.name,
    contextWindow: model.details?.parameter_size ?? "unknown",
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "labdeck-telemetry-bridge",
    time: new Date().toISOString(),
  });
});

app.get("/api/dashboard", async (_req, res) => {
  const [ollamaMac, ollamaGb10, scheduler, llamaCpp, prometheus] = await Promise.all([
    getJson(`${env.ollamaMac}/api/tags`),
    getJson(`${env.ollamaGb10}/api/tags`),
    getJson(`${env.scheduler}/v1/models`),
    getJson(`${env.llamaCpp}/health`),
    getJson(`${env.prometheus}/api/v1/query?query=up`),
  ]);

  const failedEndpoints = [
    !ollamaMac.ok && "ollama-mac",
    !ollamaGb10.ok && "ollama-gb10",
    !scheduler.ok && "gb10-scheduler",
    !llamaCpp.ok && "llama.cpp-gb10",
    !prometheus.ok && "prometheus",
  ].filter(Boolean);

  const macModels = ollamaMac.ok ? ollamaMac.data.models ?? [] : [];
  const gb10Models = ollamaGb10.ok ? ollamaGb10.data.models ?? [] : [];
  const schedulerModels = scheduler.ok ? scheduler.data.data ?? [] : [];

  const models = [
    ...schedulerModels.map((m: any) => ({
      id: m.id,
      providerId: "sched",
      name: m.id,
      contextWindow: "scheduler",
    })),
    ...gb10Models.map((m: any) => modelFromOllamaTag(m, "ollama-gb10")),
    ...macModels.map((m: any) => modelFromOllamaTag(m, "ollama-mac")),
  ];

  const data = {
    overallStatus: failedEndpoints.length ? "warning" : "healthy",
    updatedAt: new Date().toISOString(),

    hosts: [
      {
        id: "node-a",
        name: "Controller Node A",
        role: "Mac Mini Controller",
        status: ollamaMac.ok ? "healthy" : "warning",
        uptime: "live",
        cpu: 0,
        memory: 0,
        storage: 0,
        network: { rx: 0, tx: 0 },
      },
      {
        id: "node-b",
        name: "Inference Node B",
        role: "GB10 Inference",
        status: ollamaGb10.ok || scheduler.ok || llamaCpp.ok ? "healthy" : "warning",
        uptime: "live",
        cpu: 0,
        memory: 0,
        storage: 0,
        gpu: 0,
        network: { rx: 0, tx: 0 },
      },
      {
        id: "node-c",
        name: "Services Node C",
        role: "Pi 5 / App Runtime",
        status: prometheus.ok ? "healthy" : "warning",
        uptime: "live",
        cpu: 0,
        memory: 0,
        storage: 0,
        network: { rx: 0, tx: 0 },
      },
      {
        id: "ndj-inky",
        name: "InkyPi",
        role: "InkyPi Host / E-ink Status Display",
        status: "warning",
        uptime: "unknown",
        cpu: 0,
        memory: 0,
        storage: 0,
        network: { rx: 0, tx: 0 },
        reservedIp: env.inkypi,
        userId: "ndj-pi",
        heartbeat: {
          connected: false,
          missedHeartbeat: true,
          wifiSignalPct: 37,
          einkRefreshTimeout: true,
          disconnectedCount: 6,
          lastDisconnectAt: new Date().toISOString(),
        },
      },
    ],

    services: [
      {
        id: "ollama-gb10",
        name: "Ollama Server - GB10",
        status: ollamaGb10.ok ? "healthy" : "warning",
        host: "Inference Node B",
        category: "ai-runtime",
        uptime: "live",
        latencyMs: 0,
        lastHeartbeat: "live",
        activeModel: gb10Models[0]?.name,
        queueDepth: 0,
        tags: ["ai"],
      },
      {
        id: "ollama-mac",
        name: "Ollama Server - Mac Mini",
        status: ollamaMac.ok ? "healthy" : "warning",
        host: "Controller Node A",
        category: "ai-runtime",
        uptime: "live",
        latencyMs: 0,
        lastHeartbeat: "live",
        activeModel: macModels[0]?.name,
        queueDepth: 0,
        tags: ["ai"],
      },
      {
        id: "gb10-scheduler",
        name: "GB10 Scheduler / Model Router",
        status: scheduler.ok ? "healthy" : "warning",
        host: "Inference Node B",
        category: "ai-runtime",
        uptime: "live",
        latencyMs: 0,
        lastHeartbeat: "live",
        queueDepth: 0,
        tags: ["scheduler", "ai"],
      },
      {
        id: "llamacpp-gb10",
        name: "llama.cpp Server - GB10",
        status: llamaCpp.ok ? "healthy" : "warning",
        host: "Inference Node B",
        category: "ai-runtime",
        uptime: "live",
        latencyMs: 0,
        lastHeartbeat: "live",
        tags: ["llama.cpp", "ai"],
      },
      {
        id: "prometheus",
        name: "Prometheus",
        status: prometheus.ok ? "healthy" : "warning",
        host: "Services Node C",
        category: "monitoring",
        uptime: "live",
        latencyMs: 0,
        lastHeartbeat: "live",
        tags: ["metrics"],
      },
      {
        id: "inky-display",
        name: "InkyPi Display Service",
        status: "warning",
        host: "ndj-inky",
        category: "monitoring",
        uptime: "unknown",
        latencyMs: 0,
        lastHeartbeat: "stale",
        tags: ["display", "pi"],
      },
    ],

    aiProviders: [
      {
        id: "sched",
        name: "GB10 Scheduler",
        latencyMs: scheduler.ok ? 28 : 999,
        tokensPerSec: scheduler.ok ? 82 : 0,
        contextWindow: "128k",
        vramUsage: "live",
        queueDepth: 0,
        healthy: scheduler.ok,
        schedulerContention: scheduler.ok ? "moderate" : "high",
        memoryPressure: "elevated",
      },
      {
        id: "ollama-gb10",
        name: "Ollama GB10",
        latencyMs: ollamaGb10.ok ? 64 : 999,
        tokensPerSec: ollamaGb10.ok ? 56 : 0,
        contextWindow: "model-dependent",
        vramUsage: "live",
        queueDepth: 0,
        healthy: ollamaGb10.ok,
        schedulerContention: "moderate",
        memoryPressure: "elevated",
      },
      {
        id: "ollama-mac",
        name: "Ollama Mac Mini",
        latencyMs: ollamaMac.ok ? 32 : 999,
        tokensPerSec: ollamaMac.ok ? 45 : 0,
        contextWindow: "model-dependent",
        vramUsage: "n/a",
        queueDepth: 0,
        healthy: ollamaMac.ok,
        schedulerContention: "low",
        memoryPressure: "normal",
      },
    ],

    aiRuntimes: [
      {
        id: "rt-sched",
        providerId: "sched",
        name: "GB10 Scheduler",
        healthy: scheduler.ok,
        modelResidency: scheduler.ok ? "resident" : "evicted",
      },
      {
        id: "rt-ollama-gb10",
        providerId: "ollama-gb10",
        name: "Ollama GB10",
        healthy: ollamaGb10.ok,
        modelResidency: ollamaGb10.ok ? "loading" : "evicted",
      },
      {
        id: "rt-ollama-mac",
        providerId: "ollama-mac",
        name: "Ollama Mac Mini",
        healthy: ollamaMac.ok,
        modelResidency: ollamaMac.ok ? "resident" : "evicted",
      },
    ],

    models: models.length
      ? models
      : [
          { id: "no-live-models", providerId: "sched", name: "No live models detected", contextWindow: "n/a" },
        ],

    ai: {
      availableHosts: ["Inference Node B", "Controller Node A"],
      activeModel: models[0]?.name ?? "none",
      vramUsedGb: 0,
      vramTotalGb: 0,
      queueDepth: 0,
      inferenceAvailable: ollamaGb10.ok || ollamaMac.ok || scheduler.ok,
    },

    telemetry: models.length
      ? models.map((m: any) => ({
          providerId: m.providerId,
          modelId: m.id,
          latencyMs: m.providerId === "sched" ? 28 : 64,
          tokensPerSec: m.providerId === "sched" ? 82 : 56,
          memoryPressure: "elevated",
          schedulerContention: m.providerId === "sched" ? "moderate" : "low",
        }))
      : [
          {
            providerId: "sched",
            modelId: "no-live-models",
            latencyMs: 0,
            tokensPerSec: 0,
            memoryPressure: "unknown",
            schedulerContention: "unknown",
          },
        ],

    jobs: [
      {
        id: "career-ops",
        name: "Career Ops discover-market",
        status: "healthy",
        nextRun: "scheduled",
        lastRun: new Date().toISOString(),
        durationSec: 0,
        host: "Services Node C",
        summary: "placeholder",
      },
    ],

    incidents: [
      ...failedEndpoints.map((endpoint, index) => ({
        id: `endpoint-${index}`,
        code: "ENDPOINT",
        message: `${endpoint} unavailable`,
        status: "warning",
        time: "now",
        severity: 2,
        source: String(endpoint),
      })),
      {
        id: "inky-heartbeat",
        code: "INKY-DISCONNECT",
        message: "InkyPi heartbeat missed on ndj-inky",
        status: "warning",
        time: "4 min ago",
        severity: 2,
        source: "ndj-inky",
      },
    ],
  };

  res.json(data);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`LabDeck telemetry bridge listening on http://localhost:${port}/api`);
});
