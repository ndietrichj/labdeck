import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  overallStatus: 'warning',
  activeAlerts: 2,
  hosts: [
    { id: 'node-1', name: 'Controller Node A', role: 'Mac Mini Controller', status: 'healthy', uptime: '18d 04h', cpu: 31, memory: 58, storage: 47, trend: 'stable' },
    { id: 'node-2', name: 'Inference Node B', role: 'GB10 Inference', status: 'warning', uptime: '9d 21h', cpu: 67, memory: 71, storage: 63, gpu: 92, trend: 'up' },
    { id: 'node-3', name: 'Services Node C', role: 'App Runtime', status: 'healthy', uptime: '27d 02h', cpu: 42, memory: 49, storage: 54, trend: 'stable' }
  ],
  services: [
    { id: 'portfolio', name: 'Portfolio Hub / nathandjones.com', status: 'healthy', host: 'Services Node C', category: 'web', uptime: '16d', latencyMs: 37, lastHeartbeat: '18s ago', tags: ['web', 'public'] },
    { id: 'career-ops', name: 'Career Ops Local', status: 'healthy', host: 'Services Node C', category: 'automation', uptime: '12d', latencyMs: 22, lastHeartbeat: '12s ago', tags: ['ops'] },
    { id: 'hermes', name: 'Hermes Runtime', status: 'healthy', host: 'Services Node C', category: 'automation', uptime: '11d', latencyMs: 26, lastHeartbeat: '9s ago', tags: ['scheduler'] },
    { id: 'openclaw', name: 'OpenClaw Gateway', status: 'healthy', host: 'Controller Node A', category: 'network', uptime: '18d', latencyMs: 18, lastHeartbeat: '6s ago', tags: ['gateway'] },
    { id: 'ollama-m4', name: 'Ollama Server - Mac Mini M4', status: 'healthy', host: 'Controller Node A', category: 'ai-runtime', uptime: '7d', latencyMs: 63, lastHeartbeat: '11s ago', activeModel: 'qwen2.5-coder:14b', queueDepth: 1, tags: ['ai'] },
    { id: 'ollama-gb10', name: 'Ollama Server - GB10', status: 'warning', host: 'Inference Node B', category: 'ai-runtime', uptime: '9d', latencyMs: 87, lastHeartbeat: '27s ago', activeModel: 'llama3.1:70b', queueDepth: 4, tags: ['ai'] },
    { id: 'llamacpp', name: 'llama.cpp Server - GB10', status: 'healthy', host: 'Inference Node B', category: 'ai-runtime', uptime: '6d', latencyMs: 73, lastHeartbeat: '14s ago', activeModel: 'deepseek-coder-v2', queueDepth: 2, tags: ['ai'] },
    { id: 'router', name: 'GB10 Scheduler / Model Router', status: 'healthy', host: 'Inference Node B', category: 'ai-runtime', uptime: '5d', latencyMs: 29, lastHeartbeat: '8s ago', queueDepth: 3, tags: ['routing'] },
    { id: 'pihole', name: 'Pi-hole', status: 'warning', host: 'Services Node C', category: 'network', uptime: '12d', latencyMs: 121, lastHeartbeat: '43s ago', tags: ['dns'] },
    { id: 'cloudflare', name: 'Cloudflare Tunnel', status: 'healthy', host: 'Services Node C', category: 'network', uptime: '20d', latencyMs: 29, lastHeartbeat: '5s ago', tags: ['edge'] },
    { id: 'prometheus', name: 'Prometheus', status: 'healthy', host: 'Services Node C', category: 'monitoring', uptime: '27d', latencyMs: 12, lastHeartbeat: '4s ago', tags: ['metrics'] },
    { id: 'immich', name: 'Immich', status: 'healthy', host: 'Services Node C', category: 'media', uptime: '8d', latencyMs: 41, lastHeartbeat: '16s ago', tags: ['photos'] },
    { id: 'cron', name: 'recurring cron jobs', status: 'healthy', host: 'Controller Node A', category: 'jobs', uptime: '30d', latencyMs: 8, lastHeartbeat: '2s ago', queueDepth: 2, tags: ['jobs'] }
  ],
  incidents: [
    { id: 'inc-1', message: 'GB10 GPU utilization exceeded 90%', status: 'warning', time: '2 min ago' },
    { id: 'inc-2', message: 'Pi-hole latency spike detected', status: 'warning', time: '11 min ago' },
    { id: 'inc-3', message: 'Model router failover completed', status: 'healthy', time: '24 min ago' },
    { id: 'inc-4', message: 'Immich backup completed', status: 'healthy', time: '46 min ago' }
  ],
  jobs: [
    { id: 'mealops', name: 'MealOps weekly plan', status: 'healthy', lastRun: '2026-05-10 07:00', nextRun: '2026-05-17 07:00', duration: '34s', targetHost: 'Controller Node A', lastResult: '7 meals generated' },
    { id: 'career-discover', name: 'Career Ops discover-market', status: 'healthy', lastRun: '2026-05-11 06:30', nextRun: '2026-05-12 06:30', duration: '19s', targetHost: 'Services Node C', lastResult: '12 leads ingested' },
    { id: 'intel', name: 'Competitive intelligence digest', status: 'warning', lastRun: '2026-05-11 05:10', nextRun: '2026-05-12 05:10', duration: '52s', targetHost: 'Services Node C', lastResult: '2 sources timed out' },
    { id: 'portfolio-health', name: 'Portfolio health check', status: 'healthy', lastRun: '2026-05-11 08:10', nextRun: '2026-05-11 12:10', duration: '12s', targetHost: 'Services Node C', lastResult: 'all checks passed' },
    { id: 'immich-backup', name: 'Immich backup check', status: 'healthy', lastRun: '2026-05-11 03:00', nextRun: '2026-05-12 03:00', duration: '45s', targetHost: 'Services Node C', lastResult: 'snapshot OK' },
    { id: 'warmup', name: 'model warmup cron', status: 'warning', lastRun: '2026-05-11 09:00', nextRun: '2026-05-11 13:00', duration: '65s', targetHost: 'Inference Node B', lastResult: 'one model cold-started' },
    { id: 'other', name: 'other cron jobs', status: 'healthy', lastRun: '2026-05-11 08:45', nextRun: '2026-05-11 09:45', duration: '9s', targetHost: 'Controller Node A', lastResult: '5/5 succeeded' }
  ],
  aiProviders: [
    { id: 'sched', name: 'GB10 Scheduler', latencyMs: 28, tokensPerSec: 82, contextWindow: '128k', vramUsage: '34 / 48 GB', queueDepth: 3 },
    { id: 'ollama-gb10', name: 'Ollama GB10', latencyMs: 84, tokensPerSec: 56, contextWindow: '32k', vramUsage: '37 / 48 GB', queueDepth: 4 },
    { id: 'ollama-mac', name: 'Ollama Mac Mini', latencyMs: 61, tokensPerSec: 49, contextWindow: '16k', vramUsage: '11 / 16 GB', queueDepth: 1 },
    { id: 'llama-cpp', name: 'llama.cpp GB10', latencyMs: 72, tokensPerSec: 65, contextWindow: '64k', vramUsage: '30 / 48 GB', queueDepth: 2 }
  ],
  ai: {
    availableHosts: ['Inference Node B', 'Controller Node A'],
    activeModel: 'llama3.1:70b-instruct-q4_k_m',
    vramUsedGb: 32,
    vramTotalGb: 48,
    queueDepth: 3,
    inferenceAvailable: true
  },
  updatedAt: new Date().toISOString()
};
