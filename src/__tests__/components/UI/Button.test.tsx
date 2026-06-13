import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../components/UI/Button';

describe('Button', () => {
  it('renders children with base btn class', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toHaveClass('btn');
  });

  it('applies btn--barro for primary variant (default)', () => {
    render(<Button>Primário</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--barro');
  });

  it('applies btn--ghost for ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--ghost');
  });

  it('applies btn--perigo for danger variant', () => {
    render(<Button variant="danger">Perigo</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--perigo');
  });

  it('secondary variant has no extra variant class', () => {
    render(<Button variant="secondary">Secundário</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('btn');
    expect(btn).not.toHaveClass('btn--barro');
    expect(btn).not.toHaveClass('btn--ghost');
    expect(btn).not.toHaveClass('btn--perigo');
  });

  it('applies default size btn--md when no size provided', () => {
    render(<Button>Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--md');
  });

  it('applies btn--sm for small size', () => {
    render(<Button size="sm">Sm</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--sm');
  });

  it('applies btn--lg for large size', () => {
    render(<Button size="lg">Lg</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--lg');
  });

  it('shows spinner, adds btn--loading and disables when loading=true', () => {
    render(<Button loading>Salvar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('btn--loading');
    expect(btn.querySelector('.btn__spinner')).toBeInTheDocument();
  });

  it('does not show spinner when loading is false', () => {
    render(<Button>Salvar</Button>);
    expect(document.querySelector('.btn__spinner')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Btn</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when both disabled and loading are true', () => {
    render(<Button disabled loading>Btn</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('passes additional className to button', () => {
    render(<Button className="extra-class">Btn</Button>);
    expect(screen.getByRole('button')).toHaveClass('extra-class');
  });

  it('fires onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when button is disabled', () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Btn</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick when button is loading', () => {
    const onClick = jest.fn();
    render(<Button loading onClick={onClick}>Btn</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
