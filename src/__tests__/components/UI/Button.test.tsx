import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../components/UI/Button';

describe('Button', () => {
  it('renders children and default classes (primary, md)', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toHaveClass('btn--primary', 'btn--md');
    expect(btn).not.toBeDisabled();
  });

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)('renders variant %s', (v) => {
    render(<Button variant={v}>{v}</Button>);
    expect(screen.getByRole('button')).toHaveClass(`btn--${v}`);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (s) => {
    render(<Button size={s}>{s}</Button>);
    expect(screen.getByRole('button')).toHaveClass(`btn--${s}`);
  });

  it('shows spinner and disables button when loading=true', () => {
    render(<Button loading>Salvar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('btn--loading');
    expect(btn.querySelector('.btn__spinner')).toBeInTheDocument();
  });

  it('does not show spinner when loading=false', () => {
    render(<Button>Salvar</Button>);
    expect(document.querySelector('.btn__spinner')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Btn</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('passes additional className', () => {
    render(<Button className="extra-class">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass('extra-class');
  });

  it('fires onClick handler', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Btn</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
