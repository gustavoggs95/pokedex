import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/components/Home';
import pokemonPage from './src/components/PokemonPage';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Pokédex', headerTitleAlign: 'center' }}
        />
        <Stack.Screen 
        name="Pokemon Page" 
        component={pokemonPage} 
        options={ ({ route }) => ({ title: route.params.name, headerTitleAlign: 'center' }) }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
