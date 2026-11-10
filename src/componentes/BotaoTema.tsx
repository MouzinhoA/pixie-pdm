import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';

import { salvarPreferenciaTema } from '@/servicos/preferencias';
import { useCores } from '@/tema/cores';

export function BotaoTema() {
  const cores = useCores();
  const { colorScheme, setColorScheme } = useColorScheme();
  const escuro = colorScheme === 'dark';

  function alternar() {
    const novoTema = escuro ? 'light' : 'dark';
    setColorScheme(novoTema);
    salvarPreferenciaTema(novoTema);
  }

  return (
    <Pressable
      onPress={alternar}
      hitSlop={10}
      className="mr-4 active:opacity-60"
      accessibilityRole="button"
      accessibilityLabel={escuro ? 'Usar tema claro' : 'Usar tema escuro'}>
      <Ionicons name={escuro ? 'sunny-outline' : 'moon-outline'} size={24} color={cores.texto} />
    </Pressable>
  );
}
