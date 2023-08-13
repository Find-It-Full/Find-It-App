import React from 'react'
import { SafeAreaProvider } from "react-native-safe-area-context"
import auth from "@react-native-firebase/auth"
import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'
import { useEffect, useState } from "react"
import DynamicLinkDelegate from "./components/DynamicLinkDelegate"
import { StatusBar, Text } from "react-native"
import Navigator from "./screens/Navigator"
import store from "./store"
import { Provider } from "react-redux"
import SubscriptionManager from "./backend/SubscriptionManager"
import InAppNotificationManager from './components/InAppNotificationManager'
import type {PropsWithChildren} from 'react';
import EmojiManager from './backend/EmojiManager'
import { FirestoreBackend } from './backend/firestoreBackend'
import messaging from '@react-native-firebase/messaging'
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
        if(auth().currentUser !== null){
            const token = await messaging().getToken()
            FirestoreBackend.addNotificationToken(token)
        }
        onChange(auth().currentUser !== null)
    })

    return unsubscribe
}



export default function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(auth().currentUser !== null)
    conditionallyEnableEmulation()
    useEffect(() => {
        return subscribeToAuthStateChanges(setIsAuthenticated)
    }, [isAuthenticated])

    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
            />
            <Provider store={store}>
                <SafeAreaProvider>
                    <DynamicLinkDelegate>
                        <SubscriptionManager>
                            <EmojiManager>
                                <Navigator isAuthenticated={isAuthenticated} />
                            </EmojiManager>
                        </SubscriptionManager>
                    </DynamicLinkDelegate>
                </SafeAreaProvider>
            </Provider>
        </>
    )
}
