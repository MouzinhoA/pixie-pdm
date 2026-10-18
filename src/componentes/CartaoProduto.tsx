import { Pressable, Text, View } from 'react-native';

import { usuarioAtualId } from '@/banco/sessao';
import { ImagemProduto } from '@/componentes/ImagemProduto';
import { COR_STATUS_PRODUTO, Selo } from '@/componentes/Selo';
import { CONDICOES, STATUS_PRODUTO, type ProdutoDetalhado } from '@/modelos';
import { formatarPreco } from '@/utils/formatar';

interface CartaoProdutoProps {
  produto: ProdutoDetalhado;
  onPress: () => void;
  mostrarStatus?: boolean;
}

export function CartaoProduto({ produto, onPress, mostrarStatus }: CartaoProdutoProps) {
  const ehMeuAnuncio = produto.vendedorId === usuarioAtualId();

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

        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-lg font-extrabold text-roxo dark:text-lilas">{formatarPreco(produto.preco)}</Text>
          {mostrarStatus ? (
            <Selo texto={STATUS_PRODUTO[produto.status]} cor={COR_STATUS_PRODUTO[produto.status]} />
          ) : (
            ehMeuAnuncio && <Selo texto="Seu anúncio" />
          )}
        </View>
      </View>
    </Pressable>
  );
}
