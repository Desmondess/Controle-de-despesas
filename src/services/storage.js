
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_DESPESAS = '@controle_despesas';

// Busca todas as despesas armazenadas
export async function buscarDespesas() {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_DESPESAS);

    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error('Erro ao buscar despesas:', erro);
    return [];
  }
}

// Salva uma nova despesa
export async function salvarDespesa(novaDespesa) {
  try {
    const despesas = await buscarDespesas();

    const listaAtualizada = [...despesas, novaDespesa];

    await AsyncStorage.setItem(
      CHAVE_DESPESAS,
      JSON.stringify(listaAtualizada)
    );

    console.log(
      'DESPESAS ARMAZENADAS',
      JSON.stringify(listaAtualizada, null, 2)
    );

    return listaAtualizada;
  } catch (erro) {
    console.error('Erro ao salvar despesa:', erro);
    throw erro;
  }
}

// Exclui uma despesa pelo identificador
export async function excluirDespesa(id) {
  try {
    const despesas = await buscarDespesas();

    const listaAtualizada = despesas.filter(
      despesa => despesa.id !== id
    );

    await AsyncStorage.setItem(
      CHAVE_DESPESAS,
      JSON.stringify(listaAtualizada)
    );

    return listaAtualizada;
  } catch (erro) {
    console.error('Erro ao excluir despesa:', erro);
    throw erro;
  }
}
