import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  overallStatus: 'warning',
  activeAlerts: 2,
  hosts: [
    { id: 'mac-mini', name: 'Mac Mini Controller', role: 'Controller Node', status: 'healthy', uptime: '18d 04h', cpu: 31, memory: 58, storage: 47, trend: 'stable' },
    { id: 'gb10', name: 'GB10 Inference Server', role: 'GPU Inference', status: 'warning', uptime: '9d 21h', cpu: 67, memory: 71, storage: 63, gpu: 92, trend: 'up' },
    { id: 'pi5', name: 'Pi 5 App Server', role: 'App Services', status: 'healthy', uptime: '27d 02h', cpu: 42, memory: 49, storage: 54, trend: 'stable' },
    { id: 'pi-hole', name: 'Pi-hole Node', role: 'DNS Utility', status: 'warning', uptime: '12d 13h', cpu: 28, memory: 40, storage: 33, trend: 'down' },
    { id: 'gaming-pc', name: 'Gaming PC', role: 'Windows Workload', status: 'healthy', uptime: '3d 15h', cpu: 23, memory: 46, storage: 68, gpu: 35, trend: 'stable' }
  ],
  services: [
    { id: 'openclaw', name: 'OpenClaw Gateway', status: 'healthy', host: 'Mac Mini', uptime: '18d', latencyMs: 18, tags: ['gateway', 'api'] },
    { id: 'hermes', name: 'Hermes Gateway', status: 'healthy', host: 'Pi 5', uptime: '11d', latencyMs: 26, tags: ['automation', 'scheduler'] },
    { id: 'prometheus', name: 'Prometheus', status: 'healthy', host: 'Pi 5', uptime: '27d', latencyMs: 12, tags: ['metrics', 'monitoring'] },
    { id: 'immich', name: 'Immich', status: 'healthy', host: 'GB10', uptime: '8d', latencyMs: 41, tags: ['storage', 'media'] },
    { id: 'pihole-service', name: 'Pi-hole', status: 'warning', host: 'Pi-hole Node', uptime: '12d', latencyMs: 121, tags: ['dns', 'security'] },
    { id: 'portfolio', name: 'Portfolio Hub', status: 'healthy', host: 'Pi 5', uptime: '16d', latencyMs: 37, tags: ['web', 'infra'] },
    { id: 'ollama-mac', name: 'Ollama Mac', status: 'healthy', host: 'Mac Mini', uptime: '7d', latencyMs: 63, tags: ['ai', 'models'] },
    { id: 'ollama-gb10', name: 'Ollama GB10', status: 'warning', host: 'GB10', uptime: '9d', latencyMs: 87, tags: ['ai', 'inference'] },
    { id: 'cloudflare', name: 'Cloudflare Tunnel', status: 'healthy', host: 'Pi Zero', uptime: '20d', latencyMs: 29, tags: ['network', 'edge'] }
  ],
  incidents: [
    { id: 'inc-1', message: 'GB10 GPU utilization exceeded 90%', status: 'warning', time: '2 min ago' },
    { id: 'inc-2', message: 'Pi-hole latency spike detected', status: 'warning', time: '11 min ago' },
    { id: 'inc-3', message: 'Hermes cron execution completed', status: 'healthy', time: '24 min ago' },
    { id: 'inc-4', message: 'Immich backup completed', status: 'healthy', time: '46 min ago' }
  ],
  ai: {
    availableHosts: ['GB10 Inference Server', 'Mac Mini Controller'],
    activeModel: 'llama3.1:70b-instruct-q4_k_m',
    vramUsedGb: 32,
    vramTotalGb: 48,
    queueDepth: 3,
    inferenceAvailable: true
  },
  updatedAt: new Date().toISOString()
};
