# Controle de Despesas

Aplicativo mobile desenvolvido com **React Native e Expo**, destinado ao registro e acompanhamento de despesas pessoais.

A aplicação permite que diferentes usuários utilizem o mesmo dispositivo, mantendo suas despesas separadas por perfil. Cada usuário informa seu nome para acessar seu próprio conjunto de registros, sem necessidade de cadastro com senha ou conexão com um servidor externo.

O aplicativo oferece funcionalidades de cadastro, consulta, filtragem e exclusão de despesas, além de armazenamento local persistente.

## Tecnologias e dependências

O projeto utiliza as seguintes tecnologias e bibliotecas:

| Tecnologia / Biblioteca | Versão | Finalidade |
|---|---|---|
| JavaScript | ES Modules | Linguagem utilizada no desenvolvimento. |
| React | 19.3.0 | Construção da interface e gerenciamento de estados. |
| React Native | 0.88.1 | Desenvolvimento da aplicação mobile. |
| Expo | ~58.0.25 | Ambiente e ferramentas para desenvolvimento e execução do aplicativo. |
| React Navigation Native | ^7.5.2 | Gerenciamento da navegação entre telas. |
| React Navigation Native Stack | ^7.21.1 | Implementação da navegação em pilha. |
| AsyncStorage | 2.2.0 | Armazenamento local e persistência dos dados. |
| React Native Screens | ~4.30.1 | Integração e otimização das telas de navegação. |
| React Native Safe Area Context | ~5.11.1 | Gerenciamento das áreas seguras da interface. |

### Dependências adicionais instaladas

As seguintes bibliotecas também estão presentes no projeto:

- **date-fns:** biblioteca auxiliar para manipulação e formatação de datas.
- **@expo/vector-icons:** disponibiliza conjuntos de ícones para a interface.
- **expo-status-bar:** permite controlar a aparência da barra de status do dispositivo.

Essas dependências adicionais podem ser utilizadas para expandir e aprimorar a interface e as funcionalidades do aplicativo.

## Funcionalidades implementadas

### Gerenciamento de usuários

- **Identificação de usuário:** disponibiliza uma tela inicial na qual o usuário informa seu nome para acessar o aplicativo.
- **Armazenamento individual:** utiliza chaves específicas no AsyncStorage para separar as despesas de cada usuário.
- **Alternância de usuários:** permite sair de um perfil e entrar com outro nome, acessando os respectivos registros.
- **Identificação do perfil ativo:** apresenta o nome do usuário durante a utilização do aplicativo.

### Gerenciamento de despesas

- **Cadastro de despesas:** permite registrar despesas informando descrição, valor, data e categoria.
- **Validação dos dados:** verifica o preenchimento dos campos obrigatórios, impede valores não numéricos ou menores ou iguais a zero e valida o formato e a existência da data informada.
- **Categorias:** disponibiliza as categorias Alimentação, Transporte, Moradia, Saúde, Lazer, Educação e Outros.
- **Listagem de despesas:** apresenta descrição, valor, data e categoria de cada registro.
- **Ordenação cronológica:** organiza as despesas da mais recente para a mais antiga.
- **Resumo mensal:** calcula e apresenta o total gasto no mês selecionado.
- **Filtro por mês:** permite selecionar diferentes meses, atualizando a listagem e o total de despesas conforme o período selecionado.
- **Exclusão de despesas:** permite remover registros mediante confirmação, atualizando a listagem e o resumo mensal.

### Persistência e funcionamento offline

- **Persistência local:** armazena as despesas no dispositivo utilizando AsyncStorage, mantendo os registros disponíveis após o fechamento do aplicativo.
- **Separação dos dados:** cada usuário possui uma chave de armazenamento própria, evitando que as despesas de diferentes perfis sejam misturadas.
- **Funcionamento offline:** permite cadastrar, consultar e excluir despesas sem depender de conexão com a internet ou de uma API externa.

## Requisitos para execução

Para executar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada).
- npm (instalado junto com o Node.js).
- [Expo Go](https://expo.dev/go) em um dispositivo Android.
- Git (opcional, para clonar o repositório).

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Substitua `URL_DO_REPOSITORIO` pelo endereço do repositório no GitHub.

### 2. Acessar a pasta do projeto

```bash
cd controle-despesas
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npx expo start
```

Após a inicialização, será exibido um QR Code no terminal ou na interface do Expo.

### 5. Executar no dispositivo Android

1. Instale e abra o aplicativo Expo Go no celular.
2. Conecte o computador e o celular à mesma rede Wi-Fi.
3. Escaneie o QR Code exibido pelo Expo.
4. Aguarde o carregamento da aplicação.
5. Informe um nome na tela inicial para acessar suas despesas.

Caso ocorram problemas de conexão pela rede local, utilize:

```bash
npx expo start --tunnel
```

## Estrutura do projeto

```text
controle-despesas/
│
├── assets/
│
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   └── AddExpense.js
│   │
│   └── services/
│       └── storage.js
│
├── App.js
├── index.js
├── app.json
├── package.json
└── README.md
```

### Organização dos arquivos

- **App.js:** configura a navegação entre as telas do aplicativo utilizando React Navigation.
- **src/screens/LoginScreen.js:** apresenta a tela de identificação do usuário e valida o nome informado.
- **src/screens/HomeScreen.js:** apresenta a listagem de despesas, o resumo mensal, o filtro por mês e as opções de exclusão e saída do perfil.
- **src/screens/AddExpense.js:** contém o formulário de cadastro e a validação das informações da despesa.
- **src/services/storage.js:** centraliza as operações de armazenamento, consulta e exclusão de despesas utilizando AsyncStorage.
- **assets/:** armazena os recursos estáticos utilizados pelo aplicativo.
- **app.json:** contém as configurações do projeto Expo.
- **package.json:** registra as dependências e os comandos disponíveis para execução do projeto.

## Armazenamento dos dados

O aplicativo utiliza o **AsyncStorage** para armazenar as despesas localmente no dispositivo.

Cada usuário possui uma chave de armazenamento própria, gerada a partir do nome informado na tela de identificação.

Por exemplo:

```text
@controle_despesas_iuri
@controle_despesas_maria
@controle_despesas_joao
```

Os registros são armazenados em formato JSON. As informações são convertidas para uma string JSON antes do armazenamento e recuperadas posteriormente para utilização na aplicação.

As datas são armazenadas no formato `AAAA-MM-DD`, facilitando a ordenação cronológica e a filtragem mensal, enquanto são apresentadas ao usuário no formato `DD-MM-AAAA`.

Dessa forma, os dados permanecem disponíveis após o encerramento do aplicativo, e diferentes usuários podem manter seus próprios registros no mesmo dispositivo.

**Observação:** a identificação por nome é um mecanismo de separação local dos dados, não um sistema de autenticação. Não há verificação de identidade ou proteção por senha.

---

**Projeto desenvolvido como parte de um processo seletivo para desenvolvimento mobile.**