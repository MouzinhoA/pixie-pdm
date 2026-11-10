const MENSAGENS_POR_CODIGO: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
  user_already_exists: 'Já existe uma conta com este e-mail.',
  email_address_invalid: 'Este e-mail não existe ou não recebe mensagens. Confira o endereço (ex.: @gmail.com).',
  weak_password: 'Senha fraca. Use pelo menos 6 caracteres.',
  email_provider_disabled: 'O acesso por e-mail está desativado no momento. Tente novamente mais tarde.',
  signup_disabled: 'Novos cadastros estão desativados no momento. Tente novamente mais tarde.',
  over_email_send_rate_limit: 'Muitos cadastros em pouco tempo. Aguarde alguns minutos e tente novamente.',
  unexpected_failure: 'Não foi possível criar a conta. Verifique se este CPF já está cadastrado.',

  PGRST205: 'Uma tabela do app ainda não existe no Supabase. Rode o script supabase/pixie_comprador.sql.',
  '23505': 'Você já demonstrou interesse neste item.',
  '23503': 'Sua conta não tem perfil de comprador. Crie uma conta pelo app Pixie.',
  '23514': 'Algum dado não passou nas regras do banco. Confira os campos.',
  '42501': 'Você não tem permissão para fazer isso. Entre novamente.',
};

export function traduzirErro(erro: { code?: string; message: string }, padrao: string): Error {
  console.error('Erro do Supabase:', erro.code, erro.message);
  return new Error((erro.code && MENSAGENS_POR_CODIGO[erro.code]) || padrao);
}
