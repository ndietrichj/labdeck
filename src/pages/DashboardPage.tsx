import { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';
import type { AIProvider, AutomationJob, Host, Service, ServiceCategory } from '../types/dashboard';

type AppPage = 'HUD' | 'Services' | 'AI' | 'Automation' | 'Config';
const navItems: AppPage[] = ['HUD', 'Services', 'AI', 'Automation', 'Config'];

export function DashboardPage() {
  const { data, loading, refresh } = useDashboardData();
  const [activePage, setActivePage] = useState<AppPage>('HUD');

  if (loading && !data) return <div className="loading-screen">Loading telemetry link…</div>;
  if (!data) return <div className="loading-screen">No dashboard data available.</div>;

  return (
    <div className="hud-shell">
      <aside className="hud-sidebar hud-panel">
        <div><p className="eyebrow">LabDeck Node</p><h1>LABDECK // HUD</h1><p className="muted">ENV: HOMELAB-PRIME · PRODUCT OPS</p></div>
        <nav className="hud-nav">{navItems.map((item) => <button key={item} className={activePage === item ? 'active' : ''} onClick={() => setActivePage(item)}>{item}</button>)}</nav>
        <div className="hud-sidebar-summary"><p>SERVICES <strong>{data.services.length}</strong></p><p>AUTOMATIONS <strong>{data.automations.length}</strong></p><p>STATUS <strong>{data.overallStatus.toUpperCase()}</strong></p></div>
      </aside>

      <main className="hud-main">
        <header className="top-bar hud-panel">
          <div><p className="eyebrow">Current Section</p><h2>{activePage}</h2></div>
          <div className="top-meta"><span>Global <StatusBadge status={data.overallStatus} /></span><span>Last Updated {new Date(data.updatedAt).toLocaleTimeString()}</span><span>API MODE <strong>MOCK</strong></span><button className="refresh-btn" onClick={refresh}>Refresh</button></div>
        </header>
        {activePage === 'HUD' && <HudPage services={data.services} hosts={data.hosts} />}
        {activePage === 'Services' && <ServicesPage services={data.services} />}
        {activePage === 'AI' && <AIPage providers={data.aiProviders} />}
        {activePage === 'Automation' && <AutomationPage jobs={data.automations} />}
        {activePage === 'Config' && <ConfigPage />}
      </main>

      <aside className="hud-rail hud-panel">
        <h3>Incident / Event Feed</h3>
        {data.incidents.map((incident) => <article key={incident.id} className="incident-item"><div className="incident-head"><StatusBadge status={incident.status} /><span>{incident.time}</span></div><p>{incident.message}</p></article>)}
      </aside>
    </div>
  );
}

function HudPage({ services, hosts }: { services: Service[]; hosts: Host[] }) {
  return <>
    <section className="hud-panel"><h3>Live Services Matrix</h3><div className="service-rows">{services.map((s) => <div className="service-row" key={s.id}><strong>{s.name}</strong><StatusBadge status={s.status} /><span>{s.host}</span><span>{s.category}</span><span>{s.uptime}</span><span>{s.latencyMs}ms</span><span>{s.lastHeartbeat}</span><small>{s.activeModel ?? (s.queueDepth !== undefined ? `queue ${s.queueDepth}` : s.lastRun ?? '-')}</small></div>)}</div></section>
    <section className="hud-panel"><h3>Infrastructure Nodes</h3><div className="host-grid">{hosts.map((host) => <div className="host-card" key={host.id}><div className="host-top"><h4>{host.name}</h4><StatusBadge status={host.status} /></div><p className="muted">{host.role} · uptime {host.uptime}</p><p className="muted">CPU {host.cpu}% · MEM {host.memory}% · STO {host.storage}%{host.gpu ? ` · GPU ${host.gpu}%` : ''}</p></div>)}</div></section>
  </>;
}

function ServicesPage({ services }: { services: Service[] }) {
  const [category, setCategory] = useState<ServiceCategory | 'all'>('all');
  const [status, setStatus] = useState<Service['status'] | 'all'>('all');
  const [host, setHost] = useState('all');
  const [selectedId, setSelectedId] = useState(services[0]?.id ?? '');
  const hosts = ['all', ...Array.from(new Set(services.map((s) => s.host)))];
  const filtered = services.filter((s) => (category === 'all' || s.category === category) && (status === 'all' || s.status === status) && (host === 'all' || s.host === host));
  const selected = services.find((s) => s.id === selectedId) ?? filtered[0];
  return <section className="hud-panel"><h3>Service Inventory</h3><div className="filters"><select value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory | 'all')}><option value="all">all categories</option>{['web','ai-runtime','automation','monitoring','network','media','jobs'].map((c)=><option key={c} value={c}>{c}</option>)}</select><select value={status} onChange={(e) => setStatus(e.target.value as Service['status'] | 'all')}><option value="all">all statuses</option><option value="healthy">healthy</option><option value="warning">warning</option><option value="critical">critical</option></select><select value={host} onChange={(e) => setHost(e.target.value)}>{hosts.map((h)=><option key={h} value={h}>{h}</option>)}</select></div><div className="services-page"><div className="service-table">{filtered.map((s)=><button className={`table-row ${selected?.id===s.id?'selected':''}`} key={s.id} onClick={()=>setSelectedId(s.id)}><span>{s.name}</span><span>{s.category}</span><span>{s.host}</span><StatusBadge status={s.status} /></button>)}</div><div className="details-panel">{selected && <><h4>{selected.name}</h4><p>{selected.description}</p><p>Uptime: {selected.uptime}</p><p>Latency: {selected.latencyMs}ms</p><p>Heartbeat: {selected.lastHeartbeat}</p></>}</div></div></section>;
}

