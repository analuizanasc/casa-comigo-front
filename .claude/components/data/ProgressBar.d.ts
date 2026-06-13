import * as React from 'react';

/**
 * Barra de distribuição de carga.
 * @startingPoint section="Data" subtitle="Distribuição de carga e progresso" viewport="700x300"
 */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Percentual preenchido (0–100). */
  value: number;
  tone?: 'barro' | 'verde' | 'indigo' | 'ocre';
  /** Marca de alvo (0–100), linha vertical de tinta. */
  target?: number | null;
  height?: number;
}

/**
 * Barra de distribuição de carga.
 */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
