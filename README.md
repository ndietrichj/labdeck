# LabDeck

Premium desktop homelab operations dashboard built with Tauri + React + TypeScript.

> **v0.2 note:** This release keeps mock telemetry data and expands the cyberpunk HUD into a compact 5-page operations workspace.

## App Structure (v0.2)

LabDeck now ships with five local-state pages (no router):

1. **HUD** — service-first “Live Services Matrix”, infrastructure node strip, and incident feed.
2. **Services** — searchable/filterable service inventory with service detail panel.
3. **AI** — local AI workspace MVP with provider/model selectors, mock chat loop, telemetry rail.
4. **Automation** — recurring jobs table and compact log preview.
5. **Config** — mock runtime settings panel (no persistence yet).

## Architecture Overview

- `src/pages`: page-level orchestration (`DashboardPage`)
- `src/components`: reusable UI primitives (`StatusBadge`, `MetricCard`, `SectionHeader`)
- `src/layouts`: shell/layout composition
- `src/data`: centralized mock data
- `src/hooks`: data lifecycle hooks
- `src/lib`: API facade + status formatting utilities
- `src/types`: strongly typed domain models
- `src/styles`: global design system + theme tokens

## Development

```bash
npm install
npm run dev
npm run build
npm run tauri:dev
# or
npm run tauri -- dev
```

## v0.2 Roadmap

- [x] Local-state sidebar navigation across 5 pages
- [x] Service-first HUD with live services matrix + infrastructure nodes
- [x] Services inventory with category filter + detail panel
- [x] Local AI workspace MVP with mock send/response flow
- [x] Automation job board + log preview
- [x] Config page with mock settings controls
- [ ] Real backend integration (`/api/dashboard`)
- [ ] Persisted user preferences (density/visibility/privacy)
- [ ] Actionable incident acknowledgements + timeline filters
- [ ] Model tool invocation + local agent execution wiring
