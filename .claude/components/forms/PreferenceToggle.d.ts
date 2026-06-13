import * as React from 'react';

export type Preference = 'hate' | 'neutral' | 'like';

/**
 * Segmento de preferência por tarefa.
 * @startingPoint section="Forms" subtitle="Preferência — não gosto / neutro / gosto" viewport="700x340"
 */
export interface PreferenceToggleProps {
  value?: Preference;
  onChange?: (value: Preference) => void;
  /** Mostra os rótulos (Não gosto / Neutro / Gosto) além do ícone. */
  showLabels?: boolean;
  style?: React.CSSProperties;
}

/**
 * Segmento de preferência por tarefa.
 */
export function PreferenceToggle(props: PreferenceToggleProps): JSX.Element;
