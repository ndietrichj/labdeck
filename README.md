# LabDeck

Premium desktop homelab operations dashboard built with Tauri + React + TypeScript.

> **v0.2 note:** This iteration is still frontend/mock-data only, but now ships with functional multi-page product structure and a usability-first workflow.

## Page Structure (max 5)

1. **HUD** (default): Live Services Matrix + Infrastructure Nodes + incident feed
2. **Services**: inventory table with local filters and details panel
3. **AI**: Local AI Workspace MVP (provider/model select + chat panel + telemetry)
4. **Automation**: recurring jobs/workflow status with compact log preview
5. **Config**: mock settings controls (no persistence yet)

## Architecture Overview

- `src/pages`: page orchestration and local navigation state (`DashboardPage`)
- `src/components`: reusable UI primitives (`StatusBadge`, `MetricCard`, `SectionHeader`)
- `src/layouts`: shell/layout composition
- `src/data`: centralized mock data for services, infra, AI providers, automations
- `src/hooks`: data lifecycle hooks
- `src/lib`: API facade + status formatting utilities
- `src/types`: strongly typed domain models
- `src/styles`: global design system + cyberpunk HUD theme

## Development

```bash
npm install
npm run dev
npm run build
npm run tauri:dev
```

## v0.2 Roadmap

- [x] Functional 5-page sidebar navigation (HUD/Services/AI/Automation/Config)
- [x] Live Services Matrix prioritized around apps/services/model runtimes
- [x] Service inventory filters + detail panel
- [x] Local AI Workspace MVP with mock chat workflow + telemetry
- [x] Automation workflow page with status/run windows/log preview
- [ ] Persist config settings locally
- [ ] Real backend integration and live polling streams
- [ ] AI tool-call plumbing for local coding agents
- [ ] Historical incident timeline and acknowledgements
- [ ] Adaptive compact/comfortable density presets
