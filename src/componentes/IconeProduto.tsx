import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { paleta } from '@/tema/cores';

interface IconeProdutoProps {
  largura: number;
  altura: number;
  arredondada?: boolean;
}

// Ilustração do item nas listas e no detalhe (o app não trabalha com fotos)
export function IconeProduto({ largura, altura, arredondada = true }: IconeProdutoProps) {
  const estilo = { width: largura, height: altura, borderRadius: arredondada ? 14 : 0 };

  return (
    <View style={estilo} className="items-center justify-center bg-lilas-claro dark:bg-roxo-claro">
      <Ionicons name="sparkles" size={Math.min(largura, altura) * 0.35} color={paleta.lilas} />
    </View>
  );
}
