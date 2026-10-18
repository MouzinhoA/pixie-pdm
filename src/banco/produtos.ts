import type { SQLiteDatabase } from 'expo-sqlite';

import type { ProdutoDetalhado } from '@/modelos';

export interface FiltrosProduto {
  busca?: string;
  categoriaId?: number | null;
  precoMinimo?: number; // preço maior que este valor
  precoMaximo?: number; // preço menor ou igual a este valor
}

// Busca o produto junto com a categoria, o vendedor e o interesse (se existir)
const SELECT_PRODUTO = `
  SELECT p.*,
         c.nome AS categoriaNome,
         u.nome AS vendedorNome,
         u.cidade AS vendedorCidade,
         u.telefone AS vendedorTelefone,
         u.reputacao AS vendedorReputacao,
         i.id AS interesseId
  FROM produtos p
  JOIN categorias c ON c.id = p.categoriaId
  JOIN usuarios u ON u.id = p.vendedorId
  LEFT JOIN interesses i ON i.produtoId = p.id
`;

// No banco a lista de imagens fica salva como texto JSON
type LinhaProduto = Omit<ProdutoDetalhado, 'imagens'> & { imagens: string };

function converterLinha(linha: LinhaProduto): ProdutoDetalhado {
  return { ...linha, imagens: JSON.parse(linha.imagens) };
}

export async function listarProdutos(db: SQLiteDatabase, filtros: FiltrosProduto = {}) {
  const condicoes: string[] = [];
  const parametros: (string | number)[] = [];

  if (filtros.busca?.trim()) {
    condicoes.push('p.titulo LIKE ?');
    parametros.push(`%${filtros.busca.trim()}%`);
  }
  if (filtros.categoriaId) {
    condicoes.push('p.categoriaId = ?');
    parametros.push(filtros.categoriaId);
  }
  if (filtros.precoMinimo !== undefined) {
    condicoes.push('p.preco > ?');
    parametros.push(filtros.precoMinimo);
  }
  if (filtros.precoMaximo !== undefined) {
    condicoes.push('p.preco <= ?');
    parametros.push(filtros.precoMaximo);
  }

  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '';
  const linhas = await db.getAllAsync<LinhaProduto>(
    `${SELECT_PRODUTO} ${where} ORDER BY p.criadoEm DESC`,
    parametros
  );
  return linhas.map(converterLinha);
}

export async function buscarProduto(db: SQLiteDatabase, id: number) {
  const linha = await db.getFirstAsync<LinhaProduto>(`${SELECT_PRODUTO} WHERE p.id = ?`, [id]);
  return linha ? converterLinha(linha) : null;
}
