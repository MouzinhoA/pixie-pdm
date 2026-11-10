import '@/global.css';

import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

import { Carregando } from '@/componentes/Carregando';
import { useSessao } from '@/servicos/autenticacao';
import { lerPreferenciaTema } from '@/servicos/preferencias';
import { useTemaNavegacao } from '@/tema/cores';

export default function LayoutRaiz() {
  const { setColorScheme } = useColorScheme();
  const temaNavegacao = useTemaNavegacao();
  const sessao = useSessao();
  const logado = Boolean(sessao);

  useEffect(() => {
    setColorScheme(lerPreferenciaTema());
  }, [setColorScheme]);

  if (sessao === undefined) return <Carregando />;

  return (
    <ThemeProvider value={temaNavegacao}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerTitleStyle: { fontWeight: 'bold' }, headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Protected guard={logado}>
          <Stack.Screen name="(abas)" options={{ headerShown: false }} />
          <Stack.Screen name="produto/[id]" options={{ title: 'Detalhes do item' }} />
          <Stack.Screen name="interesse/formulario" options={{ title: 'Interesse' }} />
        </Stack.Protected>

        <Stack.Protected guard={!logado}>
          <Stack.Screen name="(autenticacao)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
