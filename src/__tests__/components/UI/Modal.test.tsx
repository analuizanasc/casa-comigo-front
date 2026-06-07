import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../../../components/UI/Modal';

const defaultProps = {
  title: 'Título do Modal',
  open: true,
  onClose: jest.fn(),
};

describe('Modal', () => {
  it('returns null when open is false', () => {
    const { container } = render(<Modal {...defaultProps} open={false}>Conteúdo</Modal>);
    expect(container.firstChild).toBeNull();
  });

  it('renders title, children and close button when open', () => {
    render(<Modal {...defaultProps}>Conteúdo do modal</Modal>);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose}>Conteúdo</Modal>);
    fireEvent.click(document.querySelector('.modal-backdrop')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when modal content is clicked (stopPropagation)', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose}>Conteúdo</Modal>);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose}>Conteúdo</Modal>);
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose}>Conteúdo</Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose for non-Escape keys', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose}>Conteúdo</Modal>);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders footer when footer prop is provided', () => {
    render(
      <Modal {...defaultProps} footer={<button>Confirmar</button>}>
        Conteúdo
      </Modal>
    );
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(document.querySelector('.modal__footer')).toBeInTheDocument();
  });

  it('does not render footer div when footer is not provided', () => {
    render(<Modal {...defaultProps}>Conteúdo</Modal>);
    expect(document.querySelector('.modal__footer')).not.toBeInTheDocument();
  });

  it('does not add keydown listener when open is false', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} open={false} onClose={onClose}>Conteúdo</Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
