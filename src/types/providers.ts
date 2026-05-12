export interface Provider {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  latencyMs: number;
  capabilities: string[];
}
