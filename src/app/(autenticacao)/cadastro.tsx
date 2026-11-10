import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { TelaAutenticacao } from '@/componentes/Autenticacao';
import { Botao } from '@/componentes/Botao';
import { Campo } from '@/componentes/Campo';
import { cadastrar } from '@/servicos/autenticacao';
import { apenasDigitos, formatarCpf, mensagemDeErro } from '@/utils/formatar';
import { temErros, validarCadastro, type Erros, type FormularioCadastro } from '@/utils/validacao';

const VALORES_INICIAIS: FormularioCadastro = { nome: '', cpf: '', email: '', senha: '', confirmarSenha: '' };

type NomeCampo = keyof FormularioCadastro;
const ORDEM_CAMPOS: NomeCampo[] = ['nome', 'cpf', 'email', 'senha', 'confirmarSenha'];

export default function TelaCadastro() {
  const [valores, setValores] = useState<FormularioCadastro>(VALORES_INICIAIS);
  const [erros, setErros] = useState<Erros<FormularioCadastro>>({});
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [cadastrando, setCadastrando] = useState(false);

  const campoNome = useRef<TextInput>(null);
  const campoCpf = useRef<TextInput>(null);
  const campoEmail = useRef<TextInput>(null);
  const campoSenha = useRef<TextInput>(null);
  const campoConfirmarSenha = useRef<TextInput>(null);

  function alterar(campo: NomeCampo, valor: string) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }));
    setErros((atuais) => ({ ...atuais, [campo]: undefined }));
  }

  async function enviar() {
    const novosErros = validarCadastro(valores);
    setErros(novosErros);
    setMensagemErro(null);
    if (temErros(novosErros)) {
      const refs = { nome: campoNome, cpf: campoCpf, email: campoEmail, senha: campoSenha, confirmarSenha: campoConfirmarSenha };
      const primeiroComErro = ORDEM_CAMPOS.find((campo) => novosErros[campo]);
      if (primeiroComErro) refs[primeiroComErro].current?.focus();
      return;
    }

    setCadastrando(true);
    try {
      await cadastrar(valores.nome.trim(), apenasDigitos(valores.cpf), valores.email.trim(), valores.senha);
    } catch (erro) {
      setMensagemErro(mensagemDeErro(erro));
      setCadastrando(false);
    }
  }

  return (
    <TelaAutenticacao
      titulo="Criar conta"
      subtitulo="Cadastre-se para negociar colecionáveis."
      mensagemErro={mensagemErro}
      rodape={{ texto: 'Já tem conta?', link: 'Entrar', destino: '/login' }}>
      <Campo
        ref={campoNome}
        rotulo="Nome"
        value={valores.nome}
        onChangeText={(texto) => alterar('nome', texto)}
        erro={erros.nome}
        editable={!cadastrando}
        placeholder="Seu nome"
        maxLength={80}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => campoCpf.current?.focus()}
      />
      <Campo
        ref={campoCpf}
        rotulo="CPF"
        value={valores.cpf}
        onChangeText={(texto) => alterar('cpf', formatarCpf(texto))}
        erro={erros.cpf}
        editable={!cadastrando}
        placeholder="000.000.000-00"
        keyboardType="number-pad"
        maxLength={14}
        autoComplete="off"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => campoEmail.current?.focus()}
      />
      <Campo
        ref={campoEmail}
        rotulo="E-mail"
        value={valores.email}
        onChangeText={(texto) => alterar('email', texto)}
        erro={erros.email}
        editable={!cadastrando}
        placeholder="voce@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => campoSenha.current?.focus()}
      />
      <Campo
        ref={campoSenha}
        rotulo="Senha"
        value={valores.senha}
        onChangeText={(texto) => alterar('senha', texto)}
        erro={erros.senha}
        editable={!cadastrando}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => campoConfirmarSenha.current?.focus()}
      />
      <Campo
        ref={campoConfirmarSenha}
        rotulo="Confirmar senha"
        value={valores.confirmarSenha}
        onChangeText={(texto) => alterar('confirmarSenha', texto)}
        erro={erros.confirmarSenha}
        editable={!cadastrando}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={enviar}
      />
      <Botao
        titulo="Criar conta"
        tituloCarregando="Criando conta..."
        carregando={cadastrando}
        onPress={enviar}
      />
    </TelaAutenticacao>
  );
}
