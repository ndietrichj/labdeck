import { MetricCard } from '../components/MetricCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';

export function DashboardPage() {
  const { data, loading, refresh } = useDashboardData();

  if (loading && !data) {
    return <div className="panel">Loading operations telemetry…</div>;
  }

  if (!data) {
    return <div className="panel">No dashboard data available.</div>;
  }

  const onlineHosts = data.hosts.filter((host) => host.status !== 'critical').length;

  return (
    <div className="dashboard-grid">
      <section className="panel overview">
        <SectionHeader
          title="Overview"
          subtitle={`Last updated ${new Date(data.updatedAt).toLocaleTimeString()}`}
          action={<button className="refresh-btn" onClick={refresh}>Refresh</button>}
        />
        <div className="overview-banner">
          <span>Global System State</span>
          <StatusBadge status={data.overallStatus} />
        </div>
        <div className="metrics-grid">
          <MetricCard label="Active Alerts" value={data.activeAlerts} subtext="Investigate warning/critical" />
          <MetricCard label="Hosts Online" value={`${onlineHosts}/${data.hosts.length}`} subtext="Node availability" />
          <MetricCard label="Services" value={data.services.length} subtext="Monitored workloads" />
          <MetricCard label="AI Queue" value={data.ai.queueDepth} subtext="Pending inference tasks" />
        </div>
      </section>

      <section className="panel">
        <SectionHeader title="Host Grid" subtitle="Compute and infrastructure nodes" />
        <div className="host-grid">
          {data.hosts.map((host) => (
            <article className="host-card" key={host.id}>
              <div className="host-top"><h3>{host.name}</h3><StatusBadge status={host.status} /></div>
              <p>{host.role} · Uptime {host.uptime}</p>
              <div className="usage-grid">
                <span>CPU {host.cpu}%</span><span>Memory {host.memory}%</span><span>Storage {host.storage}%</span>
                {host.gpu !== undefined ? <span>GPU {host.gpu}%</span> : <span>GPU n/a</span>}
              </div>
              <p className="trend">Trend: {host.trend}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <SectionHeader title="Services" subtitle="Application and platform services" />
        <div className="table-like">
          {data.services.map((service) => <div key={service.id} className="row"><strong>{service.name}</strong><StatusBadge status={service.status} /><span>{service.host}</span><span>{service.uptime}</span><span>{service.latencyMs}ms</span><span>{service.tags.join(', ')}</span></div>)}
        </div>
      </section>

      <section className="panel two-col">
        <div>
          <SectionHeader title="AI Infrastructure" subtitle="Inference and model serving" />
          <p>Hosts: {data.ai.availableHosts.join(', ')}</p><p>Active Model: {data.ai.activeModel}</p>
          <p>VRAM: {data.ai.vramUsedGb}GB / {data.ai.vramTotalGb}GB</p><p>Queue Depth: {data.ai.queueDepth}</p>
          <p>Availability: {data.ai.inferenceAvailable ? 'Ready' : 'Unavailable'}</p>
        </div>
        <div>
          <SectionHeader title="Incident Feed" subtitle="Recent operational activity" />
          {data.incidents.length === 0 ? <p>No incidents in the last hour.</p> : data.incidents.map((incident) => <div key={incident.id} className="incident"><StatusBadge status={incident.status} /><span>{incident.message}</span><small>{incident.time}</small></div>)}
        </div>
      </section>
    </div>
  );
}
