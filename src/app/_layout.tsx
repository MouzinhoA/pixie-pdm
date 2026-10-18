import '@/global.css';

import { Stack, ThemeProvider } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

import { iniciarBanco, NOME_BANCO } from '@/banco/banco';
import { lerPreferenciaTema } from '@/banco/configuracoes';
import { useTemaNavegacao } from '@/tema/cores';

export default function LayoutRaiz() {
  return (
    // Abre o banco SQLite e cria as tabelas antes de mostrar as telas
    <SQLiteProvider databaseName={NOME_BANCO} onInit={iniciarBanco}>
      <Navegacao />
    </SQLiteProvider>
  );
}

function Navegacao() {
  const db = useSQLiteContext();
  const { setColorScheme } = useColorScheme();
  const temaNavegacao = useTemaNavegacao();

  // Aplica o tema (claro/escuro) que o usuário escolheu da última vez
  useEffect(() => {
    lerPreferenciaTema(db).then(setColorScheme);
  }, [db, setColorScheme]);

  return (
    <ThemeProvider value={temaNavegacao}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerTitleStyle: { fontWeight: 'bold' }, headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(abas)" options={{ headerShown: false }} />
        <Stack.Screen name="produto/[id]" options={{ title: 'Detalhes do item' }} />
        <Stack.Screen name="interesse/formulario" options={{ title: 'Interesse' }} />
      </Stack>
    </ThemeProvider>
  );
}
