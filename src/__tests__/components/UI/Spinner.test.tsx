import { render } from '@testing-library/react';
import { Spinner, PageSpinner } from '../../../components/UI/Spinner';

describe('Spinner', () => {
  it('renders SVG with default size 24', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg')!;
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveClass('spinner');
  });

  it('renders SVG with custom size', () => {
    const { container } = render(<Spinner size={48} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });
});

describe('PageSpinner', () => {
  it('renders page-spinner wrapper with a Spinner inside', () => {
    const { container } = render(<PageSpinner />);
    expect(container.querySelector('.page-spinner')).toBeInTheDocument();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});
