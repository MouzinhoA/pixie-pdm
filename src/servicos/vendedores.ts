import { supabase } from '@/servicos/supabase';

export async function buscarNomesVendedores(ids: (string | null)[]): Promise<Map<string, string>> {
  const unicos = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  const nomes = new Map<string, string>();
  if (unicos.length === 0) return nomes;

  const { data, error } = await supabase.from('vendedor_publico').select('id, nome').in('id', unicos);
  if (error) {
    console.warn('Não foi possível buscar os nomes dos vendedores:', error.code, error.message);
    return nomes;
  }
  for (const vendedor of data as { id: string; nome: string }[]) {
    if (vendedor.nome) nomes.set(vendedor.id, vendedor.nome);
  }
  return nomes;
}
