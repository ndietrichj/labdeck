import { useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useDashboardData } from '../hooks/useDashboardData';
import type { Job, ServiceCategory } from '../types/dashboard';

const navItems = ['HUD', 'Services', 'AI', 'Automation', 'Config'] as const;
type Page = (typeof navItems)[number];
type AgentMode = 'Manual' | 'Patch' | 'Explain' | 'Diagnose';

const categories: Array<ServiceCategory | 'all'> = ['all', 'web', 'ai-runtime', 'automation', 'monitoring', 'network', 'media', 'jobs'];

export function DashboardPage() {
  const { data, loading, refresh } = useDashboardData();
  const [activePage, setActivePage] = useState<Page>('HUD');
  const [serviceFilter, setServiceFilter] = useState<ServiceCategory | 'all'>('all');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [providerId, setProviderId] = useState('sched');
  const [model, setModel] = useState('llama3.1:70b-instruct-q4_k_m');
  const [prompt, setPrompt] = useState('');
  const [agentMode, setAgentMode] = useState<AgentMode>('Manual');
  const [toolCalls, setToolCalls] = useState(0);
  const [sessionIncidents, setSessionIncidents] = useState<Set<string>>(new Set());
  const [automationJobs, setAutomationJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [serviceActivity, setServiceActivity] = useState('No service actions queued.');
  const [modelActivity, setModelActivity] = useState('Model inventory synchronized (mock).');
  const [automationActivity, setAutomationActivity] = useState('No manual workflow actions queued.');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [countdown, setCountdown] = useState(30);
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Local AI workspace online. Choose a provider and send a prompt.' }]);

  useEffect(() => {
    if (data) {
      setAutomationJobs(data.jobs);
      setSelectedJobId((prev) => prev || data.jobs[0]?.id || '');
      setLastUpdated(new Date(data.updatedAt));
    }
  }, [data]);

  useEffect(() => {
    const t = setInterval(() => setCountdown((s) => (s <= 1 ? 30 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((p) => !p);
      }
      if (e.key === 'Escape') setIsPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading && !data) return <div className="loading-screen">Loading telemetry link…</div>;
  if (!data) return <div className="loading-screen">No dashboard data available.</div>;

  const provider = data.aiProviders.find((p) => p.id === providerId) ?? data.aiProviders[0];
  const filteredServices = data.services.filter((service) => {
    const categoryOk = serviceFilter === 'all' || service.category === serviceFilter;
    const text = `${service.name} ${service.host} ${service.category}`.toLowerCase();
    return categoryOk && text.includes(serviceSearch.toLowerCase());
  });
  const selectedServiceData = data.services.find((service) => service.id === selectedService) ?? filteredServices[0];
  const incidents = data.incidents.filter((i) => !sessionIncidents.has(i.id));
  const selectedJob = automationJobs.find((j) => j.id === selectedJobId) ?? automationJobs[0];

  const parseVram = (value: string) => {
    const [used, total] = value.split('/').map((part) => Number.parseFloat(part.replace(/[^0-9.]/g, '')));
    const pct = total > 0 ? Math.round((used / total) * 100) : 0;
    return { used, total, pct };
  };
  const vram = parseVram(provider.vramUsage);

  const chatSend = () => {
    if (!prompt.trim()) return;
    const userPrompt = prompt.trim();
    setToolCalls((c) => c + 1);
    setMessages((m) => [...m, { role: 'user', text: userPrompt }, { role: 'assistant', text: `(${agentMode}) ${provider.name}/${model} streaming… diagnostics complete.` }]);
    setPrompt('');
  };

  const paletteResults = useMemo(() => {
    const q = paletteQuery.toLowerCase();
    if (!q) return [];
    return [
      ...data.services.filter((s) => `${s.name} ${s.category}`.toLowerCase().includes(q)).map((s) => ({ type: 'service', label: s.name, page: 'Services' as Page, id: s.id })),
      ...automationJobs.filter((j) => j.name.toLowerCase().includes(q)).map((j) => ({ type: 'job', label: j.name, page: 'Automation' as Page, id: j.id })),
      ...incidents.filter((i) => i.message.toLowerCase().includes(q)).map((i) => ({ type: 'incident', label: i.message, page: 'HUD' as Page, id: i.id })),
      ...['llama3.1:70b-instruct-q4_k_m', 'qwen2.5-coder:14b', 'deepseek-coder-v2', 'mistral-nemo:12b'].filter((m) => m.toLowerCase().includes(q)).map((m) => ({ type: 'model', label: m, page: 'AI' as Page, id: m }))
    ].slice(0, 12);
  }, [paletteQuery, data.services, automationJobs, incidents]);

  const refreshNow = async () => { await refresh(); setLastUpdated(new Date()); setCountdown(30); };

  return (<div className="hud-shell">{/* omitted for brevity? no full */}
    <aside className="hud-sidebar hud-panel"><div><p className="eyebrow">LabDeck Node</p><h1>LABDECK // HUD</h1><p className="muted">ENV: HOMELAB-PRIME · SECOPS VIEW</p></div>
    <nav className="hud-nav">{navItems.map((item) => <button key={item} className={activePage === item ? 'active' : ''} onClick={() => setActivePage(item)}><span className="nav-dot" />{item}</button>)}</nav></aside>
    <main className="hud-main">
      <header className="top-bar hud-panel"><div><p className="eyebrow">Current Section · /ops/{activePage.toLowerCase()}</p><h2>{activePage}</h2></div><div className="top-meta"><span>Global <StatusBadge status={data.overallStatus} /></span><span>Last Updated {lastUpdated.toLocaleTimeString()}</span><span className="auto-refresh"><i style={{ ['--p' as string]: `${(countdown / 30) * 100}%` }} />Auto-refresh {countdown}s</span><button className="refresh-btn" onClick={refreshNow}>Refresh</button></div></header>
      {activePage === 'HUD' && <>
        <section className="overview-strip">
          <button className="hud-panel stat interactive" onClick={() => setServiceFilter('all')}><p>Active Alerts</p><strong>{incidents.filter((i) => i.status !== 'healthy').length}</strong></button>
          <button className="hud-panel stat interactive" onClick={() => setActivePage('Services')}><p>Services</p><strong>{data.services.length}</strong></button>
          <button className="hud-panel stat interactive" onClick={() => setActivePage('AI')}><p>AI Runtimes</p><strong>{data.services.filter((s) => s.category === 'ai-runtime').length}</strong></button>
          <button className="hud-panel stat interactive" onClick={() => setActivePage('Automation')}><p>Job Queue</p><strong>{data.ai.queueDepth}</strong></button>
        </section>
      </>}
      {/* Keep rest compact */}
      <section className="hud-panel"><h3>{activePage === 'HUD' ? 'Live Services Matrix' : activePage}</h3></section>
      {activePage === 'Services' && <section className="hud-panel"><div className="filters"><input value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} placeholder="Search services" /></div><div className="chips">{categories.map((c) => <button key={c} className={serviceFilter===c?'active':''} onClick={()=>setServiceFilter(c)}>{c}</button>)}</div><div className="center-grid"><div className="service-rows">{filteredServices.map((s)=><button key={s.id} className="service-row service-btn" onClick={()=>setSelectedService(s.id)}><strong>{s.name}</strong><StatusBadge status={s.status}/><span>{s.host}</span><span>{s.category}</span><span>{s.uptime}</span><span>{s.latencyMs}ms</span><span>{s.lastHeartbeat}</span><small>{s.tags.join(' · ')} {s.status==='warning' && <span className="inline-actions"><button onClick={(e)=>{e.stopPropagation();setServiceActivity(`Ping queued for ${s.name}`)}}>Ping</button><button onClick={(e)=>{e.stopPropagation();setServiceActivity(`Logs opened for ${s.name}`)}}>Logs</button><button onClick={(e)=>{e.stopPropagation();setServiceActivity(`Restart queued for ${s.name}`)}}>Restart</button></span>}</small></button>)}</div><article className="hud-panel"><h3>Service Detail</h3>{selectedServiceData && <><p><strong>{selectedServiceData.name}</strong></p><p className="muted">{serviceActivity}</p><div className="actions"><button onClick={()=>setServiceActivity(`Restart queued for ${selectedServiceData.name}`)}>Restart</button><button onClick={()=>setServiceActivity(`Health check queued for ${selectedServiceData.name}`)}>Force Health Check</button><button onClick={()=>setServiceActivity(`Log stream opened for ${selectedServiceData.name}`)}>View Logs</button></div></>}</article></div></section>}
      {activePage === 'AI' && <section className="center-grid"><article className="hud-panel"><div className="filters"><select value={provider.id} onChange={(e) => setProviderId(e.target.value)}>{data.aiProviders.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select><select value={model} onChange={(e)=>setModel(e.target.value)}><option>llama3.1:70b-instruct-q4_k_m</option><option>qwen2.5-coder:14b</option><option>deepseek-coder-v2</option><option>mistral-nemo:12b</option></select><select value={agentMode} onChange={(e)=>setAgentMode(e.target.value as AgentMode)}><option>Manual</option><option>Patch</option><option>Explain</option><option>Diagnose</option></select></div><div className="chat-panel">{messages.map((m,i)=><p key={i} className="muted"><strong>{m.role}:</strong> {m.text}</p>)}</div><div className="filters"><input value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Enter prompt"/><button className="refresh-btn" onClick={chatSend}>Mock Send</button></div></article><article className="hud-panel"><h3>Telemetry</h3><p className="muted">Provider: {provider.name}</p><p className="muted">Model: {model}</p><p className="muted">Tool calls: {toolCalls}</p><div className={`vram ${vram.pct>80?'warn':''}`}><span>VRAM {provider.vramUsage}</span><div><i style={{width:`${vram.pct}%`}}/></div></div><p className="muted">{modelActivity}</p></article></section>}
      {activePage === 'Automation' && <section className="center-grid"><article className="hud-panel"><div className="service-rows">{automationJobs.map((j)=><button key={j.id} className="service-row service-btn" onClick={()=>setSelectedJobId(j.id)}><strong>{j.name}</strong><StatusBadge status={j.status}/><span>{j.lastRun}</span><span>{j.nextRun}</span><span>{j.duration}</span><span>{j.targetHost}</span><small>{j.lastResult}</small><button onClick={(e)=>{e.stopPropagation(); if(window.confirm(`Run ${j.name} now?`)){setAutomationJobs((jobs)=>jobs.map((x)=>x.id===j.id?{...x,lastResult:'Manual run queued'}:x)); setAutomationActivity(`Manual run queued for ${j.name}`);}}}>▶ Run Now</button></button>)}</div></article><article className="hud-panel"><h3>Workflow Detail</h3><p className="muted">{automationActivity}</p><p className="muted">Selected: {selectedJob?.name}</p><p className="muted">Duration trend: ▃▅▆▅▃▇</p><p className="muted">Log tail: [09:12] queued, [09:13] worker allocated, [09:14] completed.</p></article></section>}
      {activePage === 'Config' && <section className="hud-panel"><div className="service-rows"><div className="service-row"><strong>Backend URL</strong><span>https://controller-node-a.local/api</span></div><div className="service-row"><strong>Refresh Interval</strong><span>30s</span></div><div className="service-row"><strong>Privacy Mode</strong><span>enabled</span></div><div className="service-row"><strong>API Mode</strong><span>mock / local</span></div><div className="service-row"><strong>Node Table</strong><span>Controller Node A / Inference Node B / Services Node C</span></div></div></section>}
    </main>
    <aside className="hud-rail hud-panel"><h3>Incident / Event Feed</h3>{incidents.map((incident) => <article key={incident.id} className={`incident-item ${incident.status}`}><div className="incident-head"><StatusBadge status={incident.status} /><span>{incident.time}</span><button onClick={() => setSessionIncidents((prev) => new Set(prev).add(incident.id))}>ACK</button></div><p>{incident.message}</p></article>)}</aside>
    {isPaletteOpen && <div className="palette"><div className="hud-panel"><input autoFocus value={paletteQuery} onChange={(e)=>setPaletteQuery(e.target.value)} placeholder="Search services, jobs, incidents, models"/>{paletteResults.map((r)=><button key={`${r.type}-${r.id}`} onClick={()=>{setActivePage(r.page); if(r.type==='service')setSelectedService(r.id); if(r.type==='job')setSelectedJobId(r.id); if(r.type==='model'){setModel(r.id);setActivePage('AI');} setIsPaletteOpen(false);}}>{r.type}: {r.label}</button>)}</div></div>}
  </div>);
}
