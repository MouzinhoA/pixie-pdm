import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { traduzirErro } from '@/servicos/erros';
import { supabase } from '@/servicos/supabase';

export async function cadastrar(nome: string, cpf: string, email: string, senha: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { tipo: 'comprador', nome, cpf } },
  });
  if (error) throw traduzirErro(error, 'Não foi possível criar a conta. Tente novamente.');
  if (!data.session) throw new Error('Conta criada, mas o login exige confirmação por e-mail. Fale com o administrador.');
}

export async function entrar(email: string, senha: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw traduzirErro(error, 'Não foi possível entrar. Tente novamente.');
}

export async function sair() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Não foi possível sair. Tente novamente.');
}

export async function buscarIdUsuarioLogado(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Sua sessão expirou. Entre novamente.');
  return data.session.user.id;
}

export function useSessao() {
  const [sessao, setSessao] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessao(data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => setSessao(novaSessao));
    return () => data.subscription.unsubscribe();
  }, []);

  return sessao;
}
