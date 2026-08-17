export const scenes = [
  {
    id: 'cosmos', icon: '✦', name: 'Cosmos', scale: '10²⁶ m → 10¹⁶ m', title: 'Observable Universe',
    subtitle: 'Cosmic structure, galaxies, stellar populations, time and scale.',
    description: 'A zoomable cosmological context. Large-scale structure is treated as reduced simulation or catalog-backed observation depending on mode.',
    truth: { simulated:'reduced physics', reconstructed:'model + anchors', observed:'catalog data' },
    metrics: [['Age','13.8 Gyr'],['Scale','cosmic web'],['Objects','galaxies'],['Clock','shared']]
  },
  {
    id: 'system', icon: '☉', name: 'Star System', scale: '10¹³ m → 10⁷ m', title: 'Star & Planet Formation',
    subtitle: 'One causal path from stellar environment to a generated world.',
    description: 'A selected system inherits its stellar population, disk conditions, orbital state and planetary composition rather than spawning as an unrelated scene.',
    truth: { simulated:'formation model', reconstructed:'anchored analog', observed:'ephemerides' },
    metrics: [['Star','selected'],['Planets','inherited'],['Orbit','continuous'],['Seed','deterministic']]
  },
  {
    id: 'earth', icon: '◉', name: 'Earth', scale: '10⁷ m → 10³ m', title: 'Planetary Earth',
    subtitle: 'Terrain, climate, water, vegetation, deep time, weather and live data.',
    description: 'Earth can be explored as a reconstructed paleoworld, a branching Free Earth, or the measured present. Provenance follows every field.',
    truth: { simulated:'free branch', reconstructed:'777 ka + history', observed:'live Earth' },
    metrics: [['Terrain','versioned'],['Water','conserved'],['Climate','multi-source'],['Provenance','visible']]
  },
  {
    id: 'ecology', icon: '❧', name: 'Ecology', scale: '10⁴ m → 10⁻⁶ m', title: 'Living Planet',
    subtitle: 'Water → plants → animals → selection → speciation.',
    description: 'Ecology is a causal subsystem of the same planet: resources move, organisms inherit traits, niches shift and lineages can branch or vanish.',
    truth: { simulated:'causal ecology', reconstructed:'evidence envelopes', observed:'field layers' },
    metrics: [['Plants','dynamic'],['Animals','embodied'],['Evolution','heritable'],['Extinction','possible']]
  },
  {
    id: 'organism', icon: '⌁', name: 'Organism', scale: '10⁰ m → 10⁻⁶ m', title: 'Embodied Organisms',
    subtitle: 'Senses, drives, bodies, metabolism, movement and environmental action.',
    description: 'Agents exist physically inside the world. Their perception is local and limited; their actions modify the same environment that constrains them.',
    truth: { simulated:'agent state', reconstructed:'behavioral priors', observed:'atlas/reference' },
    metrics: [['Body','physical'],['Senses','limited'],['Needs','internal'],['Actions','world-coupled']]
  },
  {
    id: 'brain', icon: '⌘', name: 'Brain', scale: '10⁻¹ m → 10⁻⁶ m', title: 'Brain & Internal Model',
    subtitle: 'Wiring, memory, prediction, learning, emotion-like drives and decisions.',
    description: 'The cognition layer connects anatomical reference structure with simplified adaptive agents. Brain visualizations stay distinct from simulated minds.',
    truth: { simulated:'cognitive model', reconstructed:'comparative model', observed:'atlas-derived' },
    metrics: [['Wiring','atlas lens'],['Memory','agent'],['Learning','adaptive'],['Prediction','local']]
  },
  {
    id: 'society', icon: '⚑', name: 'Society', scale: '10⁵ m → 10⁰ m', title: 'Settlements & Societies',
    subtitle: 'Cooperation, conflict, economies, construction, culture and institutions.',
    description: 'Embodied people can form settlements and institutions. Resources, buildings, threats and social organization remain tied to the planet beneath them.',
    truth: { simulated:'emergent society', reconstructed:'historical constraints', observed:'current indicators' },
    metrics: [['People','agents'],['Resources','physical'],['Culture','evolving'],['World','persistent']]
  },
  {
    id: 'history', icon: '⌛', name: 'History', scale: 'millennia → seconds', title: 'Human Timeline',
    subtitle: 'Language, population, migration, states, technology and ecological change.',
    description: 'A scrub-able historical layer uses explicit anchor evidence and uncertainty, avoiding synthetic precision where the record is coarse.',
    truth: { simulated:'counterfactual branch', reconstructed:'historical anchors', observed:'modern datasets' },
    metrics: [['Time','scrubbable'],['Language','regional'],['Population','anchored'],['Uncertainty','explicit']]
  },
  {
    id: 'live', icon: '◌', name: 'Live Reality', scale: 'now', title: 'Reality Now',
    subtitle: 'Weather, astronomy, markets, headlines and planetary signals.',
    description: 'The present-day observatory feeds public data into the same interface, while clearly separating measurements from derived indices and artistic sonification.',
    truth: { simulated:'fallback stream', reconstructed:'recent history', observed:'live feeds' },
    metrics: [['Earth','live'],['Space weather','live'],['Markets','live'],['Audio','sonified']]
  }
];
