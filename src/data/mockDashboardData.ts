import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  overallStatus: 'warning',
  activeAlerts: 3,
  hosts: [
    { id: 'node-1', name: 'Controller Node A', role: 'Mac Mini Controller', status: 'healthy', uptime: '18d 04h', cpu: 31, memory: 58, storage: 47, trend: 'stable' },
    { id: 'node-2', name: 'Inference Node B', role: 'GB10 Inference', status: 'warning', uptime: '9d 21h', cpu: 67, memory: 71, storage: 63, gpu: 92, trend: 'up' },
    { id: 'node-3', name: 'Services Node C', role: 'App Runtime', status: 'healthy', uptime: '27d 02h', cpu: 42, memory: 49, storage: 54, trend: 'stable' },
    { id: 'ndj-inky', name: 'InkyPi', role: 'e-ink observability', status: 'warning', uptime: '2d 01h', cpu: 28, memory: 33, storage: 41, trend: 'down', heartbeat: { connected: false, lastHeartbeat: new Date(Date.now()-1000*60*14).toISOString(), disconnectedCount: 6, wifiSignalPct: 37, einkRefreshTimeout: true, missedHeartbeat: true } }
  ],
  services: [
    { id: 'portfolio', name: 'Portfolio Hub / nathandjones.com', status: 'healthy', host: 'Services Node C', category: 'web', uptime: '16d', latencyMs: 37, lastHeartbeat: '18s ago', tags: ['web', 'public'] },
    { id: 'ollama-gb10', name: 'Ollama Server - GB10', status: 'warning', host: 'Inference Node B', category: 'ai-runtime', uptime: '9d', latencyMs: 87, lastHeartbeat: '27s ago', activeModel: 'llama3.1:70b', queueDepth: 4, tags: ['ai'] },
    { id: 'pihole', name: 'Pi-hole', status: 'warning', host: 'Services Node C', category: 'network', uptime: '12d', latencyMs: 121, lastHeartbeat: '43s ago', tags: ['dns'] },
    { id: 'prometheus', name: 'Prometheus', status: 'healthy', host: 'Services Node C', category: 'monitoring', uptime: '27d', latencyMs: 12, lastHeartbeat: '4s ago', tags: ['metrics'] }
  ],
  incidents: [
    { id: 'inc-1', message: 'GB10 GPU utilization exceeded 90%', status: 'warning', time: '2 min ago', source: 'prometheus' },
    { id: 'inc-2', message: 'InkyPi heartbeat missed on ndj-inky', status: 'warning', time: '4 min ago', source: 'ndj-inky' },
    { id: 'inc-3', message: 'InkyPi e-ink refresh timeout placeholder emitted', status: 'warning', time: '13 min ago', source: 'ndj-inky' }
  ],
  jobs: [
    { id: 'career-discover', name: 'Career Ops discover-market', status: 'healthy', lastRun: '2026-05-11 06:30', nextRun: '2026-05-12 06:30', duration: '19s', targetHost: 'Services Node C', lastResult: '12 leads ingested' }
  ],
  aiProviders: [
    { id: 'sched', name: 'GB10 Scheduler', latencyMs: 28, tokensPerSec: 82, contextWindow: '128k', vramUsage: '34 / 48 GB', queueDepth: 3, healthy: true, schedulerContention: 'moderate', memoryPressure: 'elevated' },
    { id: 'ollama-gb10', name: 'Ollama GB10', latencyMs: 84, tokensPerSec: 56, contextWindow: '32k', vramUsage: '37 / 48 GB', queueDepth: 4, healthy: true, schedulerContention: 'high', memoryPressure: 'critical' }
  ],
  aiRuntimes: [
    { id: 'rt-sched', providerId: 'sched', name: 'GB10 Scheduler', healthy: true, modelResidency: 'resident' },
    { id: 'rt-ollama', providerId: 'ollama-gb10', name: 'Ollama /api/tags', healthy: true, modelResidency: 'loading' }
  ],
  models: [
    { id: 'llama3.1:70b-instruct-q4_k_m', providerId: 'sched', name: 'llama3.1:70b-instruct-q4_k_m', contextWindow: '128k' },
    { id: 'qwen2.5-coder:14b', providerId: 'ollama-gb10', name: 'qwen2.5-coder:14b', contextWindow: '32k' }
  ],
  ai: { availableHosts: ['Inference Node B', 'Controller Node A'], activeModel: 'llama3.1:70b-instruct-q4_k_m', vramUsedGb: 32, vramTotalGb: 48, queueDepth: 3, inferenceAvailable: true },
  telemetry: [
    { providerId: 'sched', modelId: 'llama3.1:70b-instruct-q4_k_m', latencyMs: 28, tokensPerSec: 82, memoryPressure: 'elevated', schedulerContention: 'moderate' },
    { providerId: 'ollama-gb10', modelId: 'qwen2.5-coder:14b', latencyMs: 84, tokensPerSec: 56, memoryPressure: 'critical', schedulerContention: 'high' }
  ],
  updatedAt: new Date().toISOString()
};
