// Classes do modelo de negócio do Pixie (app do comprador)

// Vendedor que anuncia os itens (classe Usuario do diagrama)
export interface Usuario {
  id: number;
  nome: string;
  cidade: string;
  telefone: string;
  reputacao: number; // nota média de 0 a 5
}

export interface Categoria {
  id: number;
  nome: string;
}

export type Condicao = 'lacrado' | 'novo' | 'usado' | 'com_avarias';
export type StatusProduto = 'disponivel' | 'reservado' | 'vendido';

// Item colecionável anunciado por um vendedor
export interface Produto {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  imagens: string[];
  condicao: Condicao;
  status: StatusProduto;
  categoriaId: number;
  vendedorId: number;
  criadoEm: string; // data em formato ISO
}

// Produto junto com dados das tabelas relacionadas, usado nas telas
export interface ProdutoDetalhado extends Produto {
  categoriaNome: string;
  vendedorNome: string;
  vendedorCidade: string;
  vendedorTelefone: string;
  vendedorReputacao: number;
  interesseId: number | null; // preenchido quando o comprador já demonstrou interesse
}

export type TipoInteresse = 'compra' | 'troca';
export type StatusInteresse = 'aguardando' | 'negociando' | 'encerrado';

// Entidade principal do CRUD: o interesse do comprador em comprar ou trocar um item.
// Demonstrar interesse não é comprar: o item continua sendo do vendedor.
export interface Interesse {
  id: number;
  produtoId: number;
  tipo: TipoInteresse;
  valorOferecido: number | null; // só para compra (opcional)
  itemTroca: string; // só para troca: o que o comprador oferece
  mensagem: string; // recado para o vendedor
  status: StatusInteresse;
  criadoEm: string; // data em formato ISO
}

// Interesse junto com os dados do produto, usado nas telas
export interface InteresseDetalhado extends Interesse {
  produtoTitulo: string;
  produtoPreco: number;
  produtoImagens: string[];
  categoriaNome: string;
  vendedorNome: string;
  vendedorTelefone: string;
}

// Textos exibidos nas telas para cada valor
export const CONDICOES: Record<Condicao, string> = {
  lacrado: 'Lacrado',
  novo: 'Novo',
  usado: 'Usado',
  com_avarias: 'Com avarias',
};

export const STATUS_PRODUTO: Record<StatusProduto, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

export const TIPOS_INTERESSE: Record<TipoInteresse, string> = {
  compra: 'Comprar',
  troca: 'Trocar',
};

export const STATUS_INTERESSE: Record<StatusInteresse, string> = {
  aguardando: 'Aguardando resposta',
  negociando: 'Em negociação',
  encerrado: 'Encerrado',
};

// Próxima etapa da negociação (quem muda é o vendedor; no app, isso é simulado)
export const PROXIMO_STATUS: Record<StatusInteresse, StatusInteresse | null> = {
  aguardando: 'negociando',
  negociando: 'encerrado',
  encerrado: null,
};
