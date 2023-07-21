import React, { useState } from 'react'
import { Text, View } from 'react-native';
import BackButton from '../../components/BackButton';
import BigButton from '../../components/BigButton';
import TextField from '../../components/TextField';
import { FormScreenBase, ScreenBase } from '../../ui-base/containers';
import { Spacer, VerticallyCenteringRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import { CreateAccountProps } from '../Navigator';
import { Colors } from '../../ui-base/colors';
import { SafeAuth } from '../../backend/safeAuth';
import { FirestoreBackend } from '../../backend/firestoreBackend';

export default function CreateAccount(props: CreateAccountProps) {

    const [password, setPassword] = useState('')
    const [passwordRe, setPasswordRe] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const samePassword = password === passwordRe
    const isValidPassword = (password.length >= 5) && samePassword && firstName.length > 0 && lastName.length > 0

    const createUser = async () => {
        await SafeAuth.createUserWithEmailAndPassword(props.route.params.email, password, () => props.navigation.navigate('EmailSignIn'))
        await FirestoreBackend.editAccount({ firstName, lastName })
    }

    const passwordErrorComponent = samePassword || passwordRe.length === 0 || password.length === 0 ? 
        null
        :
        <Text style={[TextStyles.p, { marginTop: -Spacing.BigGap + Spacing.HalfGap, color:Colors.Red }]}>Passwords don't match.</Text>

    return (
        <FormScreenBase externalChildren={<BackButton />}>
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
            <BigButton label='Finish' onPress={createUser} disabled={ ! isValidPassword} isInColumn />
        </FormScreenBase>
    )
}