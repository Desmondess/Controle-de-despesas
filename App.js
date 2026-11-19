import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpense';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
      >
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