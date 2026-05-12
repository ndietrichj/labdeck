import { useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';
import type { ServiceCategory } from '../types/dashboard';

const navItems = ['HUD', 'Services', 'AI', 'Automation', 'Config'] as const;
type Page = (typeof navItems)[number];

export function DashboardPage() {
  const { data, meta, loading, refresh, runtimeConfig } = useDashboardData();
  const [activePage, setActivePage] = useState<Page>('HUD');
  const [serviceFilter, setServiceFilter] = useState<ServiceCategory | 'all'>('all');
  const [serviceSearch, setServiceSearch] = useState('');
  const [providerId, setProviderId] = useState('sched');
  const [model, setModel] = useState('');

  const modelsForProvider = data?.models.filter((m) => m.providerId === providerId) ?? [];

  useEffect(() => {
    if (!modelsForProvider.find((m) => m.id === model)) {
      setModel(modelsForProvider[0]?.id ?? '');
    }
  }, [model, modelsForProvider]);

  const provider = data?.aiProviders.find((p) => p.id === providerId) ?? data?.aiProviders[0];
  const telemetry =
    data?.telemetry.find((t) => t.providerId === providerId && t.modelId === model) ??
    data?.telemetry[0];

  const filteredServices = useMemo(() => {
    return (
      data?.services.filter((service) => {
        const categoryOk = serviceFilter === 'all' || service.category === serviceFilter;
        return (
          categoryOk &&
          `${service.name} ${service.host} ${service.category}`
            .toLowerCase()
            .includes(serviceSearch.toLowerCase())
        );
      }) ?? []
    );
  }, [data?.services, serviceFilter, serviceSearch]);

  if (loading && !data) {
    return <div className="loading-screen">Loading telemetry link…</div>;
  }

  if (!data) {
    return <div className="loading-screen">No dashboard data available.</div>;
  }

  return (
    <div className="hud-shell">
      <aside className="hud-sidebar hud-panel">
        <h1>LABDECK // HUD</h1>
        <nav className="hud-nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={activePage === item ? 'active' : ''}
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="hud-main">
        <header className="top-bar hud-panel">
          <h2>{activePage}</h2>
          <div className="top-meta">
            <span>
              Global <StatusBadge status={data.overallStatus} />
            </span>
            <span>Updated {new Date(meta.lastUpdated).toLocaleTimeString()}</span>
            <span>Source {meta.source}</span>
            <button className="refresh-btn" onClick={refresh}>
              {meta.refreshInFlight ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </header>

        {meta.failedEndpoints.length > 0 && (
          <section className="hud-panel">
            <p className="muted">
              Endpoint warnings: {meta.failedEndpoints.join(', ')}{' '}
              {meta.error ? `(${meta.error})` : ''}
            </p>
          </section>
        )}

        {activePage === 'HUD' && (
          <section className="hud-panel">
            <h3>Infrastructure Nodes</h3>
            <div className="host-grid">
              {data.hosts.map((host) => (
                <div className="host-card" key={host.id}>
                  <h4>{host.name}</h4>
                  <StatusBadge status={host.status} />
                  <p className="muted">{host.role}</p>
                  {host.heartbeat && (
                    <p className="muted">
                      InkyPi: {host.heartbeat.connected ? 'connected' : 'disconnected'} · missed:
                      {String(host.heartbeat.missedHeartbeat)} · wifi:
                      {host.heartbeat.wifiSignalPct}% · e-ink timeout:
                      {String(host.heartbeat.einkRefreshTimeout)} · disconnects:
                      {host.heartbeat.disconnectedCount}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === 'Services' && (
          <section className="hud-panel">
            <div className="filters">
              <input
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search services"
              />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value as ServiceCategory | 'all')}
              >
                <option value="all">all</option>
                <option value="web">web</option>
                <option value="ai-runtime">ai-runtime</option>
                <option value="automation">automation</option>
                <option value="monitoring">monitoring</option>
                <option value="network">network</option>
                <option value="media">media</option>
                <option value="jobs">jobs</option>
              </select>
            </div>

            <div className="service-rows">
              {filteredServices.map((s) => (
                <div key={s.id} className="service-row">
                  <strong>{s.name}</strong>
                  <StatusBadge status={s.status} />
                  <span>{s.lastHeartbeat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === 'AI' && (
          <section className="center-grid">
            <article className="hud-panel">
              <div className="filters">
                <select value={providerId} onChange={(e) => setProviderId(e.target.value)}>
                  {data.aiProviders.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select value={model} onChange={(e) => setModel(e.target.value)}>
                  {modelsForProvider.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="muted">Provider health: {provider?.healthy ? 'healthy' : 'degraded'}</p>
              <p className="muted">
                Runtime residency:{' '}
                {data.aiRuntimes.find((r) => r.providerId === providerId)?.modelResidency ??
                  'unknown'}
              </p>
            </article>

            <article className="hud-panel">
              <p className="muted">Latency: {telemetry?.latencyMs ?? 'n/a'}ms</p>
              <p className="muted">TPS: {telemetry?.tokensPerSec ?? 'n/a'}</p>
              <p className="muted">Memory pressure: {telemetry?.memoryPressure ?? 'unknown'}</p>
              <p className="muted">
                Scheduler contention: {telemetry?.schedulerContention ?? 'unknown'}
              </p>
            </article>
          </section>
        )}

        {activePage === 'Automation' && (
          <section className="hud-panel">
            <div className="service-rows">
              {data.jobs.map((job) => (
                <div className="service-row" key={job.id}>
                  <strong>{job.name}</strong>
                  <StatusBadge status={job.status} />
                  <span>{job.nextRun}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === 'Config' && (
          <section className="hud-panel">
            <div className="service-rows">
              <div className="service-row">
                <strong>Backend URL</strong>
                <span>{runtimeConfig.backendBaseUrl}</span>
              </div>
              <div className="service-row">
                <strong>API Mode</strong>
                <span>{runtimeConfig.mode}</span>
              </div>
              <div className="service-row">
                <strong>Refresh Interval</strong>
                <span>{runtimeConfig.refreshIntervalMs}ms</span>
              </div>
              <div className="service-row">
                <strong>Nodes</strong>
                <span>{runtimeConfig.nodeRegistry.map((n) => `${n.hostname}(${n.ip})`).join(', ')}</span>
              </div>
            </div>
          </section>
        )}
      </main>

      <aside className="hud-rail hud-panel">
        <h3>Incident Feed</h3>
        {data.incidents.map((incident) => (
          <article key={incident.id} className="incident-item">
            <div className="incident-head">
              <StatusBadge status={incident.status} />
              <span>{incident.time}</span>
            </div>
            <p>{incident.message}</p>
          </article>
        ))}
      </aside>
    </div>
  );
}