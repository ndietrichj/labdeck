export interface OllamaTagResponse { models: Array<{ name: string; size?: number }>; }
export interface OpenAiModelResponse { data: Array<{ id: string }>; }
export interface HealthResponse { ok: boolean; details?: string; }

export const liveAdapters = {
  ollamaTags: (baseUrl: string) => `${baseUrl}/api/tags`,
  ollamaHealth: (baseUrl: string) => `${baseUrl}/api/generate`,
  gb10Models: (baseUrl: string) => `${baseUrl}/v1/models`,
  llamacppHealth: (baseUrl: string) => `${baseUrl}/health`,
  prometheusQuery: (baseUrl: string, query: string) => `${baseUrl}/api/v1/query?query=${encodeURIComponent(query)}`,
  piholeSummary: (baseUrl: string) => `${baseUrl}?summaryRaw`,
  inkyHeartbeat: (host: string) => `ssh://${host}/heartbeat`,
};
