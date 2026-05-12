export interface Node {
  id: string;
  name: string;
  role: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: string;
  cpu: number;
  memory: number;
  storage: number;
  gpu?: number;
  network: { rx: number; tx: number };
}

export interface NodeTelemetry {
  nodeId: string;
  timestamp: string;
  cpu: number;
  memory: number;
  gpu?: number;
}
