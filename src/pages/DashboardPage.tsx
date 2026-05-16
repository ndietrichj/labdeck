import { useEffect, useMemo, useState } from 'react';

const displayNodeName = (name?: string) => {
  const map: Record<string, string> = {
    "Controller Node A": "Mac Mini M4",
    "Inference Node B": "Dell Pro Max GB10",
    "Services Node C": "Raspberry Pi 5",
    "InkyPi": "Raspberry Pi Zero 2 W — InkyPi"
  };
  return map[name ?? ""] ?? name ?? "Unknown host";
};

const displayNodeRole = (role?: string) => {
  const map: Record<string, string> = {
    "Mac Mini Controller": "Controller Node / Agent Host",
    "GB10 Inference": "Inference Host via Ollama + llama.cpp",
    "Pi 5 / App Runtime": "App & Test/Dev Server Host",
    "InkyPi Host / E-ink Status Display": "E-ink Display Host"
  };
  return map[role ?? ""] ?? role ?? "";
};

import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';
import type { Job, Service, ServiceCategory } from '../types/dashboard';
import AgentConsole from "../components/AgentConsole";

const navItems = ['HUD', 'Services', 'AI', 'Automation', 'Config'] as const;
type Page = (typeof navItems)[number];
const actionPills = ['Ping', 'Health Check', 'Restart', 'Start', 'Stop', 'Kill', 'Logs'];

