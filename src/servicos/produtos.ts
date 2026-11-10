import type { Condicao, ProdutoDetalhado, StatusProduto } from '@/modelos';
import { traduzirErro } from '@/servicos/erros';
import { supabase } from '@/servicos/supabase';
import { buscarNomesVendedores } from '@/servicos/vendedores';

export interface FiltrosProduto {
  busca?: string;
  categoriaId?: number | null;
  precoMinimo?: number;
  precoMaximo?: number;
}

interface LinhaProduto {
  id: number;
  titulo: string;
  descricao: string;
  preco: number | string;
  condicao: Condicao;
  status: StatusProduto;
  categoria_id: number;
  vendedor_id: string | null;
  marca: string | null;
  quantidade: number;
  imagens: string[] | null;
  criado_em: string;
  categorias: { nome: string } | null;
}

const COLUNAS_PRODUTO =
  'id, titulo, descricao, preco, condicao, status, categoria_id, vendedor_id, marca, quantidade, imagens, criado_em, categorias(nome)';

async function buscarMeusInteresses(produtoIds: number[]): Promise<Map<number, number>> {
  const mapa = new Map<number, number>();
  if (produtoIds.length === 0) return mapa;

  const { data: sessao } = await supabase.auth.getSession();
  if (!sessao.session) return mapa;

  const { data, error } = await supabase
    .from('interesses')
    .select('id, produto_id')
    .eq('comprador_id', sessao.session.user.id)
    .in('produto_id', produtoIds);
  if (error) {
    console.warn('Não foi possível buscar seus interesses:', error.code, error.message);
    return mapa;
  }
  for (const linha of data as { id: number; produto_id: number }[]) mapa.set(linha.produto_id, linha.id);
  return mapa;
}

async function detalhar(linhas: LinhaProduto[]): Promise<ProdutoDetalhado[]> {
  const [nomesVendedores, interesses] = await Promise.all([
    buscarNomesVendedores(linhas.map((linha) => linha.vendedor_id)),
    buscarMeusInteresses(linhas.map((linha) => linha.id)),
  ]);

  return linhas.map((linha) => ({
    id: linha.id,
    titulo: linha.titulo,
    descricao: linha.descricao,
    preco: Number(linha.preco),
    condicao: linha.condicao,
    status: linha.status,
    categoriaId: linha.categoria_id,
    vendedorId: linha.vendedor_id,
    marca: linha.marca,
    quantidade: linha.quantidade,
    imagens: linha.imagens ?? [],
    criadoEm: linha.criado_em,
    categoriaNome: linha.categorias?.nome ?? 'Sem categoria',
    vendedorNome: linha.vendedor_id ? (nomesVendedores.get(linha.vendedor_id) ?? null) : null,
    interesseId: interesses.get(linha.id) ?? null,
  }));
}

export async function listarProdutos(filtros: FiltrosProduto = {}) {
  let consulta = supabase.from('produtos').select(COLUNAS_PRODUTO).neq('status', 'pausado');

  const busca = filtros.busca?.trim();
  if (busca) consulta = consulta.ilike('titulo', `%${busca}%`);
  if (filtros.categoriaId) consulta = consulta.eq('categoria_id', filtros.categoriaId);
  if (filtros.precoMinimo !== undefined) consulta = consulta.gt('preco', filtros.precoMinimo);
  if (filtros.precoMaximo !== undefined) consulta = consulta.lte('preco', filtros.precoMaximo);

  const { data, error } = await consulta.order('criado_em', { ascending: false });
  if (error) throw traduzirErro(error, 'Não foi possível carregar os itens.');
  return detalhar(data as unknown as LinhaProduto[]);
}

export async function buscarProduto(id: number): Promise<ProdutoDetalhado | null> {
  const { data, error } = await supabase.from('produtos').select(COLUNAS_PRODUTO).eq('id', id).maybeSingle();
  if (error) throw traduzirErro(error, 'Não foi possível carregar o item.');
  if (!data) return null;
  const [produto] = await detalhar([data as unknown as LinhaProduto]);
  return produto;
}
