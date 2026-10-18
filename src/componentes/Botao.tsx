import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useCores } from '@/tema/cores';

type Variante = 'primario' | 'secundario' | 'perigo';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
  desabilitado?: boolean;
}

const ESTILOS: Record<Variante, { fundo: string; texto: string }> = {
  primario: { fundo: 'bg-roxo dark:bg-lilas', texto: 'text-creme dark:text-roxo' },
  secundario: { fundo: 'bg-lilas-claro dark:bg-roxo-claro', texto: 'text-roxo dark:text-creme' },
  perigo: { fundo: 'bg-red-600', texto: 'text-white' },
};

export function Botao({ titulo, onPress, variante = 'primario', icone, carregando, desabilitado }: BotaoProps) {
  const cores = useCores();
  const estilo = ESTILOS[variante];
  const corConteudo = variante === 'perigo' ? '#FFFFFF' : variante === 'primario' ? cores.fundo : cores.texto;
  const inativo = carregando || desabilitado;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      className={`flex-row items-center justify-center gap-2 rounded-2xl px-5 py-4 active:opacity-80 ${estilo.fundo} ${inativo ? 'opacity-60' : ''}`}>
      {carregando ? (
        <ActivityIndicator color={corConteudo} />
      ) : (
        icone && <Ionicons name={icone} size={20} color={corConteudo} />
      )}
      <Text className={`text-base font-bold ${estilo.texto}`}>{titulo}</Text>
    </Pressable>
  );
}
