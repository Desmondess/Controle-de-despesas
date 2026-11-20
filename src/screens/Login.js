import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');

  function entrar() {
    const nome = usuario.trim();

    // Verifica se o usuário informou um nome
    if (!nome) {
      Alert.alert(
        'Campo obrigatório',
        'Informe seu nome para continuar.'
      );
      return;
    }

    // Fecha o teclado
    Keyboard.dismiss();

    // Substitui a tela de login pela Home,
    // enviando o nome do usuário como parâmetro
    navigation.replace('Home', {
      usuario: nome,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>
          Controle de Despesas
        </Text>

        <Text style={styles.subtitulo}>
          Informe seu nome para acessar suas despesas.
        </Text>

        <Text style={styles.label}>
          Usuário
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={entrar}
        />

        <Button
          title="Entrar"
          onPress={entrar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },

  conteudo: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 12,
    elevation: 3,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D4ED8',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
});