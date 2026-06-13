import * as React from 'react';

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Percentual de conclusão (0–100). */
  value: number;
  /** Diâmetro em px. */
  size?: number;
  tone?: 'barro' | 'verde' | 'indigo' | 'ocre';
}

export function ProgressRing(props: ProgressRingProps): JSX.Element;
