import { useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';
import type { ServiceCategory } from '../types/dashboard';

const navItems = ['HUD', 'Services', 'AI', 'Automation', 'Config'] as const;
type Page = (typeof navItems)[number];

export function DashboardPage() {
  const { data, loading, refresh } = useDashboardData();
  const [activePage, setActivePage] = useState<Page>('HUD');
  const [serviceFilter, setServiceFilter] = useState<ServiceCategory | 'all'>('all');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [providerId, setProviderId] = useState('sched');
  const [model, setModel] = useState('llama3.1:70b-instruct-q4_k_m');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Local AI workspace online. Choose a provider and send a prompt.' }]);

  if (loading && !data) return <div className="loading-screen">Loading telemetry link…</div>;
  if (!data) return <div className="loading-screen">No dashboard data available.</div>;

  const provider = data.aiProviders.find((p) => p.id === providerId) ?? data.aiProviders[0];
  const filteredServices = data.services.filter((service) => {
    const categoryOk = serviceFilter === 'all' || service.category === serviceFilter;
    const text = `${service.name} ${service.host} ${service.category}`.toLowerCase();
    return categoryOk && text.includes(serviceSearch.toLowerCase());
  });
  const selectedServiceData = data.services.find((service) => service.id === selectedService) ?? filteredServices[0];

  const chatSend = () => {
    if (!prompt.trim()) return;
    const userPrompt = prompt.trim();
    setMessages((m) => [...m, { role: 'user', text: userPrompt }, { role: 'assistant', text: `Mock response from ${provider.name} on ${model}: completed local inference pass.` }]);
    setPrompt('');
  };

  return (
    <div className="hud-shell">
      <aside className="hud-sidebar hud-panel">
        <div><p className="eyebrow">LabDeck Node</p><h1>LABDECK // HUD</h1><p className="muted">ENV: HOMELAB-PRIME · SECOPS VIEW</p></div>
        <nav className="hud-nav">{navItems.map((item) => <button key={item} className={activePage === item ? 'active' : ''} onClick={() => setActivePage(item)}>{item}</button>)}</nav>
      </aside>
      <main className="hud-main">
        <header className="top-bar hud-panel"><div><p className="eyebrow">Current Section</p><h2>{activePage}</h2></div><div className="top-meta"><span>Global <StatusBadge status={data.overallStatus} /></span><span>Last Updated {new Date(data.updatedAt).toLocaleTimeString()}</span><button className="refresh-btn" onClick={refresh}>Refresh</button></div></header>

        {activePage === 'HUD' && <>
          <section className="overview-strip">
            <article className="hud-panel stat"><p>Active Alerts</p><strong>{data.activeAlerts}</strong></article>
            <article className="hud-panel stat"><p>Services</p><strong>{data.services.length}</strong></article>
            <article className="hud-panel stat"><p>AI Runtimes</p><strong>{data.services.filter((s) => s.category === 'ai-runtime').length}</strong></article>
            <article className="hud-panel stat"><p>Job Queue</p><strong>{data.ai.queueDepth}</strong></article>
          </section>
          <section className="hud-panel"><h3>Live Services Matrix</h3><div className="service-rows">{data.services.map((s) => <div key={s.id} className="service-row"><strong>{s.name}</strong><StatusBadge status={s.status} /><span>{s.host}</span><span>{s.category}</span><span>{s.uptime}</span><span>{s.latencyMs}ms</span><span>{s.lastHeartbeat}</span><small>{s.activeModel ?? '-'} · q:{s.queueDepth ?? 0}</small></div>)}</div></section>
          <section className="hud-panel"><h3>Infrastructure Nodes</h3><div className="host-grid">{data.hosts.map((host) => <div className="host-card" key={host.id}><div className="host-top"><h4>{host.name}</h4><StatusBadge status={host.status} /></div><p className="muted">{host.role} · uptime {host.uptime}</p><p className="muted">CPU {host.cpu}% · MEM {host.memory}% · DISK {host.storage}% {host.gpu ? `· GPU ${host.gpu}%` : ''}</p></div>)}</div></section>
        </>}

        {activePage === 'Services' && <section className="hud-panel"><h3>Service Inventory</h3><div className="filters"><input value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} placeholder="Search services" /><select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value as ServiceCategory | 'all')}><option value="all">all</option><option value="web">web</option><option value="ai-runtime">ai-runtime</option><option value="automation">automation</option><option value="monitoring">monitoring</option><option value="network">network</option><option value="media">media</option><option value="jobs">jobs</option></select></div><div className="center-grid"><div className="service-rows">{filteredServices.map((s) => <button key={s.id} className="service-row service-btn" onClick={() => setSelectedService(s.id)}><strong>{s.name}</strong><StatusBadge status={s.status} /><span>{s.host}</span><span>{s.category}</span><span>{s.uptime}</span><span>{s.latencyMs}ms</span><span>{s.lastHeartbeat}</span><small>{s.tags.join(' · ')}</small></button>)}</div><article className="hud-panel"><h3>Service Detail</h3>{selectedServiceData && <div><p><strong>{selectedServiceData.name}</strong></p><p className="muted">Host: {selectedServiceData.host}</p><p className="muted">Category: {selectedServiceData.category}</p><p className="muted">Uptime: {selectedServiceData.uptime}</p><p className="muted">Latency: {selectedServiceData.latencyMs}ms</p><p className="muted">Heartbeat: {selectedServiceData.lastHeartbeat}</p><p className="muted">Model: {selectedServiceData.activeModel ?? 'n/a'}</p><p className="muted">Queue: {selectedServiceData.queueDepth ?? 'n/a'}</p></div>}</article></div></section>}

        {activePage === 'AI' && <section className="center-grid"><article className="hud-panel"><h3>Local AI Workspace</h3><div className="filters"><select value={provider.id} onChange={(e) => setProviderId(e.target.value)}>{data.aiProviders.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}</select><select value={model} onChange={(e) => setModel(e.target.value)}><option>llama3.1:70b-instruct-q4_k_m</option><option>qwen2.5-coder:14b</option><option>deepseek-coder-v2</option><option>mistral-nemo:12b</option></select></div><div className="chat-panel">{messages.map((m, i) => <p key={i} className="muted"><strong>{m.role}:</strong> {m.text}</p>)}</div><div className="filters"><input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt" /><button className="refresh-btn" onClick={chatSend}>Mock Send</button></div></article><article className="hud-panel"><h3>Telemetry</h3><p className="muted">Provider: {provider.name}</p><p className="muted">Model: {model}</p><p className="muted">Latency: {provider.latencyMs}ms</p><p className="muted">Tokens/sec: {provider.tokensPerSec}</p><p className="muted">Context: {provider.contextWindow}</p><p className="muted">VRAM: {provider.vramUsage}</p><p className="muted">Queue: {provider.queueDepth}</p><p className="muted">Tool calls: placeholder</p></article></section>}

        {activePage === 'Automation' && <section className="center-grid"><article className="hud-panel"><h3>Recurring Workflows</h3><div className="service-rows">{data.jobs.map((job) => <div className="service-row" key={job.id}><strong>{job.name}</strong><StatusBadge status={job.status} /><span>{job.lastRun}</span><span>{job.nextRun}</span><span>{job.duration}</span><span>{job.targetHost}</span><small>{job.lastResult}</small></div>)}</div></article><article className="hud-panel"><h3>Log Preview</h3><p className="muted">[09:12] model warmup cron: cold start recovered.</p><p className="muted">[08:46] other cron jobs: sync cache completed.</p><p className="muted">[08:10] portfolio health check: all endpoints green.</p></article></section>}

        {activePage === 'Config' && <section className="hud-panel"><h3>Config (Mock)</h3><div className="service-rows"><div className="service-row"><strong>Backend URL</strong><span>http://localhost:8787</span></div><div className="service-row"><strong>API Mode</strong><span>mock / local</span></div><div className="service-row"><strong>Refresh Interval</strong><span>10s</span></div><div className="service-row"><strong>Privacy Mode</strong><span>enabled</span></div><div className="service-row"><strong>Density</strong><span>compact</span></div><div className="service-row"><strong>Visible Sections</strong><span>HUD, Services, AI, Automation, Config</span></div></div></section>}
      </main>
      <aside className="hud-rail hud-panel"><h3>Incident / Event Feed</h3>{data.incidents.map((incident) => <article key={incident.id} className="incident-item"><div className="incident-head"><StatusBadge status={incident.status} /><span>{incident.time}</span></div><p>{incident.message}</p></article>)}</aside>
    </div>
  );
}
