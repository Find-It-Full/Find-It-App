import * as React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AddScan from "./screens/adding/scanAdd"
import HomeScreen from "./screens/account/homeScreen"
import detailsAdd from "./screens/adding/detailsAdd"
import { SafeAreaProvider } from "react-native-safe-area-context"
import auth from "@react-native-firebase/auth"
import { useEffect, useState } from "react"
import SignIn from "./screens/account/SignIn"

export const uid = "Ethan"

const Stack = createNativeStackNavigator()

function subscribeToAuthStateChanges(onChange: (isAuthenticated: boolean) => void): () => void {
    
    const unsubscribe = auth().onAuthStateChanged(async () => { 
        console.log('Got an auth state change'); 
        onChange(auth().currentUser !== null)
    })

    return unsubscribe
}

export default function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(auth().currentUser !== null)

    useEffect(() => {
        return subscribeToAuthStateChanges(setIsAuthenticated)
    }, [isAuthenticated])

    const initialScreen = isAuthenticated ? "Home" : "SignIn"

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={initialScreen}>
                    {
                        isAuthenticated ? (
                            <>
                                <Stack.Screen name="Home" component={HomeScreen} />
                                <Stack.Screen name="AddScan" component={AddScan} />
                                <Stack.Screen name="DetailsAdd" component={detailsAdd} />
                            </>
                        ) :
                        (
                            <>
                                <Stack.Screen name="SignIn" component={SignIn} />
                            </>
                        )
                    }
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
