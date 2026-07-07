# Configuration Tool — Front-End

Enterprise-grade **React 19** front-end blueprint for a **hardware configuration tool** —
a single application for configuring a family of network-connected devices, from user
accounts and hardware composition to zones, actions, audio processing, diagnostics and an
operator portal.

> **Status:** Pre-project blueprint. This repository is being set up ahead of contract
> award to prove the proposed architecture, tooling and (human + AI) delivery model can
> deliver what the proposal promises.

---

## 1. Context

|                            |                                                                       |
| -------------------------- | --------------------------------------------------------------------- |
| **Product**                | Configuration tool for a range of network-connected hardware devices  |
| **Scope (this repo)**      | Front-end layer only                                                  |
| **Deployment**             | Static site on an **embedded Linux** platform                         |
| **APIs**                   | Provided by the customer — REST (OpenAPI) + WebSocket (AsyncAPI)      |
| **Design**                 | Provided by the customer — Figma (industrial digital interface style) |
| **Delivery model**         | Fixed price, Agile, 2-week sprints, 3 days/week on-site               |
| **Full launch**            | November 2027                                                         |
| **Intermediate milestone** | Mid 2027 — first functional release                                   |

### What is in scope

Implementation of all agreed UI screens and workflows (~52 layout templates, ~64 sub-page
layouts, **~180 clickable pages**), REST + WebSocket integration, multi-language support,
multi-theme support, responsive behaviour, embedded-Linux optimisation, front-end security
practices, automated testing, and technical documentation for handover.

### What is out of scope

Backend services, ownership of the OpenAPI/AsyncAPI specs, embedded Linux platform
development, final translated content, and product/business requirements definition.

---

## 2. Technology Stack

| Concern                | Choice                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| Framework              | **React 19**                                                        |
| Language               | **TypeScript 5** (`strict: true`)                                   |
| Build tool             | **Vite 6**                                                          |
| UI library             | **Untitled UI** (Tailwind CSS)                                      |
| Router                 | **TanStack Router v1** (type-safe routes + URL state)               |
| Server state (REST)    | **TanStack Query v5**                                               |
| WebSocket state        | `useWebSocket` hook → **Jotai** atoms                               |
| Client / UI state      | **Jotai**                                                           |
| Forms                  | **React Hook Form** + **Zod** (`@hookform/resolvers`)               |
| Validation             | **Zod** (shared between forms and API parsing)                      |
| REST codegen           | **@hey-api/openapi-ts** (types + TanStack Query hooks)              |
| WebSocket typing       | **asyncapi-generator** + custom templates                           |
| API mocking            | **MSW v2** (identical handlers in dev + test)                       |
| i18n                   | **react-i18next** (type-safe keys, lazy per namespace)              |
| Theming                | CSS custom properties via Tailwind config (`data-theme`)            |
| Unit / component tests | **Jest** + **React Testing Library**                                |
| E2E tests              | **Cypress**                                                         |
| Accessibility          | **jest-axe** (unit) + **cypress-axe** (e2e)                         |
| Component docs         | **Storybook 8**                                                     |
| Linting / formatting   | **ESLint 9** (flat config) + **Prettier**                           |
| Git hooks              | **Husky** + **lint-staged** + **commitlint** (Conventional Commits) |
| Static analysis        | **SonarCloud** (Quality Gate blocks merges)                         |
| Dependency security    | **npm audit** (CI) + **Dependabot** / Snyk                          |
| Bundle analysis        | **rollup-plugin-visualizer** (every production build)               |

Full rationale for every choice lives in [`docs/Technical-Architecture-Plan.md`](docs/Technical-Architecture-Plan.md)
(source of truth) and the ADRs under [`docs/adr/`](docs/adr/).

---

## 3. Architecture at a Glance

**Feature-based Clean Architecture** — vertical slices, one per functional module.

```
┌─────────────────────────────────────────┐
│  Pages  (route components, ultra-thin)  │
├─────────────────────────────────────────┤
│  Hooks / Use Cases  (orchestration)     │
├─────────────────────────────────────────┤
│  API Layer  (TanStack Query + codegen)  │
├─────────────────────────────────────────┤
│  Domain Types  (Zod schemas + TS types) │
└─────────────────────────────────────────┘
```

```
src/
├── app/          # Bootstrap: providers, router, global error boundary
├── features/     # Vertical feature slices (auth, dashboard, device-options, …)
├── shared/       # Cross-feature components, hooks, lib, types, i18n
├── api/          # GENERATED — do not edit (rest/ + ws/)
└── styles/       # Theme tokens + global styles
```

**Hard rules**

- Features **never** import from other features — shared logic goes in `shared/`
  (enforced by `import/no-cycle` and `no-restricted-imports`).
- `src/api/` is **codegen output** — never edited by hand.
- Pages contain no business logic; components are presentational; hooks orchestrate.
- No `any`, no non-null `!`, no `dangerouslySetInnerHTML` (ESLint-enforced).

**State decision tree**

| Data source              | Home                          |
| ------------------------ | ----------------------------- |
| Server (REST)            | TanStack Query                |
| WebSocket                | `useWebSocket` → Jotai atom   |
| Form input               | React Hook Form               |
| UI state (tabs, sidebar) | Jotai atom (feature-local)    |
| Navigation / filters     | TanStack Router search params |

---

## 4. Team

A hybrid team of **3 human members** and **7 virtual (AI) teammates**. Each virtual
teammate reads a role-specific instruction file so that AI-assisted ("vibe") coding stays
architecture-compliant and consistent. See [`AGENTS.md`](AGENTS.md) for the full charter.

