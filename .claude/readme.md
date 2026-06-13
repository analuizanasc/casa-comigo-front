# Casa Comigo · Sistema de Design

> **A casa é um mutirão.** Sistema de design para um app de organização e
> distribuição justa de tarefas domésticas — com identidade de **xilogravura
> nordestina**, modernizada para leveza e boas práticas de UX/UI.

Casa Comigo é um sistema web e app onde moradores de uma mesma casa cadastram
tarefas, definem a porcentagem de carga de cada pessoa e indicam preferências
(o que gostam e o que têm limitação de fazer). O sistema então **distribui as
tarefas com justiça**. Público: jovens adultos dividindo casa com amigos ou
parceiros, e famílias com crianças — gente que acredita em divisão justa do lar.

A linguagem visual nasce do **folheto de cordel** e da **xilogravura**: tinta
quente sobre papel creme, carimbos de madeira, serrilhas de cordel e o sol do
sertão. Nesta versão, mantivemos essa identidade e a **modernizamos**: cartões
que *flutuam* sobre o papel (sombras quentes em camadas, cantos macios), no
espírito da referência de UI escolhida — componentes "descolados" do fundo,
trazendo leveza e modernidade.

---

## Fontes / origens

- **GitHub (front-end real):** https://github.com/analuizanasc/casa-comigo-front — React + TypeScript + Vite. Fonte de verdade para a API de componentes (Button, Badge, Input, Sidebar) e para as telas (Login, Houses, Schedule, Catalog, Members, Preferences, Reports). Explore para aprofundar.
- **GitHub (app):** https://github.com/analuizanasc/casa-comigo
- **Mockups v1 enviados** (`uploads/`): Cronograma, Catálogo, Preferências, Membros, Relatórios e a página de Sistema de Design original — base da paleta e dos motivos de gravura.
- **Referência de UI:** peça "Arounda UX/UI" (`uploads/escolhida.png`) — inspiração para componentes flutuantes/leves.

> O leitor pode não ter acesso aos repositórios privados; os links ficam
> registrados para quem tiver.

---

## CONTENT FUNDAMENTALS — como escrevemos

- **Idioma:** português do Brasil, sempre.
- **Tom:** caloroso, coletivo e direto — fala de "casa", "mutirão", "morador".
  Há um toque poético de cordel reservado a títulos e epígrafes
  (*"o serviço se reparte como farinha na mesa"*), nunca em rótulos de UI.
