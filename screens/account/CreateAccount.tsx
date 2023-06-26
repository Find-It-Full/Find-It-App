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
import auth from "@react-native-firebase/auth"
import { Colors } from '../../ui-base/colors';

export default function CreateAccount(props: CreateAccountProps) {

    const [password, setPassword] = useState('')
    const [passwordRe, setPasswordRe] = useState('')
    const [samePassword, setSamePassword] = useState(false)

    const isValidPassword = password.length > 5

    return (
        <FormScreenBase>
            
            <View style={{ flex: 1, justifyContent: 'center' }}>
            <BackButton />
                <Text style={TextStyles.h2}>{"Set a Password"}</Text>
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
                <TextField
                    placeholder='Re- Enter Password'
                    onChangeText={setPasswordRe}
                    value={passwordRe.split('').map((_) => '•').join('')}
                    inputProps={{
                        autoCapitalize: 'none',
                        autoComplete: 'password-new',
                        autoCorrect: false,
                        autoFocus: true,
                    }}
                />{samePassword?<Text style={[TextStyles.p, { marginTop: -Spacing.BigGap + Spacing.QuarterGap, color:Colors.Red }]}>Must be the same password.</Text>:<></>
                
                }
            
            
            </View>
            <BigButton label='Next' onPress={() => {
                if(password == passwordRe){
                    auth().createUserWithEmailAndPassword(props.route.params.email,password)}
                else{
                    setSamePassword(true)
                }
                
                
               }} disabled={ ! isValidPassword} isInColumn />
        </FormScreenBase>
    )
}