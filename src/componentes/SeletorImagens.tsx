import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ImagemProduto } from '@/componentes/ImagemProduto';
import { useCores } from '@/tema/cores';
import { avisar } from '@/utils/alertas';
import { escolherImagens, LIMITE_IMAGENS } from '@/utils/imagens';

interface SeletorImagensProps {
  imagens: string[];
  onMudar: (imagens: string[]) => void;
}

// Miniaturas das fotos do anúncio, com botões de adicionar e remover
export function SeletorImagens({ imagens, onMudar }: SeletorImagensProps) {
  const cores = useCores();
  const vagas = LIMITE_IMAGENS - imagens.length;

  async function adicionar() {
    try {
      const novas = await escolherImagens(vagas);
      onMudar([...imagens, ...novas]);
    } catch {
      avisar('Erro', 'Não foi possível abrir a galeria de fotos.');
    }
  }

  return (
    <View className="gap-1">
      <Text className="text-sm font-semibold text-roxo dark:text-creme">
        Fotos ({imagens.length}/{LIMITE_IMAGENS})
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 py-1">
        {imagens.map((uri) => (
          <View key={uri}>
            <ImagemProduto uri={uri} largura={88} altura={88} />
            <Pressable
              onPress={() => onMudar(imagens.filter((imagem) => imagem !== uri))}
              accessibilityLabel="Remover foto"
              className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-red-600">
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        ))}

        {vagas > 0 && (
          <Pressable
            onPress={adicionar}
            className="h-[88px] w-[88px] items-center justify-center rounded-2xl border-2 border-dashed border-lilas active:opacity-70">
            <Ionicons name="camera-outline" size={28} color={cores.destaque} />
            <Text className="text-xs text-roxo dark:text-creme">Adicionar</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
