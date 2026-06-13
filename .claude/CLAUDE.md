# Casa Comigo — Design System

App de organização e distribuição justa de tarefas domésticas, com identidade de **xilogravura nordestina** modernizada.

**Arquivos do design system:** `~/.claude/casa-comigo-design-system/`

Ao trabalhar em qualquer interface do Casa Comigo, leia o `readme.md` e explore os arquivos dessa pasta para se tornar expert na marca.

---

## Repositórios

- **Front-end (React + TypeScript + Vite):** https://github.com/analuizanasc/casa-comigo-front
- **App:** https://github.com/analuizanasc/casa-comigo

---

## Arquivos-chave

- `styles.css` + `tokens/` — CSS global, tokens de cor/tipo/espaço/elevação e motivos de gravura
- `components/` — Primitivos React: Button, Card, Badge, Tag, Avatar, Input, Select, PreferenceToggle, ProgressBar, ProgressRing, Icon
- `guidelines/` — Cartões-espécime das fundações visuais
- `ui_kits/casa-comigo/` — Recriação navegável do app (Login, Cronograma, Catálogo, Membros, Relatórios)
- `uploads/` — Mockups originais das telas

---

## Identidade visual — regras essenciais

**Paleta**
- Fundo: `#F1E7D3` (papel creme) — **nunca branco puro**
- Texto: `#211A12` (tinta quente)
- Primária: `#B14A28` (barro/terracota)
- Acentos: anil (informação), verde-caatinga (leve/sucesso), ocre/sol-do-sertão (atenção), vermelho-barro (perigo)

**Tipografia**
- Display/títulos: **Anton** — caixa-alta, condensada, espírito de cartaz de cordel
- Corpo/UI: **Archivo** — grotesca legível
- Sobrancelhas: Archivo 700, 12px, tracking 0.22em, em barro

**Elevação**
- Cartões flutuam com **sombras quentes em camadas** (translúcidas em tinta), não sombra dura
- Hover de cartão interativo: eleva `-4px`
- Sombra dura de carimbo (`4px 4px 0`) é **acento opcional**, não padrão

**Cantos**
- Cartões: 18px · Painéis: 26px · Pílulas: 999px · Botões: 12–18px
- Canto reto de 4px reservado como **acento de carimbo** (não padrão)

**Bordas**
- Cartões e controles: `1.5px solid rgba(33,26,18,.32)` — visível, traço de gravura

**Botões**
- Primário: barro com sombra quente
- Secundário: areia `#EADCC0` com borda marcante — **não existe botão branco**
- Hover: eleva `-2px`; Press: `scale(0.98)`

**Iconografia**
- Sistema xilográfico próprio em `components/icons/Icon.jsx` — traço marcante ~6px, cantos retos
- SVGs isolados em `assets/icons/*.svg` (calendar, clipboard, heart, users, chart)
- **Não misturar** com Lucide ou outros ícones de traço fino
- Motivos de gravura CSS: `sol`, `serrilha`, `hachura`, `losango` — acentos de marca, não ícones de controle

---

## Conteúdo e tom

- **Idioma:** português do Brasil, sempre
- **Tom:** caloroso, coletivo, direto — vocabulário de "casa", "mutirão", "morador"
- **Casing:** títulos em caixa-alta (Anton); rótulos/selos em CAIXA-ALTA com tracking; corpo em sentence case
- **Verbos curtos:** "Distribuir tarefas", "Convidar membro", "Concluir", "Reatribuir"
- **Eyebrows com voz de casa:** "Mutirão da semana", "Quem mora na casa", "A despensa de serviços"
- **Status de tarefa:** Leve / Médio / Pesado · Pendente / Concluída / Atrasada / Redistribuída
- **Papéis:** Administrador / Gestor de Catálogo / Morador
