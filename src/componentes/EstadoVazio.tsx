import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { paleta } from '@/tema/cores';

interface EstadoVazioProps {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  mensagem: string;
}

export function EstadoVazio({ icone, titulo, mensagem }: EstadoVazioProps) {
  return (
    <View className="items-center gap-2 px-8 py-16">
      <Ionicons name={icone} size={56} color={paleta.lilas} />
      <Text className="text-center text-lg font-bold text-roxo dark:text-creme">{titulo}</Text>
      <Text className="text-center text-sm text-suave dark:text-lilas-claro">{mensagem}</Text>
    </View>
  );
}