function AIPage({ providers }: { providers: AIProvider[] }) {
  const [providerId, setProviderId] = useState(providers[0]?.id ?? '');
  const provider = providers.find((p) => p.id === providerId) ?? providers[0];
  const [model, setModel] = useState(provider?.models[0] ?? '');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Local AI Workspace initialized. Ready for coding prompts.' }]);
  const send = () => { if (!prompt.trim()) return; setMessages((m) => [...m, { role: 'user', text: prompt }, { role: 'assistant', text: `Mock response from ${provider?.name} using ${model}: scaffold reviewed, next step suggested.` }]); setPrompt(''); };
  return <section className="workspace-grid"><article className="hud-panel"><h3>Local AI Workspace</h3><div className="filters"><select value={providerId} onChange={(e)=>{ const next = providers.find((p)=>p.id===e.target.value); setProviderId(e.target.value); setModel(next?.models[0] ?? ''); }}>{providers.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select><select value={model} onChange={(e)=>setModel(e.target.value)}>{provider?.models.map((m)=><option key={m} value={m}>{m}</option>)}</select></div><div className="chat-log">{messages.map((m,i)=><p key={i}><strong>{m.role}:</strong> {m.text}</p>)}</div><div className="prompt-row"><input value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Enter prompt / coding task..." /><button className="refresh-btn" onClick={send}>Send</button></div></article><article className="hud-panel telemetry"><h3>Runtime Telemetry</h3><p>Provider: {provider?.name}</p><p>Model: {model}</p><p>Latency: 68ms</p><p>Tokens/sec: 47.2</p><p>Context window: 128k</p><p>VRAM usage: 34.8 GB</p><p>Queue depth: 2</p><p>Tool calls: placeholder</p></article></section>;
}

function AutomationPage({ jobs }: { jobs: AutomationJob[] }) {
  const [selected, setSelected] = useState(jobs[0]);
  return <section className="workspace-grid"><article className="hud-panel"><h3>Recurring Jobs & Scheduled Workflows</h3><div className="service-table">{jobs.map((j)=><button key={j.id} className={`table-row ${selected?.id===j.id?'selected':''}`} onClick={()=>setSelected(j)}><span>{j.name}</span><span>{j.targetHost}</span><span>{j.nextRun}</span><StatusBadge status={j.status} /></button>)}</div></article><article className="hud-panel telemetry">{selected && <><h3>{selected.name}</h3><p>Last run: {selected.lastRun}</p><p>Next run: {selected.nextRun}</p><p>Duration: {selected.duration}</p><p>Target host: {selected.targetHost}</p><p>Last result: {selected.lastResult}</p><h4>Log Preview</h4><ul>{selected.logPreview.map((l)=><li key={l}>{l}</li>)}</ul></>}</article></section>;
}

function ConfigPage() {
  return <section className="hud-panel"><h3>Config (Mock)</h3><div className="config-grid"><label>API Mode <input type="checkbox" defaultChecked /></label><label>Backend URL <input defaultValue="http://localhost:3000/api" /></label><label>Refresh Interval <select defaultValue="5"><option value="5">5s</option><option value="15">15s</option><option value="30">30s</option></select></label><label>Visible Sections <input type="checkbox" defaultChecked /> Services <input type="checkbox" defaultChecked /> AI <input type="checkbox" defaultChecked /> Automations</label><label>Privacy Mode <input type="checkbox" /></label><label>Theme Density <select defaultValue="compact"><option value="compact">Compact</option><option value="comfortable">Comfortable</option></select></label></div></section>;
}
