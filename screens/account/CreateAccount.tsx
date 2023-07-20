import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native';
import BackButton from '../../components/BackButton';
import BigButton from '../../components/BigButton';
import TextField from '../../components/TextField';
import { FormScreenBase, ScreenBase } from '../../ui-base/containers';
import { Spacer, VerticallyCenteringGroupedRow, VerticallyCenteringRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import { CreateAccountProps } from '../Navigator';
import auth from "@react-native-firebase/auth"
import { Colors } from '../../ui-base/colors';
import { SafeAuth } from '../../backend/safeAuth';

export default function CreateAccount(props: CreateAccountProps) {

    const [password, setPassword] = useState('')
    const [passwordRe, setPasswordRe] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const samePassword = password === passwordRe
    const isValidPassword = (password.length >= 5) && samePassword && firstName.length > 0 && lastName.length > 0

    const createUser = async () => {
        SafeAuth.createUserWithEmailAndPassword(props.route.params.email, password, () => props.navigation.navigate('EmailSignIn'))
        // catch (e) {
        //     console.log(e)
        //     if (e.message.includes('auth/email-already-in-use')) {
        //         // we should not hit this.
        //     }
        //     else if (e.message.includes('auth/invalid-email')) {
        //         // we should not hit this either
        //         // but just in case...
        //         Alert.alert('Invalid Email', 'Looks like there was an error in email you entered.')
        //         props.navigation.navigate('EmailSignIn');
        //     }
        //     else if (e.message.includes('auth/weak-password')) {
        //         setPasswordError(`That password isn't strong enough. Passwords must be at least six characters and include something that isn't a letter or number.`)
        //     }
        //     else if (e.message.includes('auth/network-request-failed')) {
        //         setPasswordError(`Connection failed. Please try again.`)
        //     }
        // }
    }

    const passwordErrorComponent = samePassword || passwordRe.length === 0 || password.length === 0 ? 
        passwordError.length > 0 ?
            <Text style={[TextStyles.p, { marginTop: -Spacing.BigGap + Spacing.HalfGap, color:Colors.Red }]}>{passwordError}</Text>
            :
            null
        :
        <Text style={[TextStyles.p, { marginTop: -Spacing.BigGap + Spacing.HalfGap, color:Colors.Red }]}>Passwords don't match.</Text>

    return (
        <ScreenBase>
            <BackButton />
            <View style={{ flex: 1, marginTop: Spacing.BigGap * 2 }}>
                <Text style={TextStyles.h2}>{"Welcome!"}</Text>
                <Text style={[TextStyles.p, { marginTop: Spacing.QuarterGap }]}>{"We just need a couple bits of information to get started."}</Text>
                <Spacer size={Spacing.BigGap} />
                <VerticallyCenteringRow>
                    <TextField
                        placeholder='First Name'
                        onChangeText={setFirstName}
                        value={firstName}
                        inputProps={{
                            autoCapitalize: 'words',
                            autoCorrect: true,
                            autoFocus: true,
                        }}
                        style={{ flex: 1, marginBottom: 0 }}
                    />
                    <Spacer size={Spacing.HalfGap} />
                    <TextField
                        placeholder='Last Name'
                        onChangeText={setLastName}
                        value={lastName}
                        inputProps={{
                            autoCapitalize: 'words',
                            autoCorrect: false,
                        }}
                        style={{ flex: 1, marginBottom: 0 }}
                    />
                </VerticallyCenteringRow>
                <Spacer size={Spacing.HalfGap} />
                <TextField
                    placeholder='Password'
                    onChangeText={setPassword}
                    value={password}
                    inputProps={{
                        autoCapitalize: 'none',
                        autoComplete: 'password-new',
                        autoCorrect: false,
                        secureTextEntry: true,
                    }}
                    style={{ marginBottom: 0 }}
                />
                <Spacer size={Spacing.HalfGap} />
                <TextField
                    placeholder='Re- Enter Password'
                    onChangeText={setPasswordRe}
                    value={passwordRe}
                    inputProps={{
                        autoCapitalize: 'none',
                        autoComplete: 'password-new',
                        autoCorrect: false,
                        secureTextEntry: true,
                    }}
                />
                {
                    passwordErrorComponent
                }
            </View>
            <BigButton label='Next' onPress={createUser} disabled={ ! isValidPassword} isInColumn />
        </ScreenBase>
    )
}