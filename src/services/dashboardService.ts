import { fetchDashboardData } from '../lib/api';

export const getServices = async () => (await fetchDashboardData()).data.services;
export const getNodes = async () => (await fetchDashboardData()).data.hosts;
export const getIncidents = async () => (await fetchDashboardData()).data.incidents;
export const getWorkflows = async () => (await fetchDashboardData()).data.jobs;
export const getAiRuntimes = async () => (await fetchDashboardData()).data.aiRuntimes;
export const getModels = async () => (await fetchDashboardData()).data.models;
export const getTelemetry = async () => (await fetchDashboardData()).data.telemetry;
