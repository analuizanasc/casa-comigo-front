import * as React from 'react';

/**
 * Campo de texto com rótulo de carimbo.
 * @startingPoint section="Forms" subtitle="Campos de formulário — foco terracota" viewport="700x340"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Mensagem de erro — pinta a borda de vermelho. */
  error?: string;
  /** Dica auxiliar abaixo do campo. */
  hint?: string;
}

/**
 * Campo de texto com rótulo de carimbo.
 */
export function Input(props: InputProps): JSX.Element;
