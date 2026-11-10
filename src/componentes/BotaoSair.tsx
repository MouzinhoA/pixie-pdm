import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { sair } from '@/servicos/autenticacao';
import { useCores } from '@/tema/cores';
import { avisar, confirmar } from '@/utils/alertas';
import { mensagemDeErro } from '@/utils/formatar';

export function BotaoSair() {
  const cores = useCores();

  function pedirConfirmacao() {
    confirmar('Sair', 'Deseja sair da sua conta?', 'Sair', async () => {
      try {
        await sair();
      } catch (erro) {
        avisar('Erro', mensagemDeErro(erro));
      }
    });
  }

  return (
    <Pressable
      onPress={pedirConfirmacao}
      hitSlop={10}
      className="mr-4 active:opacity-60"
      accessibilityRole="button"
      accessibilityLabel="Sair da conta">
      <Ionicons name="log-out-outline" size={24} color={cores.texto} />
    </Pressable>
  );
}
