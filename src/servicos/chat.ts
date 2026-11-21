import type { Mensagem } from '@/modelos';
import { traduzirErro } from '@/servicos/erros';
import { supabase } from '@/servicos/supabase';

const TABELA_MENSAGENS = 'mensagens';

interface LinhaMensagem {
  id: number;
  interesse_id: number;
  autor_id: string;
  conteudo: string;
  criado_em: string;
}

function paraMensagem(linha: LinhaMensagem): Mensagem {
  return {
    id: linha.id,
    interesseId: linha.interesse_id,
    autorId: linha.autor_id,
    conteudo: linha.conteudo,
    criadoEm: linha.criado_em,
  };
}

export async function buscarMensagens(interesseId: number): Promise<Mensagem[]> {
  const { data, error } = await supabase
    .from(TABELA_MENSAGENS)
    .select('*')
    .eq('interesse_id', interesseId)
    .order('criado_em', { ascending: true });

  if (error) throw traduzirErro(error, 'Não foi possível carregar a conversa.');
  return (data as LinhaMensagem[]).map(paraMensagem);
}

export async function enviarMensagem(interesseId: number, conteudo: string): Promise<Mensagem> {
  const { data, error } = await supabase
    .from(TABELA_MENSAGENS)
    .insert({ interesse_id: interesseId, conteudo })
    .select()
    .single();

  if (error) {
    if (error.code === '42501') {
      throw new Error('O chat só aceita mensagens enquanto a negociação está em andamento.');
    }
    if (error.code === '23514') throw new Error('A mensagem precisa ter entre 1 e 1000 caracteres.');
    throw traduzirErro(error, 'Não foi possível enviar a mensagem.');
  }
  return paraMensagem(data as LinhaMensagem);
}

export function escutarMensagens(interesseId: number, aoReceber: (mensagem: Mensagem) => void): () => void {
  const canal = supabase
    .channel(`chat-interesse-${interesseId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: TABELA_MENSAGENS,
        filter: `interesse_id=eq.${interesseId}`,
      },
      (payload) => aoReceber(paraMensagem(payload.new as LinhaMensagem))
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}

export function adicionarSemDuplicar(lista: Mensagem[], nova: Mensagem): Mensagem[] {
  if (lista.some((mensagem) => mensagem.id === nova.id)) return lista;
  return [...lista, nova].sort((a, b) => a.id - b.id);
}
