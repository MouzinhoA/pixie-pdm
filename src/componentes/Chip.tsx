import { Pressable, Text } from 'react-native';

interface ChipProps {
  rotulo: string;
  selecionado: boolean;
  onPress: () => void;
}

export function Chip({ rotulo, selecionado, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2 active:opacity-70 ${
        selecionado
          ? 'border-roxo bg-roxo dark:border-lilas dark:bg-lilas'
          : 'border-lilas-claro bg-white dark:border-roxo-claro dark:bg-roxo'
      }`}>
      <Text
        className={`text-sm font-medium ${selecionado ? 'text-creme dark:text-roxo' : 'text-roxo dark:text-creme'}`}>
        {rotulo}
      </Text>
    </Pressable>
  );
}
