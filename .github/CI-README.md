# Pipeline de CI — Casa Comigo Front

Pipeline de **Integração Contínua** configurada com **GitHub Actions** para o projeto Casa Comigo Front (React + TypeScript + Vite).

---

## Fluxo da Pipeline

```
Push / PR / Manual / Schedule
           │
           ▼
  ┌─────────────────┐
  │  Lint & Type    │  ← Job 1: qualidade de código
  │  Check          │
  └────────┬────────┘
           │ (falhou? pipeline encerra aqui)
           ▼
  ┌─────────────────┐
  │  Testes &       │  ← Job 2: testes + cobertura + relatórios
  │  Cobertura      │
  └────────┬────────┘
           │ (falhou? build não roda)
           ▼
  ┌─────────────────┐
  │  Build de       │  ← Job 3: bundle de produção
  │  Produção       │
  └─────────────────┘
```

---

## Gatilhos (Triggers)

| Gatilho | Configuração | Quando dispara |
|---------|-------------|----------------|
| `push` | branches: `main`, `develop` | A cada commit enviado |
| `pull_request` | branches: `main`, `develop` | Abertura ou atualização de PR |
| `workflow_dispatch` | input: versão do Node | Acionamento manual pela interface do GitHub |
| `schedule` | `cron: '0 6 * * 1-5'` | Todos os dias úteis às 06:00 UTC (03:00 BRT) |

### Por que esses gatilhos?

- **`push`**: garante feedback imediato a cada commit, evitando acúmulo de problemas na branch principal.
- **`pull_request`**: bloqueia a fusão de código que não passa nos testes, protegendo `main` e `develop`.
- **`workflow_dispatch`**: útil para re-executar a pipeline manualmente após correção de ambiente ou para testar com outra versão do Node sem fazer commit.
- **`schedule`**: execução periódica detecta regressões causadas por atualizações de dependências externas ou mudanças de ambiente — mesmo sem novos commits.

---

## Jobs

### Job 1 — Lint & Type Check

Roda **antes dos testes** para falhar o mais rápido possível (_fail fast_). Não faz sentido gastar tempo executando 100+ testes se o código sequer compila ou tem erros de lint.

| Step | Ferramenta | O que verifica |
|------|-----------|----------------|
| Lint | ESLint | Padrões de código, regras de React Hooks, importações |
| Type check | `tsc --noEmit` | Erros de tipagem TypeScript sem gerar arquivos |

### Job 2 — Testes Unitários & Cobertura

Executa `npm run test:ci`, que combina em um único comando:
- Todos os testes com **Jest** + **ts-jest** + **jsdom**
- Reporter padrão (saída no log)
- Reporter **jest-junit** (gera `test-results/junit.xml`)
- Cobertura em 4 formatos: `text`, `lcov`, `html`, `json-summary`

**Relatórios gerados:**

| Relatório | Formato | Uso |
|-----------|---------|-----|
| `test-results/junit.xml` | JUnit XML | Publicado como check nativo do GitHub (aba "Tests") |
| `coverage/index.html` | HTML | Relatório visual navegável — baixe o artefato e abra no browser |
| `coverage/lcov.info` | LCOV | Integração com ferramentas como Codecov, SonarQube |
| `coverage/coverage-summary.json` | JSON | Base para o sumário exibido no Job Summary |

**Thresholds de cobertura** (configurados em `jest.config.cjs`):

| Métrica | Mínimo |
|---------|--------|
| Statements | 95% |
| Branches | 88% |
| Functions | 99% |
| Lines | 97% |

Se qualquer threshold não for atingido, a pipeline falha — garantindo que novas features venham sempre com testes adequados.

### Job 3 — Build de Produção

Valida que o bundle Vite gera sem erros após todas as verificações passarem. O artefato `dist/` fica disponível para download e pode ser consumido por uma pipeline de CD (_Continuous Deployment_) futura.

---

## Artefatos

Os artefatos são arquivos gerados durante a execução da pipeline e ficam disponíveis para download na página do workflow no GitHub.

| Artefato | Conteúdo | Retenção |
|----------|----------|----------|
| `test-results-junit` | XML com resultados de cada teste | 30 dias |
| `coverage-report` | HTML + LCOV + JSON da cobertura | 30 dias |
| `dist-<sha>` | Bundle de produção (Vite) | 7 dias |

**Como baixar:** na página do workflow → role até a seção **Artifacts** → clique no artefato desejado.

---

## Conceitos Utilizados

### Fail Fast

```
quality → test → build
```

Os jobs são encadeados via `needs`. Se o lint falhar, os testes não rodam. Se os testes falharem, o build não roda. Isso evita desperdício de tempo e recursos de CI.

### Cache de Dependências

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

O `actions/setup-node` com `cache: 'npm'` armazena o diretório `~/.npm` entre execuções. Na prática, o `npm ci` passa de ~30s para ~3s em runs subsequentes — as dependências são restauradas do cache em vez de baixadas da internet.

### Concorrência Controlada

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

Se você fizer push de dois commits rapidamente, a pipeline do primeiro commit é **cancelada automaticamente** quando o segundo inicia. Garante que apenas o run mais recente consume recursos, evitando filas longas no runner.

### Permissões Mínimas (Least Privilege)

```yaml
permissions:
  contents: read
  checks: write
```

Seguindo o princípio de menor privilégio: a pipeline só lê o código (`contents: read`) e escreve resultados de checks (`checks: write`). Nenhuma permissão extra é concedida, limitando o impacto em caso de comprometimento de um token.

### `if: always()` nos Artefatos

```yaml
- uses: actions/upload-artifact@v4
  if: always()
```

Sem `if: always()`, o upload de artefatos só rodaria se todos os steps anteriores passassem — ou seja, quando os testes **falham**, os relatórios (que são justamente o que você precisa para depurar) **não seriam salvos**. Com `if: always()`, os artefatos são enviados independentemente do resultado.

### Job Summary

```yaml
echo "## Cobertura" >> $GITHUB_STEP_SUMMARY
```

Escreve na variável especial `$GITHUB_STEP_SUMMARY` para exibir um resumo de cobertura formatado em Markdown diretamente na página do workflow — sem precisar baixar artefatos para ver os números principais.

### `dorny/test-reporter`

Publica o JUnit XML como **check nativo do GitHub**, visível na aba "Tests" de cada execução e inline nos commits e PRs. Facilita identificar qual teste falhou sem precisar baixar artefatos ou analisar logs.

### `workflow_dispatch` com Inputs

```yaml
workflow_dispatch:
  inputs:
    node_version:
      type: choice
      options: ['18', '20', '22']
```

Permite executar a pipeline manualmente com parâmetros. Útil para testar compatibilidade com diferentes versões do Node ou re-executar após um incidente sem precisar fazer um commit vazio.

---

## Como Executar Localmente

```bash
# Testes simples
npm test

# Testes com cobertura
npm run test:coverage

# Simular o comando da pipeline de CI
JEST_JUNIT_OUTPUT_DIR=./test-results \
JEST_JUNIT_OUTPUT_NAME=junit.xml \
npm run test:ci
```

---

## Estrutura de Arquivos

```
.github/
├── workflows/
│   └── ci.yml          ← Pipeline principal
└── CI-README.md        ← Esta documentação

jest.config.cjs         ← Configuração Jest + thresholds
package.json            ← Scripts: test, test:coverage, test:ci
```
