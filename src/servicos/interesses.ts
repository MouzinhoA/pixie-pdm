import type { Interesse, InteresseDetalhado, StatusInteresse, TipoInteresse } from '@/modelos';
import { traduzirErro } from '@/servicos/erros';
import { supabase } from '@/servicos/supabase';
import { buscarNomesVendedores } from '@/servicos/vendedores';

export type DadosInteresse = Pick<Interesse, 'tipo' | 'valorOferecido' | 'itemTroca' | 'mensagem'>;


interface LinhaInteresse {
  id: number;
  produto_id: number;
  tipo: TipoInteresse;
  valor_oferecido: number | string | null;
  item_troca: string;
  mensagem: string;
  status: StatusInteresse;
  criado_em: string;
  produtos: {
    titulo: string;
    preco: number | string;
    imagens: string[] | null;
    vendedor_id: string | null;
    categorias: { nome: string } | null;
  } | null;
}

const COLUNAS_INTERESSE =
  'id, produto_id, tipo, valor_oferecido, item_troca, mensagem, status, criado_em, produtos(titulo, preco, imagens, vendedor_id, categorias(nome))';

async function detalhar(linhas: LinhaInteresse[]): Promise<InteresseDetalhado[]> {
  const nomesVendedores = await buscarNomesVendedores(linhas.map((linha) => linha.produtos?.vendedor_id ?? null));

  return linhas.map((linha) => {
    const vendedorId = linha.produtos?.vendedor_id;
    return {
      id: linha.id,
      produtoId: linha.produto_id,
      tipo: linha.tipo,
      valorOferecido: linha.valor_oferecido === null ? null : Number(linha.valor_oferecido),
      itemTroca: linha.item_troca,
      mensagem: linha.mensagem,
      status: linha.status,
      criadoEm: linha.criado_em,
      produtoTitulo: linha.produtos?.titulo ?? 'Item removido',
      produtoPreco: Number(linha.produtos?.preco ?? 0),
      produtoImagem: linha.produtos?.imagens?.[0] ?? null,
      categoriaNome: linha.produtos?.categorias?.nome ?? 'Sem categoria',
      vendedorNome: vendedorId ? (nomesVendedores.get(vendedorId) ?? null) : null,
    };
  });
}

function paraBanco(dados: DadosInteresse) {
  return {
    tipo: dados.tipo,
    valor_oferecido: dados.valorOferecido,
    item_troca: dados.itemTroca,
    mensagem: dados.mensagem,
  };
}

export async function listarInteresses(status: StatusInteresse | null = null) {
  let consulta = supabase.from('interesses').select(COLUNAS_INTERESSE);
  if (status) consulta = consulta.eq('status', status);

  const { data, error } = await consulta.order('criado_em', { ascending: false });
  if (error) throw traduzirErro(error, 'Não foi possível carregar seus interesses.');
  return detalhar(data as unknown as LinhaInteresse[]);
}

export async function buscarInteresse(id: number): Promise<InteresseDetalhado | null> {
  const { data, error } = await supabase.from('interesses').select(COLUNAS_INTERESSE).eq('id', id).maybeSingle();
  if (error) throw traduzirErro(error, 'Não foi possível carregar o interesse.');
  if (!data) return null;
  const [interesse] = await detalhar([data as unknown as LinhaInteresse]);
  return interesse;
}

export async function criarInteresse(produtoId: number, dados: DadosInteresse): Promise<number> {
  // comprador_id é preenchido pelo banco com o usuário logado (default auth.uid())
  const { data, error } = await supabase
    .from('interesses')
    .insert({ produto_id: produtoId, ...paraBanco(dados) })
    .select('id')
    .single();
  if (error) throw traduzirErro(error, 'Não foi possível enviar o interesse.');
  return data.id;
}

export async function atualizarInteresse(id: number, dados: DadosInteresse) {
  const { error } = await supabase.from('interesses').update(paraBanco(dados)).eq('id', id);
  if (error) throw traduzirErro(error, 'Não foi possível atualizar o interesse.');
}

export async function atualizarStatusInteresse(id: number, status: StatusInteresse) {
  const { error } = await supabase.from('interesses').update({ status }).eq('id', id);
  if (error) throw traduzirErro(error, 'Não foi possível mudar o status.');
}

export async function excluirInteresse(id: number) {
  const { error } = await supabase.from('interesses').delete().eq('id', id);
  if (error) throw traduzirErro(error, 'Não foi possível cancelar o interesse.');
}

export interface ResumoInteresses {
  total: number;
  compras: number;
  trocas: number;
  negociando: number;
}

export async function buscarResumoInteresses(): Promise<ResumoInteresses> {
  const { data, error } = await supabase.from('interesses').select('tipo, status');
  if (error) throw traduzirErro(error, 'Não foi possível carregar o resumo.');

  const linhas = data as { tipo: TipoInteresse; status: StatusInteresse }[];
  return {
    total: linhas.length,
    compras: linhas.filter((linha) => linha.tipo === 'compra').length,
    trocas: linhas.filter((linha) => linha.tipo === 'troca').length,
    negociando: linhas.filter((linha) => linha.status === 'negociando').length,
  };
}
