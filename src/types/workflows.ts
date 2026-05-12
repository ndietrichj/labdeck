export type WorkflowStatus = 'running' | 'queued' | 'failed' | 'healthy' | 'paused';

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
