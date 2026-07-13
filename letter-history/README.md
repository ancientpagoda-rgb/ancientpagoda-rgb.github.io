# Letter History

A fresh version of the project that treats letters as the organisms.

The unit is not an idea, concept, or philosophy. The unit is a visible letter
form: a mark that survives by being copied, rotated, renamed, borrowed, split,
merged, and repurposed.

## Frame

Letters have histories:

```text
pictorial sign
  -> Semitic letter name and sound
  -> Phoenician letter
  -> Greek adaptation
  -> Etruscan / Old Italic adaptation
  -> Latin letter
  -> modern printed and digital forms
```

The first prototype starts with the modern Latin alphabet and stores a compact
ancestry for each letter.

The current `index.html` renders this as a poster-style lineage map: one row per
modern letter, colored zones for major script stages, and clickable rows for
detail.

## Evidence Caveat

Letter histories are not always clean single-parent family trees. Some letters
split from one ancestor, some were reintroduced, some changed sound, and some
are late medieval or early modern variants. The data uses confidence labels
instead of pretending every path is equally certain.
