import { forwardRef, useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useCores } from '@/tema/cores';

interface CampoProps extends TextInputProps {
  rotulo: string;
  erro?: string;
}

// forwardRef deixa a tela focar o campo (ex.: pular para o próximo ao apertar "próximo" no teclado)
export const Campo = forwardRef<TextInput, CampoProps>(function Campo(
  { rotulo, erro, multiline, onFocus, onBlur, ...props },
  ref
) {
  const cores = useCores();
  const [focado, setFocado] = useState(false);

  const corBorda = erro
    ? 'border-red-500'
    : focado
      ? 'border-lilas'
      : 'border-lilas-claro dark:border-roxo-claro';

  return (
    <View className="gap-1">
      <Text className="text-sm font-semibold text-roxo dark:text-creme">{rotulo}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSuave}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        onFocus={(evento) => {
          setFocado(true);
          onFocus?.(evento);
        }}
        onBlur={(evento) => {
          setFocado(false);
          onBlur?.(evento);
        }}
        className={`rounded-xl border bg-white px-4 py-3 text-base text-roxo dark:bg-roxo dark:text-creme ${
          multiline ? 'h-28' : ''
        } ${corBorda} ${props.editable === false ? 'opacity-50' : ''}`}
        {...props}
      />
      {erro && <Text className="text-xs text-red-600 dark:text-red-400">{erro}</Text>}
    </View>
  );
});
