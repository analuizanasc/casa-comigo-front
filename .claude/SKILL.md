---
name: casa-comigo-design
description: Use this skill to generate well-branded interfaces and assets for Casa Comigo, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. Casa Comigo is a collaborative household-chore app with a Northeastern-Brazilian woodcut (xilogravura) identity, modernized for lightness.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

Key files:
- `readme.md` — full design guide (content + visual foundations, iconography, index).
- `styles.css` + `tokens/` — global CSS, color/type/spacing/elevation tokens, gravura motifs.
- `components/` — React primitives (Button, Card, Badge, Tag, Avatar, Input, Select, PreferenceToggle, ProgressBar, ProgressRing). Mount via `window.CasaComigoDesignSystem_64c258`.
- `guidelines/` — foundation specimen cards.
- `ui_kits/casa-comigo/` — navigable app recreation.

Core brand cues: warm paper canvas (never pure white), terracotta (barro) primary action, Anton display + Archivo body, Sol do Sertão motif, soft floating cards with warm layered shadows. Portuguese (pt-BR) copy, warm/collective tone.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
