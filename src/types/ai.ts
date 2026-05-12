export type AIProviderType = 'ollama' | 'llama-cpp' | 'vllm' | 'remote';

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  vramRequiredGb: number;
  isOnline: boolean;
  tags: string[];
}

export interface Runtime {
  id: string;
  provider: AIProviderType;
  name: string;
  endpoint: string;
  isAvailable: boolean;
  models: Model[];
  currentModel?: string;
}

export interface AITelemetry {
  runtime: Runtime;
  vramUsedGb: number;
  vramTotalGb: number;
  queueDepth: number;
  tokensPerSec: number;
  contextWindow: string;
  activeSessions: number;
  lastQueryTime?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  type: AIProviderType;
  endpoint: string;
  latencyMs: number;
  uptime: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  models: string[];
}
