Segmento de preferência — o morador marca afinidade com a tarefa (não gosto / neutro / gosto). Recurso central do Casa Comigo para distribuição justa.

```jsx
const [pref, setPref] = React.useState('like');
<PreferenceToggle value={pref} onChange={setPref} />
<PreferenceToggle value="hate" showLabels onChange={setPref} />
```

Props: `value` (`hate|neutral|like`), `onChange`, `showLabels`.
