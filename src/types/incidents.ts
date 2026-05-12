export type AlertSeverity = 1 | 2 | 3 | 4;

export interface Incident {
  id: string;
  code: string;
  message: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
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
