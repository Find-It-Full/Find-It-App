import React, { useState } from 'react'
import { Text, View } from 'react-native';
import BackButton from '../../components/BackButton';
import BigButton from '../../components/BigButton';
import TextField from '../../components/TextField';
import { FormScreenBase } from '../../ui-base/containers';
import { Spacer } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import { CreateAccountProps } from '../Navigator';

export default function CreateAccount(props: CreateAccountProps) {

    const [password, setPassword] = useState('')

    const isValidPassword = password.length > 5

    return (
        <FormScreenBase>
            <BackButton />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={TextStyles.h2}>Set a Password</Text>
                <Spacer size={Spacing.BigGap} />
                <TextField
                    placeholder='Password'
                    onChangeText={setPassword}
                    value={password.split('').map((_) => '•').join('')}
                    inputProps={{
                        autoCapitalize: 'none',
                        autoComplete: 'password-new',
                        autoCorrect: false,
                        autoFocus: true,
                    }}
                />
                <Text style={[TextStyles.p, { marginTop: -Spacing.BigGap + Spacing.QuarterGap }]}>Must be at least 5 characters long.</Text>
            </View>
            <BigButton label='Next' onPress={() => {}} disabled={ ! isValidPassword} isInColumn />
        </FormScreenBase>
    )
}