// Mock data for LabDeck - can be replaced with real API calls later
import type { DashboardData, ServiceCategory, Status, ModelInfo } from '../types';

const modelInfo = (id: string, name: string, contextWindow: string, vram: number, tags: string[]): ModelInfo => ({
  id, name, contextWindow, vramRequiredGb: vram, isOnline: true, tags
});

export const mockDashboardData: DashboardData = {
  overallStatus: 'warning',
  activeAlerts: 3,
  nodes: [
    { id: 'node-1', name: 'Controller Node A', role: 'Mac Mini Controller', status: 'healthy', uptime: '18d 04h', cpu: 31, memory: 58, storage: 47, gpu: undefined, network: { rx: 1024, tx: 512 }, reservedIp: '10.0.0.10', userId: 'ndj', disconnectedCount: 0, lastDisconnect: 'N/A' },
    { id: 'node-2', name: 'Inference Node B', role: 'GB10 Inference', status: 'warning', uptime: '9d 21h', cpu: 67, memory: 71, storage: 63, gpu: 92, network: { rx: 2048, tx: 1024 }, reservedIp: '10.0.0.105', userId: 'ndj', disconnectedCount: 2, lastDisconnect: '4h ago', wifiSignalStrength: -72 },
    { id: 'node-3', name: 'Services Node C', role: 'App Runtime', status: 'healthy', uptime: '27d 02h', cpu: 42, memory: 49, storage: 54, gpu: undefined, network: { rx: 512, tx: 256 }, reservedIp: '10.0.0.110', userId: 'ndj', disconnectedCount: 0, lastDisconnect: 'N/A' },
    { id: 'node-4', name: 'ndj-inky', role: 'InkyPi Host / Display', status: 'warning', uptime: '3d 16h', cpu: 15, memory: 32, storage: 28, gpu: undefined, network: { rx: 128, tx: 64 }, reservedIp: '10.0.0.175', userId: 'ndj-pi', disconnectedCount: 12, lastDisconnect: '45m ago', wifiSignalStrength: -85, lastHeartbeat: '2m ago', healthInterval: 30 }
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
    { id: 'cron', name: 'recurring cron jobs', status: 'healthy', host: 'Controller Node A', category: 'jobs', uptime: '30d', latencyMs: 8, lastHeartbeat: '2s ago', queueDepth: 2, tags: ['jobs'] },
    { id: 'inky-display', name: 'InkyPi Display Service', status: 'warning', host: 'ndj-inky', category: 'monitoring', uptime: '3d', latencyMs: 156, lastHeartbeat: '90s ago', tags: ['display', 'pi'] }
  ],
  incidents: [
    { id: 'inc-1', code: 'GPU-90', message: 'GB10 GPU utilization exceeded 90%', status: 'warning', time: '2 min ago', severity: 2, source: 'Inference Node B' },
    { id: 'inc-2', code: 'NET-SPIKE', message: 'Pi-hole latency spike detected', status: 'warning', time: '11 min ago', severity: 2, source: 'Services Node C' },
    { id: 'inc-3', code: 'FAILOVER', message: 'Model router failover completed', status: 'healthy', time: '24 min ago', severity: 1, source: 'Inference Node B' },
    { id: 'inc-4', code: 'BACKUP', message: 'Immich backup completed', status: 'healthy', time: '46 min ago', severity: 1, source: 'Services Node C' },
    { id: 'inc-5', code: 'INKY-DISCONNECT', message: 'ndj-inky heartbeat missed - intermittent connectivity', status: 'warning', time: '45m ago', severity: 3, source: 'ndj-inky' },
    { id: 'inc-6', code: 'INKY-REFRESH', message: 'InkyPi display refresh timeout', status: 'warning', time: '1h ago', severity: 2, source: 'ndj-inky' },
    { id: 'inc-7', code: 'GB10-THERMAL', message: 'GB10 GPU thermal warning - cooling threshold exceeded', status: 'warning', time: '3h ago', severity: 2, source: 'Inference Node B' },
    { id: 'inc-8', code: 'MODEL-EVICTION', message: 'Ollama model eviction - low VRAM pressure', status: 'warning', time: '5h ago', severity: 2, source: 'Inference Node B' }
  ],
  workflows: [
    { id: 'mealops', name: 'MealOps weekly plan', status: 'healthy', lastRun: '2026-05-10 07:00', nextRun: '2026-05-17 07:00', duration: '34s', targetHost: 'Controller Node A', lastResult: '7 meals generated', config: { schedule: 'weekly', trigger: 'cron' } },
    { id: 'career-discover', name: 'Career Ops discover-market', status: 'healthy', lastRun: '2026-05-11 06:30', nextRun: '2026-05-12 06:30', duration: '19s', targetHost: 'Services Node C', lastResult: '12 leads ingested', config: { schedule: 'daily', trigger: 'cron' } },
    { id: 'intel', name: 'Competitive intelligence digest', status: 'healthy', lastRun: '2026-05-11 05:10', nextRun: '2026-05-12 05:10', duration: '52s', targetHost: 'Services Node C', lastResult: '2 sources timed out', config: { schedule: 'daily', trigger: 'cron' } },
    { id: 'portfolio-health', name: 'Portfolio health check', status: 'healthy', lastRun: '2026-05-11 08:10', nextRun: '2026-05-11 12:10', duration: '12s', targetHost: 'Services Node C', lastResult: 'all checks passed', config: { schedule: 'hourly', trigger: 'cron' } },
    { id: 'immich-backup', name: 'Immich backup check', status: 'healthy', lastRun: '2026-05-11 03:00', nextRun: '2026-05-12 03:00', duration: '45s', targetHost: 'Services Node C', lastResult: 'snapshot OK', config: { schedule: 'daily', trigger: 'cron' } },
    { id: 'warmup', name: 'model warmup cron', status: 'healthy', lastRun: '2026-05-11 09:00', nextRun: '2026-05-11 13:00', duration: '65s', targetHost: 'Inference Node B', lastResult: 'one model cold-started', config: { schedule: '4h', trigger: 'cron' } },
    { id: 'other', name: 'other cron jobs', status: 'healthy', lastRun: '2026-05-11 08:45', nextRun: '2026-05-11 09:45', duration: '9s', targetHost: 'Controller Node A', lastResult: '5/5 succeeded', config: { schedule: 'hourly', trigger: 'cron' } }
  ],
  aiProviders: [
    { 
      id: 'sched', 
      name: 'GB10 Scheduler', 
      type: 'ollama', 
      endpoint: 'http://localhost:11434', 
      latencyMs: 28, 
      uptime: '18d', 
      status: 'healthy', 
      models: ['qwen3-coder-next', 'deepseek-coder-v2', 'glm-4.7-flash'],
      availableModels: [
        modelInfo('qwen3-coder-next', 'qwen3-coder-next', '128k', 64, ['coder', 'general']),
        modelInfo('deepseek-coder-v2', 'deepseek-coder-v2', '128k', 48, [' coder', 'specialized']),
        modelInfo('glm-4.7-flash', 'glm-4.7-flash', '128k', 32, ['general', 'fast'])
      ]
    },
    { 
      id: 'ollama-gb10', 
      name: 'Ollama GB10', 
      type: 'ollama', 
      endpoint: 'http://localhost:11435', 
      latencyMs: 84, 
      uptime: '9d', 
      status: 'warning', 
      models: ['qwen2.5-coder:32b', 'qwen3:35b', 'gemma4:31b'],
      availableModels: [
        modelInfo('qwen2.5-coder:32b', 'qwen2.5-coder:32b', '128k', 48, ['coder', 'specialized']),
        modelInfo('qwen3:35b', 'qwen3:35b', '128k', 56, ['general', 'chat']),
        modelInfo('gemma4:31b', 'gemma4:31b', '128k', 40, ['chat', 'general'])
      ]
    },
    { 
      id: 'ollama-mac', 
      name: 'Ollama Mac Mini', 
      type: 'ollama', 
      endpoint: 'http://localhost:11434', 
      latencyMs: 61, 
      uptime: '7d', 
      status: 'healthy', 
      models: ['llama3.1:8b', 'qwen2.5:7b'],
      availableModels: [
        modelInfo('llama3.1:8b', 'llama3.1:8b', '8k', 8, ['chat', 'lightweight']),
        modelInfo('qwen2.5:7b', 'qwen2.5:7b', '32k', 12, ['general', 'lightweight'])
      ]
    },
    { 
      id: 'llama-cpp', 
      name: 'llama.cpp GB10', 
      type: 'llama-cpp', 
      endpoint: 'http://localhost:8080', 
      latencyMs: 72, 
      uptime: '6d', 
      status: 'healthy', 
      models: ['mistral-instruct-q4', 'codellama-q5'],
      availableModels: [
        modelInfo('mistral-instruct-q4', 'mistral-instruct-q4', '8k', 6, ['instruct', 'quantized']),
        modelInfo('codellama-q5', 'codellama-q5', '16k', 10, ['coder', 'quantized'])
      ]
    }
  ],
  ai: {
    runtime: {
      id: 'gb10-runtime',
      provider: 'ollama',
      name: 'GB10 Inference Runtime',
      endpoint: 'http://localhost:11434',
      isAvailable: true,
      models: [
        { id: 'llama3.1:70b', name: 'llama3.1:70b', provider: 'ollama', contextWindow: '128k', vramRequiredGb: 48, isOnline: true, tags: ['inference', 'general'] },
        { id: 'qwen2.5-coder:14b', name: 'qwen2.5-coder:14b', provider: 'ollama', contextWindow: '128k', vramRequiredGb: 28, isOnline: true, tags: ['inference', 'coder'] }
      ],
      currentModel: 'llama3.1:70b'
    },
    vramUsedGb: 32,
    vramTotalGb: 48,
    queueDepth: 3,
    tokensPerSec: 82,
    contextWindow: '128k',
    activeSessions: 2,
    lastQueryTime: new Date().toISOString()
  },
  alertSystem: {
    activeIncidents: 3,
    criticalCount: 0,
    warningCount: 5,
    healthyCount: 8,
    lastAlert: '45m ago'
  },
  updatedAt: new Date().toISOString()
};
