import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';

import { salvarPreferenciaTema } from '@/banco/configuracoes';
import { useCores } from '@/tema/cores';

export function BotaoTema() {
  const db = useSQLiteContext();
  const cores = useCores();
  const { colorScheme, setColorScheme } = useColorScheme();
  const escuro = colorScheme === 'dark';

  async function alternar() {
    const novoTema = escuro ? 'light' : 'dark';
    setColorScheme(novoTema);
    await salvarPreferenciaTema(db, novoTema);
  }

  return (
    <Pressable
      onPress={alternar}
      hitSlop={10}
      className="mr-4 active:opacity-60"
      accessibilityLabel={escuro ? 'Usar tema claro' : 'Usar tema escuro'}>
      <Ionicons name={escuro ? 'sunny-outline' : 'moon-outline'} size={24} color={cores.texto} />
    </Pressable>
  );
}
