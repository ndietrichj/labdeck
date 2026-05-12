import type { Status } from '../types';

export function StatusBadge({ status }: { status: Status }) {
  const statusLabel: Record<Status, string> = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    unknown: 'Unknown'
  };
  
  const statusClass: Record<Status, string> = {
    healthy: 'status-healthy',
    warning: 'status-warning',
    critical: 'status-critical',
    unknown: 'status-unknown'
  };

  return <span className={`status-badge ${statusClass[status]}`}>{statusLabel[status]}</span>;
}