import { DarkTheme, DefaultTheme } from 'expo-router';
import { useColorScheme } from 'nativewind';

// Cores tiradas da logo do Pixie (manter igual ao tailwind.config.js).
// Use as classes do Tailwind sempre que possível; estas constantes são
// para lugares que não aceitam className (ícones, abas, cabeçalhos...).
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

// Tema usado pelos cabeçalhos e pela barra de abas
export function useTemaNavegacao() {
  const { colorScheme } = useColorScheme();
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const cores = colorScheme === 'dark' ? escuro : claro;

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
