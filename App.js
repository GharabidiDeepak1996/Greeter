import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import BottomNavigation from './screens/BottomNavigation'; 
import TripDetailsScreen from './screens/TripDetailsScreen';
import TransportDetails from './screens/TransportDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="SplashScreen">
    <Stack.Screen
    name="SplashScreen"
    component={SplashScreen}
    options={{headerShown: false}}
    />
    <Stack.Screen
    name="LoginScreen"
    component={LoginScreen}
    options={{headerShown: false}}
    />
    <Stack.Screen
    name="BottomNavigation"
    component={BottomNavigation}
    options={{headerShown: false}}
    />
     <Stack.Screen
    name="TripDetailsScreen"
    component={TripDetailsScreen}
    options={{headerShown: false,  animation: "slide_from_right"}}
    />
    
    {/* <Stack.Screen
    name="TransportDetails"
    component={TransportDetails}
    options={{headerShown: false,  animation: "slide_from_right"}}
    /> */}
    </Stack.Navigator>
    </NavigationContainer> 
  );
}
