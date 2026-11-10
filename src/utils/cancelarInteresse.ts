import { excluirInteresse } from '@/servicos/interesses';
import { avisar, confirmar } from '@/utils/alertas';
import { mensagemDeErro } from '@/utils/formatar';

export function cancelarInteresse(interesseId: number, tituloProduto: string, depois: () => void | Promise<void>) {
  confirmar('Cancelar interesse', `Deseja cancelar seu interesse em "${tituloProduto}"?`, 'Cancelar interesse', async () => {
    try {
      await excluirInteresse(interesseId);
      await depois();
      avisar('Pronto', 'Interesse cancelado.');
    } catch (erro) {
      avisar('Erro', mensagemDeErro(erro));
    }
  });
}
