/* @ds-bundle: {"format":3,"namespace":"CasaComigoDesignSystem_64c258","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"ProgressRing","sourcePath":"components/data/ProgressRing.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"PreferenceToggle","sourcePath":"components/forms/PreferenceToggle.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"WOODCUT_ICONS","sourcePath":"components/icons/Icon.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"7b4952c8db9e","components/core/Badge.jsx":"cd3508725359","components/core/Button.jsx":"8b7b027aa040","components/core/Card.jsx":"7d2682807700","components/core/Tag.jsx":"67e66e76f2ab","components/data/ProgressBar.jsx":"9116d9b8f477","components/data/ProgressRing.jsx":"4a5bcbfa9241","components/forms/Input.jsx":"4cdbb7434045","components/forms/PreferenceToggle.jsx":"25632feeabca","components/forms/Select.jsx":"854f88915090","components/icons/Icon.jsx":"f3149a8b6a15","ui_kits/casa-comigo/login.jsx":"2fb747ae8ff4","ui_kits/casa-comigo/screens.jsx":"500aa081b3c5","ui_kits/casa-comigo/screens2.jsx":"0b05ad17594b","ui_kits/casa-comigo/shell.jsx":"5f887268cccd"},"inlinedExternals":[],"unexposedExports":[{"name":"effortLabel","sourcePath":"components/core/Badge.jsx"},{"name":"effortVariant","sourcePath":"components/core/Badge.jsx"},{"name":"roleLabel","sourcePath":"components/core/Badge.jsx"},{"name":"statusLabel","sourcePath":"components/core/Badge.jsx"},{"name":"statusVariant","sourcePath":"components/core/Badge.jsx"}]} */

(() => {

const __ds_ns = (window.CasaComigoDesignSystem_64c258 = window.CasaComigoDesignSystem_64c258 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — carimbo de inicial. Tipografia de cartaz (Anton), borda
 * macia e fundo de barro/anil. Use para moradores da casa.
 */
function Avatar({
  name = '?',
  tone = 'barro',
  size = 42,
  src = null,
  style = {},
  ...props
}) {
  const tones = {
    barro: {
      background: 'var(--barro-claro)',
      color: 'var(--barro-fundo)'
    },
    indigo: {
      background: 'var(--indigo-claro)',
      color: 'var(--indigo)'
    },
    verde: {
      background: 'var(--verde-claro)',
      color: '#3d5026'
    },
    ocre: {
      background: 'var(--ocre-claro)',
      color: '#855415'
    }
  };
  const t = tones[tone] || tones.barro;
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      width: size,
      height: size,
      flex: 'none',
      display: 'inline-grid',
      placeItems: 'center',
      overflow: 'hidden',
      borderRadius: '50%',
      border: '1.5px solid var(--border-strong)',
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.42,
      textTransform: 'uppercase',
      lineHeight: 1,
      ...t,
      ...style
    }
  }, props), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initial);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  default: {
    bg: 'var(--surface-card)',
    bd: 'var(--border-strong)',
    fg: 'var(--text-strong)'
  },
  sage: {
    bg: 'var(--verde-claro)',
    bd: 'var(--verde)',
    fg: '#3d5026'
  },
  warning: {
    bg: 'var(--ocre-claro)',
    bd: 'var(--ocre)',
    fg: '#855415'
  },
  danger: {
    bg: 'var(--vermelho-claro)',
    bd: 'var(--vermelho)',
    fg: 'var(--vermelho)'
  },
  info: {
    bg: 'var(--indigo-claro)',
    bd: 'var(--indigo)',
    fg: 'var(--indigo)'
  },
  success: {
    bg: 'var(--verde-claro)',
    bd: 'var(--verde)',
    fg: '#3d5026'
  },
  terracotta: {
    bg: 'var(--barro-claro)',
    bd: 'var(--barro)',
    fg: 'var(--barro-fundo)'
  }
};

/**
 * Badge / selo — carimbo de status, esforço ou cargo. Caixa-alta,
 * pílula com borda fina de cor. `dot` adiciona o ponto de status.
 */
function Badge({
  variant = 'default',
  dot = false,
  children,
  style = {},
  ...props
}) {
  const t = TONES[variant] || TONES.default;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: 11.5,
      letterSpacing: '0.1em',
      padding: dot ? '5px 11px' : '4px 11px',
      border: `1.5px solid ${t.bd}`,
      borderRadius: 'var(--radius-full)',
      background: t.bg,
      color: t.fg,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, props), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'currentColor',
      flex: 'none'
    }
  }), children);
}

