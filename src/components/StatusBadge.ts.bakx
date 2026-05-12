import type { Status } from '../types/dashboard';
import { statusClass, statusLabel } from '../lib/status';

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`status-badge ${statusClass[status]}`}>{statusLabel[status]}</span>;
}
