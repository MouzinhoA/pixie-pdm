import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, View } from 'react-native';

import { listarCategorias } from '@/banco/categorias';
import { listarProdutos } from '@/banco/produtos';
import { CartaoProduto } from '@/componentes/CartaoProduto';
import { Chip } from '@/componentes/Chip';
import { EstadoVazio } from '@/componentes/EstadoVazio';
import type { Categoria, ProdutoDetalhado } from '@/modelos';
import { useCores } from '@/tema/cores';
import { avisar } from '@/utils/alertas';

const FAIXAS_PRECO: { rotulo: string; minimo?: number; maximo?: number }[] = [
  { rotulo: 'Até R$ 100', maximo: 100 },
  { rotulo: 'R$ 100 a R$ 500', minimo: 100, maximo: 500 },
  { rotulo: 'Acima de R$ 500', minimo: 500 },
];

export default function TelaExplorar() {
  const db = useSQLiteContext();
  const cores = useCores();

  const [produtos, setProdutos] = useState<ProdutoDetalhado[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [faixaPreco, setFaixaPreco] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      const faixa = faixaPreco === null ? undefined : FAIXAS_PRECO[faixaPreco];

      async function carregar() {
        try {
          const [lista, listaCategorias] = await Promise.all([
            listarProdutos(db, { busca, categoriaId, precoMinimo: faixa?.minimo, precoMaximo: faixa?.maximo }),
            listarCategorias(db),
          ]);
          if (ativo) {
            setProdutos(lista);
            setCategorias(listaCategorias);
          }
        } catch {
          avisar('Erro', 'Não foi possível carregar os itens.');
        } finally {
          if (ativo) setCarregando(false);
        }
      }

      carregar();
      return () => {
        ativo = false;
      };
    }, [db, busca, categoriaId, faixaPreco])
  );

  const filtros = (
    <View className="gap-3 pb-2">
      <View className="flex-row items-center gap-2 rounded-2xl border border-lilas-claro bg-white px-4 dark:border-roxo-claro dark:bg-roxo">
        <Ionicons name="search" size={20} color={cores.textoSuave} />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar colecionáveis..."
          placeholderTextColor={cores.textoSuave}
          className="flex-1 py-3 text-base text-roxo dark:text-creme"
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <Ionicons name="close-circle" size={20} color={cores.textoSuave} onPress={() => setBusca('')} />
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        <Chip rotulo="Todas" selecionado={categoriaId === null} onPress={() => setCategoriaId(null)} />
        {categorias.map((categoria) => (
          <Chip
            key={categoria.id}
            rotulo={categoria.nome}
            selecionado={categoriaId === categoria.id}
            onPress={() => setCategoriaId(categoria.id)}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="items-center gap-2">
        <Ionicons name="pricetag-outline" size={18} color={cores.textoSuave} />
        <Chip rotulo="Qualquer preço" selecionado={faixaPreco === null} onPress={() => setFaixaPreco(null)} />
        {FAIXAS_PRECO.map((faixa, posicao) => (
          <Chip
            key={faixa.rotulo}
            rotulo={faixa.rotulo}
            selecionado={faixaPreco === posicao}
            onPress={() => setFaixaPreco(posicao)}
          />
        ))}
      </ScrollView>

      <Text className="text-sm text-suave dark:text-lilas-claro">
        {produtos.length} {produtos.length === 1 ? 'item encontrado' : 'itens encontrados'}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-creme dark:bg-roxo-escuro">
      <FlatList
        data={produtos}
        keyExtractor={(produto) => String(produto.id)}
        renderItem={({ item }) => (
          <CartaoProduto produto={item} onPress={() => router.push(`/produto/${item.id}`)} />
        )}
        ListHeaderComponent={filtros}
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator size="large" color={cores.destaque} className="mt-10" />
          ) : (
            <EstadoVazio
              icone="search-outline"
              titulo="Nada por aqui"
              mensagem="Nenhum item encontrado. Tente outra busca ou filtro."
            />
          )
        }
        contentContainerClassName="gap-3 p-4"
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