/* Mapas de domínio — herdados do app Casa Comigo.
   Também anexados a Badge.* para que cheguem ao namespace do bundle
   (exports minúsculos ficam internos). */
const effortLabel = {
  light: 'Leve',
  medium: 'Médio',
  heavy: 'Pesado'
};
const effortVariant = {
  light: 'sage',
  medium: 'warning',
  heavy: 'danger'
};
const statusLabel = {
  pending: 'Pendente',
  completed: 'Concluída',
  overdue: 'Atrasada',
  redistributed: 'Redistribuída'
};
const statusVariant = {
  pending: 'info',
  completed: 'success',
  overdue: 'danger',
  redistributed: 'warning'
};
const roleLabel = {
  admin: 'Administrador',
  catalog_manager: 'Gestor de Catálogo',
  resident: 'Morador'
};
Badge.effortLabel = effortLabel;
Badge.effortVariant = effortVariant;
Badge.statusLabel = statusLabel;
Badge.statusVariant = statusVariant;
Badge.roleLabel = roleLabel;
Object.assign(__ds_scope, { Badge, effortLabel, effortVariant, statusLabel, statusVariant, roleLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — ação primária do Casa Comigo.
 * Terracota (barro) para ação principal; cantos macios, sombra quente
 * que descola o botão do papel, leve elevação no hover.
 */
function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  disabled,
  ...props
}) {
  const sizes = {
    sm: {
      padding: '8px 14px',
      fontSize: 13.5,
      gap: 6,
      radius: 'var(--radius-sm)'
    },
    md: {
      padding: '11px 20px',
      fontSize: 15,
      gap: 8,
      radius: 'var(--radius-md)'
    },
    lg: {
      padding: '14px 26px',
      fontSize: 16.5,
      gap: 9,
      radius: 'var(--radius-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--action)',
      color: 'var(--text-on-barro)',
      border: '1.5px solid var(--barro-fundo)',
      boxShadow: 'var(--shadow-barro)'
    },
    secondary: {
      background: 'var(--surface-sand)',
      color: 'var(--text-strong)',
      border: '1.5px solid var(--border-mark)',
      boxShadow: 'var(--shadow-md)'
    },
    ink: {
      background: 'var(--tinta)',
      color: 'var(--text-on-ink)',
      border: '1.5px solid var(--tinta)',
      boxShadow: 'var(--shadow-ink)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1.5px solid transparent',
      boxShadow: 'none'
    },
    danger: {
      background: 'transparent',
      color: 'var(--vermelho)',
      border: '1.5px solid var(--vermelho)',
      boxShadow: 'none'
    }
  };
  const v = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: isDisabled,
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: s.fontSize,
      letterSpacing: '0.01em',
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      padding: s.padding,
      borderRadius: s.radius,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.55 : 1,
      transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
      whiteSpace: 'nowrap',
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (isDisabled) return;
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      if (variant === 'primary') e.currentTarget.style.background = 'var(--action-press)';
      if (variant === 'secondary') e.currentTarget.style.background = 'var(--areia-fundo)';
      if (variant === 'ghost') e.currentTarget.style.background = 'var(--surface-sunk)';
      if (variant === 'danger') e.currentTarget.style.background = 'var(--vermelho-claro)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.background = v.background;
      e.currentTarget.style.boxShadow = v.boxShadow;
    },
    onMouseDown: e => {
      if (!isDisabled) e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
    },
    onMouseUp: e => {
      if (!isDisabled) e.currentTarget.style.transform = 'translateY(-2px)';
    }
  }, props), loading ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: '1em',
      height: '1em',
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block',
      animation: 'cc-spin 0.7s linear infinite'
    }
  }) : iconLeft, children, iconRight, /*#__PURE__*/React.createElement("style", null, `@keyframes cc-spin{to{transform:rotate(360deg)}}`));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card (bloco) — superfície flutuante. Descolada do papel por sombra
 * quente em camadas e cantos macios. `stamp` traz o acento xilogravura
 * (sombra dura de carimbo). `accent` pinta uma faixa lateral de cor.
 */
