import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { atualizarInteresse, buscarInteresse, criarInteresse, type DadosInteresse } from '@/banco/interesses';
import { buscarProduto } from '@/banco/produtos';
import { Botao } from '@/componentes/Botao';
import { Campo } from '@/componentes/Campo';
import { Carregando } from '@/componentes/Carregando';
import { Cartao } from '@/componentes/Cartao';
import { Chip } from '@/componentes/Chip';
import { IconeProduto } from '@/componentes/IconeProduto';
import { TIPOS_INTERESSE, type ProdutoDetalhado, type TipoInteresse } from '@/modelos';
import { avisar } from '@/utils/alertas';
import { formatarPreco, mensagemDeErro, precoParaTexto, textoParaPreco } from '@/utils/formatar';
import { temErros, validarInteresse, type Erros, type FormularioInteresse } from '@/utils/validacao';

const LISTA_TIPOS = Object.keys(TIPOS_INTERESSE) as TipoInteresse[];

// Mesma tela para criar (recebe produtoId) e editar (recebe id do interesse)
export default function TelaFormularioInteresse() {
  const { id, produtoId } = useLocalSearchParams<{ id?: string; produtoId?: string }>();
  const editando = Boolean(id);
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
  const [tipo, setTipo] = useState<TipoInteresse | null>(null);
  const [valorOferecido, setValorOferecido] = useState('');
  const [itemTroca, setItemTroca] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Validação dinâmica: depois da primeira tentativa de salvar, os erros são
  // recalculados a cada alteração e somem assim que o campo é corrigido
  const formulario = { tipo, valorOferecido, itemTroca, mensagem };
  const erros: Erros<FormularioInteresse> = tentouSalvar ? validarInteresse(formulario) : {};

  // Carrega o produto e, se estiver editando, os dados do interesse
  useEffect(() => {
    async function carregar() {
      try {
        if (id) {
          const interesse = await buscarInteresse(db, Number(id));
          if (interesse) {
            setTipo(interesse.tipo);
            setValorOferecido(interesse.valorOferecido === null ? '' : precoParaTexto(interesse.valorOferecido));
            setItemTroca(interesse.itemTroca);
            setMensagem(interesse.mensagem);
            setProduto(await buscarProduto(db, interesse.produtoId));
          }
        } else if (produtoId) {
          setProduto(await buscarProduto(db, Number(produtoId)));
        }
      } catch {
        avisar('Erro', 'Não foi possível carregar os dados do formulário.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [db, id, produtoId]);

  async function salvar() {
    setTentouSalvar(true);
    if (temErros(validarInteresse(formulario)) || !tipo) {
      avisar('Verifique o formulário', 'Corrija os campos destacados em vermelho.');
      return;
    }
    if (!produto) return;

    setSalvando(true);
    try {
      // Guarda só o campo que faz sentido para o tipo escolhido
      const dados: DadosInteresse = {
        tipo,
        valorOferecido: tipo === 'compra' && valorOferecido.trim() ? textoParaPreco(valorOferecido) : null,
        itemTroca: tipo === 'troca' ? itemTroca.trim() : '',
        mensagem: mensagem.trim(),
      };

      if (id) {
        await atualizarInteresse(db, Number(id), dados);
      } else {
        await criarInteresse(db, produto.id, dados);
      }
      router.back();
      avisar(
        editando ? 'Sucesso' : 'Interesse enviado!',
        editando
          ? 'Interesse atualizado!'
          : `${produto.vendedorNome} vai receber sua proposta. Contato do vendedor: ${produto.vendedorTelefone}.`
      );
    } catch (erro) {
      avisar('Erro ao salvar', mensagemDeErro(erro));
      setSalvando(false);
    }
  }

  if (carregando) return <Carregando />;

  return (
    <ScrollView
      className="flex-1 bg-creme dark:bg-roxo-escuro"
      contentContainerClassName="gap-5 p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Stack.Screen options={{ title: editando ? 'Editar interesse' : 'Demonstrar interesse' }} />

      {produto && (
        <Cartao>
          <View className="flex-row items-center gap-3">
            <IconeProduto largura={64} altura={64} />
            <View className="flex-1">
              <Text className="text-base font-bold text-roxo dark:text-creme">{produto.titulo}</Text>
              <Text className="text-sm text-suave dark:text-lilas-claro">
                {formatarPreco(produto.preco)} · {produto.vendedorNome}
              </Text>
            </View>
          </View>
        </Cartao>
      )}

      <Opcoes titulo="Você quer *" erro={erros.tipo}>
        {LISTA_TIPOS.map((opcao) => (
          <Chip key={opcao} rotulo={TIPOS_INTERESSE[opcao]} selecionado={tipo === opcao} onPress={() => setTipo(opcao)} />
        ))}
      </Opcoes>

      {tipo === 'compra' && (
        <Campo
          rotulo="Quanto você oferece? (opcional)"
          value={valorOferecido}
          onChangeText={setValorOferecido}
          placeholder="Ex: 80,00"
          keyboardType="decimal-pad"
          erro={erros.valorOferecido}
        />
      )}

      {tipo === 'troca' && (
        <Campo
          rotulo="O que você oferece na troca? *"
          value={itemTroca}
          onChangeText={setItemTroca}
          placeholder="Ex: Carta Pikachu holográfica"
          maxLength={100}
          erro={erros.itemTroca}
        />
      )}

      <Campo
        rotulo="Mensagem para o vendedor *"
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Ex: Olá! Tenho interesse, o item ainda está disponível?"
        multiline
        maxLength={300}
        erro={erros.mensagem}
      />

      <Botao
        titulo={editando ? 'Salvar alterações' : 'Enviar interesse'}
        icone="send-outline"
        carregando={salvando}
        onPress={salvar}
      />
    </ScrollView>
  );
}

// Grupo de chips com título e mensagem de erro
function Opcoes({ titulo, erro, children }: { titulo: string; erro?: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-roxo dark:text-creme">{titulo}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
      {erro && <Text className="text-xs text-red-600 dark:text-red-400">{erro}</Text>}
    </View>
  );
}
