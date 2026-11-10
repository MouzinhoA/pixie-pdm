import { Image } from 'expo-image';
import { Link, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotaoTema } from '@/componentes/BotaoTema';
import { useCores } from '@/tema/cores';

interface TelaAutenticacaoProps {
  titulo: string;
  subtitulo: string;
  mensagemErro: string | null;
  rodape: { texto: string; link: string; destino: Href };
  children: ReactNode;
}

export function TelaAutenticacao({ titulo, subtitulo, mensagemErro, rodape, children }: TelaAutenticacaoProps) {
  const cores = useCores();

  return (
    <SafeAreaView style={[estilos.tela, { backgroundColor: cores.fundo }]}>
      <View style={estilos.barraTopo}>
        <BotaoTema />
      </View>

      <KeyboardAvoidingView style={estilos.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.rolagem} keyboardShouldPersistTaps="handled">
          <View style={estilos.coluna}>
            <View style={estilos.cabecalho}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={estilos.logo}
                contentFit="contain"
                accessibilityLabel="Pixie"
              />
              <View style={estilos.textosCabecalho}>
                <Text style={[estilos.titulo, { color: cores.texto }]} accessibilityRole="header">
                  {titulo}
                </Text>
                <Text style={[estilos.subtitulo, { color: cores.textoSuave }]}>{subtitulo}</Text>
              </View>
            </View>

            <View style={[estilos.cartao, { backgroundColor: cores.cartao, borderColor: cores.borda }]}>
              {children}
              {mensagemErro && (
                <Text accessibilityRole="alert" className="text-sm text-red-600 dark:text-red-400">
                  {mensagemErro}
                </Text>
              )}
            </View>

            <Text style={[estilos.rodape, { color: cores.textoSuave }]}>
              {rodape.texto}{' '}
              <Link href={rodape.destino} replace style={[estilos.linkRodape, { color: cores.destaque }]}>
                {rodape.link}
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  barraTopo: { alignItems: 'flex-end', paddingTop: 8 },
  rolagem: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 24 },
  coluna: { width: '100%', maxWidth: 384, alignSelf: 'center', gap: 24 },
  cabecalho: { alignItems: 'center', gap: 12 },
  logo: { height: 56, width: 107 },
  textosCabecalho: { alignItems: 'center', gap: 2 },
  titulo: { fontSize: 24, fontWeight: '600', letterSpacing: -0.5, textAlign: 'center' },
  subtitulo: { fontSize: 14, textAlign: 'center' },
  cartao: { gap: 16, borderWidth: 1, borderRadius: 14, padding: 20 },
  rodape: { fontSize: 14, textAlign: 'center' },
  linkRodape: { fontWeight: '500' },
});
