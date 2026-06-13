import { render, screen, fireEvent } from '@testing-library/react';
import { Input, Select, Textarea } from '../../../components/UI/Input';

describe('Input', () => {
  it('renders an input without label', () => {
    render(<Input id="email" placeholder="E-mail" />);
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders label associated with input when label prop provided', () => {
    render(<Input id="email" label="E-mail" />);
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
  });

  it('applies campo--erro class and shows error message when error prop provided', () => {
    render(<Input id="pwd" label="Senha" error="Campo obrigatório" />);
    expect(screen.getByLabelText('Senha')).toHaveClass('campo--erro');
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('does not apply campo--erro class when no error', () => {
    render(<Input id="name" />);
    expect(document.querySelector('.campo--erro')).not.toBeInTheDocument();
  });

  it('wraps input in campo-wrap container', () => {
    render(<Input id="x" />);
    expect(document.querySelector('.campo-wrap')).toBeInTheDocument();
  });

  it('passes extra className to the input element', () => {
    render(<Input id="x" className="my-class" />);
    expect(document.querySelector('.my-class')).toBeInTheDocument();
  });

  it('fires onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<Input id="x" onChange={onChange} />);
    fireEvent.change(document.querySelector('input')!, { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Opção A' },
    { value: 'b', label: 'Opção B' },
  ];

  it('renders all options inside a combobox', () => {
    render(<Select id="sel" options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Opção A')).toBeInTheDocument();
    expect(screen.getByText('Opção B')).toBeInTheDocument();
  });

  it('renders label associated with select when label prop provided', () => {
    render(<Select id="sel" label="Escolha" options={options} />);
    expect(screen.getByLabelText('Escolha')).toBeInTheDocument();
  });

  it('applies campo--erro class and shows error message when error prop provided', () => {
    render(<Select id="sel" options={options} error="Selecione uma opção" />);
    expect(document.querySelector('.campo--erro')).toBeInTheDocument();
    expect(screen.getByText('Selecione uma opção')).toBeInTheDocument();
  });

  it('does not apply campo--erro class when no error', () => {
    render(<Select id="sel" options={options} />);
    expect(document.querySelector('.campo--erro')).not.toBeInTheDocument();
  });

  it('applies extra className to the select element', () => {
    render(<Select id="sel" options={options} className="custom" />);
    expect(document.querySelector('.custom')).toBeInTheDocument();
  });

  it('fires onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<Select id="sel" options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Textarea', () => {
  it('renders textarea without label', () => {
    render(<Textarea id="desc" placeholder="Descreva..." />);
    expect(screen.getByPlaceholderText('Descreva...')).toBeInTheDocument();
  });

  it('renders label associated with textarea when label prop provided', () => {
    render(<Textarea id="desc" label="Descrição" />);
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
  });

  it('applies campo--erro class and shows error message when error prop provided', () => {
    render(<Textarea id="desc" error="Erro no campo" />);
    expect(document.querySelector('.campo--erro')).toBeInTheDocument();
    expect(screen.getByText('Erro no campo')).toBeInTheDocument();
  });

  it('does not apply campo--erro class when no error', () => {
    render(<Textarea id="desc" />);
    expect(document.querySelector('.campo--erro')).not.toBeInTheDocument();
  });

  it('applies extra className to the textarea element', () => {
    render(<Textarea id="desc" className="ta-custom" />);
    expect(document.querySelector('.ta-custom')).toBeInTheDocument();
  });

  it('fires onChange when textarea content changes', () => {
    const onChange = jest.fn();
    render(<Textarea id="desc" onChange={onChange} />);
    fireEvent.change(document.querySelector('textarea')!, { target: { value: 'texto' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
