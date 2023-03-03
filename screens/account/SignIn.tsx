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

export default function SignIn(props: { }) {
    const [error,setError] = useState(false)
    const [sent,setSent] = useState(false)
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

async function emailSignIn(email:string,password:string) {

    try{
await auth().createUserWithEmailAndPassword(email, password)
    }
    catch(err){
        setError(true)
    }

}

async function forgotPassword(email:string) {

    try{
await auth().sendPasswordResetEmail(email)
setSent(true)
    }
    catch(err){
        setError(true)
    }

}

    return (
        <ScreenBase>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={TextStyles.h1}>Welcome!</Text>
            </View>
            <EmailAndPasswordInput error ={error} sent={sent} forgotPassword={async (email)=>{await forgotPassword(email)}} onSubmit={ async (email,password)=>{await emailSignIn(email,password)}} />
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