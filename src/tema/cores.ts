import { DarkTheme, DefaultTheme } from 'expo-router';
import { useColorScheme } from 'nativewind';

export const paleta = {
  roxo: '#221272',
  roxoClaro: '#3A2C8F',
  roxoEscuro: '#120A3D',
  creme: '#FCF2E8',
  lilas: '#D19FFC',
  suave: '#6B6497',
  estrela: '#F2B705',
};

const claro = {
  fundo: paleta.creme,
  cartao: '#FFFFFF',
  texto: paleta.roxo,
  textoSuave: paleta.suave,
  destaque: paleta.roxo,
  borda: '#EEDDFE',
};

const escuro = {
  fundo: paleta.roxoEscuro,
  cartao: paleta.roxo,
  texto: paleta.creme,
  textoSuave: '#B9B0E6',
  destaque: paleta.lilas,
  borda: paleta.roxoClaro,
};

export function useCores() {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? escuro : claro;
}

export function useTemaNavegacao() {
  const { colorScheme } = useColorScheme();
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const cores = useCores();

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: cores.destaque,
      background: cores.fundo,
      card: cores.cartao,
      text: cores.texto,
      border: cores.borda,
    },
  };
}
