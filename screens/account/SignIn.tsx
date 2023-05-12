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
import BigPrimaryActionButton from "../../components/BigPrimaryActionButton"
import InAppNotificationManager from "../../components/InAppNotificationManager"


export default function SignIn(props: SignInProps) {
    const [showMiscError, setShowMiscError] = useState(false)
    const [showNoInternetError, setShowNoInternetError] = useState(false)

    async function onAppleButtonPress() {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // Ensure Apple returned a user identityToken
        if ( ! appleAuthRequestResponse.identityToken) {
            setShowMiscError(true)
            return
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

    return (
        <>
            <ScreenBase>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={TextStyles.h1}>FoundHound</Text>
                </View>
                {/* <EmailAndPasswordInput error={error} sent={sent} forgotPassword={async (email) => { await forgotPassword(email) }} onSubmit={async (email, password) => { await emailSignIn(email, password) }} /> */}
                {/* <BigButton
                    label='Continue with Email'
                    onPress={() =>
                        props.navigation.navigate('EmailSignIn')
                    }
                    isInColumn
                /> */}
                <Spacer size={Spacing.Gap} />
                <BigPrimaryActionButton
                    icon='􀀑'
                    label='Continue with Google'
                    onPress={() =>
                        onGoogleSignIn().then(() =>
                            console.log("Signed in with Google!")
                        ).catch((e) => {
                            if (e.code !== '-5') {
                                setShowMiscError(true)
                            }
                        })
                    }
                    isInColumn
                />
                <Spacer size={Spacing.Gap} />
                <BigPrimaryActionButton
                    icon='􀣺'
                    label='Continue with Apple'
                    onPress={() =>
                        onAppleButtonPress().then(() =>
                            console.log("Signed in with Apple!")
                        ).catch((e) => {
                            if (e.code === '1000') {
                                setShowNoInternetError(true)
                            } else if (e.code !== '1001') {
                                setShowMiscError(true)
                            }
                        })
                    }
                    isInColumn
                />
            </ScreenBase>
            <InAppNotificationManager 
                shouldShowMiscError={showMiscError}
                shouldShowNoInternetError={showNoInternetError}
                resetMiscError={() => setShowMiscError(false)}
                resetNoInternetError={() => setShowNoInternetError(false)}
            />
        </>
    )
}