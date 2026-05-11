import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData } from '../lib/api';
import type { DashboardData } from '../types/dashboard';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await fetchDashboardData();
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
