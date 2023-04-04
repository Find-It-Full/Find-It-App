import { GoogleSignin } from "@react-native-google-signin/google-signin"
import auth from "@react-native-firebase/auth"
import React, { useState } from "react"
import {
    Text,
    View,
} from "react-native"
import { ScreenBase } from "../../ui-base/containers"
import { TextStyles } from "../../ui-base/text"
import BigButton from "../../components/BigButton"
import EmailAndPasswordInput from "../../components/emailAndPasswordInput"
import { SignInProps } from "../Navigator"
import { Spacer } from "../../ui-base/layouts"
import { Spacing } from "../../ui-base/spacing"
import { appleAuth } from '@invertase/react-native-apple-authentication';


export default function SignIn(props: SignInProps) {
    const [error, setError] = useState(false)
    const [sent, setSent] = useState(false)

    async function onAppleButtonPress() {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
      
        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
          throw new Error('Apple Sign-In failed - no identify token returned');
        }
      
        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      
        // Sign the user in with the credential
        return auth().signInWithCredential(appleCredential);
      }






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

    async function emailSignIn(email: string, password: string) {

        try {
            await auth().createUserWithEmailAndPassword(email, password)
        }
        catch (err) {
            setError(true)
        }

    }

    async function forgotPassword(email: string) {

        try {
            await auth().sendPasswordResetEmail(email)
            setSent(true)
        }
        catch (err) {
            setError(true)
        }

    }

    return (
        <ScreenBase>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={TextStyles.h1}>FoundHound</Text>
            </View>
            {/* <EmailAndPasswordInput error={error} sent={sent} forgotPassword={async (email) => { await forgotPassword(email) }} onSubmit={async (email, password) => { await emailSignIn(email, password) }} /> */}
            <BigButton
                label='Continue with Email'
                onPress={() =>
                    props.navigation.navigate('EmailSignIn')
                }
                isInColumn
            />
            <Spacer size={Spacing.Gap} />
            <BigButton
                label='Continue with Google'
                onPress={() =>
                    onGoogleSignIn().then(() =>
                        console.log("Signed in with Google!")
                    )
                }
                isInColumn
            />
            <Spacer size={Spacing.Gap} />
            <BigButton
                label='Continue with Apple'
                onPress={() =>
                    onAppleButtonPress().then(() =>
                        console.log("Signed in with Apple!")
                    )
                }
                isInColumn
            />
        </ScreenBase>
    )
}