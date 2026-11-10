import type { TipoInteresse } from '@/modelos';
import { apenasDigitos, textoParaPreco } from '@/utils/formatar';

export type Erros<T> = Partial<Record<keyof T, string>>;

export function temErros<T>(erros: Erros<T>) {
  return Object.keys(erros).length > 0;
}

export interface FormularioInteresse {
  tipo: TipoInteresse | null;
  valorOferecido: string;
  itemTroca: string;
  mensagem: string;
}

export function validarInteresse(form: FormularioInteresse) {
  const erros: Erros<FormularioInteresse> = {};
  const valor = form.valorOferecido.trim();
  const itemTroca = form.itemTroca.trim();
  const mensagem = form.mensagem.trim();

  if (!form.tipo) erros.tipo = 'Escolha se quer comprar ou trocar.';

  if (form.tipo === 'compra' && valor) {
    if (!/^\d{1,7}([.,]\d{1,2})?$/.test(valor)) erros.valorOferecido = 'Formato inválido. Exemplo: 149,90';
    else if (textoParaPreco(valor) <= 0) erros.valorOferecido = 'O valor deve ser maior que zero.';
  }

  if (form.tipo === 'troca') {
    if (itemTroca.length < 3) erros.itemTroca = 'Diga qual item você oferece na troca.';
    else if (itemTroca.length > 100) erros.itemTroca = 'Use no máximo 100 caracteres.';
  }

  if (mensagem.length < 10) erros.mensagem = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  else if (mensagem.length > 300) erros.mensagem = 'A mensagem pode ter no máximo 300 caracteres.';

  return erros;
}

export function ehCpfValido(texto: string) {
  const cpf = apenasDigitos(texto);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(cpf[tamanho])) return false;
  }
  return true;
}

export const TAMANHO_MINIMO_SENHA = 6;

export interface FormularioCadastro {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export function validarCadastro(form: FormularioCadastro) {
  const erros: Erros<FormularioCadastro> = {};
  const nome = form.nome.trim();
  const email = form.email.trim();

  if (!nome) erros.nome = 'Informe seu nome.';
  else if (nome.length < 2) erros.nome = 'O nome deve ter pelo menos 2 caracteres.';
  else if (nome.length > 80) erros.nome = 'O nome deve ter no máximo 80 caracteres.';

  if (!form.cpf.trim()) erros.cpf = 'Informe seu CPF.';
  else if (!ehCpfValido(form.cpf)) erros.cpf = 'CPF inválido. Confira os números digitados.';

  if (!email) erros.email = 'Informe seu e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = 'E-mail inválido. Ex.: voce@exemplo.com';

  if (!form.senha) erros.senha = 'Crie uma senha.';
  else if (form.senha.length < TAMANHO_MINIMO_SENHA)
    erros.senha = `A senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;

  if (!form.confirmarSenha) erros.confirmarSenha = 'Repita a senha.';
  else if (form.confirmarSenha !== form.senha) erros.confirmarSenha = 'As senhas não são iguais.';

  return erros;
}
