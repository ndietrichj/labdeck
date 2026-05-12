import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  overallStatus: 'warning',
  activeAlerts: 4,
  hosts: [
    { id: 'mac-mini-m4', name: 'Mac Mini M4 · 24GB RAM', role: 'Controller Node / Agent Host', hostType: 'Apple Silicon workstation', primaryServices: ['LabDeck Tauri', 'Automation Coordinator', 'Control plane'], status: 'healthy', uptime: '21d 02h', cpu: 24, memory: 61, storage: 43, trend: 'stable' },
    { id: 'dell-gb10', name: 'Dell Pro Max GB10', role: 'Inference Host via Ollama and llama.cpp', hostType: 'GPU inference workstation', primaryServices: ['Ollama API', 'llama.cpp server', 'Model scheduler'], status: 'warning', uptime: '8d 14h', cpu: 58, memory: 74, storage: 67, gpu: 89, trend: 'up' },
    { id: 'rpi-5', name: 'Raspberry Pi 5 · 16GB RAM', role: 'App & Test/Dev Server Host', hostType: 'ARM edge server', primaryServices: ['Node services', 'Docker Compose stack', 'Dev previews'], status: 'healthy', uptime: '16d 10h', cpu: 37, memory: 46, storage: 52, trend: 'stable' },
    { id: 'rpi-zero-pihole', name: 'Raspberry Pi Zero 2 W', role: 'Pi-hole', hostType: 'ARM micro host', primaryServices: ['Pi-hole DNS'], status: 'healthy', uptime: '28d 03h', cpu: 11, memory: 34, storage: 48, trend: 'stable' },
    { id: 'rpi-zero-inkypi', name: 'Raspberry Pi Zero 2 W', role: 'InkyPi e-Ink Display Host', hostType: 'ARM micro host', primaryServices: ['InkyPi heartbeat', 'Display updater'], status: 'critical', uptime: '2d 00h', cpu: 19, memory: 30, storage: 39, trend: 'down', heartbeat: { connected: false, lastHeartbeat: new Date(Date.now() - 1000 * 60 * 17).toISOString(), disconnectedCount: 8, wifiSignalPct: 33, einkRefreshTimeout: true, missedHeartbeat: true } },
    { id: 'rpi-4b-cam', name: 'Raspberry Pi 4B', role: 'Dog / Apartment Camera', hostType: 'ARM media node', primaryServices: ['RTSP relay', 'Motion capture'], status: 'warning', uptime: '11d 09h', cpu: 64, memory: 69, storage: 71, trend: 'up' }
  ],
  services: [
    { id: 'labdeck-ui', name: 'LabDeck Console', description: 'Tauri desktop shell for live homelab operations.', status: 'healthy', host: 'Mac Mini M4 · 24GB RAM', category: 'web', runtimeType: 'tauri', endpoint: 'tauri://localhost', uptime: '5d 7h', latencyMs: 9, lastHeartbeat: '5s ago', lastFailure: 'none in last 30d', tags: ['ops', 'ui'] },
    { id: 'ollama-gb10', name: 'Ollama API', description: 'Primary local model endpoint.', status: 'warning', host: 'Dell Pro Max GB10', category: 'ai-runtime', runtimeType: 'docker', endpoint: 'http://gb10.local:11434', uptime: '8d 14h', latencyMs: 87, lastHeartbeat: '24s ago', lastFailure: '2026-05-10 23:13 UTC · model pull timeout', activeModel: 'llama3.1:70b-instruct-q4_k_m', queueDepth: 4, tags: ['ai'] },
    { id: 'llamacpp', name: 'llama.cpp Inference', description: 'Fallback inference runtime for quantized models.', status: 'healthy', host: 'Dell Pro Max GB10', category: 'ai-runtime', runtimeType: 'bare-metal', endpoint: 'http://gb10.local:8080', uptime: '8d 14h', latencyMs: 41, lastHeartbeat: '10s ago', lastFailure: 'none in last 14d', activeModel: 'qwen2.5-coder:14b', tags: ['ai', 'fallback'] },
    { id: 'pihole', name: 'Pi-hole DNS', description: 'Network-wide DNS filtering.', status: 'healthy', host: 'Raspberry Pi Zero 2 W', category: 'network', runtimeType: 'systemd', endpoint: 'http://pihole.local/admin', uptime: '28d 03h', latencyMs: 19, lastHeartbeat: '11s ago', lastFailure: '2026-04-22 02:11 UTC · DNS restart', tags: ['dns'] },
    { id: 'camera-relay', name: 'Camera Relay', description: 'Dog/apartment camera relay and motion tagging.', status: 'warning', host: 'Raspberry Pi 4B', category: 'media', runtimeType: 'docker compose', endpoint: 'rtsp://rpi4b.local:8554/live', uptime: '11d 09h', latencyMs: 133, lastHeartbeat: '39s ago', lastFailure: '2026-05-11 08:40 UTC · stream reconnect', tags: ['media'] }
  ],
  incidents: [
    { id: 'inc-1', message: 'InkyPi heartbeat stale for 17m', status: 'critical', time: '1 min ago', source: 'ndj-inky' },
    { id: 'inc-2', message: 'GB10 scheduler queue depth > 3', status: 'warning', time: '4 min ago', source: 'ollama-gb10' },
    { id: 'inc-3', message: 'Camera relay packet loss detected', status: 'warning', time: '12 min ago', source: 'camera-relay' }
  ],
  jobs: [
    { id: 'mealops-sync', name: 'Weekly meal planning sync', domain: 'MealOps', status: 'healthy', schedule: '0 7 * * 0', lastRun: '2026-05-10 07:00', nextRun: '2026-05-17 07:00', duration: '41s', targetHost: 'Raspberry Pi 5 · 16GB RAM', lastResult: '7 meals generated', successRate: '98%', missedRunWarning: 'none' },
    { id: 'career-market-scan', name: 'Career market scan', domain: 'CareerOps', status: 'warning', schedule: '30 6 * * *', lastRun: '2026-05-12 06:30', nextRun: '2026-05-13 06:30', duration: '24s', targetHost: 'Mac Mini M4 · 24GB RAM', lastResult: 'API backoff on source 2', successRate: '92%', missedRunWarning: '1 delayed run this week' },
    { id: 'nightly-backup', name: 'NAS + config backup', domain: 'Backups', status: 'healthy', schedule: '0 2 * * *', lastRun: '2026-05-12 02:00', nextRun: '2026-05-13 02:00', duration: '5m 12s', targetHost: 'Raspberry Pi 5 · 16GB RAM', lastResult: 'completed', successRate: '99%', missedRunWarning: 'none' }
  ],
  aiProviders: [
    { id: 'sched', name: 'GB10 Scheduler', endpoint: 'http://gb10.local:11434', endpointStatus: 'live', latencyMs: 31, tokensPerSec: 79, contextWindow: '128k', vramUsage: '34 / 48 GB', queueDepth: 3, healthy: true, schedulerContention: 'moderate', memoryPressure: 'elevated' },
    { id: 'llamacpp', name: 'llama.cpp Runtime', endpoint: 'http://gb10.local:8080', endpointStatus: 'stale', latencyMs: 52, tokensPerSec: 46, contextWindow: '32k', vramUsage: '22 / 48 GB', queueDepth: 1, healthy: true, schedulerContention: 'low', memoryPressure: 'normal' }
  ],
  aiRuntimes: [
    { id: 'rt-sched', providerId: 'sched', name: 'GB10 Scheduler', healthy: true, modelResidency: 'resident' },
    { id: 'rt-llamacpp', providerId: 'llamacpp', name: 'llama.cpp', healthy: true, modelResidency: 'loading' }
  ],
  models: [
    { id: 'llama3.1:70b-instruct-q4_k_m', providerId: 'sched', name: 'llama3.1:70b-instruct-q4_k_m', contextWindow: '128k' },
    { id: 'deepseek-r1:32b', providerId: 'sched', name: 'deepseek-r1:32b', contextWindow: '64k' },
    { id: 'qwen2.5-coder:14b', providerId: 'llamacpp', name: 'qwen2.5-coder:14b', contextWindow: '32k' }
  ],
  ai: { availableHosts: ['Dell Pro Max GB10', 'Mac Mini M4 · 24GB RAM'], activeModel: 'llama3.1:70b-instruct-q4_k_m', vramUsedGb: 34, vramTotalGb: 48, queueDepth: 3, inferenceAvailable: true },
  telemetry: [
    { providerId: 'sched', modelId: 'llama3.1:70b-instruct-q4_k_m', latencyMs: 31, tokensPerSec: 79, memoryPressure: 'elevated', schedulerContention: 'moderate', providerHealth: 'healthy', modelResidency: 'resident', queueDepth: 3 },
    { providerId: 'llamacpp', modelId: 'qwen2.5-coder:14b', latencyMs: 52, tokensPerSec: 46, memoryPressure: 'normal', schedulerContention: 'low', providerHealth: 'healthy', modelResidency: 'loading', queueDepth: 1 }
  ],
  updatedAt: new Date().toISOString()
};


