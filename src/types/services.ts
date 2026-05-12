export type ServiceCategory = 'web' | 'ai-runtime' | 'automation' | 'monitoring' | 'network' | 'media' | 'jobs';

export interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
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
