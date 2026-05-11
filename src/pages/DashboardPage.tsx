import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';

const navItems = ['HUD', 'Services', 'AI', 'Incidents', 'Config'];

function Meter({ label, value }: { label: string; value?: number }) {
  const safeValue = value ?? 0;
  return (
    <div className="hud-meter">
      <div className="hud-meter-head"><span>{label}</span><span>{value === undefined ? 'n/a' : `${safeValue}%`}</span></div>
      <div className="hud-meter-track"><i style={{ width: `${Math.min(safeValue, 100)}%` }} /></div>
    </div>
  );
}

export function DashboardPage() {
  const { data, loading, refresh } = useDashboardData();

  if (loading && !data) return <div className="loading-screen">Loading telemetry link…</div>;
  if (!data) return <div className="loading-screen">No dashboard data available.</div>;

  const onlineHosts = data.hosts.filter((host) => host.status !== 'critical').length;
  const totalVramPct = Math.round((data.ai.vramUsedGb / data.ai.vramTotalGb) * 100);

  return (
    <div className="hud-shell">
      <aside className="hud-sidebar hud-panel">
        <div>
          <p className="eyebrow">LabDeck Node</p>
          <h1>LABDECK // HUD</h1>
          <p className="muted">ENV: HOMELAB-PRIME · SECOPS VIEW</p>
        </div>
        <nav className="hud-nav">
          {navItems.map((item, index) => (
            <button key={item} className={index === 0 ? 'active' : ''}>{item}</button>
          ))}
        </nav>
        <div className="hud-sidebar-summary">
          <p>SENSORS ONLINE <strong>{onlineHosts}/{data.hosts.length}</strong></p>
          <p>ALERT CHANNELS <strong>{data.activeAlerts}</strong></p>
          <p>AI HOSTS <strong>{data.ai.availableHosts.length}</strong></p>
        </div>
      </aside>

      <main className="hud-main">
        <header className="top-bar hud-panel">
          <div>
            <p className="eyebrow">Current Section</p>
            <h2>Command Dashboard</h2>
          </div>
          <div className="top-meta">
            <span>Global <StatusBadge status={data.overallStatus} /></span>
            <span>Last Updated {new Date(data.updatedAt).toLocaleTimeString()}</span>
            <span>API MODE <strong>MOCK</strong></span>
            <button className="refresh-btn" onClick={refresh}>Refresh</button>
          </div>
        </header>

        <section className="overview-strip">
          <article className="hud-panel stat"><p>Active Alerts</p><strong>{data.activeAlerts}</strong></article>
          <article className="hud-panel stat"><p>Hosts Online</p><strong>{onlineHosts}/{data.hosts.length}</strong></article>
          <article className="hud-panel stat"><p>Services</p><strong>{data.services.length}</strong></article>
          <article className="hud-panel stat"><p>Queue Depth</p><strong>{data.ai.queueDepth}</strong></article>
        </section>

        <section className="center-grid">
          <article className="hud-panel ai-core">
            <h3>AI Core</h3>
            <div className="radar-wrap">
              <div className="radar-ring"><div className="radar-ring inner" /><div className="pulse-dot" /></div>
              <div className="ai-readout">
                <p>MODEL</p><strong>{data.ai.activeModel}</strong>
                <p>VRAM</p><strong>{data.ai.vramUsedGb} / {data.ai.vramTotalGb} GB ({totalVramPct}%)</strong>
                <p>QUEUE</p><strong>{data.ai.queueDepth}</strong>
                <p>HOST STATUS</p><strong>{data.ai.inferenceAvailable ? 'READY' : 'OFFLINE'}</strong>
              </div>
            </div>
          </article>

          <article className="hud-panel">
            <h3>Host Modules</h3>
            <div className="host-grid">
              {data.hosts.map((host) => (
                <div className="host-card" key={host.id}>
                  <div className="host-top"><h4>{host.name}</h4><StatusBadge status={host.status} /></div>
                  <p className="muted">{host.role} · uptime {host.uptime}</p>
                  <Meter label="CPU" value={host.cpu} />
                  <Meter label="Memory" value={host.memory} />
                  <Meter label="Storage" value={host.storage} />
                  <Meter label="GPU" value={host.gpu} />
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="hud-panel">
          <h3>Service Telemetry</h3>
          <div className="service-rows">
            {data.services.map((service) => (
              <div key={service.id} className="service-row">
                <strong>{service.name}</strong>
                <StatusBadge status={service.status} />
                <span>{service.host}</span>
                <span>{service.uptime}</span>
                <span>{service.latencyMs}ms</span>
                <small>{service.tags.join(' · ')}</small>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="hud-rail hud-panel">
        <h3>Incident / Event Feed</h3>
        {data.incidents.map((incident) => (
          <article key={incident.id} className="incident-item">
            <div className="incident-head"><StatusBadge status={incident.status} /><span>{incident.time}</span></div>
            <p>{incident.message}</p>
          </article>
        ))}
      </aside>
    </div>
  );
}
