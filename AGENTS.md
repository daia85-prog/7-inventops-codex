# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Product decisions

- Approved visual target: `reference-approved.png`.
- This repository is the independent **Codex product line**. Never push changes to the Claude repository; `upstream-claude` is reference-only.
- Baseline imported from `daia85-prog/7-inventops` at commit `e5caccd`. All work after this point belongs to the Codex line.
- Build one cohesive product with three first-class modules: Simulador de Impacto, Comissionamento and Sala de Decisão.
- The Simulador de Impacto is the default screen.
- Use plain executive language. Naming may change autonomously when a term is unclear or technically imprecise.
- Preserve the current `velox-demo/`; this prototype is fully isolated in this folder.