| Human | Role                       | Virtual teammate | Role                 | Instruction file                                                       |
| ----- | -------------------------- | ---------------- | -------------------- | ---------------------------------------------------------------------- |
| —     | Solution Architect         | **Solid**        | Solution Architect   | [`docs/agents/SolutionArchitect.md`](docs/agents/SolutionArchitect.md) |
| —     | Senior Front-end Developer | **Vibe**         | Developer            | [`docs/agents/Developer.md`](docs/agents/Developer.md)                 |
| —     | Business Analyst           | **Scope**        | Business Analyst     | [`docs/agents/BusinessAnalyst.md`](docs/agents/BusinessAnalyst.md)     |
|       |                            | **Probe**        | Tester / QA          | [`docs/agents/Tester.md`](docs/agents/Tester.md)                       |
|       |                            | **Aegis**        | Security specialist  | [`docs/agents/Security.md`](docs/agents/Security.md)                   |
|       |                            | **Pixel**        | UX / Design Guardian | [`docs/agents/UXGuardian.md`](docs/agents/UXGuardian.md)               |
|       |                            | **Flux**         | DevOps               | [`docs/agents/DevOps.md`](docs/agents/DevOps.md)                       |

**Per-sprint working method (TDD discipline)**

1. **Scope** elaborates requirements in Gherkin (Given/When/Then).
2. **Probe** writes Jest/Cypress tests from the requirements (they fail).
3. **Vibe** implements the feature until tests pass.
4. **Solid** reviews the PR for architecture-boundary compliance (ADR for any deviation).
5. **Pixel** verifies visual output against Figma (via Storybook).
6. **Aegis** reviews security-sensitive areas against the OWASP checklist.
7. CI validates everything automatically.

---

## 5. Quality Gates

| Gate                                                | Target                                        |
| --------------------------------------------------- | --------------------------------------------- |
| Statement / line coverage                           | ≥ 80% (excl. generated `src/api/`)            |
| Branch coverage                                     | ≥ 75%                                         |
| Function coverage                                   | ≥ 85%                                         |
| SonarCloud Reliability / Security / Maintainability | A                                             |
| Security Hotspots reviewed                          | 100%                                          |
| Duplicated lines (new code)                         | < 3%                                          |
| Cognitive complexity / function                     | ≤ 15                                          |
| Initial JS bundle                                   | < 300 KB gzipped _(to confirm with customer)_ |

**CI pipeline (every PR):** install → type-check → lint → unit tests + coverage →
SonarCloud Quality Gate → `npm audit` (critical = fail) → Vite build → bundle report.
Cypress E2E runs nightly and on release branches.

**Pre-commit:** `lint-staged` (eslint --fix → prettier → `tsc --noEmit`) + `commitlint`.

---

## 6. Getting Started

> Scaffolding is in progress (Work Package 0 — Foundation & Tooling). Commands below reflect
> the target setup and will become live as WP0 lands.

```bash
# Install dependencies
npm install

# Generate API clients from the customer-provided specs
npm run generate:api        # REST  (OpenAPI  → src/api/rest/)
npm run generate:ws         # WebSocket (AsyncAPI → src/api/ws/)

# Develop (MSW mocks active — no backend required)
npm run dev

# Quality
npm run type-check          # tsc --noEmit
npm run lint                # eslint
npm run test                # jest + coverage
npm run test:e2e            # cypress
npm run storybook           # component docs / design system

# Production build
npm run build               # vite build (+ bundle analysis)
```

**Prerequisites:** Node.js LTS, npm. Customer-provided `openapi.yaml` / `asyncapi.yaml`
specs are required for API codegen (MSW mocks bridge the gap until then).

---

## 7. Work Packages (roadmap)

Ordered to respect dependencies and the mid-2027 intermediate milestone
(first functional release). Full breakdown in the architecture plan.

| WP   | Scope                                                            | Sprints |
| ---- | ---------------------------------------------------------------- | ------- |
| WP0  | Foundation & tooling (CI, empty app, all tooling active)         | 1–2     |
| WP1  | Auth & Dashboard                                                 | 2–3     |
| WP2  | Configuration Wizard                                             | 3–5     |
| WP3  | User Management                                                  | 4–5     |
| WP4  | System Composition (+ device auto-detect via WebSocket)          | 5–7     |
| WP5  | **Device Options** (largest — polymorphic tab/panel system)      | 7–13    |
| WP6  | System Options & Zones                                           | 9–11    |
| WP7  | Call Definition & BGM Routing                                    | 11–13   |
| WP8  | Actions & Audio Processing                                       | 12–14   |
| WP9  | Diagnostics                                                      | 14–16   |
| WP10 | Settings                                                         | 15–16   |
| WP11 | Operator Portal (Control Center, Scheduler, Message Editor, BGM) | 16–20   |
| WP12 | Quality & Handover (E2E suite, SBOM, docs, knowledge transfer)   | 19–21   |

---

## 8. Documentation

- [`AGENTS.md`](AGENTS.md) — root context & absolute rules for all (human + AI) contributors
- [`docs/Technical-Architecture-Plan.md`](docs/Technical-Architecture-Plan.md) — full technical architecture (source of truth)
- [`docs/agents/`](docs/agents/) — role-specific instruction files for each virtual teammate
- [`docs/adr/`](docs/adr/) — Architecture Decision Records

---

## 9. Licence

Proprietary. All rights reserved.
