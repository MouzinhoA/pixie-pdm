const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// 1234.5 -> "R$ 1.234,50"
export function formatarPreco(valor: number) {
  return formatoMoeda.format(valor);
}

// "2026-10-17T12:00:00.000Z" -> "17/10/2026"
export function formatarData(dataIso: string) {
  return new Date(dataIso).toLocaleDateString('pt-BR');
}

// 149.9 -> "149,90" (para preencher o campo de preço ao editar)
export function precoParaTexto(valor: number) {
  return valor.toFixed(2).replace('.', ',');
}

// "149,90" -> 149.9
export function textoParaPreco(texto: string) {
  return Number(texto.trim().replace(',', '.'));
}

export function mensagemDeErro(erro: unknown) {
  return erro instanceof Error ? erro.message : 'Ocorreu um erro inesperado.';
}
