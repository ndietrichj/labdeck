import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  overallStatus: 'warning',
  updatedAt: new Date().toISOString(),
  services: [
    { id: 'portfolio', name: 'nathandjones.com / Portfolio Hub', status: 'healthy', host: 'App Server', category: 'web', uptime: '34d 10h', latencyMs: 28, lastHeartbeat: '22s ago', description: 'Primary portfolio and public landing services.' },
    { id: 'career-ops', name: 'Career Ops Local', status: 'healthy', host: 'Mac Mini', category: 'automation', uptime: '16d 01h', latencyMs: 35, lastHeartbeat: '14s ago', lastRun: '11 min ago', description: 'Local career pipeline orchestration APIs and jobs.' },
    { id: 'hermes-runtime', name: 'Hermes Runtime', status: 'healthy', host: 'App Server', category: 'automation', uptime: '21d 03h', latencyMs: 31, lastHeartbeat: '9s ago', queueDepth: 2, description: 'Runtime for internal automations and workflow execution.' },
    { id: 'openclaw', name: 'OpenClaw Gateway', status: 'warning', host: 'Mac Mini', category: 'network', uptime: '18d 20h', latencyMs: 89, lastHeartbeat: '1m ago', queueDepth: 5, description: 'Gateway for local + edge service routing.' },
    { id: 'ollama-mac', name: 'Ollama Server - Mac Mini M4', status: 'healthy', host: 'Mac Mini', category: 'ai-runtime', uptime: '7d 13h', latencyMs: 54, lastHeartbeat: '16s ago', activeModel: 'qwen2.5-coder:14b', queueDepth: 1, description: 'Low-latency local LLM runtime for coding tasks.' },
    { id: 'ollama-gb10', name: 'Ollama Server - GB10', status: 'warning', host: 'GB10', category: 'ai-runtime', uptime: '11d 08h', latencyMs: 101, lastHeartbeat: '48s ago', activeModel: 'llama3.1:70b-instruct', queueDepth: 4, description: 'High-throughput model runtime for larger inference jobs.' },
    { id: 'llama-cpp', name: 'llama.cpp Server - GB10', status: 'healthy', host: 'GB10', category: 'ai-runtime', uptime: '5d 05h', latencyMs: 67, lastHeartbeat: '25s ago', activeModel: 'deepseek-coder-v2-lite', queueDepth: 2, description: 'Optimized inference endpoint for GGUF workloads.' },
    { id: 'gb10-router', name: 'GB10 Scheduler / Model Router', status: 'healthy', host: 'GB10', category: 'ai-runtime', uptime: '9d 14h', latencyMs: 40, lastHeartbeat: '10s ago', queueDepth: 3, description: 'Model scheduling and request load distribution layer.' },
    { id: 'pihole', name: 'Pi-hole', status: 'healthy', host: 'Utility Node', category: 'network', uptime: '44d 00h', latencyMs: 19, lastHeartbeat: '6s ago', description: 'DNS filtering and ad-blocking for local network.' },
    { id: 'cloudflare', name: 'Cloudflare Tunnel', status: 'healthy', host: 'Edge Node', category: 'network', uptime: '26d 07h', latencyMs: 33, lastHeartbeat: '18s ago', description: 'Secure outbound tunnel for external access.' },
    { id: 'prometheus', name: 'Prometheus', status: 'healthy', host: 'App Server', category: 'monitoring', uptime: '52d 04h', latencyMs: 14, lastHeartbeat: '5s ago', description: 'Metrics collection and scrape target service.' },
    { id: 'immich', name: 'Immich', status: 'warning', host: 'Media Node', category: 'media', uptime: '13d 22h', latencyMs: 94, lastHeartbeat: '54s ago', description: 'Photo and media management platform.' },
    { id: 'cron', name: 'Recurring Cron Jobs', status: 'healthy', host: 'App Server', category: 'jobs', uptime: '30d 09h', latencyMs: 21, lastHeartbeat: '11s ago', lastRun: '3 min ago', description: 'System recurring job scheduler and routines.' }
  ],
  hosts: [
    { id: 'mac-mini', name: 'Mac Mini M4', role: 'Control + AI Dispatch', status: 'healthy', uptime: '41d', cpu: 36, memory: 62, storage: 58, gpu: 48 },
    { id: 'gb10', name: 'GB10 Inference', role: 'GPU Runtime Node', status: 'warning', uptime: '11d', cpu: 71, memory: 74, storage: 66, gpu: 91 },
    { id: 'app-server', name: 'App Server', role: 'Web + Automation', status: 'healthy', uptime: '52d', cpu: 44, memory: 55, storage: 49 },
    { id: 'utility-node', name: 'Utility Node', role: 'DNS + Network', status: 'healthy', uptime: '44d', cpu: 23, memory: 35, storage: 28 }
  ],
  incidents: [
    { id: '1', message: 'Ollama GB10 queue depth crossed threshold (4).', status: 'warning', time: '4 min ago' },
    { id: '2', message: 'Portfolio Hub deploy check completed.', status: 'healthy', time: '16 min ago' },
    { id: '3', message: 'Immich thumbnail worker restart detected.', status: 'warning', time: '27 min ago' },
    { id: '4', message: 'Prometheus scrape cycle stable.', status: 'healthy', time: '42 min ago' }
  ],
  automations: [
    { id: 'mealops', name: 'MealOps weekly plan', status: 'healthy', lastRun: 'Today 05:00', nextRun: 'Sun 05:00', duration: '53s', targetHost: 'App Server', lastResult: 'Plan generated and sent', logPreview: ['Loaded pantry state', 'Generated meal plan (7 days)', 'Posted summary to dashboard'] },
    { id: 'discover-market', name: 'Career Ops discover-market', status: 'warning', lastRun: 'Today 07:10', nextRun: 'Tomorrow 07:10', duration: '2m 11s', targetHost: 'Mac Mini', lastResult: 'Partial sources timeout', logPreview: ['Fetched 14 target feeds', '2 feeds timed out', 'Retried with degraded mode'] },
    { id: 'comp-intel', name: 'Competitive intelligence digest', status: 'healthy', lastRun: 'Today 06:30', nextRun: 'Tomorrow 06:30', duration: '1m 39s', targetHost: 'App Server', lastResult: 'Digest published', logPreview: ['Scored trend deltas', 'Built digest markdown', 'Saved to /reports/ci'] },
    { id: 'portfolio-health', name: 'Portfolio health check', status: 'healthy', lastRun: 'Today 08:00', nextRun: 'Tomorrow 08:00', duration: '44s', targetHost: 'App Server', lastResult: 'All checks passed', logPreview: ['Checked SSL cert age', 'Validated sitemap and robots', 'Endpoint latency in range'] },
    { id: 'immich-backup', name: 'Immich backup check', status: 'warning', lastRun: 'Today 04:20', nextRun: 'Tomorrow 04:20', duration: '3m 02s', targetHost: 'Media Node', lastResult: 'Remote target was slow', logPreview: ['Snapshot hash validated', 'Upload throughput below baseline', 'Marked for recheck in 2h'] },
    { id: 'model-warmup', name: 'model warmup cron', status: 'healthy', lastRun: '18 min ago', nextRun: 'In 42 min', duration: '27s', targetHost: 'GB10', lastResult: 'Models warmed', logPreview: ['Loaded qwen2.5-coder:14b', 'Loaded llama3.1:70b route', 'Set cache hot state=true'] }
  ],
  aiProviders: [
    { id: 'gb10-scheduler', name: 'GB10 Scheduler', models: ['llama3.1:70b-instruct', 'qwen2.5-coder:14b', 'deepseek-r1:32b'] },
    { id: 'ollama-gb10', name: 'Ollama GB10', models: ['llama3.1:70b', 'mistral-nemo:12b', 'codellama:34b'] },
    { id: 'ollama-mac', name: 'Ollama Mac Mini', models: ['qwen2.5-coder:7b', 'phi-4-mini', 'llama3.2:3b'] },
    { id: 'llama-cpp', name: 'llama.cpp GB10', models: ['deepseek-coder-v2-lite', 'qwq:32b-q4', 'mixtral:8x7b-q5'] }
  ]
};
