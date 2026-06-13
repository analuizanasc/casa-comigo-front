# UI Kit · App Casa Comigo

Recriação navegável do app Casa Comigo, composta com os primitivos do design
system (`window.CasaComigoDesignSystem_64c258`). Fiel ao front-end real
(https://github.com/analuizanasc/casa-comigo-front) e aos mockups v1, com a
linguagem modernizada (cartões flutuantes, sombras quentes, cantos macios).

## Telas
- **Login** (`login.jsx`) — cartão de entrada com a marca Sol do Sertão.
- **Cronograma** / **Catálogo** / **Preferências** (`screens.jsx`)
- **Membros** / **Relatórios** (`screens2.jsx`)

## Shell
- `shell.jsx` — `Sidebar` (navegação com ícones Lucide), `PageHeader`, helper
  `Icon` (Lucide via UMD `createElement`), e os dados de exemplo (casa, membros).

## Como rodar
Abra `index.html`. O fluxo começa no Login → "Entrar" leva ao Cronograma; a
sidebar troca entre as telas; "Trocar de casa" volta ao Login.

## Notas de fidelidade
- Componentes vêm do bundle do design system — não reimplementados aqui.
- Ícones de navegação: Lucide (substituem os emojis do produto original).
- Dados são fictícios (Apartamento 404, moradores qa + Marcelo), espelhando os
  mockups enviados.
