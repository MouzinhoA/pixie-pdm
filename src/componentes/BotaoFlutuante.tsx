import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { useCores } from '@/tema/cores';

// Botão redondo fixo no canto da tela (ex.: "novo anúncio")
export function BotaoFlutuante({ onPress }: { onPress: () => void }) {
  const cores = useCores();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Adicionar"
      className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-roxo shadow-lg active:opacity-80 dark:bg-lilas">
      <Ionicons name="add" size={32} color={cores.fundo} />
    </Pressable>
  );
}
