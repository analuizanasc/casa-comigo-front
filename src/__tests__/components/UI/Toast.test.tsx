import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../../../components/UI/Toast';

function ToastTrigger({ message = 'Mensagem', type }: { message?: string; type?: 'success' | 'error' | 'warning' | 'info' }) {
  const toast = useToast();
  return <button onClick={() => toast(message, type)}>Show Toast</button>;
}

function renderWithProvider(props?: { message?: string; type?: 'success' | 'error' | 'warning' | 'info' }) {
  return render(
    <ToastProvider>
      <ToastTrigger {...props} />
    </ToastProvider>
  );
}

describe('ToastProvider / useToast', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.runOnlyPendingTimers());
  afterAll(() => jest.useRealTimers());

  it('useToast throws when used outside ToastProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToastTrigger />)).toThrow('useToast must be used within ToastProvider');
    consoleSpy.mockRestore();
  });

  it('shows a toast with the given message', () => {
    renderWithProvider({ message: 'Operação concluída' });
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Operação concluída')).toBeInTheDocument();
  });

  it('defaults to info type', () => {
    renderWithProvider({ message: 'Info msg' });
    fireEvent.click(screen.getByText('Show Toast'));
    expect(document.querySelector('.toast--info')).toBeInTheDocument();
  });

  it.each(['success', 'error', 'warning', 'info'] as const)('renders toast with type %s', (type) => {
    renderWithProvider({ message: `msg-${type}`, type });
    fireEvent.click(screen.getByText('Show Toast'));
    expect(document.querySelector(`.toast--${type}`)).toBeInTheDocument();
  });

  it('removes toast automatically after 4 seconds', () => {
    renderWithProvider({ message: 'Auto dismiss' });
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(4000));
    expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
  });

  it('removes toast when close button is clicked', () => {
    renderWithProvider({ message: 'Fechar manualmente' });
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Fechar manualmente')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(screen.queryByText('Fechar manualmente')).not.toBeInTheDocument();
  });

  it('can display multiple toasts simultaneously', () => {
    renderWithProvider({ message: 'Toast 1' });
    const btn = screen.getByText('Show Toast');
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.getAllByText('Toast 1')).toHaveLength(2);
  });
});
