import { GoogleSignin } from "@react-native-google-signin/google-signin"
import auth from "@react-native-firebase/auth"
import dynamicLinks from "@react-native-firebase/dynamic-links"
import { useState, useEffect } from "react"
import * as React from "react"
import { NavigationContainer } from "@react-navigation/native"
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
} from "react-native"

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from "react-native/Libraries/NewAppScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

export default function HomeScreen(props: any) {
    const [linkInfo, setLinkInfo] = useState("")

    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then((link) => {})
    }, [])

    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
        // When the component is unmounted, remove the listener
        return () => unsubscribe()
    }, [])

    const handleDynamicLink = (link) => {
        // Handle dynamic link inside your own application
        console.warn(link)
        setLinkInfo(link.url.substring(31))
    }

    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
        })
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn()

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken)

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential)
    }
    const isDarkMode = useColorScheme() === "dark"

    GoogleSignin.configure({
        webClientId:
            "199074098912-np9b1220ailpsbsn2ma5psoeabsm3pm9.apps.googleusercontent.com",
    })
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }

    return (
        <View
            style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
        >
            <Text>Hello world</Text>
            <Text>{linkInfo}</Text>
            <Button
                title="Google Sign-In"
                onPress={() =>
                    onGoogleButtonPress().then(() =>
                        console.log("Signed in with Google!")
                    )
                }
            />
            <Button
                title="Add"
                onPress={() => {
                    props.navigation.navigate("AddScan")
                }}
            />
        </View>
    )
}
