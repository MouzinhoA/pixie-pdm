import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useCores } from '@/tema/cores';

interface CampoProps extends TextInputProps {
  rotulo: string;
  erro?: string;
}

// Caixa de texto com rótulo e mensagem de erro de validação
export function Campo({ rotulo, erro, multiline, ...props }: CampoProps) {
  const cores = useCores();

  return (
    <View className="gap-1">
      <Text className="text-sm font-semibold text-roxo dark:text-creme">{rotulo}</Text>
      <TextInput
        placeholderTextColor={cores.textoSuave}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-xl border bg-white px-4 py-3 text-base text-roxo dark:bg-roxo dark:text-creme ${
          multiline ? 'h-28' : ''
        } ${erro ? 'border-red-500' : 'border-lilas-claro dark:border-roxo-claro'}`}
        {...props}
      />
      {erro && <Text className="text-xs text-red-600 dark:text-red-400">{erro}</Text>}
    </View>
  );
}
