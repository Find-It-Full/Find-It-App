import React, { useContext, useState } from 'react'
import { FormScreenBase, ScreenBase } from '../../ui-base/containers'
import { Alert, Linking, Text, View } from 'react-native'
import { TextStyles } from '../../ui-base/text'
import BackButton from '../../components/BackButton'
import TextField from '../../components/TextField'
import BigButton from '../../components/BigButton'
import { EmailSignInProps } from '../Navigator'
import auth from '@react-native-firebase/auth'
import { Colors } from '../../ui-base/colors'
import { Spacing } from '../../ui-base/spacing'
import analytics from '@react-native-firebase/analytics';
import { SafeAuth } from '../../backend/safeAuth'
import { VerticallyCenteringRow } from '../../ui-base/layouts'
import { Icons } from '../../components/PlatformIcon'

export default function EmailSignIn(props: EmailSignInProps) {

    const [email, setEmail] = useState('')

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]+$/g
    const isValidEmail = email.match(emailRegex)

    const [emailError, setEmailError] = useState('')
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)

    const createAccountOrSignIn = async () => {
        setIsCheckingEmail(true)

        const methods = await SafeAuth.fetchSignInMethodsForEmail(email)
        setIsCheckingEmail(false)

        if (methods == null) {
            return
        }

        let noOther = true
        methods.forEach((method) => {
            if (method === 'google.com') {
                Alert.alert('Email Already in Use', 'A Google account with that email has already been set up. Please continue with Google.')
                noOther = false
                props.navigation.goBack()

            }
            if (method === 'apple.com') {
                Alert.alert('Email Already in Use', 'An Apple account with that email has already been set up. Please continue with Apple.')
                noOther = false
                props.navigation.goBack()
            }
        });

        if (methods.length > 0 && noOther) {
            console.log("analytics --- enter password")
            await analytics().logEvent('enter_password', {})
            props.navigation.navigate('EnterPassword', { email: email })
        }
        else if (noOther) {
            console.log("analytics --- create account email")
            await analytics().logEvent('create_email_account', {})
            props.navigation.navigate('CreateAccount', { email: email })
        }
    }

    const buttons = (
        <View style={{ marginBottom: 0 }}>
            <BigButton
                label={Icons.NEXT}
                onPress={createAccountOrSignIn}
                disabled={!isValidEmail}
                isLoading={isCheckingEmail}
                isInColumn
            />
            <VerticallyCenteringRow style={{ justifyContent: "center", alignItems: "center", paddingTop: Spacing.HalfGap }}>
                <Text style={TextStyles.p2}>Having trouble signing in? </Text>
                <Text onPress={async () => {
                    const canOpen = await Linking.canOpenURL("mailto:support@beacontags.com?subject=Trouble%20Signing%20In")

                    if (canOpen) {
                        Linking.openURL("mailto:support@beacontags.com?subject=Trouble%20Signing%20In")
                    }
                    else {
                        Linking.openURL("https://beacontags.com/support")
                    }
                }} style={[TextStyles.p2, { textDecorationLine: 'underline' }]}>Contact Support</Text>
            </VerticallyCenteringRow>
        </View>
    )

    return (
        <FormScreenBase externalChildren={<BackButton />} buttons={buttons}>
            <View style={{ flex: 1, paddingTop: Spacing.BigGap * 2 }}>
                <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap }]}>What's your email?</Text>
                <TextField
                    onChangeText={setEmail}
                    placeholder={'someone@something.com'}
                    value={email}
                    inputProps={{
                        autoCapitalize: 'none',
                        autoComplete: 'email',
                        autoCorrect: false,
                        autoFocus: true
                    }}
                />
                {
                    emailError.length > 0 ?
                        <Text style={[TextStyles.p, { color: Colors.Red, marginTop: -Spacing.ThreeQuartersGap }]}>{emailError}</Text> :
                        null
                }
            </View>
        </FormScreenBase>
    )
}