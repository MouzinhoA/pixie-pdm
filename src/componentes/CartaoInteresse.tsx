import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { IconeProduto } from '@/componentes/IconeProduto';
import { COR_STATUS_INTERESSE, Selo } from '@/componentes/Selo';
import { PROXIMO_STATUS, STATUS_INTERESSE, TIPOS_INTERESSE, type InteresseDetalhado } from '@/modelos';
import { useCores } from '@/tema/cores';
import { formatarData, formatarPreco } from '@/utils/formatar';

interface CartaoInteresseProps {
  interesse: InteresseDetalhado;
  onAbrir: () => void; 
  onEditar: () => void;
  onCancelar: () => void;
  onSimularResposta: () => void; 
}

export function CartaoInteresse({ interesse, onAbrir, onEditar, onCancelar, onSimularResposta }: CartaoInteresseProps) {
  const cores = useCores();
  const proximoStatus = PROXIMO_STATUS[interesse.status];
  const encerrado = interesse.status === 'encerrado';

  return (
    <View className="gap-3 rounded-2xl bg-white p-3 dark:bg-roxo">
      <Pressable onPress={onAbrir} className="flex-row gap-3 active:opacity-80">
        <IconeProduto largura={72} altura={72} />
        <View className="flex-1 gap-1">
          <Text numberOfLines={2} className="text-base font-bold text-roxo dark:text-creme">
            {interesse.produtoTitulo}
          </Text>
          <Text className="text-xs text-suave dark:text-lilas-claro">
            {interesse.vendedorNome} · {formatarPreco(interesse.produtoPreco)}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Selo texto={STATUS_INTERESSE[interesse.status]} cor={COR_STATUS_INTERESSE[interesse.status]} />
            <Selo texto={TIPOS_INTERESSE[interesse.tipo]} />
          </View>
        </View>
      </Pressable>

      <View className="gap-1 rounded-xl bg-creme p-3 dark:bg-roxo-claro">
        {interesse.tipo === 'compra' && interesse.valorOferecido !== null && (
          <Text className="text-sm font-semibold text-roxo dark:text-creme">
            Ofereceu {formatarPreco(interesse.valorOferecido)}
          </Text>
        )}
        {interesse.tipo === 'troca' && (
          <Text className="text-sm font-semibold text-roxo dark:text-creme">Oferece: {interesse.itemTroca}</Text>
        )}
        <Text numberOfLines={2} className="text-sm italic text-suave dark:text-lilas-claro">
          “{interesse.mensagem}”
        </Text>
        <Text className="text-xs text-suave dark:text-lilas-claro">Enviado em {formatarData(interesse.criadoEm)}</Text>
      </View>

      {proximoStatus && (
        <View className="gap-2 rounded-xl border border-dashed border-lilas p-3">
          <Text className="text-xs font-semibold uppercase text-suave dark:text-lilas-claro">Simulação</Text>
          <Pressable
            onPress={onSimularResposta}
            className="flex-row items-center justify-center gap-1 rounded-xl bg-creme py-2 active:opacity-70 dark:bg-roxo-claro">
            <Ionicons name="play-forward-outline" size={18} color={cores.texto} />
            <Text className="font-semibold text-roxo dark:text-creme">
              {proximoStatus === 'negociando' ? 'Vendedor respondeu' : 'Encerrar negociação'}
            </Text>
          </Pressable>
        </View>
      )}

      <View className="flex-row gap-2">
        {!encerrado && (
          <Pressable
            onPress={onEditar}
            className="flex-1 flex-row items-center justify-center gap-1 rounded-xl bg-lilas-claro py-2 active:opacity-70 dark:bg-roxo-claro">
            <Ionicons name="create-outline" size={18} color={cores.texto} />
            <Text className="font-semibold text-roxo dark:text-creme">Editar</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onCancelar}
          className="flex-1 flex-row items-center justify-center gap-1 rounded-xl bg-red-100 py-2 active:opacity-70">
          <Ionicons name="close-circle-outline" size={18} color="#B91C1C" />
          <Text className="font-semibold text-red-700">Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}
