Lista suspensa do Casa Comigo — mesmo estilo do Input, com seta de cordel.

```jsx
<Select id="morador" label="Morador" options={[
  { value: 'todos', label: 'Todos' },
  { value: 'qa', label: 'qa' },
  { value: 'marcelo', label: 'Marcelo' },
]} />
```

Props: `label`, `error`, `options` (`{value,label}[]`) + atributos nativos de `<select>`.
