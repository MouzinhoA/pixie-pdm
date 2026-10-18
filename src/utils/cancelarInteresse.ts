import type { SQLiteDatabase } from 'expo-sqlite';

import { excluirInteresse } from '@/banco/interesses';
import { avisar, confirmar } from '@/utils/alertas';
import { mensagemDeErro } from '@/utils/formatar';

// Pede confirmação, exclui o interesse e avisa o resultado.
// Cada tela passa em "depois" o que precisa fazer em seguida (recarregar a lista, atualizar o estado...).
export function cancelarInteresse(
  db: SQLiteDatabase,
  interesseId: number,
  tituloProduto: string,
  depois: () => void | Promise<void>
) {
  confirmar('Cancelar interesse', `Deseja cancelar seu interesse em "${tituloProduto}"?`, 'Cancelar interesse', async () => {
    try {
      await excluirInteresse(db, interesseId);
      await depois();
      avisar('Pronto', 'Interesse cancelado.');
    } catch (erro) {
      avisar('Erro', mensagemDeErro(erro));
    }
  });
}
