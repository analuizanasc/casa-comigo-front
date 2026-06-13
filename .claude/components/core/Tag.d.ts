import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Ícone à esquerda (Lucide ou outro nó). */
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Tag(props: TagProps): JSX.Element;
