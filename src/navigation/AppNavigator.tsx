import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';

export type RootStackParamList = {
    Home: undefined;
    Questionnaire: { childId: string; source: 'parent' | 'teacher' };
    Game: { childId: string };
    Result: { childId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#F9FAFB' },
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                    name="Questionnaire"
                    component={QuestionnaireScreen}
                    options={{ headerShown: true, title: 'Assessment' }}
                />
                <Stack.Screen
                    name="Game"
                    component={GameScreen}
                    options={{ headerShown: true, title: 'Reaction Game' }}
                />
                <Stack.Screen
                    name="Result"
                    component={ResultScreen}
                    options={{ headerShown: true, title: 'Diagnosis Results' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
