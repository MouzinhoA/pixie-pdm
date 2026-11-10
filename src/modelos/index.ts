export interface Categoria {
  id: number;
  nome: string;
}

export type Condicao = 'lacrado' | 'novo' | 'usado' | 'com_avarias';
export type StatusProduto = 'disponivel' | 'pausado' | 'vendido';

export interface Produto {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  condicao: Condicao;
  status: StatusProduto;
  categoriaId: number;
  vendedorId: string | null;
  marca: string | null;
  quantidade: number;
  imagens: string[];
  criadoEm: string;
}

export interface ProdutoDetalhado extends Produto {
  categoriaNome: string;
  vendedorNome: string | null;
  interesseId: number | null;
}

export type TipoInteresse = 'compra' | 'troca';
export type StatusInteresse = 'aguardando' | 'negociando' | 'encerrado';

export interface Interesse {
  id: number;
  produtoId: number;
  tipo: TipoInteresse;
  valorOferecido: number | null;
  itemTroca: string;
  mensagem: string;
  status: StatusInteresse;
  criadoEm: string;
}

export interface InteresseDetalhado extends Interesse {
  produtoTitulo: string;
  produtoPreco: number;
  produtoImagem: string | null;
  categoriaNome: string;
  vendedorNome: string | null;
}

export const CONDICOES: Record<Condicao, string> = {
  lacrado: 'Lacrado',
  novo: 'Novo',
  usado: 'Usado',
  com_avarias: 'Com avarias',
};

export const STATUS_PRODUTO: Record<StatusProduto, string> = {
  disponivel: 'Disponível',
  pausado: 'Pausado',
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

export const PROXIMO_STATUS: Record<StatusInteresse, StatusInteresse | null> = {
  aguardando: 'negociando',
  negociando: 'encerrado',
  encerrado: null,
};
