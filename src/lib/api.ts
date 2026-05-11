import { mockDashboardData } from '../data/mockDashboardData';
import type { DashboardData } from '../types/dashboard';

const MOCK_MODE = true;
const BACKEND_BASE_URL = 'http://10.0.0.220:8787/api';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboardData(): Promise<DashboardData> {
  if (MOCK_MODE) {
    await delay(450);
    return { ...mockDashboardData, updatedAt: new Date().toISOString() };
  }

  const response = await fetch(`${BACKEND_BASE_URL}/dashboard`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  return response.json() as Promise<DashboardData>;
}
