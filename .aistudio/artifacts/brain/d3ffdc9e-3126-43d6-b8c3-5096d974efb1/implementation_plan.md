# Reverse Engineering Agent (morluto/rea) & Claude Code Architecture

A complete integration of the `morluto/rea` (Reverse Engineering Agent) workflow and Claude Code execution pipeline into Codube, enabling users to enter any website URL, systematically extract full-system design logic (tokens, typography, layout hierarchy, copywriting, and component maps), and generate stunning redesigned Next.js apps with direct Claude Code CLI exports and live previews, while eliminating React 19 console warnings.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Decision**: The user confirmed **Full System Depth** extraction: Layout structure, design tokens (colors, typography, spacing, radius, shadows), copywriting, and modular component hierarchy.
>
> **Execution Strategy**:
> 1. **morluto/rea Deep Reverse Engineering Pipeline**: Connect URL input to an evidence-backed extraction model based on `morluto/rea` that parses archetype category, brand identity, color tokens, typography hierarchy, responsive breakpoints, layout components, and copy tone.
> 2. **Claude Code CLI & MCP Generation Pipeline**: Provide a dedicated Claude Code exporter that outputs a production-ready `CLAUDE.md`, Model Context Protocol (`mcp.json`) server configuration, prompt instructions, and a ready-to-run CLI command (`claude "rebuild this site with the extracted REA design tokens"`).
> 3. **Console Error Fixes**:
>    - **Key Collision (`components/Footer.tsx`)**: Prevent duplicate registration of `Footer.tsx` in `components/LiveCodeViewer.tsx` when the site schema already contains a footer section.
>    - **Style Property Conflict (`background` vs `backgroundClip`)**: Replace shorthand `background: p.grad` with non-conflicting `backgroundImage: p.grad` in `components/SiteRenderer.tsx`'s `gradText` helper to comply with React 19 DOM reconciliation rules.

---

## 1. Overview & Core Concept

- **What It Does**: Allows users to paste any existing website URL (or company name), extracts its complete design system and architectural blueprint using the `morluto/rea` methodology, and provides dual outputs:
  1. **Instant Interactive Redesign Canvas**: A responsive, live-editable Next.js web application with modern Bento grids, typography, and theme controls.
  2. **Claude Code & Agent Suite**: A 1-click terminal export containing `CLAUDE.md`, architectural specifications, component boundaries, and command recipes for Claude Code, Cursor, and Gemini CLI.
- **Target Audience / Persona**: Frontend engineers, designers, and founders who want to deconstruct competitor or benchmark websites and produce high-quality, production-ready code without starting from scratch.
- **Key Value**: Replaces guesswork and generic AI slop with structured, evidence-grounded reverse engineering that captures real design rhythm, spacing tokens, and component logic.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **URL Ingestion**: User pastes a URL (e.g. `https://linear.app`, `https://stripe.com`, `https://airbnb.com`) on the Landing Page Hero or Builder Dashboard.
2. **REA Multi-Phase Extraction**: Visual feedback displays the REA inspection stages:
   - `01. Network & Bundle Inspection`: Scanning asset bundles, fonts, and frameworks.
   - `02. Design Token Extraction`: Palettes, dark/light contrast ratios, radii, font pairings.
   - `03. Semantic Layout Reconstruction`: Navbar, Hero, Bento Feature Grid, Social Proof, Pricing, Footer.
   - `04. Claude Code Agent Spec Formulation`: Generating architectural blueprint and prompt instructions.
3. **Canvas & Code Studio**:
   - **Preview Mode**: Live responsive canvas (Desktop / Tablet / Mobile).
   - **Edit Mode**: Inline text editing with color picker and section rearrangement.
   - **See Code**: Integrated `LiveCodeViewer` displaying full Next.js App Router source files with syntax highlighting, single-file copy, and ZIP download.
   - **Claude Code & REA Inspector**: Dedicated modal displaying the extracted REA report, design tokens, and a 1-click `Copy Claude Code Prompt` button.

