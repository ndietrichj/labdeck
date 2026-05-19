import { useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';
import '../styles/dashboard.css';

const navItems = ['HUD', 'Services', 'AI', 'Automation', 'Config'] as const;
type Page = (typeof navItems)[number];

type HomelabStatus = any;

export function DashboardPage() {
  const { data, meta, loading, refresh, runtimeConfig } = useDashboardData();
  const [activePage, setActivePage] = useState<Page>('HUD');
  const [homelab, setHomelab] = useState<HomelabStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHomelabStatus() {
      try {
        const res = await fetch(`${runtimeConfig.backendBaseUrl}/homelab/status`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (!cancelled) setHomelab(payload.data ?? payload);
      } catch {
        if (!cancelled) setHomelab(null);
      }
    }

    loadHomelabStatus();
    const id = window.setInterval(loadHomelabStatus, runtimeConfig.refreshIntervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [runtimeConfig.backendBaseUrl, runtimeConfig.refreshIntervalMs]);

  const hosts = useMemo(() => {
    if (!data) return [];

    return data.hosts.map((host) => ({
      ...host,
      displayName:
        host.name === 'Controller Node A' || host.name === 'Mac Mini M4'
          ? 'Mac Mini M4'
          : host.name === 'Inference Node B' || host.name === 'Dell Pro Max GB10'
          ? 'Dell Pro Max GB10'
          : host.name,
    }));
  }, [data]);

  const macMini = hosts.find((h) =>
    `${h.name} ${h.displayName} ${h.role}`.toLowerCase().includes('mac') ||
    `${h.name} ${h.displayName} ${h.role}`.toLowerCase().includes('controller')
  );

  const gb10 = hosts.find((h) =>
    `${h.name} ${h.displayName} ${h.role}`.toLowerCase().includes('gb10') ||
    `${h.name} ${h.displayName} ${h.role}`.toLowerCase().includes('inference') ||
    `${h.name} ${h.displayName} ${h.role}`.toLowerCase().includes('dell')
  );

  if (loading && !data) return <div className="loading-screen">Loading LabDeck telemetry...</div>;
  if (!data) return <div className="loading-screen">No telemetry available.</div>;

  const summary = homelab?.summary ?? {};
  const warnings = homelab?.warnings ?? [];
  const findings = homelab?.doctor?.findings ?? [];
  const incidents = homelab?.incidents ?? data.incidents ?? [];
  const routes = homelab?.ai?.routes ?? {};
  const routeList = Object.entries(routes);
  const routeOnline = routeList.filter(([, value]: any) => value?.ok === true).length;
  const routeTotal = routeList.length || data.aiProviders.length;
  const snapshotCount = homelab?.recovery?.snapshots ?? 0;

  const critical = Number(summary.critical ?? 0);
  const warnCount = Number(summary.warnings ?? warnings.length ?? 0);
  const incidentsOpen = Number(summary.incidents_open ?? incidents.length ?? 0);

  const diskWarning = [...warnings, ...findings].find((item: any) =>
    `${item.area} ${item.message}`.toLowerCase().includes('disk')
  );

  const agentWarning = [...warnings, ...findings].find((item: any) =>
    `${item.area} ${item.message}`.toLowerCase().includes('agent') ||
    `${item.message}`.toLowerCase().includes('hermes')
  );

  const networkWarning = [...warnings, ...findings, ...incidents].find((item: any) =>
    `${item.area} ${item.message}`.toLowerCase().includes('network') ||
    `${item.area} ${item.message}`.toLowerCase().includes('dns') ||
    `${item.area} ${item.message}`.toLowerCase().includes('inky')
  );

  const warningLights = [
    {
      label: 'CHECK ENGINE',
      value: critical > 0 ? `${critical} CRITICAL` : warnCount > 0 || incidentsOpen > 0 ? `${warnCount || incidentsOpen} WARN` : 'CLEAR',
      state: critical > 0 ? 'critical' : warnCount > 0 || incidentsOpen > 0 ? 'warn' : 'ok',
    },
    {
      label: 'AI RUNTIME',
      value: routeTotal ? `${routeOnline}/${routeTotal} ROUTES` : 'UNKNOWN',
      state: routeTotal && routeOnline === routeTotal ? 'ok' : 'warn',
    },
    {
      label: 'AGENTIC',
      value: agentWarning ? 'WARN' : 'OK',
      state: agentWarning ? 'warn' : 'ok',
    },
    {
      label: 'DISK',
      value: diskWarning ? 'PRESSURE' : 'OK',
      state: diskWarning ? 'warn' : 'ok',
    },
    {
      label: 'RECOVERY',
      value: `${snapshotCount} SNAPSHOT${snapshotCount === 1 ? '' : 'S'}`,
      state: snapshotCount > 0 ? 'ok' : 'warn',
    },
    {
      label: 'NETWORK',
      value: networkWarning ? 'WARN' : 'OK',
      state: networkWarning ? 'warn' : 'ok',
    },
  ];

  const feedItems = [...incidents, ...warnings, ...findings].slice(0, 5);

  const GaugeCard = ({ title, subtitle, cpu, ram, disk, gpu, status }: any) => {
    const rotation = -120 + ((cpu ?? 0) / 100) * 240;

    return (
      <article className="gauge-card">
        <div className="gauge-ring">
          <div className="gauge-inner">
            <div className="gauge-face-lines" />
            <div className="gauge-needle" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }} />

            <div className="gauge-center">
              <h2>{title}</h2>
              <p>{subtitle}</p>

              <div className="gauge-cpu">{cpu ?? 0}<span>%</span></div>
              <div className="gauge-label">CPU</div>

              <div className="gauge-secondary">
                <div><strong>{ram ?? 0}%</strong><span>RAM</span></div>
                <div><strong>{disk ?? 0}%</strong><span>DISK</span></div>
                {typeof gpu === 'number' && <div><strong>{gpu}%</strong><span>GPU</span></div>}
              </div>

              <div className="gauge-status"><StatusBadge status={status} /></div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="hud-shell">
      <aside className="hud-sidebar hud-panel">
        <h1>LABDECK</h1>
        <nav className="hud-nav">
          {navItems.map((item) => (
            <button key={item} className={activePage === item ? 'active' : ''} onClick={() => setActivePage(item)}>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="hud-main">
        <header className="top-bar hud-panel">
          <h2>SYSTEM OVERVIEW</h2>
          <div className="top-meta">
            <StatusBadge status={critical > 0 ? 'critical' : warnCount > 0 ? 'warning' : data.overallStatus} />
            <span>{meta.source.toUpperCase()}</span>
            <span>{new Date(meta.lastUpdated).toLocaleTimeString()}</span>
            <button className="refresh-btn" onClick={refresh}>Refresh</button>
          </div>
        </header>

        {activePage === 'HUD' && (
          <>
            <section className="speedometer-layout hud-panel">
              {macMini && <GaugeCard title="MAC MINI M4" subtitle="Controller / Agent Host" cpu={macMini.cpu} ram={macMini.memory} disk={macMini.storage} status={macMini.status} />}
              {gb10 && <GaugeCard title="DELL PRO MAX GB10" subtitle="Inference Host" cpu={gb10.cpu} ram={gb10.memory} disk={gb10.storage} gpu={gb10.gpu} status={gb10.status} />}
            </section>

            <section className="warning-light-row hud-panel">
              {warningLights.map((light) => (
                <article key={light.label} className={`warning-light ${light.state}`}>
                  <span className="warning-light-dot" />
                  <div>
                    <strong>{light.label}</strong>
                    <p>{light.value}</p>
                  </div>
                </article>
              ))}
            </section>

            <section className="runtime-strip hud-panel">
              <h3>AI RUNTIME</h3>
              <div className="runtime-grid">
                {routeList.length > 0 ? (
                  routeList.map(([name, route]: any) => (
                    <div key={name} className="runtime-pill">
                      <span className={route?.ok ? 'runtime-dot ok' : 'runtime-dot warn'} />
                      <strong>{name.replaceAll('_', ' ')}</strong>
                      <small>{route?.latency_ms ? `${route.latency_ms}ms` : 'n/a'}</small>
                    </div>
                  ))
                ) : (
                  data.aiProviders.map((provider) => (
                    <div key={provider.id} className="runtime-pill">
                      <span className={provider.healthy ? 'runtime-dot ok' : 'runtime-dot warn'} />
                      <strong>{provider.name}</strong>
                      <small>{provider.latencyMs}ms</small>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activePage !== 'HUD' && (
          <section className="hud-panel placeholder-panel">
            <h2>{activePage}</h2>
            <p>Detailed {activePage.toLowerCase()} view stays available here.</p>
          </section>
        )}
      </main>

      <aside className="hud-rail hud-panel">
        <h3>Incident Feed</h3>
        {feedItems.length === 0 ? (
          <p className="muted">No active incidents.</p>
        ) : (
          feedItems.map((item: any, index: number) => (
            <article key={`${item.message}-${index}`} className="incident-item">
              <div className="incident-head">
                <StatusBadge status={(item.severity ?? item.status ?? 'warning').toLowerCase()} />
                <span>{item.area ?? item.source ?? 'System'}</span>
              </div>
              <p>{item.message}</p>
            </article>
          ))
        )}
      </aside>
    </div>
  );
}