function Card({
  surface = 'card',
  elevation = 'md',
  stamp = false,
  accent = null,
  padding = 'var(--space-5)',
  interactive = false,
  style = {},
  children,
  ...props
}) {
  const surfaces = {
    card: 'var(--surface-card)',
    soft: 'var(--surface-soft)',
    sunk: 'var(--surface-sunk)'
  };
  const elevations = {
    none: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };
  const base = {
    background: surfaces[surface] || surfaces.card,
    border: '1.5px solid var(--border-mark)',
    borderRadius: stamp ? 'var(--radius-carimbo)' : 'var(--radius-md)',
    boxShadow: stamp ? 'var(--shadow-carimbo)' : elevations[elevation] || elevations.md,
    padding,
    transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
    ...(accent ? {
      borderLeft: `5px solid ${accent}`
    } : {}),
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base,
    onMouseEnter: interactive ? e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    } : undefined,
    onMouseLeave: interactive ? e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = base.boxShadow;
    } : undefined
  }, props), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag (papel-pill) — chip de metadado discreto: duração, frequência,
 * cômodo, morador. Fundo de papel afundado, sem caixa-alta.
 */
function Tag({
  icon = null,
  children,
  style = {},
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12.5,
      fontWeight: 600,
      padding: '4px 11px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-sunk)',
      color: 'var(--text-body)',
      whiteSpace: 'nowrap',
      lineHeight: 1.4,
      ...style
    }
  }, props), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      opacity: 0.8
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressBar — barra de distribuição/carga. Trilho de papel afundado
 * e preenchimento com hachura de buril (textura xilogravura).
 */
