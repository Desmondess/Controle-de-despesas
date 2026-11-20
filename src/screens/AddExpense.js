
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import {
  salvarDespesa,
  atualizarDespesa,
} from '../services/storage';

const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Educação',
  'Outros',
];

export default function AddExpenseScreen({ navigation, route }) {
  const { usuario, despesa } = route.params;

  // Verifica se a tela foi aberta para edição
  const modoEdicao = !!despesa;

  // Inicializa os campos com os dados existentes,
  // caso esteja editando uma despesan
  const [descricao, setDescricao] = useState(
    despesa ? despesa.descricao : ''
  );

  const [centavos, setCentavos] = useState(
    despesa ? Math.round(Number(despesa.valor) * 100) : 0
  );

  const [data, setData] = useState(
    despesa ? converterDataParaExibicao(despesa.data) : obterDataLocal()
  );

  const [categoria, setCategoria] = useState(
    despesa ? despesa.categoria : ''
  );

  async function cadastrarDespesa() {
    // Verifica os campos obrigatórios
    if (!descricao.trim() || centavos <= 0 || !data || !categoria) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos.'
      );
      return;
    }

    // Converte os centavos para reais
    const valorNumerico = centavos / 100;

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      Alert.alert(
        'Valor inválido',
        'Informe um valor maior que zero.'
      );
      return;
    }

    // Valida o formato DD-MM-AAAA
    const dataValida = /^\d{2}-\d{2}-\d{4}$/.test(data);

    if (!dataValida) {
      Alert.alert(
        'Data inválida',
        'Informe a data no formato DD-MM-AAAA.'
      );
      return;
    }

    const [dia, mes, ano] = data.split('-').map(Number);

    const dataObj = new Date(ano, mes - 1, dia);

    if (
      dataObj.getFullYear() !== ano ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getDate() !== dia
    ) {
      Alert.alert(
        'Data inválida',
        'A data informada não existe.'
      );
      return;
    }

    // Converte para AAAA-MM-DD antes de armazenar
    const dataISO = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    // Mantém o ID original na edição
    // e gera um novo ID no cadastro
    const despesaAtualizada = {
      id: modoEdicao ? despesa.id : Date.now().toString(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      data: dataISO,
      categoria,
    };

    try {
      if (modoEdicao) {
        await atualizarDespesa(usuario, despesaAtualizada);
      } else {
        await salvarDespesa(usuario, despesaAtualizada);
      }

      Alert.alert(
        'Sucesso',
        modoEdicao
          ? 'Despesa atualizada com sucesso!'
          : 'Despesa cadastrada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (erro) {
      Alert.alert(
        'Erro',
        modoEdicao
          ? 'Não foi possível atualizar a despesa.'
          : 'Não foi possível salvar a despesa.'
      );
    }
  }

  function formatarMoeda(totalCentavos) {
    const reais = (totalCentavos / 100).toFixed(2);
    return reais.replace('.', ',');
  }

  function handleChangeValor(texto) {
    // Mantém apenas os dígitos
    const digitos = texto.replace(/\D/g, '');

    const novoTotal = digitos ? Number(digitos) : 0;

    setCentavos(novoTotal);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicao ? 'Editar despesa' : 'Nova despesa'}
      </Text>

      <Text style={styles.label}>Descrição</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Almoço"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Valor (R$)</Text>

      <TextInput
        style={styles.input}
        placeholder="0,00"
        keyboardType="number-pad"
        value={formatarMoeda(centavos)}
        onChangeText={handleChangeValor}
      />

      <Text style={styles.label}>Data (DD-MM-AAAA)</Text>

      <TextInput
        style={styles.input}
        placeholder="01-08-2026"
        keyboardType="numeric"
        value={data}
        onChangeText={(texto) => setData(formatarData(texto))}
      />

      <Text style={styles.label}>Categoria</Text>

      <View style={styles.categorias}>
        {CATEGORIAS.map(item => (
          <Text
            key={item}
            onPress={() => setCategoria(item)}
            style={[
              styles.categoria,
              categoria === item && styles.categoriaSelecionada,
            ]}
          >
            {item}
          </Text>
        ))}
      </View>

      <Button
        title={modoEdicao ? 'Salvar alterações' : 'Salvar despesa'}
        onPress={cadastrarDespesa}
      />
    </ScrollView>
  );
}

// Retorna a data atual no formato DD-MM-AAAA
function obterDataLocal() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${dia}-${mes}-${ano}`;
}

// Converte AAAA-MM-DD para DD-MM-AAAA
function converterDataParaExibicao(dataISO) {
  if (!dataISO) {
    return obterDataLocal();
  }

  const [ano, mes, dia] = dataISO.split('-');

  return `${dia}-${mes}-${ano}`;
}

// Formata automaticamente a data digitada
function formatarData(texto) {
  // Remove tudo que não for número
  const numeros = texto.replace(/\D/g, '').slice(0, 8);

  // Adiciona os hífens automaticamente
  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 4) {
    return `${numeros.slice(0, 2)}-${numeros.slice(2)}`;
  }

  return `${numeros.slice(0, 2)}-${numeros.slice(2, 4)}-${numeros.slice(4)}`;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },

  categoria: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
  },

  categoriaSelecionada: {
    backgroundColor: '#93C5FD',
    fontWeight: 'bold',
  },
});
