import { GoogleSignin } from "@react-native-google-signin/google-signin"
import auth from "@react-native-firebase/auth"
import React from "react"
import {
    Text,
    View,
} from "react-native"
import { ScreenBase } from "../../ui-base/containers"
import { TextStyles } from "../../ui-base/text"
import BigButton from "../../components/BigButton"

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
        <ScreenBase>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={TextStyles.h1}>Welcome!</Text>
            </View>
            <BigButton
                label='Sign in with Google'
                onPress={() =>
                    onGoogleSignIn().then(() =>
                        console.log("Signed in with Google!")
                    )
                }
                isInColumn
            />
        </ScreenBase>
    )
}