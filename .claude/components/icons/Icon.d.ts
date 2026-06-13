import * as React from 'react';

export type IconName =
  | 'calendar' | 'clipboard' | 'heart' | 'users' | 'chart'
  | 'clock' | 'house' | 'check' | 'plus' | 'repeat' | 'alert'
  | 'zap' | 'userplus' | 'arrowleft' | 'x'
  | 'happy' | 'neutral' | 'sad';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Nome do ícone xilográfico. */
  name: IconName;
  /** Tamanho em px (lado do quadrado). */
  size?: number;
  /** Cor do traço (default: currentColor). */
  color?: string;
  /** Cor dos recortes claros (default: papel-branco). */
  paper?: string;
  /** Rótulo acessível; se omitido, o ícone é decorativo. */
  title?: string;
}

/**
 * Ícone xilográfico — traço marcante de gravura, recortes de papel.
 * @startingPoint section="Brand" subtitle="Ícones xilográficos — navegação, interface, faces" viewport="700x300"
 */
export function Icon(props: IconProps): JSX.Element;

/** Registro nome → markup interno do SVG (viewBox 0 0 100 100). */
export const WOODCUT_ICONS: Record<IconName, string>;
