import { Alert, Platform } from 'react-native';

// O Alert do React Native não aparece no navegador (react-native-web),
// então no web usamos as caixas de diálogo do próprio navegador.

// Mostra uma mensagem simples (sucesso ou erro)
export function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

// Pede confirmação antes de uma ação (ex.: excluir) e só executa se o usuário confirmar
export function confirmar(titulo: string, mensagem: string, textoBotao: string, aoConfirmar: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: 'Voltar', style: 'cancel' },
    { text: textoBotao, style: 'destructive', onPress: aoConfirmar },
  ]);
}
