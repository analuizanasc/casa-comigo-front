import React from 'react';

/* ============================================================
   Casa Comigo · Ícones xilográficos
   Traço marcante (currentColor), fundo de papel (var(--icon-paper)),
   cantos retos (miter/square) — tinta sobre madeira.
   viewBox 0 0 100 100 · escala com `size`.
   ============================================================ */
export const WOODCUT_ICONS = {
  /* ---- navegação ---- */
  calendar: '<polygon points="10,22 88,20 90,90 12,92" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/><line x1="11" y1="44" x2="89" y2="46" stroke="currentColor" stroke-width="6"/><rect x="26" y="11" width="8" height="18" fill="currentColor"/><rect x="66" y="13" width="8" height="18" fill="currentColor"/><rect x="26" y="55" width="15" height="11" fill="currentColor"/><line x1="50" y1="61" x2="74" y2="61" stroke="currentColor" stroke-width="5"/><line x1="26" y1="78" x2="50" y2="78" stroke="currentColor" stroke-width="5"/><line x1="58" y1="78" x2="74" y2="78" stroke="currentColor" stroke-width="5"/>',
  clipboard: '<polygon points="18,16 82,19 80,93 20,89" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/><polygon points="35,6 65,9 63,23 37,21" fill="currentColor"/><line x1="30" y1="38" x2="70" y2="40" stroke="currentColor" stroke-width="5" stroke-dasharray="8 4 15 5"/><line x1="28" y1="53" x2="68" y2="55" stroke="currentColor" stroke-width="5" stroke-dasharray="12 6 8 4"/><line x1="32" y1="68" x2="72" y2="66" stroke="currentColor" stroke-width="5" stroke-dasharray="6 3 20 4"/><line x1="30" y1="81" x2="55" y2="79" stroke="currentColor" stroke-width="5" stroke-dasharray="10 5"/>',
  heart: '<path d="M50 90 L15 50 C5 35 15 15 35 15 C45 15 50 25 50 25 C50 25 55 15 65 15 C85 15 95 35 85 50 Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="miter"/><path d="M50 78 L25 50 C18 40 25 25 35 25 C42 25 50 35 50 35 C50 35 58 25 65 25 C75 25 82 40 75 50 Z" fill="var(--icon-paper)"/><path d="M50 65 L35 48 C30 42 35 32 42 32 C46 32 50 38 50 38 C50 38 54 32 58 32 C65 32 70 42 65 48 Z" fill="currentColor"/>',
  users: '<polygon points="45,90 95,90 85,60 55,60" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/><circle cx="70" cy="40" r="14" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6"/><polygon points="5,90 60,90 50,55 15,55" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="miter"/><circle cx="35" cy="35" r="16" fill="currentColor" stroke="currentColor" stroke-width="2"/><line x1="15" y1="65" x2="25" y2="60" stroke="var(--icon-paper)" stroke-width="2"/><line x1="12" y1="75" x2="30" y2="70" stroke="var(--icon-paper)" stroke-width="2"/>',
  chart: '<line x1="12" y1="12" x2="14" y2="90" stroke="currentColor" stroke-width="6" stroke-linecap="square"/><line x1="12" y1="90" x2="94" y2="88" stroke="currentColor" stroke-width="6" stroke-linecap="square"/><polygon points="22,52 36,50 38,86 24,86" fill="currentColor"/><polygon points="46,66 60,64 62,86 48,86" fill="var(--icon-paper)" stroke="currentColor" stroke-width="5" stroke-linejoin="miter"/><polygon points="70,28 84,30 85,86 72,86" fill="currentColor"/>',

  /* ---- interface ---- */
  clock: '<circle cx="50" cy="52" r="36" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6"/><line x1="50" y1="10" x2="50" y2="20" stroke="currentColor" stroke-width="6"/><line x1="50" y1="52" x2="50" y2="30" stroke="currentColor" stroke-width="6" stroke-linecap="square"/><line x1="50" y1="52" x2="68" y2="62" stroke="currentColor" stroke-width="6" stroke-linecap="square"/>',
  house: '<polygon points="50,12 92,48 80,48 80,88 20,88 20,48 8,48" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/><rect x="42" y="60" width="16" height="28" fill="currentColor"/>',
  check: '<polyline points="16,52 40,78 86,24" fill="none" stroke="currentColor" stroke-width="11" stroke-linejoin="miter" stroke-linecap="square"/>',
  plus: '<line x1="50" y1="16" x2="50" y2="84" stroke="currentColor" stroke-width="11" stroke-linecap="square"/><line x1="16" y1="50" x2="84" y2="50" stroke="currentColor" stroke-width="11" stroke-linecap="square"/>',
  repeat: '<path d="M22 42 A30 30 0 0 1 80 36" fill="none" stroke="currentColor" stroke-width="6"/><polygon points="80,19 91,40 65,40" fill="currentColor"/><path d="M78 58 A30 30 0 0 1 20 64" fill="none" stroke="currentColor" stroke-width="6"/><polygon points="20,81 9,60 35,60" fill="currentColor"/>',
  alert: '<polygon points="50,14 92,86 8,86" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/><line x1="50" y1="40" x2="50" y2="64" stroke="currentColor" stroke-width="8" stroke-linecap="square"/><rect x="45" y="71" width="10" height="9" fill="currentColor"/>',
  zap: '<polygon points="56,8 24,56 47,56 41,92 80,40 53,40" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="miter"/>',
  userplus: '<circle cx="40" cy="34" r="16" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6"/><path d="M12 86 C12 58 68 58 68 86" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/><line x1="82" y1="28" x2="82" y2="56" stroke="currentColor" stroke-width="6" stroke-linecap="square"/><line x1="68" y1="42" x2="96" y2="42" stroke="currentColor" stroke-width="6" stroke-linecap="square"/>',
  arrowleft: '<line x1="22" y1="50" x2="84" y2="50" stroke="currentColor" stroke-width="8" stroke-linecap="square"/><polyline points="46,26 20,50 46,74" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="miter" stroke-linecap="square"/>',
  x: '<line x1="24" y1="24" x2="76" y2="76" stroke="currentColor" stroke-width="10" stroke-linecap="square"/><line x1="76" y1="24" x2="24" y2="76" stroke="currentColor" stroke-width="10" stroke-linecap="square"/>',

  /* ---- faces de preferência (substituem emoji) ---- */
  happy: '<circle cx="50" cy="50" r="38" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6"/><rect x="32" y="36" width="9" height="12" fill="currentColor"/><rect x="59" y="36" width="9" height="12" fill="currentColor"/><path d="M32 62 Q50 80 68 62" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="square"/>',
  neutral: '<circle cx="50" cy="50" r="38" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6"/><rect x="32" y="36" width="9" height="12" fill="currentColor"/><rect x="59" y="36" width="9" height="12" fill="currentColor"/><line x1="34" y1="66" x2="66" y2="66" stroke="currentColor" stroke-width="6" stroke-linecap="square"/>',
  sad: '<circle cx="50" cy="50" r="38" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6"/><rect x="32" y="36" width="9" height="12" fill="currentColor"/><rect x="59" y="36" width="9" height="12" fill="currentColor"/><path d="M32 72 Q50 54 68 72" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="square"/>',
};

/**
 * Icon — ícone xilográfico do Casa Comigo. Herda a cor do texto
 * (`currentColor`) no traço; o `paper` pinta os recortes claros.
 */
export function Icon({ name, size = 24, color, paper = 'var(--papel-branco)', style = {}, title, ...props }) {
  const inner = WOODCUT_ICONS[name];
  return (
    <span
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, lineHeight: 0, flex: 'none',
        color: color || 'currentColor', '--icon-paper': paper, ...style,
      }}
      dangerouslySetInnerHTML={{
        __html: inner
          ? `<svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`
          : '',
      }}
      {...props}
    />
  );
}
