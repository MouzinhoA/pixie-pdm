import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';

import { paleta } from '@/tema/cores';

interface EstrelasProps {
  nota: number;
  tamanho?: number;
  onSelecionar?: (nota: number) => void; // se informado, as estrelas viram botões
}

export function Estrelas({ nota, tamanho = 16, onSelecionar }: EstrelasProps) {
  return (
    <View className="flex-row gap-1">
      {[1, 2, 3, 4, 5].map((posicao) => {
        const icone = nota >= posicao ? 'star' : nota >= posicao - 0.5 ? 'star-half' : 'star-outline';
        const estrela = <Ionicons name={icone} size={tamanho} color={paleta.estrela} />;

        if (!onSelecionar) return <View key={posicao}>{estrela}</View>;
        return (
          <Pressable
            key={posicao}
            onPress={() => onSelecionar(posicao)}
            hitSlop={6}
            accessibilityLabel={`Nota ${posicao}`}>
            {estrela}
          </Pressable>
        );
      })}
    </View>
  );
}
