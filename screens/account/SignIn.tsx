import { GoogleSignin } from "@react-native-google-signin/google-signin"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import React, { useState } from "react"
import {
    Image,
    Platform,
    Text,
    View,
} from "react-native"
import { ScreenBase } from "../../ui-base/containers"
import { TextStyles } from "../../ui-base/text"
import { SignInProps } from "../Navigator"
import { Spacer } from "../../ui-base/layouts"
import { Spacing } from "../../ui-base/spacing"
import { appleAuth } from '@invertase/react-native-apple-authentication';
import BigPrimaryActionButton from "../../components/BigPrimaryActionButton"
import InAppNotificationManager from "../../components/InAppNotificationManager"
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/Ionicons'
import PlatformIcon, { Icons } from "../../components/PlatformIcon"
import { FirestoreBackend } from "../../backend/firestoreBackend"
import { Colors } from "../../ui-base/colors"


export default function SignIn(props: SignInProps) {
    const [showMiscError, setShowMiscError] = useState(false)
    const [showNoInternetError, setShowNoInternetError] = useState(false)

    const handleCredentialedUserSignOn = async (result: FirebaseAuthTypes.UserCredential) => {
        if (result.additionalUserInfo?.isNewUser) {
            const name = result.user.displayName ?? ''
            const split = name.split(' ')
            const firstName = split.shift() ?? ''
            const lastName = split.join(' ') ?? ''
            await FirestoreBackend.editAccount({ firstName, lastName })
        }
        else {
            console.log(JSON.stringify(result))
            console.log(auth().currentUser)
        }
    }

    async function onAppleButtonPress() {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
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
        const result = await auth().signInWithCredential(appleCredential)
        return await handleCredentialedUserSignOn(result)
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
        const result = await auth().signInWithCredential(googleCredential)
        return await handleCredentialedUserSignOn(result)
    }

    GoogleSignin.configure({
        webClientId:
            "199074098912-np9b1220ailpsbsn2ma5psoeabsm3pm9.apps.googleusercontent.com",
    })

    return (
        <>
            <ScreenBase>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require("./bwicon.png")} style={{width: 128, height: 128}} />
                </View>
                
                {Platform.OS === "ios" ? <BigPrimaryActionButton
                    icon={<PlatformIcon icon={Icons.APPLE_LOGO} />}
                    label='Continue with Apple'
                    onPress={() =>
                        onAppleButtonPress().then(async () => {
                            console.log("analytics --- apple signin worked")
                            await analytics().logEvent('signin_apple_worked', {})
                            console.log("Signed in with Apple!")
                        }
                        ).catch(async (e: FirebaseAuthTypes.NativeFirebaseAuthError) => {
                            console.log("analytics --- apple signin failed")
                            await analytics().logEvent('signin_apple_error', { error: e })
                            if (e.message.includes('AuthorizationError')) {
                                setShowMiscError(true)
                            }
                            else if (e.code === '1000') {
                                setShowNoInternetError(true)
                            } else if (e.code !== '1001') {
                                setShowMiscError(true)
                            }
                        })
                    }
                    isInColumn
                /> : null}
                <Spacer size={Spacing.Gap} />
                <BigPrimaryActionButton
                    icon={<Icon name='ios-logo-google' style={TextStyles.h3} />}
                    label='Continue with Google'
                    onPress={() =>
                        onGoogleSignIn().then(async () => {
                            console.log("analytics --- google signin worked")
                            await analytics().logEvent('signin_google_worked', {})
                            console.log("Signed in with Google!")
                        }
                        ).catch(async (e) => {
                            console.log(e)
                            console.log("analytics --- google signin failed")
                            await analytics().logEvent('signin_google_error', { error: e })
                            if (e.code !== '-5') {
                                setShowMiscError(true)
                            }
                        })
                    }
                    isInColumn
                />
                <Spacer size={Spacing.Gap} />
                <View style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <HLine />
                    <Text style={[TextStyles.p2, { fontStyle: 'italic' }]}>or</Text>
                    <HLine />
                </View>
                <Spacer size={Spacing.Gap} />
                <BigPrimaryActionButton
                    icon = {<PlatformIcon icon={Icons.ENVELOPE} />}
                    label='Continue with Email'
                    onPress={async () =>{
                        await analytics().logEvent('signin_google_worked', {})
                        console.log("Signed in with Google!")
                        props.navigation.navigate('EmailSignIn')
                    }}
                    isInColumn
                    hideShadow
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

function HLine() {
    return (
        <View style={{ height: 1, flex: 1, marginTop: 2, backgroundColor: Colors.TextColor, opacity: 0.1, marginHorizontal: Spacing.ThreeQuartersGap }}/>
    )
}