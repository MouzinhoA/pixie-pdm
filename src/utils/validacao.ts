import type { TipoInteresse } from '@/modelos';
import { textoParaPreco } from '@/utils/formatar';

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
