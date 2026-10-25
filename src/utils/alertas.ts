import { Alert, Platform } from 'react-native';

export function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

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
