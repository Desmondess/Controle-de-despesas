import AsyncStorage from '@react-native-async-storage/async-storage';

// Gera uma chave específica para cada usuário
function obterChaveDespesas(usuario) {
  const nomeNormalizado = usuario.trim().toLowerCase();

  return `@controle_despesas_${nomeNormalizado}`;
}

// Busca as despesas de um usuário
export async function buscarDespesas(usuario) {
  try {
    const chave = obterChaveDespesas(usuario);

    const dados = await AsyncStorage.getItem(chave);

    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error('Erro ao buscar despesas:', erro);
    return [];
  }
}

// Salva uma nova despesa para determinado usuário
export async function salvarDespesa(usuario, novaDespesa) {
  try {
    const chave = obterChaveDespesas(usuario);

    const despesas = await buscarDespesas(usuario);

    const listaAtualizada = [...despesas, novaDespesa];

    await AsyncStorage.setItem(
      chave,
      JSON.stringify(listaAtualizada)
    );

    return listaAtualizada;
  } catch (erro) {
    console.error('Erro ao salvar despesa:', erro);
    throw erro;
  }
}

// Exclui uma despesa pelo identificador
export async function excluirDespesa(usuario, id) {
  try {
    const chave = obterChaveDespesas(usuario);

    const despesas = await buscarDespesas(usuario);

    const listaAtualizada = despesas.filter(
      despesa => despesa.id !== id
    );

    await AsyncStorage.setItem(
      chave,
      JSON.stringify(listaAtualizada)
    );

    return listaAtualizada;
  } catch (erro) {
    console.error('Erro ao excluir despesa:', erro);
    throw erro;
  }
}

export async function atualizarDespesa(usuario, despesaAtualizada) {
  try {
    const chave = obterChaveDespesas(usuario);

    const despesas = await buscarDespesas(usuario);

    const listaAtualizada = despesas.map(despesa =>
      despesa.id === despesaAtualizada.id
        ? despesaAtualizada
        : despesa
    );

    await AsyncStorage.setItem(
      chave,
      JSON.stringify(listaAtualizada)
    );

    return listaAtualizada;
  } catch (erro) {
    console.error('Erro ao atualizar despesa:', erro);
    throw erro;
  }
}