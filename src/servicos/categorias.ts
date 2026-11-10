import type { Categoria } from '@/modelos';
import { traduzirErro } from '@/servicos/erros';
import { supabase } from '@/servicos/supabase';

export async function listarCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase.from('categorias').select('id, nome').order('nome');
  if (error) throw traduzirErro(error, 'Não foi possível carregar as categorias.');
  return data;
}
