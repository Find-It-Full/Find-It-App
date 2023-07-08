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
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/Ionicons'


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
                    <Text style={TextStyles.h1}>Beacon Tags</Text>
                </View>
                {/* <EmailAndPasswordInput error={error} sent={sent} forgotPassword={async (email) => { await forgotPassword(email) }} onSubmit={async (email, password) => { await emailSignIn(email, password) }} /> */}
                <BigPrimaryActionButton
                    icon = {<Icon name = 'ios-mail-outline' style ={TextStyles.h3}/>}
                    label='Continue with Email'
                    onPress={async () =>{
                        await analytics().logEvent('signin_google_worked', {})
                        console.log("Signed in with Google!")
                        props.navigation.navigate('EmailSignIn')
                    }}
                    isInColumn
                />
                <Spacer size={Spacing.Gap} />
                <BigPrimaryActionButton
                    icon= {<Icon name = 'ios-logo-google' style ={TextStyles.h3}/>}
                    label='Continue with Google'
                    onPress={() =>
                        onGoogleSignIn().then(async () => {
                            console.log("analysitcs --- google signin worked")
                        await analytics().logEvent('signin_google_worked', {})
                            console.log("Signed in with Google!")
                        }
                        ).catch(async (e) => {
                            console.log(e)
                            console.log("analysitcs --- google signin failed")
                            await analytics().logEvent('signin_apple_worked', {error:e})
                            if (e.code !== '-5') {
                                setShowMiscError(true)
                            }
                        })
                    }
                    isInColumn
                />
                <Spacer size={Spacing.Gap} />
                <BigPrimaryActionButton
                    icon={<Icon name = 'ios-logo-apple' style ={TextStyles.h3}/>}
                    label='Continue with Apple'
                    onPress={() =>
                        onAppleButtonPress().then(async () => {
                            console.log("analysitcs --- apple signin worked")
                            await analytics().logEvent('signin_apple_worked', {})
                            console.log("Signed in with Apple!")
                        }
                        ).catch(async (e) => {
                            console.log("analysitcs --- apple signin failed")
                            await analytics().logEvent('signin_apple_error', {error:e})
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