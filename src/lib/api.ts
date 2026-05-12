import { mockDashboardData } from '../data/mockDashboardData';
import type { DashboardData, LoadMeta, RuntimeConfig } from '../types/dashboard';

export const runtimeConfig: RuntimeConfig = {
  backendBaseUrl: import.meta.env.VITE_BACKEND_BASE_URL ?? 'http://localhost:8787/api',
  mode: (import.meta.env.VITE_DATA_MODE === 'live' ? 'live' : 'mock'),
  refreshIntervalMs: Number(import.meta.env.VITE_REFRESH_INTERVAL_MS ?? 10000),
  providers: {
    ollama: import.meta.env.VITE_OLLAMA_URL ?? 'http://localhost:11434',
    gb10Scheduler: import.meta.env.VITE_GB10_SCHED_URL ?? 'http://10.0.0.10:8000',
    llamacpp: import.meta.env.VITE_LLAMACPP_URL ?? 'http://10.0.0.10:8080',
    prometheus: import.meta.env.VITE_PROM_URL ?? 'http://localhost:9090',
    pihole: import.meta.env.VITE_PIHOLE_URL ?? 'http://pi.hole/admin/api.php',
  },
  nodeRegistry: [{ id: 'ndj-inky', hostname: 'ndj-inky', ip: '10.0.0.175', user: 'ndj-pi', unstable: true }],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<{ data: T; meta: LoadMeta }> {
  if (runtimeConfig.mode === 'mock') {
    await delay(180);
    return { data: fallback, meta: { source: 'mock', lastUpdated: new Date().toISOString(), stale: false, failedEndpoints: [], refreshInFlight: false } };
  }

  try {
    const r = await fetch(`${runtimeConfig.backendBaseUrl}${endpoint}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return { data: (await r.json()) as T, meta: { source: 'live', lastUpdated: new Date().toISOString(), stale: false, failedEndpoints: [], refreshInFlight: false } };
  } catch (e) {
    return { data: fallback, meta: { source: 'stale', lastUpdated: new Date().toISOString(), stale: true, failedEndpoints: [endpoint], refreshInFlight: false, error: e instanceof Error ? e.message : 'unknown error' } };
  }
}

export async function fetchDashboardData() {
  return fetchWithFallback<DashboardData>('/dashboard', { ...mockDashboardData, updatedAt: new Date().toISOString() });
}
