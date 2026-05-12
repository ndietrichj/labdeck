// Status types
export type Status = 'healthy' | 'warning' | 'critical' | 'unknown';
export type WorkflowStatus = 'running' | 'queued' | 'failed' | 'healthy' | 'paused';
export type ServiceCategory = 'web' | 'ai-runtime' | 'automation' | 'monitoring' | 'network' | 'media' | 'jobs';
export type AlertSeverity = 1 | 2 | 3 | 4;
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

export interface ModelInfo extends Omit<Model, 'provider'> {}

// Services
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

export interface ServiceDetail {
  overview: Service;
  logs: { timestamp: string; level: string; message: string }[];
  metrics: { timestamp: string; name: string; value: number }[];
  actions: { id: string; name: string; type: string }[];
}

// Workflows
export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  lastRun: string;
  nextRun: string;
  duration: string;
  targetHost: string;
  lastResult: string;
  config: {
    schedule: string;
    trigger: 'cron' | 'manual' | 'event';
  };
}

export interface WorkflowRunHistory {
  id: string;
  workflowId: string;
  startTime: string;
  endTime: string;
  status: WorkflowStatus;
  result: string;
}

// AI / Models
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
  status: Status;
  models: string[];
  availableModels: ModelInfo[];
}

// Nodes / Infrastructure
export interface Node {
  id: string;
  name: string;
  role: string;
  status: Status;
  uptime: string;
  cpu: number;
  memory: number;
  storage: number;
  gpu?: number;
  network: { rx: number; tx: number };
  reservedIp: string;
  userId: string;
  disconnectedCount: number;
  lastDisconnect: string;
  wifiSignalStrength?: number;
  healthInterval?: number;
  lastHeartbeat?: string;
}

export interface NodeTelemetry {
  nodeId: string;
  timestamp: string;
  cpu: number;
  memory: number;
  gpu?: number;
}

// Incidents
export interface Incident {
  id: string;
  code: string;
  message: string;
  status: Status;
  time: string;
  severity: AlertSeverity;
  source?: string;
  acknowledged?: boolean;
  acknowledgedBy?: string;
}

export interface AlertSystem {
  activeIncidents: number;
  criticalCount: number;
  warningCount: number;
  healthyCount: number;
  lastAlert: string;
}

// Providers
export interface Provider {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  status: Status;
  latencyMs: number;
  capabilities: string[];
}

// Dashboard data - holds all entities together
export interface DashboardData {
  overallStatus: Status;
  activeAlerts: number;
  nodes: Node[];
  services: Service[];
  incidents: Incident[];
  workflows: Workflow[];
  aiProviders: AIProvider[];
  ai: AITelemetry;
  alertSystem: AlertSystem;
  updatedAt: string;
}
