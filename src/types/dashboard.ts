export type Status = 'healthy' | 'warning' | 'critical' | 'unknown';

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
  uptime: string;
  latencyMs: number;
  tags: string[];
}

export interface Incident {
  id: string;
  message: string;
  status: Status;
  time: string;
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
  ai: AiInfra;
  updatedAt: string;
}
