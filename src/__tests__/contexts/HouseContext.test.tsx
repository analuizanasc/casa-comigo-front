import { render, screen, fireEvent } from '@testing-library/react';
import { HouseProvider, useHouse } from '../../contexts/HouseContext';
import type { HouseSummary } from '../../types';

const mockHouse: HouseSummary = { id: 'h1', name: 'Casa Teste', role: 'admin', created_at: '2024-01-01' };

function TestConsumer() {
  const { currentHouse, setCurrentHouse } = useHouse();
  return (
    <div>
      <span data-testid="house">{currentHouse?.name ?? 'null'}</span>
      <button onClick={() => setCurrentHouse(mockHouse)}>Set</button>
      <button onClick={() => setCurrentHouse(null)}>Clear</button>
    </div>
  );
}

describe('HouseContext', () => {
  it('starts with currentHouse as null', () => {
    render(<HouseProvider><TestConsumer /></HouseProvider>);
    expect(screen.getByTestId('house')).toHaveTextContent('null');
  });

  it('setCurrentHouse updates the state', () => {
    render(<HouseProvider><TestConsumer /></HouseProvider>);
    fireEvent.click(screen.getByText('Set'));
    expect(screen.getByTestId('house')).toHaveTextContent('Casa Teste');
  });

  it('setCurrentHouse(null) resets state', () => {
    render(<HouseProvider><TestConsumer /></HouseProvider>);
    fireEvent.click(screen.getByText('Set'));
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByTestId('house')).toHaveTextContent('null');
  });

  it('useHouse throws when used outside HouseProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useHouse must be used within HouseProvider');
    consoleSpy.mockRestore();
  });
});
