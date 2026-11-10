import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { paleta } from '@/tema/cores';

interface IconeProdutoProps {
  largura: number;
  altura: number;
  arredondada?: boolean;
  imagem?: string | null; 
}

export function IconeProduto({ largura, altura, arredondada = true, imagem }: IconeProdutoProps) {
  const [falhou, setFalhou] = useState(false);
  const estilo = { width: largura, height: altura, borderRadius: arredondada ? 14 : 0 };

  if (imagem && !falhou) {
    return (
      <Image
        source={{ uri: imagem }}
        style={estilo}
        contentFit="cover"
        transition={150}
        onError={() => setFalhou(true)}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={estilo} className="items-center justify-center bg-lilas-claro dark:bg-roxo-claro">
      <Ionicons name="sparkles" size={Math.min(largura, altura) * 0.35} color={paleta.lilas} />
    </View>
  );
}
