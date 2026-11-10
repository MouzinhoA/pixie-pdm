import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';

import { buscarResumoInteresses, listarInteresses, type ResumoInteresses } from '@/servicos/interesses';
import { CartaoInteresse } from '@/componentes/CartaoInteresse';
import { Chip } from '@/componentes/Chip';
import { EstadoVazio } from '@/componentes/EstadoVazio';
import { STATUS_INTERESSE, type InteresseDetalhado, type StatusInteresse } from '@/modelos';
import { useCores } from '@/tema/cores';
import { avisar } from '@/utils/alertas';
import { cancelarInteresse } from '@/utils/cancelarInteresse';
import { mensagemDeErro } from '@/utils/formatar';

const LISTA_STATUS = Object.keys(STATUS_INTERESSE) as StatusInteresse[];

export default function TelaInteresses() {
  const cores = useCores();

  const [interesses, setInteresses] = useState<InteresseDetalhado[]>([]);
  const [resumo, setResumo] = useState<ResumoInteresses | null>(null);
  const [status, setStatus] = useState<StatusInteresse | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const [lista, novoResumo] = await Promise.all([listarInteresses(status), buscarResumoInteresses()]);
      setInteresses(lista);
      setResumo(novoResumo);
    } catch (erro) {
      avisar('Erro', mensagemDeErro(erro));
    } finally {
      setCarregando(false);
    }
  }, [status]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const cabecalho = (
    <View className="gap-3 pb-2">
      {resumo && resumo.total > 0 && (
        <View className="rounded-2xl bg-white p-4 dark:bg-roxo">
          <View className="flex-row flex-wrap gap-3">
            <Numero rotulo="Interesses" valor={String(resumo.total)} />
            <Numero rotulo="Para comprar" valor={String(resumo.compras)} />
            <Numero rotulo="Para trocar" valor={String(resumo.trocas)} />
            <Numero rotulo="Em negociação" valor={String(resumo.negociando)} />
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        <Chip rotulo="Todos" selecionado={status === null} onPress={() => setStatus(null)} />
        {LISTA_STATUS.map((opcao) => (
          <Chip key={opcao} rotulo={STATUS_INTERESSE[opcao]} selecionado={status === opcao} onPress={() => setStatus(opcao)} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-creme dark:bg-roxo-escuro">
      <FlatList
        data={interesses}
        keyExtractor={(interesse) => String(interesse.id)}
        renderItem={({ item }) => (
          <CartaoInteresse
            interesse={item}
            onAbrir={() => router.push(`/produto/${item.produtoId}`)}
            onEditar={() => router.push({ pathname: '/interesse/formulario', params: { id: item.id } })}
            onCancelar={() => cancelarInteresse(item.id, item.produtoTitulo, carregar)}
          />
        )}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator size="large" color={cores.destaque} className="mt-10" />
          ) : (
            <EstadoVazio
              icone="chatbubbles-outline"
              titulo={status ? 'Nenhum interesse com esse status' : 'Nenhum interesse ainda'}
              mensagem="Abra um item na aba Explorar e toque em “Demonstrar interesse”."
            />
          )
        }
        contentContainerClassName="gap-3 p-4"
      />
    </View>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View className="min-w-[45%] flex-1 rounded-xl bg-creme p-3 dark:bg-roxo-claro">
      <Text className="text-lg font-extrabold text-roxo dark:text-lilas">{valor}</Text>
      <Text className="text-xs text-suave dark:text-lilas-claro">{rotulo}</Text>
    </View>
  );
}
