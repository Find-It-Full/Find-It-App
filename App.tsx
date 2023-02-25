import React from 'react'
import { SafeAreaProvider } from "react-native-safe-area-context"
import auth from "@react-native-firebase/auth"
import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'
import { useEffect, useState } from "react"
import DynamicLinkDelegate from "./components/DynamicLinkDelegate"
import { Text } from "react-native"
import Navigator from "./screens/Navigator"
import store from "./store"
import { Provider } from "react-redux"
import SubscriptionManager from "./backend/SubscriptionManager"

export const uid = "Ethan"
const USE_EMULATORS = false

function conditionallyEnableEmulation() {
    if (USE_EMULATORS) {
        try {
            auth().useEmulator('http://localhost:9099')
            console.log('Able to initialize Auth emulator.')
        } catch (e) {
            console.error('Unable to initialize authentication emulator.')
        }

        try {
            firestore().useEmulator('localhost', 8080)
            console.log('Able to initialize firestore emulator.')
        } catch (e) {
            console.error('Unable to initialize firestore emulator.')
        }

        try {
            functions().useEmulator('127.0.0.1', 5001)
            console.log('Able to initialize functions emulator.')
        } catch (e) {
            console.error('Unable to initialize functions emulator.')
        }
    }
}

function subscribeToAuthStateChanges(onChange: (isAuthenticated: boolean) => void): () => void {
    
    const unsubscribe = auth().onAuthStateChanged(async () => { 
        console.log('Got an auth state change'); 
        onChange(auth().currentUser !== null)
    })

    return unsubscribe
}

export default function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(auth().currentUser !== null)

    conditionallyEnableEmulation()

    console.log(auth().currentUser?.uid)

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
