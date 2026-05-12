# LabDeck

Tauri + React + TypeScript homelab command HUD with a DarkSignal/cyberpunk operations style.

## v0.2 Focus

v0.2 is a **refinement pass** of the existing 5-page shell with denser layouts, actionable mock controls, and tactical operator workflows.

## Current 5-Page Structure

1. **HUD**: live services matrix, infrastructure telemetry, summary tiles, incident rail.
2. **Services**: searchable inventory, category chips, service detail actions.
3. **AI**: local workspace with provider/model/agent mode, telemetry, mock tool-call session tracking.
4. **Automation**: recurring workflows, manual trigger stubs, drill-down context.
5. **Config**: mock connection/runtime settings and node/service endpoint placeholders.

## Mock Telemetry Note

This build intentionally uses centralized mock data and local component state only. No live backend, Ollama, or internal network calls are executed in this pass.

## Future Backend / Ollama Integration Roadmap

- Replace mock API facade with real `/api/dashboard` polling.
- Wire service/automation actions to backend command queue.
- Connect AI workspace to Ollama + model router endpoints.
- Persist user settings (density, refresh interval, privacy mode).
- Add historical telemetry storage and richer trend visualizations.

## Development

```bash
npm install
npm run dev
npm run build
npm run tauri dev
```
