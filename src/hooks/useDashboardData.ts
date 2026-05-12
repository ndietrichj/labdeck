import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData, runtimeConfig } from '../lib/api';
import type { DashboardData, LoadMeta } from '../types/dashboard';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [meta, setMeta] = useState<LoadMeta>({ source: 'mock', stale: false, failedEndpoints: [], lastUpdated: new Date().toISOString(), refreshInFlight: false });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setMeta((m) => ({ ...m, refreshInFlight: true }));
    const result = await fetchDashboardData();
    setData(result.data);
    setMeta(result.meta);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, runtimeConfig.refreshIntervalMs);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { data, meta, loading, refresh, runtimeConfig };
}
