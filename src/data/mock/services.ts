export type ServiceCategory = 'web' | 'ai-runtime' | 'automation' | 'monitoring' | 'network' | 'media' | 'jobs';

export interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  host: string;
  category: ServiceCategory;
  uptime: string;
  latencyMs: number;
  lastHeartbeat: string;
  activeModel?: string;
  queueDepth?: number;
  tags: string[];
}

export const mockServices: Service[] = [
  {
    id: 'portfolio',
    name: 'Portfolio Hub / nathandjones.com',
    status: 'healthy',
    host: 'Services Node C',
    category: 'web',
    uptime: '16d',
    latencyMs: 37,
    lastHeartbeat: '18s ago',
    tags: ['web', 'public']
  },
  {
    id: 'career-ops',
    name: 'Career Ops Local',
    status: 'healthy',
    host: 'Services Node C',
    category: 'automation',
    uptime: '12d',
    latencyMs: 22,
    lastHeartbeat: '12s ago',
    tags: ['ops']
  },
  {
    id: 'hermes',
    name: 'Hermes Runtime',
    status: 'healthy',
    host: 'Services Node C',
    category: 'automation',
    uptime: '11d',
    latencyMs: 26,
    lastHeartbeat: '9s ago',
    tags: ['scheduler']
  },
  {
    id: 'openclaw',
    name: 'OpenClaw Gateway',
    status: 'healthy',
    host: 'Controller Node A',
    category: 'network',
    uptime: '18d',
    latencyMs: 18,
    lastHeartbeat: '6s ago',
    tags: ['gateway']
  },
  {
    id: 'ollama-m4',
    name: 'Ollama Server - Mac Mini M4',
    status: 'healthy',
    host: 'Controller Node A',
    category: 'ai-runtime',
    uptime: '7d',
    latencyMs: 63,
    lastHeartbeat: '11s ago',
    activeModel: 'qwen2.5-coder:14b',
    queueDepth: 1,
    tags: ['ai']
  },
  {
    id: 'ollama-gb10',
    name: 'Ollama Server - GB10',
    status: 'warning',
    host: 'Inference Node B',
    category: 'ai-runtime',
    uptime: '9d',
    latencyMs: 87,
    lastHeartbeat: '27s ago',
    activeModel: 'llama3.1:70b',
    queueDepth: 4,
    tags: ['ai']
  },
  {
    id: 'llamacpp',
    name: 'llama.cpp Server - GB10',
    status: 'healthy',
    host: 'Inference Node B',
    category: 'ai-runtime',
    uptime: '6d',
    latencyMs: 73,
    lastHeartbeat: '14s ago',
    activeModel: 'deepseek-coder-v2',
    queueDepth: 2,
    tags: ['ai']
  },
  {
    id: 'router',
    name: 'GB10 Scheduler / Model Router',
    status: 'healthy',
    host: 'Inference Node B',
    category: 'ai-runtime',
    uptime: '5d',
    latencyMs: 29,
    lastHeartbeat: '8s ago',
    queueDepth: 3,
    tags: ['routing']
  },
  {
    id: 'pihole',
    name: 'Pi-hole',
    status: 'warning',
    host: 'Services Node C',
    category: 'network',
    uptime: '12d',
    latencyMs: 121,
    lastHeartbeat: '43s ago',
    tags: ['dns']
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Tunnel',
    status: 'healthy',
    host: 'Services Node C',
    category: 'network',
    uptime: '20d',
    latencyMs: 29,
    lastHeartbeat: '5s ago',
    tags: ['edge']
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    status: 'healthy',
    host: 'Services Node C',
    category: 'monitoring',
    uptime: '27d',
    latencyMs: 12,
    lastHeartbeat: '4s ago',
    tags: ['metrics']
  },
  {
    id: 'immich',
    name: 'Immich',
    status: 'healthy',
    host: 'Services Node C',
    category: 'media',
    uptime: '8d',
    latencyMs: 41,
    lastHeartbeat: '16s ago',
    tags: ['photos']
  },
  {
    id: 'cron',
    name: 'recurring cron jobs',
    status: 'healthy',
    host: 'Controller Node A',
    category: 'jobs',
    uptime: '30d',
    latencyMs: 8,
    lastHeartbeat: '2s ago',
    queueDepth: 2,
    tags: ['jobs']
  }
];
