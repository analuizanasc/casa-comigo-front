import * as React from 'react';

/**
 * Bloco / cartão flutuante.
 * @startingPoint section="Core" subtitle="Cartões — superfície flutuante, sombra quente" viewport="700x460"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tom da superfície. */
  surface?: 'card' | 'soft' | 'sunk';
  /** Sombra de elevação. */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  /** Acento xilogravura: canto reto + sombra dura de carimbo. */
  stamp?: boolean;
  /** Cor da faixa lateral de acento (ex.: var(--barro)). */
  accent?: string | null;
  padding?: string;
  /** Eleva no hover. */
  interactive?: boolean;
  children?: React.ReactNode;
}

/**
 * Bloco / cartão flutuante.
 */
export function Card(props: CardProps): JSX.Element;
