
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import  { useState, useEffect } from 'react';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Button,
    useColorScheme,
    View,
    AppRegistry,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScan from './features/adding/scanAdd';
import HomeScreen from './features/account/homeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import detailsAdd from './features/adding/detailsAdd';
export const uid = "Ethan"


const Stack = createNativeStackNavigator();






export default function App() {

    return (
        <NavigationContainer >
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddScan" component={AddScan} />
                <Stack.Screen name="DetailsAdd" component={detailsAdd} />
                
            </Stack.Navigator>
        </NavigationContainer>
            

           
        
    );
    
};


const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

