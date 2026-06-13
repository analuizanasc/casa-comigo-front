import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Nome do morador — a inicial vira o carimbo. */
  name: string;
  tone?: 'barro' | 'indigo' | 'verde' | 'ocre';
  /** Diâmetro em px. */
  size?: number;
  /** URL de foto (opcional). */
  src?: string | null;
}

export function Avatar(props: AvatarProps): JSX.Element;
