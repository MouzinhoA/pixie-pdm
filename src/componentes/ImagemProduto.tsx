import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { paleta } from '@/tema/cores';

interface ImagemProdutoProps {
  uri?: string;
  largura: number;
  altura: number;
  arredondada?: boolean;
}

// Mostra a foto do produto ou um ícone quando o anúncio não tem fotos
export function ImagemProduto({ uri, largura, altura, arredondada = true }: ImagemProdutoProps) {
  const estilo = { width: largura, height: altura, borderRadius: arredondada ? 14 : 0 };

  if (uri) {
    return <Image source={{ uri }} style={estilo} contentFit="cover" transition={200} />;
  }

  return (
    <View style={estilo} className="items-center justify-center bg-lilas-claro dark:bg-roxo-claro">
      <Ionicons name="sparkles" size={Math.min(largura, altura) * 0.35} color={paleta.lilas} />
    </View>
  );
}
