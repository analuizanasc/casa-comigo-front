Selo / carimbo do Casa Comigo — marca esforço (Leve/Médio/Pesado), status de tarefa ou cargo do morador.

```jsx
<Badge variant="sage">Leve</Badge>
<Badge variant="info" dot>Pendente</Badge>
<Badge variant="terracotta">Administrador</Badge>
{/* via mapas de domínio (Badge.statusVariant / Badge.statusLabel) */}
<Badge variant={Badge.statusVariant[task.status]} dot>{Badge.statusLabel[task.status]}</Badge>
```

Variantes: default, success, warning, danger, info, sage, terracotta. Use `dot` para status. Mapas anexados ao componente: `Badge.effortLabel/effortVariant`, `Badge.statusLabel/statusVariant`, `Badge.roleLabel` (também exportados nomeados para uso em código-fonte).
