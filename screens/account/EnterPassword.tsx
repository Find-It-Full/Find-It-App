import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native';
import BackButton from '../../components/BackButton';
import BigButton, { SmallButton } from '../../components/BigButton';
import TextField from '../../components/TextField';
import { FormScreenBase, ScreenBase } from '../../ui-base/containers';
import { Spacer } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import { EnterPasswordProps } from '../Navigator';
import auth from "@react-native-firebase/auth"
import { Colors } from '../../ui-base/colors';
import { SafeAuth } from '../../backend/safeAuth';

export default function EnterPassword(props: EnterPasswordProps) {

    const [password, setPassword] = useState('')
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const buttons = (
        <BigButton label='Sign In' isLoading={isLoggingIn} disabled={password.length === 0} onPress={ async () => {
            setIsLoggingIn(true)
            await SafeAuth.signInWithEmailAndPassword(props.route.params.email, password, () => props.navigation.navigate('EmailSignIn'))       
            setIsLoggingIn(false)
        }} isInColumn />
    )

    return (
        <FormScreenBase externalChildren={<BackButton />} buttons={buttons}>
            <View style={{ flex: 1, marginTop: Spacing.BigGap * 2 }}>
                <Text style={TextStyles.h2}>{"Enter Password"}</Text>
                <Spacer size={Spacing.BigGap} />
                <TextField
                    placeholder='Password'
                    onChangeText={setPassword}
                    value={password}
                    inputProps={{
                        autoCapitalize: 'none',
                        autoComplete: 'password',
                        autoCorrect: false,
                        autoFocus: true,
                        secureTextEntry: true
                    }}
                />
                <Text
                    style={[TextStyles.p, { textDecorationLine: 'underline' }]}
                    onPress={async () => {
                        const succeeded = await SafeAuth.sendPasswordResetEmail(props.route.params.email, () => props.navigation.navigate('EmailSignIn'))
                        if (succeeded) {
                            Alert.alert('Check Your Email!', `We just sent a password reset link to ${props.route.params.email}.`)
                        }
                    }}
                >
                    Forgot your password?
                </Text> 
            </View>
        </FormScreenBase>
    )
}