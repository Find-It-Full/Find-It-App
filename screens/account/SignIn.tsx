import { GoogleSignin } from "@react-native-google-signin/google-signin"
import auth from "@react-native-firebase/auth"
import React from "react"
import {
    Text,
    Button,
    useColorScheme,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SignIn(props: { }) {

    async function onGoogleSignIn() {
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

    GoogleSignin.configure({
        webClientId:
            "199074098912-np9b1220ailpsbsn2ma5psoeabsm3pm9.apps.googleusercontent.com",
    })

    return (
        <SafeAreaView>
            <Button
                title="Sign In with Google"
                onPress={() =>
                    onGoogleSignIn().then(() =>
                        console.log("Signed in with Google!")
                    )
                }
            />
        </SafeAreaView>
    )
}