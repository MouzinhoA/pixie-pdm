import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Botao } from '@/componentes/Botao';
import { Carregando } from '@/componentes/Carregando';
import { EstadoVazio } from '@/componentes/EstadoVazio';
import { IconeProduto } from '@/componentes/IconeProduto';
import { STATUS_INTERESSE, TIPOS_INTERESSE, type InteresseDetalhado, type Mensagem } from '@/modelos';
import { buscarIdUsuarioLogado } from '@/servicos/autenticacao';
import { adicionarSemDuplicar, buscarMensagens, enviarMensagem, escutarMensagens } from '@/servicos/chat';
import { buscarInteresse } from '@/servicos/interesses';
import { useCores } from '@/tema/cores';
import { avisar } from '@/utils/alertas';
import { formatarDataHora, formatarPreco, mensagemDeErro } from '@/utils/formatar';

export default function TelaChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const interesseId = Number(id);
  const cores = useCores();
  const insets = useSafeAreaInsets();
  const alturaCabecalho = useHeaderHeight();

  const [interesse, setInteresse] = useState<InteresseDetalhado | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const lista = useRef<FlatList<Mensagem>>(null);

  useEffect(() => {
    const pararDeEscutar = escutarMensagens(interesseId, (nova) =>
      setMensagens((atuais) => adicionarSemDuplicar(atuais, nova))
    );

    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const [dadosInteresse, historico, idLogado] = await Promise.all([
          buscarInteresse(interesseId),
          buscarMensagens(interesseId),
          buscarIdUsuarioLogado(),
        ]);
        setInteresse(dadosInteresse);
        setMeuId(idLogado);
        setMensagens((atuais) => historico.reduce(adicionarSemDuplicar, atuais));
      } catch (falha) {
        setErro(mensagemDeErro(falha));
      } finally {
        setCarregando(false);
      }
    }
    carregar();

    return pararDeEscutar;
  }, [interesseId, tentativa]);

  async function enviar() {
    const conteudo = texto.trim();
    if (!conteudo || enviando) return;

    setEnviando(true);
    try {
      const enviada = await enviarMensagem(interesseId, conteudo);
      setMensagens((atuais) => adicionarSemDuplicar(atuais, enviada));
      setTexto('');
    } catch (falha) {
      avisar('Erro', mensagemDeErro(falha));
    } finally {
      setEnviando(false);
    }
  }

  const nomeVendedor = interesse?.vendedorNome ?? 'Vendedor';
  const podeEnviar = interesse?.status === 'negociando';

  if (carregando) return <Carregando />;

  if (erro || !interesse) {
    return (
      <View className="flex-1 gap-4 bg-creme p-4 dark:bg-roxo-escuro">
        <EstadoVazio
          icone="alert-circle-outline"
          titulo="Não foi possível abrir a conversa"
          mensagem={erro ?? 'Este interesse não existe mais.'}
        />
        <Botao titulo="Tentar novamente" icone="refresh" onPress={() => setTentativa((n) => n + 1)} />
      </View>
    );
  }

  const proposta =
    interesse.tipo === 'compra' && interesse.valorOferecido !== null
      ? `Quer comprar por ${formatarPreco(interesse.valorOferecido)}`
      : interesse.tipo === 'troca' && interesse.itemTroca
        ? `Quer trocar por: ${interesse.itemTroca}`
        : TIPOS_INTERESSE[interesse.tipo];
  const botaoDesativado = enviando || !texto.trim();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-creme dark:bg-roxo-escuro"
      behavior="padding"
      keyboardVerticalOffset={alturaCabecalho}>
      <View className="flex-1 gap-4 p-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="flex-row items-center gap-3 rounded-2xl border border-lilas-claro bg-white p-3 dark:border-roxo-claro dark:bg-roxo">
          <IconeProduto largura={56} altura={56} imagem={interesse.produtoImagem} />
          <View className="flex-1 gap-0.5">
            <Text numberOfLines={1} className="text-base font-bold text-roxo dark:text-creme">
              Conversa com {nomeVendedor}
            </Text>
            <Text numberOfLines={1} className="text-sm text-suave dark:text-lilas-claro">
              {interesse.produtoTitulo} · {formatarPreco(interesse.produtoPreco)}
            </Text>
            <Text numberOfLines={1} className="text-xs text-suave dark:text-lilas-claro">
              {proposta} · {STATUS_INTERESSE[interesse.status]}
            </Text>
          </View>
        </View>

        <View className="flex-1 gap-3 rounded-2xl border border-lilas-claro bg-white/50 p-3 dark:border-roxo-claro dark:bg-roxo/40">
          <FlatList
            ref={lista}
            data={mensagens}
            keyExtractor={(mensagem) => String(mensagem.id)}
            renderItem={({ item }) => (
              <Balao mensagem={item} minha={item.autorId === meuId} nomeVendedor={nomeVendedor} />
            )}
            onContentSizeChange={() => lista.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <Text className="py-6 text-center text-sm text-suave dark:text-lilas-claro">
                Nenhuma mensagem ainda. Mande um oi para {nomeVendedor}!
              </Text>
            }
            contentContainerClassName="grow gap-2 p-1"
            keyboardShouldPersistTaps="handled"
          />

          {podeEnviar ? (
            <View className="flex-row items-end gap-2">
              <TextInput
                value={texto}
                onChangeText={setTexto}
                placeholder={`Mensagem para ${nomeVendedor}`}
                placeholderTextColor={cores.textoSuave}
                accessibilityLabel="Mensagem"
                multiline
                maxLength={1000}
                editable={!enviando}
                className="max-h-28 flex-1 rounded-xl border border-lilas-claro bg-white px-3 py-2 text-base text-roxo dark:border-roxo-claro dark:bg-roxo-escuro dark:text-creme"
              />
              <Pressable
                onPress={enviar}
                disabled={botaoDesativado}
                accessibilityRole="button"
                accessibilityLabel="Enviar mensagem"
                accessibilityState={{ disabled: botaoDesativado, busy: enviando }}
                className={`h-10 flex-row items-center gap-1.5 rounded-xl bg-roxo px-3 active:opacity-80 dark:bg-lilas ${
                  botaoDesativado ? 'opacity-50' : ''
                }`}>
                {enviando ? (
                  <ActivityIndicator size="small" color={cores.fundo} />
                ) : (
                  <Ionicons name="send-outline" size={16} color={cores.fundo} />
                )}
                <Text className="font-semibold text-creme dark:text-roxo">Enviar</Text>
              </Pressable>
            </View>
          ) : (
            <Text className="text-center text-xs text-suave dark:text-lilas-claro">
              Negociação encerrada. A conversa está só para leitura.
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Balao({ mensagem, minha, nomeVendedor }: { mensagem: Mensagem; minha: boolean; nomeVendedor: string }) {
  return (
    <View
      className={`max-w-[80%] gap-0.5 rounded-2xl px-3 py-2 ${
        minha ? 'self-end bg-roxo dark:bg-lilas' : 'self-start border border-lilas-claro bg-white dark:border-roxo-claro dark:bg-roxo'
      }`}>
      <Text className={`text-sm ${minha ? 'text-creme dark:text-roxo' : 'text-roxo dark:text-creme'}`}>
        {mensagem.conteudo}
      </Text>
      <Text className={`text-[10px] ${minha ? 'text-lilas-claro dark:text-roxo-claro' : 'text-suave dark:text-lilas-claro'}`}>
        {minha ? 'Você' : nomeVendedor} · {formatarDataHora(mensagem.criadoEm)}
      </Text>
    </View>
  );
}
