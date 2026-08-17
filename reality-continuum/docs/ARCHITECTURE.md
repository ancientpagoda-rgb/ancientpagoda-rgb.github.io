# Architecture Sketch

## State graph

```text
ContinuumState
├─ clock
│  ├─ epoch
│  ├─ rate
│  └─ branch
├─ provenance
│  ├─ observed
│  ├─ reconstructed
│  ├─ modelDerived
│  ├─ provisional
│  └─ artistic
├─ cosmos
│  └─ selectedGalaxy → selectedStar → selectedSystem
├─ planet
│  ├─ terrain
│  ├─ atmosphere
│  ├─ hydrology
│  ├─ climate
│  └─ resources
├─ biosphere
│  ├─ chemistry
│  ├─ plants
│  ├─ animals
│  └─ lineages
├─ agents
│  ├─ bodies
│  ├─ senses
│  ├─ memory
│  ├─ drives
│  └─ modelsOfWorld
├─ society
│  ├─ settlements
│  ├─ institutions
│  ├─ culture
│  ├─ language
│  └─ economy
└─ observation
   ├─ astronomyFeeds
   ├─ earthFeeds
   ├─ markets
   └─ headlines
```

## Runtime rule

Only one subsystem owns authoritative advancement of simulation time. Renderers observe state; they do not secretly advance it. High-detail modules can substep, but reconcile into the parent clock.

## Truth contract

Every exposed quantity carries:

```js
{
  value,
  unit,
  truthClass,      // observed | reconstructed | model-derived | provisional | artistic
  sourceIds: [],
  epoch,
  uncertainty,
  method
}
```

This is the common contract that allows Earth 777-style scientific rigor, live dashboards and fictional/procedural worlds to coexist without semantic confusion.
