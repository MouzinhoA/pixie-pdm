import type { SQLiteDatabase } from 'expo-sqlite';

import type { Interesse, InteresseDetalhado, StatusInteresse } from '@/modelos';

// Campos que o comprador preenche no formulário (o status é do vendedor)
export type DadosInteresse = Pick<Interesse, 'tipo' | 'valorOferecido' | 'itemTroca' | 'mensagem'>;

// Busca o interesse junto com os dados do produto, da categoria e do vendedor
const SELECT_INTERESSE = `
  SELECT i.*,
         p.titulo AS produtoTitulo,
         p.preco AS produtoPreco,
         p.imagens AS produtoImagens,
         c.nome AS categoriaNome,
         u.nome AS vendedorNome,
         u.telefone AS vendedorTelefone
  FROM interesses i
  JOIN produtos p ON p.id = i.produtoId
  JOIN categorias c ON c.id = p.categoriaId
  JOIN usuarios u ON u.id = p.vendedorId
`;

type LinhaInteresse = Omit<InteresseDetalhado, 'produtoImagens'> & { produtoImagens: string };

function converterLinha(linha: LinhaInteresse): InteresseDetalhado {
  return { ...linha, produtoImagens: JSON.parse(linha.produtoImagens) };
}

// READ: lista os interesses (opcionalmente só de um status), mais recentes primeiro
export async function listarInteresses(db: SQLiteDatabase, status: StatusInteresse | null = null) {
  const where = status ? 'WHERE i.status = ?' : '';
  const parametros = status ? [status] : [];
  const linhas = await db.getAllAsync<LinhaInteresse>(
    `${SELECT_INTERESSE} ${where} ORDER BY i.criadoEm DESC`,
    parametros
  );
  return linhas.map(converterLinha);
}

export async function buscarInteresse(db: SQLiteDatabase, id: number) {
  const linha = await db.getFirstAsync<LinhaInteresse>(`${SELECT_INTERESSE} WHERE i.id = ?`, [id]);
  return linha ? converterLinha(linha) : null;
}

// CREATE: registra o interesse do comprador em um item
export async function criarInteresse(db: SQLiteDatabase, produtoId: number, dados: DadosInteresse) {
  const existente = await db.getFirstAsync<{ id: number }>('SELECT id FROM interesses WHERE produtoId = ?', [
    produtoId,
  ]);
  if (existente) {
    throw new Error('Você já demonstrou interesse neste item.');
  }

  const resultado = await db.runAsync(
    `INSERT INTO interesses (produtoId, tipo, valorOferecido, itemTroca, mensagem, status, criadoEm)
     VALUES (?, ?, ?, ?, ?, 'aguardando', ?)`,
    [produtoId, dados.tipo, dados.valorOferecido, dados.itemTroca, dados.mensagem, new Date().toISOString()]
  );
  return resultado.lastInsertRowId;
}

// UPDATE: o comprador altera a proposta ou a mensagem
export async function atualizarInteresse(db: SQLiteDatabase, id: number, dados: DadosInteresse) {
  await db.runAsync(
    'UPDATE interesses SET tipo = ?, valorOferecido = ?, itemTroca = ?, mensagem = ? WHERE id = ?',
    [dados.tipo, dados.valorOferecido, dados.itemTroca, dados.mensagem, id]
  );
}

// SIMULAÇÃO: muda o status como se o vendedor tivesse respondido
export async function atualizarStatusInteresse(db: SQLiteDatabase, id: number, status: StatusInteresse) {
  await db.runAsync('UPDATE interesses SET status = ? WHERE id = ?', [status, id]);
}

// DELETE: cancela o interesse (o produto continua anunciado pelo vendedor)
export async function excluirInteresse(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM interesses WHERE id = ?', [id]);
}

export interface ResumoInteresses {
  total: number;
  compras: number;
  trocas: number;
  negociando: number;
}

// Estatísticas exibidas no topo da tela de interesses (calculadas pelo SQLite)
export async function buscarResumoInteresses(db: SQLiteDatabase): Promise<ResumoInteresses> {
  const resumo = await db.getFirstAsync<ResumoInteresses>(`
    SELECT COUNT(*) AS total,
           COALESCE(SUM(tipo = 'compra'), 0) AS compras,
           COALESCE(SUM(tipo = 'troca'), 0) AS trocas,
           COALESCE(SUM(status = 'negociando'), 0) AS negociando
    FROM interesses
  `);
  return resumo ?? { total: 0, compras: 0, trocas: 0, negociando: 0 };
}
