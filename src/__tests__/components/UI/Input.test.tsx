import { render, screen } from '@testing-library/react';
import { Input, Select, Textarea } from '../../../components/UI/Input';

describe('Input', () => {
  it('renders an input without label', () => {
    render(<Input id="email" placeholder="E-mail" />);
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders label associated with input', () => {
    render(<Input id="email" label="E-mail" />);
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
  });

  it('shows error message and error class when error prop provided', () => {
    render(<Input id="pwd" label="Senha" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toHaveClass('field__input--error');
  });

  it('does not show error class when no error', () => {
    render(<Input id="name" />);
    expect(document.querySelector('.field__input--error')).not.toBeInTheDocument();
  });

  it('passes extra className to input', () => {
    render(<Input id="x" className="my-class" />);
    expect(document.querySelector('.my-class')).toBeInTheDocument();
  });
});

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Opção A' },
    { value: 'b', label: 'Opção B' },
  ];

  it('renders all options', () => {
    render(<Select id="sel" options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Opção A')).toBeInTheDocument();
    expect(screen.getByText('Opção B')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select id="sel" label="Escolha" options={options} />);
    expect(screen.getByLabelText('Escolha')).toBeInTheDocument();
  });

  it('shows error message and error class', () => {
    render(<Select id="sel" options={options} error="Selecione uma opção" />);
    expect(screen.getByText('Selecione uma opção')).toBeInTheDocument();
    expect(document.querySelector('.field__input--error')).toBeInTheDocument();
  });

  it('applies extra className', () => {
    render(<Select id="sel" options={options} className="custom" />);
    expect(document.querySelector('.custom')).toBeInTheDocument();
  });
});

describe('Textarea', () => {
  it('renders textarea without label', () => {
    render(<Textarea id="desc" placeholder="Descreva..." />);
    expect(screen.getByPlaceholderText('Descreva...')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Textarea id="desc" label="Descrição" />);
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
  });

  it('shows error message and error class', () => {
    render(<Textarea id="desc" error="Erro no campo" />);
    expect(screen.getByText('Erro no campo')).toBeInTheDocument();
    expect(document.querySelector('.field__input--error')).toBeInTheDocument();
  });

  it('applies extra className', () => {
    render(<Textarea id="desc" className="ta-custom" />);
    expect(document.querySelector('.ta-custom')).toBeInTheDocument();
  });
});
