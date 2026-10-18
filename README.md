<p align="center">
  <img src="assets/images/logo.png" alt="Pixie" width="220" />
</p>

# Pixie — colecionáveis para o comprador

Aplicativo mobile do **Projeto 1** da disciplina Programação para Dispositivos Móveis (IFPB Campus Esperança, 2026.2).

O Pixie é um marketplace de **itens colecionáveis** (cartas, action figures, moedas, quadrinhos, vinis...). Esta versão é a do **comprador**: ele explora os itens anunciados pelos vendedores e **demonstra interesse** em comprar ou trocar, enviando uma proposta e uma mensagem ao vendedor. Os dados ficam salvos no próprio celular (SQLite).

> Demonstrar interesse não é comprar: o item continua sendo um anúncio do vendedor. O interesse registra a proposta do comprador e o andamento da negociação.

## Funcionalidades

| Requisito | Onde está no app |
| --- | --- |
| **RF01 — CRUD completo** | **Interesse** (entidade principal): demonstrar interesse em um item, listar, editar (tipo, valor oferecido ou item da troca e mensagem) e cancelar. O status da negociação (aguardando → em negociação → encerrado) muda por um botão de **simulação**, já que quem responde é o vendedor. |
| **RF02 — Persistência local** | Banco **SQLite** (`expo-sqlite`) no aparelho: interesses, itens e preferência de tema continuam após fechar o app. |
| **RF03 — Listagem inteligente** | Explorar: busca por título, filtro por categoria e por faixa de preço. Interesses: filtro por status da negociação. |
| **RF04 — Validação** | Tipo (comprar/trocar) e mensagem obrigatórios; valor oferecido com formato validado; item da troca obrigatório quando o tipo é troca. Os erros aparecem embaixo de cada campo e somem quando o campo é corrigido. |
| **RF05 — Navegação** | Expo Router: abas Explorar e Interesses, tela de detalhe do item e formulário de interesse. |
| **RF06 — Feedback** | Confirmação antes de cancelar, mensagens de sucesso e erro, indicadores de carregamento. |

**Detalhe do item:** descrição, preço, conservação, dados do vendedor (cidade e reputação) e o espaço **Demonstrar interesse**.

**Extras (pontuação bônus):**
- Tema claro / escuro (botão no topo, salvo no banco)
- Estatísticas: total de interesses, quantos para comprar, para trocar e em negociação

## Tecnologias

- [React Native](https://reactnative.dev) + [Expo SDK 57](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/router/introduction/) — navegação por arquivos
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — banco de dados local
- [NativeWind](https://www.nativewind.dev) (Tailwind CSS) — estilos
- expo-image
- TypeScript

## Como executar

Pré-requisitos: [Node.js](https://nodejs.org) 20+ e o app **Expo Go** no celular Android (ou um emulador Android).

```bash
git clone <url-do-repositorio>
cd pixie-pdm
npm install
npx expo start
```

Depois, escaneie o QR Code com o Expo Go ou pressione `a` para abrir no emulador Android.

> Se o celular não conectar ao computador (redes diferentes), use `npx expo start --tunnel`.
> O app também abre no navegador (tecla `w`), mas o alvo do projeto é Android.

Outros comandos:

```bash
npx expo lint      # verifica o código
npx tsc --noEmit   # verifica os tipos
```

## Estrutura do projeto

```
src/
├── app/            # Telas (cada arquivo é uma rota do Expo Router)
│   ├── (abas)/     # Explorar e Meus interesses
│   ├── produto/    # [id] = detalhes do item
│   └── interesse/  # formulario = demonstrar/editar interesse
├── banco/          # Camada de dados: tabelas e SQL de cada entidade
├── componentes/    # Componentes visuais reutilizáveis
├── modelos/        # Tipos das classes do modelo de negócio
├── tema/           # Cores da marca e tema claro/escuro
└── utils/          # Formatação, validação, alertas e exportação
```

As telas nunca escrevem SQL: elas chamam funções da pasta `banco/` (ex.: `criarInteresse(db, produtoId, dados)`), e as regras de validação ficam em `utils/validacao.ts`.

## Capturas de tela

| Explorar | Detalhe | Formulário (validação) | Interesses | Tema escuro |
| --- | --- | --- | --- | --- |
| <img src="docs/prints/explorar.png" width="160" /> | <img src="docs/prints/detalhe.png" width="160" /> | <img src="docs/prints/formulario.png" width="160" /> | <img src="docs/prints/interesses.png" width="160" /> | <img src="docs/prints/escuro.png" width="160" /> |

## Referências

As configurações abaixo seguem a documentação oficial das bibliotecas:

- NativeWind com Expo (`babel.config.js`, `metro.config.js`, `tailwind.config.js`): https://www.nativewind.dev/docs/getting-started/installation
- expo-sqlite, incluindo a configuração para web (`metro.config.js`): https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
- Expo Router (abas e pilha de telas): https://docs.expo.dev/router/introduction/

## Documentação

Veja [docs/documentacao.md](docs/documentacao.md): tema, modelo de dados e justificativa do SQLite.