export function DashboardPage() {
  const { data, meta, loading, refresh, runtimeConfig } = useDashboardData();
  const [activePage, setActivePage] = useState<Page>('HUD');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [serviceFilter, setServiceFilter] = useState<ServiceCategory | 'all'>('all');
  const [serviceSearch, setServiceSearch] = useState('');
  const [providerId, setProviderId] = useState('sched');
  const [model, setModel] = useState('');
  const [acknowledgedIncidentIds, setAcknowledgedIncidentIds] = useState<string[]>([]);

  const acknowledgeIncident = (id: string) => {
    setAcknowledgedIncidentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const modelsForProvider = data?.models.filter((m) => m.providerId === providerId) ?? [];
  useEffect(() => { if (!modelsForProvider.find((m) => m.id === model)) setModel(modelsForProvider[0]?.id ?? ''); }, [model, modelsForProvider]);
  const provider = data?.aiProviders.find((p) => p.id === providerId) ?? data?.aiProviders[0];
  const telemetry = data?.telemetry.find((t) => t.providerId === providerId && t.modelId === model) ?? data?.telemetry[0];
  const filteredServices = useMemo(() => (data?.services.filter((service) => (serviceFilter === 'all' || service.category === serviceFilter) && `${service.name} ${service.host} ${service.category}`.toLowerCase().includes(serviceSearch.toLowerCase())) ?? []), [data?.services, serviceFilter, serviceSearch]);
  const groupedJobs = useMemo(() => data?.jobs.reduce<Record<string, Job[]>>((acc, job) => { acc[(job.domain ?? 'Misc')] = [...(acc[job.domain ?? 'Misc'] ?? []), job]; return acc; }, {}) ?? {}, [data?.jobs]);

  if (loading && !data) return <div className="loading-screen">Loading telemetry link…</div>;
  if (!data) return <div className="loading-screen">No dashboard data available.</div>;

  return <div className="hud-shell"><aside className="hud-sidebar hud-panel"><h1>LABDECK</h1><nav className="hud-nav">{navItems.map((item) => <button key={item} className={activePage === item ? 'active' : ''} onClick={() => setActivePage(item)}>{item}</button>)}</nav></aside><main className="hud-main"><header className="top-bar hud-panel"><h2>{activePage}</h2><div className="top-meta"><span><StatusBadge status={data.overallStatus} /></span><span>{meta.source.toUpperCase()}</span><span>{new Date(meta.lastUpdated).toLocaleTimeString()}</span><button className="refresh-btn" onClick={refresh}>{meta.refreshInFlight ? 'Refreshing…' : 'Refresh'}</button></div></header>{activePage === 'HUD' && <section className="hud-panel"><h3>Infrastructure Nodes</h3><div className="host-grid">{data.hosts.map((host) => <article className="host-card" key={host.id}><div className="row"><strong>{displayNodeName(host.name)}</strong><StatusBadge status={host.status} /></div><p>{displayNodeRole(host.role)}</p><p className="muted">{host.hostType}</p><p className="muted">Services: {(host.primaryServices ?? []).join(' · ') || 'none'}</p><p className="muted">Heartbeat: {host.heartbeat?.lastHeartbeat ? new Date(host.heartbeat.lastHeartbeat).toLocaleTimeString() : host.uptime}</p><div className="metrics"><span>CPU {host.cpu ?? 'n/a'}%</span><span>RAM {host.memory ?? 'n/a'}%</span><span>Disk {host.storage ?? 'n/a'}%</span><span>GPU {host.gpu ?? 'n/a'}%</span></div>{host.heartbeat?.missedHeartbeat && <p className="warning-text">InkyPi stale: disconnected {host.heartbeat.disconnectedCount}x · Wi-Fi {host.heartbeat.wifiSignalPct}% · e-ink timeout {String(host.heartbeat.einkRefreshTimeout)}</p>}</article>)}</div></section>}
{activePage === 'Services' && <section className="hud-panel"><div className="filters"><input value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} placeholder="Search services" /><select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value as ServiceCategory | 'all')}><option value="all">all</option><option value="web">web</option><option value="ai-runtime">ai-runtime</option><option value="automation">automation</option><option value="monitoring">monitoring</option><option value="network">network</option><option value="media">media</option><option value="jobs">jobs</option></select></div><div className="service-table">{filteredServices.map((s) => <button key={s.id} className="service-row" onClick={() => setSelectedService(s)}><strong>{s.name}</strong><span>{s.host}</span><span>{s.runtimeType}</span><StatusBadge status={s.status} /><span>{s.endpoint ?? 'n/a'}</span><span>{s.uptime}</span><span>{s.lastHeartbeat}</span><span>{s.lastFailure}</span><span>{s.category}</span><span>{s.activeModel ?? '-'}</span></button>)}</div>{selectedService && <aside className="detail-panel"><h4>{selectedService.name}</h4><p>{selectedService.description}</p><p className="muted">Host: {selectedService.host} · Runtime: {selectedService.runtimeType}</p><p className="muted">Last failure/outage: {selectedService.lastFailure}</p><p className="muted">Recent log tail: [placeholder] service heartbeat + rolling output</p><div className="pill-row">{actionPills.map((pill) => <button key={pill}>{pill}</button>)}</div></aside>}</section>}
{activePage === 'AI' && <section className="ai-layout"><article className="hud-panel chat-workspace"><div className="filters"><select value={providerId} onChange={(e) => setProviderId(e.target.value)}>{data.aiProviders.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select><select value={model} onChange={(e) => setModel(e.target.value)}>{modelsForProvider.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div><div className="chat-panel"><AgentConsole backendUrl={runtimeConfig.backendBaseUrl} providerId={providerId} model={model} /></div></article><article className="hud-panel"><h4>Telemetry</h4><p className="muted">Latency: {telemetry?.latencyMs}ms</p><p className="muted">Tokens/sec: {telemetry?.tokensPerSec}</p><p className="muted">Memory pressure: {telemetry?.memoryPressure}</p><p className="muted">Scheduler contention: {telemetry?.schedulerContention}</p><p className="muted">Queue depth: {telemetry?.queueDepth}</p><p className="muted">Provider health: {telemetry?.providerHealth}</p><p className="muted">Model residency: {telemetry?.modelResidency}</p></article></section>}
{activePage === 'Automation' && <section className="hud-panel"><div className="automation-grid">{Object.entries(groupedJobs).map(([domain, jobs]) => <div key={domain} className="domain-group"><h4>{domain}</h4>{jobs.map((job) => <button key={job.id} className="service-row" onClick={() => setSelectedJob(job)}><strong>{job.name}</strong><StatusBadge status={job.status} /><span>{job.schedule}</span><span>{job.nextRun}</span><span>{job.lastRun}</span><span>{job.duration}</span><span>{job.lastResult}</span><span>{job.successRate}</span><span>{job.missedRunWarning}</span><span>{job.targetHost}</span></button>)}</div>)}</div>{selectedJob && <aside className="detail-panel"><h4>{selectedJob.name}</h4><p className="muted">Recent runs: [placeholder list]</p><p className="muted">Log tail: [placeholder tail -50]</p><p className="muted">Last failure/outage: [placeholder]</p><p className="muted">Notes/Owner: [placeholder]</p><div className="pill-row"><button>Run Now</button><button>Pause</button><button>Logs</button><button>History</button></div></aside>}</section>}
{activePage === 'Config' && <section className="hud-panel compact"><p>Runtime mode: {runtimeConfig.mode}</p><p>Backend URL: {runtimeConfig.backendBaseUrl}</p><p>Refresh interval: {runtimeConfig.refreshIntervalMs}ms</p><p>Endpoint registry: {Object.entries(runtimeConfig.providers).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p><p>Node registry: {runtimeConfig.nodeRegistry.map((n) => `${n.hostname}(${n.ip})`).join(', ')}</p><p className="muted">Live = backend reachable. Mock = fallback data. Stale = endpoint lagging telemetry window.</p></section>}
</main><aside className="hud-rail hud-panel"><h3>Incident Feed</h3>{data.incidents.map((incident) => <article key={incident.id} className={`incident-item ${acknowledgedIncidentIds.includes(incident.id) ? 'acknowledged' : ''}`}><div className="incident-head"><StatusBadge status={incident.status} /><span>{incident.time}</span><button className="acknowledge-btn" onClick={() => acknowledgeIncident(incident.id)}>✓</button></div><p>{incident.message}</p></article>)}</aside></div>;
}