function ProgressBar({
  value = 0,
  tone = 'barro',
  target = null,
  height = 14,
  style = {},
  ...props
}) {
  const tones = {
    barro: 'var(--barro)',
    verde: 'var(--verde)',
    indigo: 'var(--indigo)',
    ocre: 'var(--ocre)'
  };
  const fill = tones[tone] || tones.barro;
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      height,
      width: '100%',
      border: '1.5px solid var(--border-strong)',
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-sunk)',
      overflow: 'hidden',
      ...style
    },
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, props), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${pct}%`,
      background: fill,
      backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 8px)',
      borderRadius: 'var(--radius-full)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  }), target != null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -2,
      bottom: -2,
      left: `${Math.max(0, Math.min(100, target))}%`,
      width: 2,
      background: 'var(--tinta)',
      opacity: 0.5
    },
    title: `Alvo ${target}%`
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressRing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressRing — anel de conclusão do morador no período. Disco de
 * tinta sobre papel com número de cartaz (Anton) no centro.
 */
function ProgressRing({
  value = 0,
  size = 64,
  tone = 'barro',
  style = {},
  ...props
}) {
  const tones = {
    barro: 'var(--barro)',
    verde: 'var(--verde)',
    indigo: 'var(--indigo)',
    ocre: 'var(--ocre)'
  };
  const fill = tones[tone] || tones.barro;
  const pct = Math.max(0, Math.min(100, value));
  const inner = size * 0.72;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      flex: 'none',
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      border: '1.5px solid var(--border-strong)',
      background: `conic-gradient(${fill} ${pct}%, var(--surface-sunk) 0)`,
      ...style
    },
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, props), /*#__PURE__*/React.createElement("div", {
    style: {
      width: inner,
      height: inner,
      borderRadius: '50%',
      background: 'var(--surface-card)',
      display: 'grid',
      placeItems: 'center',
      border: '1px solid var(--border)',
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.26,
      color: 'var(--text-strong)'
    }
  }, Math.round(pct), "%"));
}
Object.assign(__ds_scope, { ProgressRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressRing.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — campo de texto com rótulo de carimbo. Foco em terracota
 * com anel macio. Cantos arredondados, superfície de papel.
 */
function Input({
  label,
  error,
  hint,
  id,
  style = {},
  ...props
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontWeight: 700,
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    onFocus: e => {
      setFocus(true);
      props.onFocus && props.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      props.onBlur && props.onBlur(e);
    },
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      padding: '11px 14px',
      width: '100%',
      background: 'var(--surface-card)',
      color: 'var(--text-strong)',
      border: `1.5px solid ${error ? 'var(--alerta)' : focus ? 'var(--barro)' : 'var(--border-mark)'}`,
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: focus ? `0 0 0 4px ${error ? 'rgba(200,32,20,0.14)' : 'rgba(177,74,40,0.14)'}` : 'none',
      transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...style
    }
  }, props)), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--alerta)',
      fontWeight: 600
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — lista suspensa no mesmo estilo do Input, com seta de cordel.
 */
function Select({
  label,
  error,
  id,
  options = [],
  style = {},
  ...props
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontWeight: 700,
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: id,
    onFocus: e => {
      setFocus(true);
      props.onFocus && props.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      props.onBlur && props.onBlur(e);
    },
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      padding: '11px 38px 11px 14px',
      width: '100%',
      appearance: 'none',
      background: 'var(--surface-card)',
      color: 'var(--text-strong)',
      border: `1.5px solid ${error ? 'var(--alerta)' : focus ? 'var(--barro)' : 'var(--border-mark)'}`,
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      cursor: 'pointer',
      boxShadow: focus ? '0 0 0 4px rgba(177,74,40,0.14)' : 'none',
      transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...style
    }
  }, props), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      fontSize: 12
    }
  }, "\u25BC")));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   Casa Comigo · Ícones xilográficos
   Traço marcante (currentColor), fundo de papel (var(--icon-paper)),
   cantos retos (miter/square) — tinta sobre madeira.
   viewBox 0 0 100 100 · escala com `size`.
   ============================================================ */
const WOODCUT_ICONS = {
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
  sad: '<circle cx="50" cy="50" r="38" fill="var(--icon-paper)" stroke="currentColor" stroke-width="6"/><rect x="32" y="36" width="9" height="12" fill="currentColor"/><rect x="59" y="36" width="9" height="12" fill="currentColor"/><path d="M32 72 Q50 54 68 72" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="square"/>'
};

/**
 * Icon — ícone xilográfico do Casa Comigo. Herda a cor do texto
 * (`currentColor`) no traço; o `paper` pinta os recortes claros.
 */
function Icon({
  name,
  size = 24,
  color,
  paper = 'var(--papel-branco)',
  style = {},
  title,
  ...props
}) {
  const inner = WOODCUT_ICONS[name];
  return /*#__PURE__*/React.createElement("span", _extends({
    role: title ? 'img' : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      lineHeight: 0,
      flex: 'none',
      color: color || 'currentColor',
      '--icon-paper': paper,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner ? `<svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>` : ''
    }
  }, props));
}
Object.assign(__ds_scope, { WOODCUT_ICONS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/forms/PreferenceToggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const OPTS = [{
  value: 'hate',
  icon: 'sad',
  label: 'Não gosto',
  on: 'var(--vermelho-claro)',
  bd: 'var(--vermelho)'
}, {
  value: 'neutral',
  icon: 'neutral',
  label: 'Neutro',
  on: 'var(--ocre-claro)',
  bd: 'var(--ocre)'
}, {
  value: 'like',
  icon: 'happy',
  label: 'Gosto',
  on: 'var(--verde-claro)',
  bd: 'var(--verde)'
}];

/**
 * PreferenceToggle — segmento de preferência (não gosto / neutro / gosto)
 * com faces xilográficas. Coração do Casa Comigo: cada morador marca
 * sua afinidade com a tarefa.
 */
function PreferenceToggle({
  value = 'neutral',
  onChange,
  showLabels = false,
  style = {},
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "group",
    "aria-label": "prefer\xEAncia",
    style: {
      display: 'inline-flex',
      border: '1.5px solid var(--border-mark)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-md)',
      ...style
    }
  }, props), OPTS.map((o, i) => {
    const active = value === o.value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      "aria-pressed": active,
      onClick: () => onChange && onChange(o.value),
      title: o.label,
      style: {
        border: 'none',
        cursor: 'pointer',
        lineHeight: 0,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: 13,
        padding: showLabels ? '9px 15px' : '9px 14px',
        background: active ? o.on : 'transparent',
        color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        borderRight: i < OPTS.length - 1 ? '1.5px solid var(--border)' : 'none',
        transition: 'background var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: o.icon,
      size: 24,
      color: active ? o.bd : 'var(--text-muted)',
      paper: "var(--papel-branco)"
    }), showLabels && /*#__PURE__*/React.createElement("span", {
      style: {
        lineHeight: 1.2
      }
    }, o.label));
  }));
}
Object.assign(__ds_scope, { PreferenceToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/PreferenceToggle.jsx", error: String((e && e.message) || e) }); }

// ui_kits/casa-comigo/login.jsx
try { (() => {
/* Casa Comigo · UI kit — Login (tela de entrada). */

const {
  useState
} = React;
const DSL = window.CasaComigoDesignSystem_64c258;
function Login({
  onEnter
}) {
  const {
    Button,
    Input
  } = DSL;
  const [form, setForm] = useState({
    email: 'qa@casacomigo.app',
    password: '••••••'
  });
  const [loading, setLoading] = useState(false);
  const submit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onEnter();
    }, 650);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 400
    }
  }, /*#__PURE__*/React.createElement(Card, {
    elevation: "lg",
    padding: "36px 32px",
    style: {
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-sol",
    style: {
      width: 64,
      height: 64,
      margin: '0 auto 14px'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    className: "cc-display",
    style: {
      fontSize: 34
    }
  }, "Casa Comigo"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: 'var(--text-muted)',
      fontSize: 15
    }
  }, "Bem-vindo de volta")), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "email",
    label: "E-mail",
    type: "email",
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    }),
    placeholder: "seu@email.com"
  }), /*#__PURE__*/React.createElement(Input, {
    id: "password",
    label: "Senha",
    type: "password",
    value: form.password,
    onChange: e => setForm({
      ...form,
      password: e.target.value
    }),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    loading: loading,
    style: {
      width: '100%'
    }
  }, "Entrar")), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      marginTop: 22,
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, "N\xE3o tem conta? ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--link)',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Cadastre-se")))));
}
const {
  Card
} = DSL;
Object.assign(window, {
  Login
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/casa-comigo/login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/casa-comigo/screens.jsx
try { (() => {
/* Casa Comigo · UI kit — telas. Compõem os primitivos do design system. */

const {
  useState
} = React;
const DS = window.CasaComigoDesignSystem_64c258;
const {
  Button,
  Card,
  Badge,
  Tag,
  Avatar,
  ProgressBar,
  ProgressRing,
  PreferenceToggle,
  Input,
  Select
} = DS;
const effortLabel = {
  light: 'Leve',
  medium: 'Médio',
  heavy: 'Pesado'
};
const effortVariant = {
  light: 'sage',
  medium: 'warning',
  heavy: 'danger'
};
const statusLabel = {
  pending: 'Pendente',
  completed: 'Concluída',
  overdue: 'Atrasada',
  redistributed: 'Redistribuída'
};
const statusVariant = {
  pending: 'info',
  completed: 'success',
  overdue: 'danger',
  redistributed: 'warning'
};

/* ---- dados ---- */
const TASKS = [{
  id: 1,
  name: 'Aguar plantas',
  effort: 'light',
  time: '15min',
  freq: 'Diária',
  room: null,
  who: 'qa',
  tone: 'barro',
  day: 'Dom · 07/06',
  status: 'pending'
}, {
  id: 2,
  name: 'Lavar roupa',
  effort: 'medium',
  time: '30min',
  freq: 'Semanal',
  room: null,
  who: 'Marcelo',
  tone: 'indigo',
  day: 'Seg · 08/06',
  status: 'completed',
  at: '09:12'
}, {
  id: 3,
  name: 'Passar pano',
  effort: 'heavy',
  time: '40min',
  freq: 'Semanal',
  room: null,
  who: 'qa',
  tone: 'barro',
  day: 'Seg · 08/06',
  status: 'overdue',
  blocked: true
}, {
  id: 4,
  name: 'Espanar casa',
  effort: 'medium',
  time: '15min',
  freq: 'Semanal',
  room: 'casa',
  who: 'Marcelo',
  tone: 'indigo',
  day: 'Ter · 09/06',
  status: 'pending'
}];

/* ---- faixa de aviso semântico ---- */
function Aviso({
  kind = 'atencao',
  children
}) {
  const map = {
    ok: {
      bg: 'var(--sucesso-claro)',
      bd: 'var(--sucesso)',
      fg: '#003a26',
      icon: 'check'
    },
    atencao: {
      bg: 'var(--aviso-claro)',
      bd: '#C99A05',
      fg: '#6b5202',
      icon: 'alert'
    },
    erro: {
      bg: 'var(--alerta-claro)',
      bd: 'var(--alerta)',
      fg: '#7d1610',
      icon: 'x'
    }
  };
  const t = map[kind] || map.atencao;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 15px',
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-sm)',
      color: t.fg,
      fontWeight: 600,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 18,
    color: t.bd,
    paper: t.bg
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, children));
}

/* ---- linha de avatar + nome (chip) ---- */
function WhoChip({
  who,
  tone
}) {
  return /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(Avatar, {
    name: who,
    tone: tone,
    size: 20,
    style: {
      marginLeft: -4
    }
  }), " ", who);
}

/* ============ CRONOGRAMA ============ */
function Schedule() {
  const [done, setDone] = useState({});
  const days = [...new Set(TASKS.map(t => t.day))];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Mutir\xE3o da semana",
    title: "Cronograma",
    meta: "4 tarefas no per\xEDodo",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "zap",
        size: 18
      })
    }, "Distribuir tarefas")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "de",
    label: "De",
    type: "date",
    defaultValue: "2026-06-07"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ate",
    label: "At\xE9",
    type: "date",
    defaultValue: "2026-07-07"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 170
    }
  }, /*#__PURE__*/React.createElement(Select, {
    id: "m",
    label: "Morador",
    options: [{
      value: 'todos',
      label: 'Todos'
    }, {
      value: 'qa',
      label: 'qa'
    }, {
      value: 'marcelo',
      label: 'Marcelo'
    }]
  }))), days.map(day => /*#__PURE__*/React.createElement("div", {
    key: day
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '26px 0 14px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 21
    }
  }, day), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      borderTop: '1px solid var(--border)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, TASKS.filter(t => t.day === day).map(t => {
    const isDone = done[t.id] || t.status === 'completed';
    const st = isDone ? 'completed' : t.status;
    return /*#__PURE__*/React.createElement(Card, {
      key: t.id,
      interactive: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 20,
        fontWeight: 700
      }
    }, t.name), /*#__PURE__*/React.createElement(Badge, {
      variant: statusVariant[st],
      dot: true
    }, statusLabel[st])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: effortVariant[t.effort]
    }, effortLabel[t.effort]), t.room && /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(Icon, {
      name: "house",
      size: 14
    }), " ", t.room), /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 14
    }), " ", t.time), /*#__PURE__*/React.createElement(WhoChip, {
      who: t.who,
      tone: t.tone
    })), t.blocked && !isDone && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(Aviso, {
      kind: "atencao"
    }, "Faltou material de limpeza \u2014 reatribui\xE7\xE3o sugerida.")), /*#__PURE__*/React.createElement("hr", {
      style: {
        border: 'none',
        borderTop: '1px solid var(--border-faint)',
        margin: '16px 0'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, isDone ? /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 15,
        color: "var(--verde)"
      }),
      style: {
        color: 'var(--verde)'
      }
    }, "Conclu\xEDda", t.at ? ` às ${t.at}` : '') : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 15
      }),
      onClick: () => setDone(d => ({
        ...d,
        [t.id]: true
      }))
    }, "Concluir"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "alert",
        size: 15
      })
    }, "Impedimento"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "repeat",
        size: 15
      })
    }, "Reatribuir"))));
  })))));
}

/* ============ CATÁLOGO ============ */
function Catalog() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "A despensa de servi\xE7os",
    title: "Cat\xE1logo de tarefas",
    meta: "4 tarefas cadastradas",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 18
      })
    }, "Nova tarefa")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "busca",
    placeholder: "Buscar por nome ou c\xF4modo\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 20
    }
  }, TASKS.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19,
      fontWeight: 700
    }
  }, t.name), /*#__PURE__*/React.createElement(Badge, {
    variant: effortVariant[t.effort]
  }, effortLabel[t.effort])), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      marginTop: 12
    }
  }, t.room && /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(Icon, {
    name: "house",
    size: 14
  }), " ", t.room), /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(Icon, {
    name: "repeat",
    size: 14
  }), " ", t.freq), /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14
  }), " ", t.time)), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 'none',
      borderTop: '1px solid var(--border-faint)',
      margin: '16px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Depend\xEAncias"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Editar"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      color: 'var(--vermelho)'
    }
  }, "Remover"))))));
}

/* ============ PREFERÊNCIAS ============ */
function Preferences() {
  const init = {
    1: 'like',
    2: 'like',
    3: 'hate',
    4: 'neutral'
  };
  const [prefs, setPrefs] = useState(init);
  const [lim, setLim] = useState({
    3: true
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Cada um no seu feitio",
    title: "Minhas prefer\xEAncias",
    meta: "Diga o que voc\xEA gosta e o que tem limita\xE7\xF5es"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "busca",
    placeholder: "Buscar tarefa ou c\xF4modo\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, TASKS.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 8,
      flexWrap: 'wrap'
    }
  }, t.room && /*#__PURE__*/React.createElement(Tag, null, /*#__PURE__*/React.createElement(Icon, {
    name: "house",
    size: 14
  }), " ", t.room), /*#__PURE__*/React.createElement(Badge, {
    variant: effortVariant[t.effort]
  }, effortLabel[t.effort]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(PreferenceToggle, {
    value: prefs[t.id],
    onChange: v => setPrefs(p => ({
      ...p,
      [t.id]: v
    }))
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-body)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!lim[t.id],
    onChange: e => setLim(l => ({
      ...l,
      [t.id]: e.target.checked
    })),
    style: {
      width: 18,
      height: 18,
      accentColor: 'var(--barro)'
    }
  }), "Limita\xE7\xE3o f\xEDsica"))))));
}
Object.assign(window, {
  Schedule,
  Catalog,
  Preferences,
  Aviso,
  WhoChip,
  TASKS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/casa-comigo/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/casa-comigo/screens2.jsx
try { (() => {
/* Casa Comigo · UI kit — Membros e Relatórios. */

const DS2 = window.CasaComigoDesignSystem_64c258;
const {
  Button: Btn,
  Card: Crd,
  Badge: Bdg,
  Tag: Tg,
  Avatar: Av,
  ProgressBar: PB,
  ProgressRing: PR
} = DS2;
const roleLbl = {
  admin: 'Administrador',
  catalog_manager: 'Gestor de Catálogo',
  resident: 'Morador'
};

/* ============ MEMBROS ============ */
function Members() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Quem mora na casa",
    title: "Membros",
    meta: "2 membros na casa",
    action: /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "userplus",
        size: 18
      })
    }, "Convidar membro")
  }), /*#__PURE__*/React.createElement(Crd, {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 18
    }
  }, "Distribui\xE7\xE3o de carga"), /*#__PURE__*/React.createElement(Bdg, {
    variant: "info",
    dot: true
  }, "Distribui\xE7\xE3o igualit\xE1ria")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 18
    }
  }, MEMBERS.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, m.name), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 17
    }
  }, "50%")), /*#__PURE__*/React.createElement(PB, {
    value: 50,
    tone: m.tone === 'indigo' ? 'verde' : 'barro'
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, MEMBERS.map(m => /*#__PURE__*/React.createElement(Crd, {
    key: m.id,
    interactive: true,
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Av, {
    name: m.name,
    tone: m.tone,
    size: 48
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 18
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)'
    }
  }, m.email)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      cursor: 'pointer'
    }
  }, "Editar"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--vermelho)',
      cursor: 'pointer'
    }
  }, "Remover"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Bdg, {
    variant: m.role === 'admin' ? 'terracotta' : 'default'
  }, roleLbl[m.role]), /*#__PURE__*/React.createElement(Tg, null, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14
  }), " 10h/sem")))))));
}

/* ============ RELATÓRIOS ============ */
function StatGrid({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 8,
      textAlign: 'center'
    }
  }, items.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.lab
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      lineHeight: 1,
      color: s.color
    }
  }, s.num), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.03em',
      marginTop: 6
    }
  }, s.lab))));
}
function Reports() {
  const balance = [{
    name: 'qa',
    target: 50,
    real: 54.5,
    dev: '+4,5pp',
    devColor: 'var(--barro)',
    tone: 'barro',
    tasks: 3,
    pend: 3
  }, {
    name: 'Marcelo',
    target: 50,
    real: 45.5,
    dev: '−4,5pp',
    devColor: 'var(--indigo)',
    tone: 'indigo',
    tasks: 2,
    pend: 2
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "A conta do mutir\xE3o",
    title: "Relat\xF3rios",
    meta: "Desempenho e balanceamento da casa"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "de",
    label: "De",
    type: "date",
    defaultValue: "2026-05-08"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "ate",
    label: "At\xE9",
    type: "date",
    defaultValue: "2026-06-07"
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 26,
      margin: '8px 0 16px'
    }
  }, "Balanceamento de esfor\xE7o"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Aviso, {
    kind: "ok"
  }, "Dentro da toler\xE2ncia \u2014 Toler\xE2ncia \xB110pp ", /*#__PURE__*/React.createElement(Bdg, {
    variant: "info",
    dot: true
  }, "Igualit\xE1ria"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, balance.map(b => /*#__PURE__*/React.createElement(Crd, {
    key: b.name
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 18
    }
  }, b.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, "Alvo"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(PB, {
    value: b.target,
    tone: "indigo"
  })), /*#__PURE__*/React.createElement("strong", {
    style: {
      width: 56,
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, b.target.toFixed(1).replace('.', ','), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, "Real"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(PB, {
    value: b.real,
    tone: "verde"
  })), /*#__PURE__*/React.createElement("strong", {
    style: {
      width: 56,
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, b.real.toFixed(1).replace('.', ','), "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontWeight: 700,
      fontSize: 14,
      color: b.devColor
    }
  }, "Desvio: ", b.dev)))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 26,
      margin: '36px 0 16px'
    }
  }, "Desempenho por morador"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, balance.map(b => /*#__PURE__*/React.createElement(Crd, {
    key: b.name
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Av, {
    name: b.name,
    tone: b.tone
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 17
    }
  }, b.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)'
    }
  }, b.tasks, " tarefas atribu\xEDdas"))), /*#__PURE__*/React.createElement(PR, {
    value: 0,
    tone: b.tone === 'indigo' ? 'indigo' : 'barro'
  })), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 'none',
      borderTop: '1px solid var(--border-faint)',
      margin: '16px 0'
    }
  }), /*#__PURE__*/React.createElement(StatGrid, {
    items: [{
      num: 0,
      lab: 'Concluídas',
      color: 'var(--verde)'
    }, {
      num: b.pend,
      lab: 'Pendentes',
      color: 'var(--ocre)'
    }, {
      num: 0,
      lab: 'Atrasadas',
      color: 'var(--vermelho)'
    }, {
      num: 0,
      lab: 'Redistribuídas',
      color: 'var(--indigo)'
    }]
  })))));
}
Object.assign(window, {
  Members,
  Reports
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/casa-comigo/screens2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/casa-comigo/shell.jsx
try { (() => {
/* Casa Comigo · UI kit — shell, sidebar, topbar, Lucide icon helper.
   Exports to window for the other babel scripts. */

const {
  useState,
  useRef,
  useEffect
} = React;
const {
  Avatar,
  Icon
} = window.CasaComigoDesignSystem_64c258;

/* ---- mock data ---- */
const HOUSE = {
  name: 'Apto 404',
  code: 'CMG404'
};
const MEMBERS = [{
  id: 'qa',
  name: 'qa',
  email: 'qa@casacomigo.app',
  role: 'admin',
  tone: 'barro',
  load: 10
}, {
  id: 'marcelo',
  name: 'Marcelo',
  email: 'marcelo@casacomigo.app',
  role: 'resident',
  tone: 'indigo',
  load: 10
}];
const NAV = [{
  key: 'schedule',
  label: 'Cronograma',
  icon: 'calendar'
}, {
  key: 'catalog',
  label: 'Catálogo',
  icon: 'clipboard'
}, {
  key: 'preferences',
  label: 'Preferências',
  icon: 'heart'
}, {
  key: 'members',
  label: 'Membros',
  icon: 'users'
}, {
  key: 'reports',
  label: 'Relatórios',
  icon: 'chart'
}];

/* ---- Sidebar ---- */
function Sidebar({
  active,
  onNavigate,
  onLeave
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 256,
      flex: 'none',
      background: 'var(--surface-soft)',
      border: '1.5px solid var(--border-mark)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      padding: '22px 16px',
      position: 'sticky',
      top: 20,
      margin: '20px 0 20px 20px',
      height: 'calc(100vh - 40px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '4px 6px 20px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-sol",
    style: {
      width: 38,
      height: 38,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 16,
      lineHeight: 1.05,
      whiteSpace: 'nowrap'
    }
  }, "Casa Comigo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 3,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, HOUSE.name))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginTop: 6
    }
  }, NAV.map(item => {
    const on = active === item.key;
    return /*#__PURE__*/React.createElement("button", {
      key: item.key,
      onClick: () => onNavigate(item.key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        padding: '11px 13px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontWeight: on ? 700 : 600,
        fontSize: 15.5,
        color: on ? 'var(--barro-fundo)' : 'var(--text-body)',
        background: on ? 'var(--barro-claro)' : 'transparent',
        border: on ? '1px solid rgba(177,74,40,0.35)' : '1px solid transparent',
        transition: 'background var(--dur-base) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--surface-sunk)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: item.icon,
      size: 23,
      paper: on ? 'var(--barro-claro)' : 'var(--surface-soft)'
    }), item.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 16,
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLeave,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      fontWeight: 600,
      fontSize: 13,
      fontFamily: 'var(--font-sans)',
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowleft",
    size: 16
  }), " Trocar de casa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "qa",
    tone: "barro",
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14
    }
  }, "qa")), /*#__PURE__*/React.createElement("button", {
    title: "Sair",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--barro)',
      fontWeight: 700,
      fontSize: 13,
      fontFamily: 'var(--font-sans)',
      padding: '4px 6px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 15,
    color: "var(--barro)"
  }), " Sair"))));
}

/* ---- Page header ---- */
function PageHeader({
  eyebrow,
  title,
  meta,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 20,
      flexWrap: 'wrap',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "cc-display",
    style: {
      fontSize: 'var(--display-md)',
      marginTop: 6
    }
  }, title), meta && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 15,
      color: 'var(--text-muted)'
    }
  }, meta)), action);
}
Object.assign(window, {
  Icon,
  Sidebar,
  PageHeader,
  HOUSE,
  MEMBERS,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/casa-comigo/shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.ProgressRing = __ds_scope.ProgressRing;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.PreferenceToggle = __ds_scope.PreferenceToggle;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.WOODCUT_ICONS = __ds_scope.WOODCUT_ICONS;

__ds_ns.Icon = __ds_scope.Icon;

})();
