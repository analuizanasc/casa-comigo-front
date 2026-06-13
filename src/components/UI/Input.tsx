import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="campo-wrap">
      {label && <label className="rotulo" htmlFor={id}>{label}</label>}
      <input
        id={id}
        className={`campo ${error ? 'campo--erro' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <span className="campo-erro-msg">{error}</span>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, id, options, className = '', ...props }: SelectProps) {
  return (
    <div className="campo-wrap">
      {label && <label className="rotulo" htmlFor={id}>{label}</label>}
      <select
        id={id}
        className={`campo ${error ? 'campo--erro' : ''} ${className}`.trim()}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="campo-erro-msg">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  return (
    <div className="campo-wrap">
      {label && <label className="rotulo" htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        className={`campo ${error ? 'campo--erro' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <span className="campo-erro-msg">{error}</span>}
    </div>
  );
}
