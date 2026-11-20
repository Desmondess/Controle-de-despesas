// Importações
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpense';

// Criação do navegador
const Stack = createNativeStackNavigator();

// Componente principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Entrar',
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Controle de Despesas',
          }}
        />

        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{
            title: 'Nova Despesa',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}