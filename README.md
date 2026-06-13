# Casa Comigo — Front-end

Interface web do **Casa Comigo**, um app de organização e distribuição justa de tarefas domésticas. A identidade visual segue o design system de xilogravura nordestina modernizada.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Roteamento | React Router DOM 7 |
| HTTP | Axios |
| Testes | Jest + Testing Library |
| Lint | ESLint + typescript-eslint |

---

## Pré-requisitos

- **Node.js** 18+ e **npm**
- **Back-end** rodando em `http://localhost:3000` (veja o repositório [casa-comigo](https://github.com/analuizanasc/casa-comigo))

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/analuizanasc/casa-comigo-front.git
cd casa-comigo-front

# Instale as dependências
npm install
```

---

## Rodando o projeto

```bash
npm run dev
```

O app sobe em **http://localhost:4000**.

Todas as requisições para `/api/*` são proxiadas automaticamente para `http://localhost:3000` — sem necessidade de configurar CORS no desenvolvimento.

---

## Comandos disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 4000, HMR ativo) |
| `npm run build` | Compila TypeScript e gera bundle de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o ESLint em todo o projeto |
| `npm run test` | Executa a suíte de testes com Jest |
| `npm run test:coverage` | Testes com relatório de cobertura (texto + LCOV) |

---

## Estrutura de diretórios

```
src/
├── api/               # Clientes HTTP por domínio
│   ├── client.ts      # Instância Axios com injeção de token e tratamento de erros
│   ├── auth.ts
│   ├── catalog.ts
│   ├── houses.ts
│   ├── invitations.ts
│   ├── members.ts
│   ├── notifications.ts
│   ├── preferences.ts
│   ├── reports.ts
│   └── schedule.ts
├── assets/            # Ícones e imagens estáticas
├── components/        # Componentes reutilizáveis
│   ├── Layout/        # AppLayout com sidebar e proteção de rota
│   └── UI/            # Toast, botões, modais e outros primitivos
├── contexts/
│   ├── AuthContext.tsx # Autenticação (user + token → localStorage)
│   └── HouseContext.tsx# Casa selecionada no momento
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Houses.tsx      # Seletor de casas
│   └── house/         # Páginas autenticadas por casa
│       ├── Members.tsx
│       ├── Catalog.tsx
│       ├── Preferences.tsx
│       ├── Schedule.tsx
│       └── Reports.tsx
├── types/
│   └── index.ts       # Interfaces de domínio (User, House, Task, Assignment…)
├── App.tsx            # Definição de rotas
├── index.css          # Design system em CSS custom properties
└── main.tsx
```

---

## Arquitetura

### Camada de API

`src/api/client.ts` cria uma instância Axios com `baseURL: '/api'`. Ela injeta automaticamente o header `Authorization: Bearer <token>` a partir do `localStorage` e extrai mensagens de erro de `error.response.data.error` antes de rejeitar a promise.

Cada arquivo de domínio (`auth.ts`, `catalog.ts`, etc.) importa esse cliente e exporta funções tipadas.

### Autenticação

`AuthContext` gerencia `user` e `token`. Ambos são persistidos no `localStorage` e limpos no `logout()`. O componente `AppLayout` redireciona para `/login` quando `!isAuthenticated`.

### Notificações

`ToastProvider` (em `components/UI/Toast.tsx`) expõe o hook `useToast()` que aceita `(message, type?)` e auto-dispensa em 4 segundos.

### Rotas

```
/login           → público
/register        → público
/houses          → lista de casas (autenticado)
/houses/:id/*    → páginas da casa (autenticado via AppLayout)
*                → redireciona para /login
```

---

## Testes

Os testes ficam em `src/__tests__/` espelhando a estrutura de `src/`. São usados Jest 29 + `@testing-library/react` + `axios-mock-adapter` para mock de requisições HTTP.

```bash
# Rodar todos os testes
npm run test

# Rodar com cobertura
npm run test:coverage
```

### Cobertura atual

| Métrica | Cobertura |
|---|---|
| Statements | ≥ 97% |
| Branches | ≥ 91% |
| Functions | 100% |
| Lines | 100% |

Limites mínimos enforçados via `jest.config.cjs` (`coverageThresholds`): Statements 95% · Branches 88% · Functions 99% · Lines 97%.

### Técnicas aplicadas

- **Cobertura de sentença (statement coverage)** — cada instrução executável tem ao menos um teste que a aciona.
- **Cobertura de decisão (branch coverage)** — caminhos `if/else`, operadores `??` e `?.`, e ternários são exercitados em ambos os lados.
- Casos defensivos testados via submissão programática de formulário (`fireEvent.submit`) para validar guardas de código que a UI desabilita por design.

---

## Design system

Todo o estilo é CSS puro em `src/index.css` via CSS custom properties — sem CSS Modules nem Tailwind.

Principais tokens:

| Token | Valor | Uso |
|---|---|---|
| `--terracotta` | `#C05A38` | Cor primária / CTA |
| `--canvas` | `#F5F0EA` | Fundo da página |
| `--surface` | `#FDFAF5` | Sidebar |
| `--surface-raised` | `#FFFFFF` | Cards e modais |
| `--sage` | `#5A7D63` | Acento secundário |
| `--sp-{n}` | `n × 4px` | Escala de espaçamento |

Tipografia: **Anton** para títulos (display/cordel) e **Archivo** para corpo e UI.
