# LabDeck

Premium desktop homelab operations dashboard built with Tauri + React + TypeScript.

> **v0.1 note:** This release uses mock telemetry data and ships with a HUD-inspired cyberpunk operations interface.

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
```

## MVP Roadmap

- [x] Operations overview dashboard and host/service panels
- [x] Typed API facade with mock mode toggle
- [x] Incident feed and AI infrastructure visibility
- [ ] Real backend integration (`/api/dashboard`)
- [ ] Time-series mini charts per host/service
- [ ] Alert acknowledgement and filtering
- [ ] Multi-page navigation for logs, stacks, and model ops
