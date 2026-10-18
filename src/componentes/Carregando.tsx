import { ActivityIndicator, View } from 'react-native';

import { useCores } from '@/tema/cores';

// Indicador de carregamento ocupando a tela inteira
export function Carregando() {
  const cores = useCores();
  return (
    <View className="flex-1 items-center justify-center bg-creme dark:bg-roxo-escuro">
      <ActivityIndicator size="large" color={cores.destaque} />
    </View>
  );
}
