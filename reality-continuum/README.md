# Reality Continuum

**Reality Continuum** is a new flagship project synthesized from the ideas, systems, aesthetics, scientific instincts, game mechanics, data tooling, and infrastructure experiments across the `ancientpagoda-rgb` GitHub account.

It is **not** a monorepo of the old projects. It is a new product with one organizing idea:

> Build one continuous, persistent representation of reality that can be explored across scale and time, while keeping simulated, reconstructed, and observed states explicitly distinct.

## The experience

The user can move continuously through:

```text
observable universe
  → galaxy / star / planetary system
    → planet / terrain / climate / hydrology
      → ecosystems / evolution
        → organism / body
          → brain / internal model
            → settlements / societies
              → history / language / population
                → the live present
```

Three truth modes share the same interface:

- **Simulated** — deterministic, causal worlds that can branch.
- **Reconstructed** — historically/scientifically anchored past states with uncertainty and provenance.
- **Observed** — current or catalog-backed measurements and public live data.

The project must never silently blur these modes.

## Core architecture

1. **Continuity graph** — objects inherit from prior scales instead of spawning disconnected scenes.
2. **Shared clock** — one authoritative time system drives all active subsystems.
3. **Adaptive fidelity** — increase detail around the current observation/interaction region.
4. **Provenance ledger** — every field can state whether it is measured, reconstructed, model-derived, provisional, or artistic.
5. **Embodied agents** — organisms and people act inside the same physical world they perceive.
6. **Persistent world** — settlements, ecology and agent consequences survive across sessions.
7. **Live observatory** — present-day public feeds can occupy the same UI without masquerading as simulation.
8. **Resilience** — reproducible builds, checksums, backups, restore drills and hardening are part of the product architecture.

## Prototype

This repository scaffold contains a no-dependency browser concept showing the intended scale rail, truth modes, timeline and visual continuity.

Run:

```bash
cd reality-continuum
python3 -m http.server 4174
```

Open `http://127.0.0.1:4174`.

## Next implementation phases

### Phase 1 — Continuum shell
- authoritative clock and deterministic seeds
- camera/scale state
- provenance schema
- persistent world snapshot format
- modular renderer contract

### Phase 2 — Cosmos → planet continuity
- catalog-backed observable mode
- reduced cosmology/stellar/planet formation simulated mode
- live ephemerides for observed Solar System mode

### Phase 3 — Planetary engine
- terrain, water, atmosphere, climate, seasons and tides
- reconstructed Earth mode and procedural-world mode
- data ingestion with versioned manifests and checksums

### Phase 4 — Life
- plants, animals, heredity, selection, niches and speciation
- chemical/prebiotic bridge as an optional deeper layer
- explicit extinction and ecosystem feedbacks

### Phase 5 — Minds
- embodied sensory agents
- memory, learning, prediction and internal drives
- atlas/reference brain lens kept separate from simulated cognition

### Phase 6 — Civilization
- settlements, construction, resource flows, conflict and cooperation
- language/culture/history layers
- persistent shared-world backend when multiplayer/persistence is activated

### Phase 7 — Reality Now
- astronomy, weather, Earth imagery, population/country indicators, markets and headlines
- data sonification
- observed-mode dashboards that feed the same scene graph

### Phase 8 — Operations
- automated backups
- restore verification
- deployment hardening
- source/data integrity checks
