import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface CartaoProps {
  titulo?: string;
  children: ReactNode;
}

export function Cartao({ titulo, children }: CartaoProps) {
  return (
    <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-roxo">
      {titulo && <Text className="text-lg font-bold text-roxo dark:text-creme">{titulo}</Text>}
      {children}
    </View>
  );
}