- **Pessoa:** fala-se **com** o morador ("Diga o que você gosta", "Minhas
  preferências", "Bem-vindo de volta"). Primeira pessoa aparece em telas
  pessoais ("Minhas casas", "Minhas preferências").
- **Casing:** títulos de página em **caixa-alta de cartaz** (Anton). Rótulos,
  selos e sobrancelhas em CAIXA-ALTA com tracking largo. Corpo em sentence case.
- **Verbos de ação curtos e no infinitivo/imperativo:** "Distribuir tarefas",
  "Convidar membro", "Concluir", "Reatribuir", "Remover", "Editar".
- **Sobrancelhas (eyebrows) com voz de casa:** "Mutirão da semana", "Quem mora
  na casa", "A despensa de serviços", "Cada um no seu feitio", "A conta do
  mutirão". Cada tela tem uma — é parte da personalidade.
- **Esforço e status nomeados:** Leve / Médio / Pesado; Pendente / Concluída /
  Atrasada / Redistribuída; Administrador / Gestor de Catálogo / Morador.
- **Números com vírgula decimal** (pt-BR): `54,5%`, `±10pp`.
- **Emoji:** moderação. A preferência por tarefa usa 👎 😐 👍 (faz parte do
  produto). Fora isso, ícones são de traço (Lucide) — sem emoji decorativo.

---

## VISUAL FOUNDATIONS

**Paleta.** Papel creme (`#F1E7D3`) é o canvas — **nunca branco puro**. Texto é
tinta quente (`#211A12`). A **ação primária é o barro/terracota** (`#B14A28`),
herança direta do app. Acentos nordestinos de função: **anil** (informação),
**verde-caatinga** (leve/sucesso), **sol do sertão / ocre** (médio/atenção),
**vermelho-barro** (pesado/perigo). Camada semântica de estado: erro `#C82014`,
aviso `#FBBC05`, sucesso `#006241`. Imagens, quando entram, são quentes e
terrosas (gravura preta sobre papel ou tons de barro).

**Tipografia.** **Anton** (display, caixa-alta, condensada) é o cartaz de cordel
— títulos, números grandes, marca. **Archivo** (grotesca legível) faz todo o
corpo, rótulos e dados. Sobrancelhas: Archivo 700, 12px, tracking 0.22em.

**Espaço.** Escala base-4 (4 → 96px). Layout arejado; mais respiro que a v1.

**Cantos.** Modernizados e **mais arredondados / soltos do fundo**: cartões em
18px, painéis em 26px, pílulas em 999px; botões em 12–18px. O canto **quase reto
de 4px** (`--radius-carimbo`) é reservado como **acento de carimbo** — não é o
padrão.

**Elevação / fundos.** A grande mudança de modernização: componentes **flutuam**
sobre o papel via **sombras quentes em camadas** (`--shadow-sm/md/lg`, em tinta
translúcida), em vez da sombra dura preta da v1. A ação primária ganha sombra de
barro. O fundo é o papel creme com **grão sutil de impressão** (ruído ~4%). A
sombra dura de carimbo (`--shadow-carimbo`) sobrevive como acento opcional.

**Bordas.** Para manter o **traço marcante** da gravura, cartões e controles usam
uma borda de **1,5px em `--border-mark`** (`rgba(33,26,18,.32)`) — visível, no
lugar do hairline quase invisível. O traço grosso reaparece em selos e no acento
"carimbo".

**Animação.** Discreta e funcional. Durações 120–280ms, `ease-out` suave.
Hover de botão/cartão = leve **elevação** (translateY -2/-3px) + sombra maior;
press = `scale(0.98)`. Sem bounce, sem loops decorativos.

**Estados.** Hover: superfície escurece levemente / eleva. Foco: anel macio de
4px na cor de ação (barro). Press: afunda/encolhe. Inválido: borda e anel
vermelhos.

**Botões.** Primária = barro com borda de barro-fundo e sombra quente. **Não há
botão branco** — a secundária usa **areia** (`--areia` #EADCC0), superfície tátil
de madeira com borda marcante; há ainda `ink` (tinta), `ghost` e `danger`.
Hover eleva (-2px) e aprofunda a sombra; press = `scale(0.98)`.

**Cartões.** Superfície `papel-branco`, **borda marcante 1,5px**, raio 18px,
sombra média; elevam (-4px) no hover quando interativos. Variante `stamp` =
canto reto + sombra dura (gravura).

**Transparência/blur.** Usada com parcimônia — apenas anéis de foco translúcidos.
Sem glassmorphism.

---

## ICONOGRAPHY

- **Ícones xilográficos próprios — `components/icons/Icon.jsx`.** Derivados das
  referências de gravura enviadas: traço marcante (`currentColor`, ~6px no
  viewBox de 100), recortes claros pintados pelo papel (`--icon-paper`), cantos
  retos (miter/square) e leves hachuras. É **o** sistema de ícones da marca —
  substitui o emoji e os ícones de traço fino.
- **Uso:** `<Icon name="calendar" size={24} />`. O traço herda a cor do texto;
  `color` e `paper` permitem temá-lo. Tamanhos confortáveis: 22–24px na
  navegação, 14–16px em chips/botões, 24–34px nas faces.
- **Conjunto:**
  - *Navegação* — `calendar` (Cronograma), `clipboard` (Catálogo), `heart`
    (Preferências), `users` (Membros), `chart` (Relatórios).
  - *Interface* — `clock`, `house`, `check`, `plus`, `repeat`, `alert`, `zap`,
    `userplus`, `arrowleft`, `x`.
  - *Faces de preferência* — `sad` / `neutral` / `happy` (substituem 👎😐👍).
- **Para ícones fora do conjunto:** desenhe no mesmo estilo (viewBox 100, traço
  6, miter/square, recortes em `var(--icon-paper)`) e adicione ao registro
  `WOODCUT_ICONS`. Evite misturar ícones de traço fino (ex.: Lucide).
- **Assets:** as 5 marcas de navegação também existem como SVG isolado em
  `assets/icons/*.svg` para uso fora do React.
- **Motivos de gravura** (CSS, em `tokens/motifs.css`): `sol` (brasão/marca),
  `serrilha` (borda de cordel), `hachura` (sombra de buril / fundo de imagem),
  `losango` (grade de diamantes). São **acentos de marca** — não substituem
  ícones de controle. Veja `guidelines/brand-*.card.html`.
- Não há fonte de ícone própria nem SVGs proprietários no repositório original;
  este conjunto xilográfico foi criado para o sistema.

---

## ÍNDICE — o que há nesta pasta

**Raiz**
- `styles.css` — ponto de entrada global (apenas `@import`s).
- `readme.md` — este guia.
- `SKILL.md` — manifesto para uso como Agent Skill.

**`tokens/`** — fundações em CSS custom properties
- `colors.css` · `typography.css` · `spacing.css` (espaço, raio, elevação,
  movimento) · `motifs.css` (texturas de gravura) · `base.css` (reset + canvas).

**`components/`** — primitivos React (`window.CasaComigoDesignSystem_64c258`)
- `core/` — **Button**, **Card**, **Avatar**, **Badge**, **Tag**
- `forms/` — **Input**, **Select**, **PreferenceToggle**
- `data/` — **ProgressBar**, **ProgressRing**

**`guidelines/`** — cartões-espécime (Design System tab): cor, tipo, espaço, marca.

**`ui_kits/casa-comigo/`** — recriação navegável do app (Login, Cronograma,
Catálogo, Membros, Relatórios) usando os primitivos.

---

## Substituições / pendências

- **Fontes** carregadas via Google Fonts (Anton + Archivo) por `@import`
  (aprovado). Para uso 100% offline, peça os arquivos `.woff2`.
- **Iconografia** agora é o conjunto **xilográfico próprio** (`Icon`), derivado
  das suas referências de gravura — emoji e Lucide foram removidos da UI.
