export type Status = 'healthy' | 'warning' | 'critical' | 'unknown';

export type ServiceCategory = 'web' | 'ai-runtime' | 'automation' | 'monitoring' | 'network' | 'media' | 'jobs';

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
}

export interface Service {
  id: string;
  name: string;
  status: Status;
  host: string;
  category: ServiceCategory;
  uptime: string;
  latencyMs: number;
  lastHeartbeat: string;
  activeModel?: string;
  queueDepth?: number;
  tags: string[];
}

export interface Incident {
  id: string;
  message: string;
  status: Status;
  time: string;
}

export interface Job {
  id: string;
  name: string;
  status: Status;
  lastRun: string;
  nextRun: string;
  duration: string;
  targetHost: string;
  lastResult: string;
}

export interface AiProvider {
  id: string;
  name: string;
  latencyMs: number;
  tokensPerSec: number;
  contextWindow: string;
  vramUsage: string;
  queueDepth: number;
}

export interface AiInfra {
  availableHosts: string[];
  activeModel: string;
  vramUsedGb: number;
  vramTotalGb: number;
  queueDepth: number;
  inferenceAvailable: boolean;
}

export interface DashboardData {
  overallStatus: Status;
  activeAlerts: number;
  hosts: Host[];
  services: Service[];
  incidents: Incident[];
  jobs: Job[];
  aiProviders: AiProvider[];
  ai: AiInfra;
  updatedAt: string;
}
