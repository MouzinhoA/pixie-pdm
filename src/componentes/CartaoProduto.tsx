import { Pressable, Text, View } from 'react-native';

import { ImagemProduto } from '@/componentes/ImagemProduto';
import { COR_STATUS_PRODUTO, Selo } from '@/componentes/Selo';
import { CONDICOES, STATUS_PRODUTO, type ProdutoDetalhado } from '@/modelos';
import { formatarPreco } from '@/utils/formatar';

interface CartaoProdutoProps {
  produto: ProdutoDetalhado;
  onPress: () => void;
}

export function CartaoProduto({ produto, onPress }: CartaoProdutoProps) {
  return (
    <Pressable onPress={onPress} className="flex-row gap-3 rounded-2xl bg-white p-3 active:opacity-80 dark:bg-roxo">
      <ImagemProduto uri={produto.imagens[0]} largura={92} altura={92} />

      <View className="flex-1 justify-between">
        <View className="gap-1">
          <Text numberOfLines={2} className="text-base font-bold text-roxo dark:text-creme">
            {produto.titulo}
          </Text>
          <Text numberOfLines={1} className="text-xs text-suave dark:text-lilas-claro">
            {produto.categoriaNome} · {CONDICOES[produto.condicao]}
          </Text>
        </View>

        <Text className="text-lg font-extrabold text-roxo dark:text-lilas">{formatarPreco(produto.preco)}</Text>

        <View className="flex-row flex-wrap gap-2">
          {produto.status !== 'disponivel' && (
            <Selo texto={STATUS_PRODUTO[produto.status]} cor={COR_STATUS_PRODUTO[produto.status]} />
          )}
          {produto.interesseId !== null && <Selo texto="Interesse enviado" />}
        </View>
      </View>
    </Pressable>
  );
}
