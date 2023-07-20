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

    return (
        <ScreenBase>
            <BackButton />
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
                        // catch (err) {
                        //     if (err.message.includes('invalid-email')) {
                        //         // we shouldn't get here
                        //         Alert.alert(`Invalid Email`, `Looks like there was an error in email you entered.`)
                        //         props.navigation.navigate('EmailSignIn')
                        //     }
                        //     else if (err.message.includes('user-not-found')) {
                        //         // we shouldn't get here
                        //         Alert.alert(`User Not Found`, `We can't find a user with the email you entered.`)
                        //         props.navigation.navigate('EmailSignIn')
                        //     }
                        //     else if (err.message.includes('network-request-failed')) {
                        //         Alert.alert(`Connection Failed`, `Please try again.`)
                        //     }
                        //     else {
                        //         Alert.alert(`Oops!`, `Something went wrong. Please make sure you entered the right email.`)
                        //         props.navigation.navigate('EmailSignIn')
                        //     }
                        // }
                    }}
                >Forgot your password?</Text>
                 
            </View>
            <BigButton label='Next' onPress={ async () => {
                await SafeAuth.signInWithEmailAndPassword(props.route.params.email, password, () => props.navigation.navigate('EmailSignIn'))       
                // catch (err) {
                //     if (err.code === 'auth/wrong-password') {
                //         Alert.alert('Oops!', 'Looks like you have the wrong email or password.')
                //     }
                //     else if (err.code === 'auth/invalid-email') {
                //         // we shouldn't get here
                //         Alert.alert(`Invalid Email`, `Looks like there was an error in email you entered.`)
                //         props.navigation.navigate('EmailSignIn')
                //     }
                //     else if (err.code === 'auth/network-request-failed') {
                //         Alert.alert(`Connection Failed`, `Please try again.`)
                //     }
                //     else if (err.code === 'auth/user-not-found') {
                //         // we shouldn't get here
                //         Alert.alert(`User Not Found`, `We can't find a user with the email you entered.`)
                //         props.navigation.navigate('EmailSignIn')
                //     }
                //     else {
                //         Alert.alert(`Oops!`, `Something went wrong. Please try again.`)
                //         props.navigation.navigate('EmailSignIn')
                //     }
                // }
            }} isInColumn />
        </ScreenBase>
    )
}