import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { TelaAutenticacao } from '@/componentes/Autenticacao';
import { Botao } from '@/componentes/Botao';
import { Campo } from '@/componentes/Campo';
import { entrar } from '@/servicos/autenticacao';
import { mensagemDeErro } from '@/utils/formatar';

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);
  const campoSenha = useRef<TextInput>(null);

  async function enviar() {
    if (!email.trim() || !senha) {
      setMensagemErro('Informe o e-mail e a senha.');
      return;
    }

    setEntrando(true);
    setMensagemErro(null);
    try {
      await entrar(email.trim(), senha);
    } catch (erro) {
      setMensagemErro(mensagemDeErro(erro));
      setEntrando(false);
    }
  }

  return (
    <TelaAutenticacao
      titulo="Entrar no Pixie"
      subtitulo="Acesse sua conta para explorar e negociar colecionáveis."
      mensagemErro={mensagemErro}
      rodape={{ texto: 'Ainda não tem conta?', link: 'Criar conta', destino: '/cadastro' }}>
      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => campoSenha.current?.focus()}
        editable={!entrando}
      />
      <Campo
        ref={campoSenha}
        rotulo="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={enviar}
        editable={!entrando}
      />
      <Botao titulo="Entrar" tituloCarregando="Entrando..." carregando={entrando} onPress={enviar} />
    </TelaAutenticacao>
  );
}