### Visual Identity & Theme
- **Aesthetic Direction**: High-density developer cockpit, dark graphite workspace (`#09090f`), sharp borders (`border-white/10`), crisp monospace typography for code/tokens, and restrained flame/violet accents.
- **Color Palette**:
  - Background: `#05050a` (Deep Space) / Surface: `#0d0d16` (Cockpit Slate)
  - Primary Accent: `#f97316` (REA Flame) / Secondary Accent: `#8b5cf6` (Claude Violet)
  - Text: `#f8fafc` (Primary) / `#94a3b8` (Muted Secondary)
- **Zero-Pill Discipline**: Clean inline metadata with typographic separators (`·`) rather than colorful rounded pill badges; functional segmented controls with clear active states for view switching (Preview / Edit / Code).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: morluto/rea Agent Engine Architecture
- **Chosen Approach**: Implement a hybrid REA agent route in `/app/api/rea/analyze/route.ts` that:
  - If `GEMINI_API_KEY` is present, conducts live multimodal LLM reverse-engineering of the URL to generate high-fidelity, nuanced copy and custom styling tokens.
  - If offline or keyless, uses an intelligent domain archetype analyzer (SaaS, FinTech, E-Commerce, DevTools, Creative Portfolio, Hospitality) that extracts realistic, cohesive design systems and structures without failing.
  - Generates a dedicated `CLAUDE.md` and `rea-spec.json` bundled directly into the project exports.
- **Why**: Ensures 100% reliability for both local evaluation and production environments, giving immediate high-fidelity output regardless of external API rate limits.

### Decision 2: Console Error Resolutions
- **Duplicate Key in LiveCodeViewer**:
  - *Fix*: Deduplicate file paths in `components/LiveCodeViewer.tsx` before rendering tree items, ensuring `components/Footer.tsx` and custom section components maintain unique keys.
- **React 19 Style Collision in SiteRenderer**:
  - *Fix*: Update `gradText` helper from `background: p.grad` to `backgroundImage: p.grad`, preserving `WebkitBackgroundClip: "text"` and `backgroundClip: "text"` without React shorthand reset warnings.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                                │
│  ┌──────────────────────┐  ┌─────────────────┐  ┌───────────────────┐  │
│  │   Hero / Dashboard   │  │ Builder Canvas  │  │ Live Code Viewer  │  │
│  │ (URL Input + Prompt) │  │(Preview & Edit) │  │ (Next.js Project) │  │
│  └──────────┬───────────┘  └────────┬────────┘  └─────────┬─────────┘  │
└─────────────┼───────────────────────┼─────────────────────┼────────────┘
              │                       │                     │
              ▼                       ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   morluto/rea ENGINE & CONTROLLERS                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ `/app/api/rea/analyze` & `/lib/serverStore.ts`                   │  │
│  │  - URL Normalization & Archetype Detection                       │  │
│  │  - Token Extractor (Colors, Radii, Fonts, Layout Grid)           │  │
│  │  - Component Decompiler (Navbar, Hero, Bento, Stats, Footer)     │  │
│  │  - Claude Code Agent Spec Generator (`CLAUDE.md`, MCP tools)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Generated Outputs:                                               │  │
│  │  1. `SiteDoc` / `SiteV2` JSON Model (Interactive in Canvas)      │  │
│  │  2. Complete Next.js 15+ App Router Project Files                │  │
│  │  3. `CLAUDE.md` + Agent Prompts for Claude Code CLI              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & File Work Plan
1. **`components/LiveCodeViewer.tsx`**:
   - Deduplicate `generatedFiles` array to prevent duplicate `components/Footer.tsx`.
   - Add `CLAUDE.md` to the exported file tree showing the exact instructions and prompt to run Claude Code locally.
2. **`components/SiteRenderer.tsx`**:
   - Update `gradText` to use `backgroundImage` instead of `background` shorthand.
3. **`lib/serverStore.ts` & `/app/api/rea/analyze/route.ts`**:
   - Enhance `generateSiteFromUrl` to generate comprehensive design tokens, copywriting archetypes, and Claude Code instructions.
   - Include `claudeCodeSpec` in the returned project payload.
4. **`components/ReaInspectorModal.tsx`**:
   - Add a dedicated **Claude Code Prompt & MCP** tab with 1-click copy for `claude "rebuild this site with the extracted REA design tokens"`.
