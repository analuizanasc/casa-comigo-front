import * as React from 'react';

/**
 * Botão de ação do Casa Comigo.
 * @startingPoint section="Core" subtitle="Botões — terracota, cantos macios, sombra quente" viewport="700x460"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual. `primary` = terracota (ação principal). */
  variant?: 'primary' | 'secondary' | 'ink' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Mostra spinner e desabilita o botão. */
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Botão de ação do Casa Comigo.
 */
export function Button(props: ButtonProps): JSX.Element;
