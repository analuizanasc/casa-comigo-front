import * as React from 'react';

export type BadgeVariant =
  | 'default' | 'success' | 'warning' | 'danger' | 'info' | 'sage' | 'terracotta';

/**
 * Selo / carimbo de status, esforço ou cargo.
 * @startingPoint section="Core" subtitle="Selos — esforço, status e cargo" viewport="700x460"
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Mostra o ponto de status (carimbo). */
  dot?: boolean;
  children: React.ReactNode;
}

/**
 * Selo / carimbo de status, esforço ou cargo.
 */
export function Badge(props: BadgeProps): JSX.Element;

export const effortLabel: Record<string, string>;
export const effortVariant: Record<string, BadgeVariant>;
export const statusLabel: Record<string, string>;
export const statusVariant: Record<string, BadgeVariant>;
export const roleLabel: Record<string, string>;
