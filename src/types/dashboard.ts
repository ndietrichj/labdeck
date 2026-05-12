export type Status = 'healthy' | 'warning' | 'critical' | 'unknown';
export type DataSource = 'mock' | 'live' | 'stale';

export type ServiceCategory = 'web' | 'ai-runtime' | 'automation' | 'monitoring' | 'network' | 'media' | 'jobs';

export interface NodeHeartbeat {
  connected: boolean;
  lastHeartbeat: string;
  disconnectedCount: number;
  wifiSignalPct?: number;
  einkRefreshTimeout?: boolean;
  missedHeartbeat: boolean;
}

export interface Host {
  id: string;
  name: string;
  role: string;
  status: Status;
  uptime: string;
  cpu: number;
  memory: number;
  storage: number;
  gpu?: number;
  trend: 'up' | 'down' | 'stable';
  heartbeat?: NodeHeartbeat;
}

export interface Service { id: string; name: string; status: Status; host: string; category: ServiceCategory; uptime: string; latencyMs: number; lastHeartbeat: string; activeModel?: string; queueDepth?: number; tags: string[]; }
export interface Incident { id: string; message: string; status: Status; time: string; source?: string; }
export interface Job { id: string; name: string; status: Status; lastRun: string; nextRun: string; duration: string; targetHost: string; lastResult: string; }

export interface AiRuntime { id: string; providerId: string; name: string; healthy: boolean; modelResidency: 'resident' | 'loading' | 'evicted'; }
export interface AiModel { id: string; providerId: string; name: string; contextWindow: string; }
export interface AiProvider { id: string; name: string; latencyMs: number; tokensPerSec: number; contextWindow: string; vramUsage: string; queueDepth: number; healthy: boolean; schedulerContention: 'low' | 'moderate' | 'high'; memoryPressure: 'normal' | 'elevated' | 'critical'; }
export interface AiInfra { availableHosts: string[]; activeModel: string; vramUsedGb: number; vramTotalGb: number; queueDepth: number; inferenceAvailable: boolean; }
export interface TelemetrySnapshot { providerId: string; modelId: string; latencyMs: number; tokensPerSec: number; memoryPressure: string; schedulerContention: string; }

export interface DashboardData {
  overallStatus: Status;
  activeAlerts: number;
  hosts: Host[];
  services: Service[];
  incidents: Incident[];
  jobs: Job[];
  aiProviders: AiProvider[];
  aiRuntimes: AiRuntime[];
  models: AiModel[];
  ai: AiInfra;
  telemetry: TelemetrySnapshot[];
  updatedAt: string;
}

export interface RuntimeConfig {
  backendBaseUrl: string;
  mode: 'mock' | 'live';
  refreshIntervalMs: number;
  providers: Record<string, string>;
  nodeRegistry: Array<{ id: string; hostname: string; ip: string; user: string; unstable: boolean }>;
}

export interface LoadMeta {
  source: DataSource;
  lastUpdated: string;
  stale: boolean;
  failedEndpoints: string[];
  refreshInFlight: boolean;
  error?: string;
}
