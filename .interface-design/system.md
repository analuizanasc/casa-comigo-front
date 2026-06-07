# Casa Comigo — Design System

## Direction
Warm, domestic. Paleta inspirada em terracota (cerâmica), linho (tecidos), sálvia (plantas de cozinha) e madeira âmbar. Sensação de uma casa bem cuidada — organizada mas acolhedora, não corporativa.

## Depth strategy
Borders-only com shadow-sm apenas em hover de cards elevados. Nada de shadows dramáticos.

## Spacing base unit
4px (`--sp-1`). Escala: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48.

## Color palette
- Canvas: `#F5F0EA` — warm cream, fundo de página
- Surface: `#FDFAF5` — sidebar, levemente mais claro
- Surface-raised: `#FFFFFF` — cards, modais
- Terracota: `#C05A38` — primary brand, CTAs
- Sage: `#5A7D63` — secondary accent
- Borders: `rgba(44, 31, 26, 0.10)` — borda padrão, quente

## Typography
Inter, sem serifa. Pesos: 700-800 para títulos, 600 para labels/nav, 500 para corpo, 400 nunca usado explicitamente.

## Component patterns
- **Sidebar**: mesma cor que surface (não contraste), borda direita sutil. Links com hover terracota-light.
- **Cards** (task, member, house): border-radius 16px, border 1px, hover eleva border para --border-mid.
- **Buttons**: primary=terracota, secondary=borda, ghost=transparente. Sem sombra, só cor.
- **Badges**: pill (border-radius 100px), background=light variant, color=token.
- **Modal**: border-radius 22px, backdrop blur 2px, shadow-lg.
- **Toasts**: bottom-right, 4s auto-dismiss, border colorida por tipo.
- **Inputs**: fundo canvas (mais escuro que surface — "inset"), focus ring terracota.
- **Progress bars**: height 8px, border-radius 100px, terracota fill.
- **Avatar**: círculo terracota-light com inicial em terracota.

## Key signatures
- Assignment cards: borda esquerda 3px colorida por status (success/danger/warning/gray)
- Preference toggles: 3 botões emoji (👎😐👍) com opacity 0.35 → 1 no ativo
- Performance ring: SVG circle com stroke-dashoffset animado
- Weight bars: fill width transitionado 0.5s
