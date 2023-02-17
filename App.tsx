import React from 'react'
import { SafeAreaProvider } from "react-native-safe-area-context"
import auth from "@react-native-firebase/auth"
import { useEffect, useState } from "react"
import DynamicLinkDelegate from "./components/DynamicLinkDelegate"
import { Text } from "react-native"
import Navigator from "./screens/Navigator"
import store from "./store"
import { Provider } from "react-redux"
import SubscriptionManager from "./backend/SubscriptionManager"

export const uid = "Ethan"

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

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <DynamicLinkDelegate>
                    <SubscriptionManager>
                        <Navigator isAuthenticated={isAuthenticated} />
                    </SubscriptionManager>
                </DynamicLinkDelegate>
            </SafeAreaProvider>
        </Provider>
    )
}
