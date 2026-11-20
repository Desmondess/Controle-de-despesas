
import { useState, useCallback } from 'react';

import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
//import { buscarDespesas } from '../services/storage';
import {
  buscarDespesas,
  excluirDespesa,
} from '../services/storage';

// Retorna o mês atual no formato AAAA-MM
function obterMesAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');

  return `${ano}-${mes}`;
}

export default function HomeScreen({ navigation, route }) {
  const { usuario } = route.params;
  const [despesas, setDespesas] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(obterMesAtual());

  // Carrega as despesas sempre que a tela inicial recebe foco
  useFocusEffect(
    useCallback(() => {
      async function carregarDespesas() {
        const lista = await buscarDespesas(usuario);

        // Ordena da mais recente para a mais antiga
        lista.sort((a, b) => b.data.localeCompare(a.data));

        setDespesas(lista);
      }

      carregarDespesas();
    }, [usuario])
  );

  // Avança ou retrocede um mês
  function mudarMes(diferenca) {
    const [ano, mes] = mesSelecionado.split('-').map(Number);

    const novaData = new Date(ano, mes - 1 + diferenca, 1);

    const novoAno = novaData.getFullYear();
    const novoMes = String(novaData.getMonth() + 1).padStart(2, '0');

    setMesSelecionado(`${novoAno}-${novoMes}`);
  }

  // Converte AAAA-MM para o nome do mês e ano
  function formatarMes(mesISO) {
    const [ano, mes] = mesISO.split('-').map(Number);

    return new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  }

  // Filtra as despesas do mês selecionado
  const despesasFiltradas = despesas.filter(despesa =>
    despesa.data.startsWith(mesSelecionado)
  );

  // Calcula o total somente das despesas filtradas
  const totalMensal = despesasFiltradas.reduce(
    (total, despesa) => total + despesa.valor,
    0
  );

  // Converte AAAA-MM-DD para DD-MM-AAAA
  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}-${mes}-${ano}`;
  }

  // Formata o valor como moeda brasileira
  function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function confirmarExclusao(despesa) {
  Alert.alert(
    'Excluir despesa',
    `Deseja realmente excluir "${despesa.descricao}"?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const listaAtualizada = await excluirDespesa(usuario, despesa.id);

            setDespesas(listaAtualizada);
          } catch (erro) {
            Alert.alert(
              'Erro',
              'Não foi possível excluir a despesa.'
            );
          }
        },
      },
    ]
  );
}

  function renderizarDespesa({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.linha}>
        <Text style={styles.descricao}>{item.descricao}</Text>

        <Text style={styles.valor}>
          {formatarValor(item.valor)}
        </Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.categoria}>{item.categoria}</Text>

        <Text style={styles.data}>
          {formatarData(item.data)}
        </Text>
      </View>

      <View style={styles.acoes}>
        <Pressable
          style={styles.botaoEditar}
          onPress={() =>
            navigation.navigate('AddExpense', {
              usuario,
              despesa: item,
            })
          }
        >
          <Text style={styles.textoBotaoEditar}>Editar</Text>
        </Pressable>

        <Pressable
          style={styles.botaoExcluir}
          onPress={() => confirmarExclusao(item)}
        >
          <Text style={styles.textoBotaoExcluir}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.container}
      data={despesasFiltradas}
      keyExtractor={item => item.id}
      renderItem={renderizarDespesa}
      ListHeaderComponent={
        <View>
          <Text style={styles.subtitulo}>
            Olá, {usuario}!
          </Text>

          <Button
            title="Sair"
            color="#DC2626"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            }
          />

          <Text style={styles.titulo}>Controle de Despesas</Text>

          <View style={styles.resumo}>
            <Text style={styles.subtitulo}>Total gasto no período</Text>

            <Text style={styles.total}>
              {formatarValor(totalMensal)}
            </Text>
          </View>

          {/* Seletor de mês */}
          <View style={styles.seletorMes}>
            <Pressable
              style={styles.botaoMes}
              onPress={() => mudarMes(-1)}
            >
              <Text style={styles.seta}>‹</Text>
            </Pressable>

            <Text style={styles.mesSelecionado}>
              {formatarMes(mesSelecionado)}
            </Text>

            <Pressable
              style={styles.botaoMes}
              onPress={() => mudarMes(1)}
            >
              <Text style={styles.seta}>›</Text>
            </Pressable>
          </View>

          <Button
            title="Adicionar despesa"
            onPress={() => navigation.navigate('AddExpense', {usuario})}
          />

          <Text style={styles.tituloLista}>
            Despesas do período
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.vazio}>
          Nenhuma despesa cadastrada neste mês.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  container: {
    padding: 20,
    flexGrow: 1,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  resumo: {
    backgroundColor: '#DBEAFE',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 16,
    color: '#374151',
  },

  total: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginTop: 8,
  },

  seletorMes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
  },

  botaoMes: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  seta: {
    fontSize: 30,
    color: '#2563EB',
    fontWeight: 'bold',
  },

  mesSelecionado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'capitalize',
  },

  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  descricao: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },

  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  categoria: {
    fontSize: 14,
    color: '#555555',
  },

  data: {
    fontSize: 14,
    color: '#777777',
  },

  vazio: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
    fontSize: 15,
  },

  acoes: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 10,
},

botaoEditar: {
  backgroundColor: '#2563EB',
  paddingVertical: 9,
  paddingHorizontal: 18,
  borderRadius: 8,
},

textoBotaoEditar: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},

botaoExcluir: {
  backgroundColor: '#DC2626',
  paddingVertical: 9,
  paddingHorizontal: 18,
  borderRadius: 8,
},

textoBotaoExcluir: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},

});
