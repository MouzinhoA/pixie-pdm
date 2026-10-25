import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buscarProduto } from '@/banco/produtos';
import { Botao } from '@/componentes/Botao';
import { Carregando } from '@/componentes/Carregando';
import { Cartao } from '@/componentes/Cartao';
import { EstadoVazio } from '@/componentes/EstadoVazio';
import { Estrelas } from '@/componentes/Estrelas';
import { IconeProduto } from '@/componentes/IconeProduto';
import { COR_STATUS_PRODUTO, Selo } from '@/componentes/Selo';
import { CONDICOES, STATUS_PRODUTO, type ProdutoDetalhado } from '@/modelos';
import { avisar } from '@/utils/alertas';
import { cancelarInteresse } from '@/utils/cancelarInteresse';
import { formatarData, formatarPreco } from '@/utils/formatar';

export default function TelaDetalheProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      buscarProduto(db, Number(id))
        .then(setProduto)
        .catch(() => avisar('Erro', 'Não foi possível carregar o item.'))
        .finally(() => setCarregando(false));
    }, [db, id])
  );

  if (carregando) return <Carregando />;

  if (!produto) {
    return (
      <View className="flex-1 bg-creme dark:bg-roxo-escuro">
        <EstadoVazio icone="alert-circle-outline" titulo="Item não encontrado" mensagem="Este anúncio não existe mais." />
      </View>
    );
  }

  const disponivel = produto.status !== 'vendido';
  const { interesseId } = produto;

  return (
    <ScrollView
      className="flex-1 bg-creme dark:bg-roxo-escuro"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <IconeProduto largura={width} altura={220} arredondada={false} />

      <View className="gap-4 p-4">
        <View className="gap-2">
          <View className="flex-row flex-wrap gap-2">
            <Selo texto={STATUS_PRODUTO[produto.status]} cor={COR_STATUS_PRODUTO[produto.status]} />
            <Selo texto={CONDICOES[produto.condicao]} />
            <Selo texto={produto.categoriaNome} />
          </View>
          <Text className="text-2xl font-bold text-roxo dark:text-creme">{produto.titulo}</Text>
          <Text className="text-3xl font-extrabold text-roxo dark:text-lilas">{formatarPreco(produto.preco)}</Text>
        </View>

        <Cartao titulo="Descrição">
          <Text className="text-base leading-6 text-roxo dark:text-creme">{produto.descricao}</Text>
          <Text className="text-sm text-suave dark:text-lilas-claro">
            Conservação: {CONDICOES[produto.condicao]} · Anunciado em {formatarData(produto.criadoEm)}
          </Text>
        </Cartao>

        <Cartao titulo="Vendedor">
          <Text className="text-base font-semibold text-roxo dark:text-creme">{produto.vendedorNome}</Text>
          <Text className="text-sm text-suave dark:text-lilas-claro">{produto.vendedorCidade}</Text>
          <View className="flex-row items-center gap-2">
            <Estrelas nota={produto.vendedorReputacao} />
            <Text className="text-sm text-suave dark:text-lilas-claro">{produto.vendedorReputacao.toFixed(1)}</Text>
          </View>
        </Cartao>

        <Cartao titulo="Interesse">
          {interesseId !== null ? (
            <View className="gap-3">
              <Text className="text-sm text-suave dark:text-lilas-claro">
                Você já demonstrou interesse neste item. Acompanhe na aba Interesses.
              </Text>
              <Botao
                titulo="Editar interesse"
                icone="create-outline"
                onPress={() => router.push({ pathname: '/interesse/formulario', params: { id: interesseId } })}
              />
              <Botao
                titulo="Cancelar interesse"
                icone="close-circle-outline"
                variante="perigo"
                onPress={() =>
                  cancelarInteresse(db, interesseId, produto.titulo, () =>
                    setProduto((atual) => (atual ? { ...atual, interesseId: null } : atual))
                  )
                }
              />
            </View>
          ) : disponivel ? (
            <View className="gap-3">
              <Text className="text-sm text-suave dark:text-lilas-claro">
                Quer comprar ou trocar? Envie uma proposta para {produto.vendedorNome}.
              </Text>
              <Botao
                titulo="Demonstrar interesse"
                icone="chatbubbles-outline"
                onPress={() => router.push({ pathname: '/interesse/formulario', params: { produtoId: produto.id } })}
              />
            </View>
          ) : (
            <Text className="text-sm text-suave dark:text-lilas-claro">Este item já foi vendido.</Text>
          )}
        </Cartao>
      </View>
    </ScrollView>
  );
}
