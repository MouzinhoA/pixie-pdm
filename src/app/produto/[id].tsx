import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Botao } from '@/componentes/Botao';
import { Carregando } from '@/componentes/Carregando';
import { Cartao } from '@/componentes/Cartao';
import { EstadoVazio } from '@/componentes/EstadoVazio';
import { IconeProduto } from '@/componentes/IconeProduto';
import { COR_STATUS_PRODUTO, Selo } from '@/componentes/Selo';
import { CONDICOES, STATUS_PRODUTO, type ProdutoDetalhado } from '@/modelos';
import { buscarProduto } from '@/servicos/produtos';
import { avisar } from '@/utils/alertas';
import { cancelarInteresse } from '@/utils/cancelarInteresse';
import { formatarData, formatarPreco, mensagemDeErro } from '@/utils/formatar';

export default function TelaDetalheProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      buscarProduto(Number(id))
        .then(setProduto)
        .catch((erro) => avisar('Erro', mensagemDeErro(erro)))
        .finally(() => setCarregando(false));
    }, [id])
  );

  if (carregando) return <Carregando />;

  if (!produto) {
    return (
      <View className="flex-1 bg-creme dark:bg-roxo-escuro">
        <EstadoVazio icone="alert-circle-outline" titulo="Item não encontrado" mensagem="Este anúncio não existe mais." />
      </View>
    );
  }

  const disponivel = produto.status === 'disponivel' && produto.quantidade > 0;
  const nomeVendedor = produto.vendedorNome ?? 'o vendedor';
  const { interesseId } = produto;

  return (
    <ScrollView
      className="flex-1 bg-creme dark:bg-roxo-escuro"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <IconeProduto largura={width} altura={260} arredondada={false} imagem={produto.imagens[0]} />

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

        <Cartao>
          <View className="flex-row flex-wrap gap-y-4">
            <Detalhe rotulo="Categoria" valor={produto.categoriaNome} />
            <Detalhe rotulo="Marca / fabricante" valor={produto.marca?.trim() || 'Não informada'} />
            <Detalhe rotulo="Conservação" valor={CONDICOES[produto.condicao]} />
            <Detalhe rotulo="Quantidade" valor={`${produto.quantidade} un.`} />
            <Detalhe rotulo="Anunciado em" valor={formatarData(produto.criadoEm)} />
            <Detalhe rotulo="Código" valor={`#${produto.id}`} />
          </View>
        </Cartao>

        <Cartao titulo="Descrição">
          <Text className="text-base leading-6 text-roxo dark:text-creme">{produto.descricao}</Text>
        </Cartao>

        <Cartao titulo="Vendedor">
          <Text className="text-base font-semibold text-roxo dark:text-creme">
            {produto.vendedorNome ?? 'Vendedor não informado'}
          </Text>
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
                  cancelarInteresse(interesseId, produto.titulo, () =>
                    setProduto((atual) => (atual ? { ...atual, interesseId: null } : atual))
                  )
                }
              />
            </View>
          ) : disponivel ? (
            <View className="gap-3">
              <Text className="text-sm text-suave dark:text-lilas-claro">
                Quer comprar ou trocar? Envie uma proposta para {nomeVendedor}.
              </Text>
              <Botao
                titulo="Demonstrar interesse"
                icone="chatbubbles-outline"
                onPress={() => router.push({ pathname: '/interesse/formulario', params: { produtoId: produto.id } })}
              />
            </View>
          ) : (
            <Text className="text-sm text-suave dark:text-lilas-claro">
              {produto.status === 'vendido' ? 'Este item já foi vendido.' : 'Este item não está disponível no momento.'}
            </Text>
          )}
        </Cartao>
      </View>
    </ScrollView>
  );
}

function Detalhe({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View className="w-1/2 gap-0.5 pr-2">
      <Text className="text-xs text-suave dark:text-lilas-claro">{rotulo}</Text>
      <Text className="text-sm font-semibold text-roxo dark:text-creme">{valor}</Text>
    </View>
  );
}
