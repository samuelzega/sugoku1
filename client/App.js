import React from 'react'

import { Home, Game, Finish } from './src/screens/index'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import store from './src/provider/store'
const Stack = createStackNavigator()

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen
                        name="Game"
                        component={Game}
                        initialParams={{ difficulty: 'easy' }}
                    />
                    <Stack.Screen name="Finish" component={Finish} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}
