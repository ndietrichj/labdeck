export type Status = 'healthy' | 'warning' | 'critical' | 'unknown';

export type ServiceCategory =
  | 'web'
  | 'ai-runtime'
  | 'automation'
  | 'monitoring'
  | 'network'
  | 'media'
  | 'jobs';

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
  lastRun?: string;
  description: string;
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
}

export interface Incident {
  id: string;
  message: string;
  status: Status;
  time: string;
}

export interface AutomationJob {
  id: string;
  name: string;
  status: Status;
  lastRun: string;
  nextRun: string;
  duration: string;
  targetHost: string;
  lastResult: string;
  logPreview: string[];
}

export interface AIProvider {
  id: string;
  name: string;
  models: string[];
}

export interface DashboardData {
  overallStatus: Status;
  updatedAt: string;
  services: Service[];
  hosts: Host[];
  incidents: Incident[];
  automations: AutomationJob[];
  aiProviders: AIProvider[];
}
