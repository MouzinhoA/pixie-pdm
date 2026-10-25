import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useCores } from '@/tema/cores';

type Variante = 'primario' | 'perigo';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
}

const ESTILOS: Record<Variante, { fundo: string; texto: string }> = {
  primario: { fundo: 'bg-roxo dark:bg-lilas', texto: 'text-creme dark:text-roxo' },
  perigo: { fundo: 'bg-red-600', texto: 'text-white' },
};

export function Botao({ titulo, onPress, variante = 'primario', icone, carregando }: BotaoProps) {
  const cores = useCores();
  const estilo = ESTILOS[variante];
  const corConteudo = variante === 'perigo' ? '#FFFFFF' : cores.fundo;

  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      className={`flex-row items-center justify-center gap-2 rounded-2xl px-5 py-4 active:opacity-80 ${estilo.fundo} ${carregando ? 'opacity-60' : ''}`}>
      {carregando ? (
        <ActivityIndicator color={corConteudo} />
      ) : (
        icone && <Ionicons name={icone} size={20} color={corConteudo} />
      )}
      <Text className={`text-base font-bold ${estilo.texto}`}>{titulo}</Text>
    </Pressable>
  );
}
