import { Text, View } from 'react-native';

import type { StatusInteresse, StatusProduto } from '@/modelos';

export type CorSelo = 'lilas' | 'verde' | 'amarelo' | 'cinza';

const ESTILOS: Record<CorSelo, { fundo: string; texto: string }> = {
  lilas: { fundo: 'bg-lilas-claro', texto: 'text-roxo' },
  verde: { fundo: 'bg-green-100', texto: 'text-green-800' },
  amarelo: { fundo: 'bg-amber-100', texto: 'text-amber-800' },
  cinza: { fundo: 'bg-gray-200', texto: 'text-gray-700' },
};

export const COR_STATUS_PRODUTO: Record<StatusProduto, CorSelo> = {
  disponivel: 'verde',
  reservado: 'amarelo',
  vendido: 'cinza',
};

export const COR_STATUS_INTERESSE: Record<StatusInteresse, CorSelo> = {
  aguardando: 'amarelo',
  negociando: 'verde',
  encerrado: 'cinza',
};

export function Selo({ texto, cor = 'lilas' }: { texto: string; cor?: CorSelo }) {
  const estilo = ESTILOS[cor];
  return (
    <View className={`self-start rounded-full px-3 py-1 ${estilo.fundo}`}>
      <Text className={`text-xs font-semibold ${estilo.texto}`}>{texto}</Text>
    </View>
  );
}
