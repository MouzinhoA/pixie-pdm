import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { paleta } from '@/tema/cores';

// Mostra uma nota de 0 a 5 em estrelas (inteiras e meias)
export function Estrelas({ nota, tamanho = 16 }: { nota: number; tamanho?: number }) {
  return (
    <View className="flex-row gap-1">
      {[1, 2, 3, 4, 5].map((posicao) => {
        const icone = nota >= posicao ? 'star' : nota >= posicao - 0.5 ? 'star-half' : 'star-outline';
        return <Ionicons key={posicao} name={icone} size={tamanho} color={paleta.estrela} />;
      })}
    </View>
  );
}
