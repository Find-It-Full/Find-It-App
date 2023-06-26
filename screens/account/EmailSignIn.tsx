import React, { useContext, useState } from 'react'
import { FormScreenBase } from '../../ui-base/containers'
import { Alert, Text, View } from 'react-native'
import { TextStyles } from '../../ui-base/text'
import BackButton from '../../components/BackButton'
import TextField from '../../components/TextField'
import BigButton from '../../components/BigButton'
import { EmailSignInProps } from '../Navigator'
import auth from '@react-native-firebase/auth'
import { Colors } from '../../ui-base/colors'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { Spacing } from '../../ui-base/spacing'
import analytics from '@react-native-firebase/analytics';

export default function EmailSignIn(props: EmailSignInProps) {

    const safeAreaInsets = useContext(SafeAreaInsetsContext)

    const [email, setEmail] = useState('')

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const isValidEmail = email.match(emailRegex)

    const [emailError, setEmailError] = useState('')

    const createAccountOrSignIn = async () => {
        
        try {
            
            const methods = await auth().fetchSignInMethodsForEmail(email)
            let noOther = true
            methods.forEach((method) => {
                if(method == 'google.com'){
                    Alert.alert("Please sign in with google")
                    noOther = false
                    props.navigation.goBack()
                    
                } 
                if(method == 'apple.com'){
                    Alert.alert("Please sign in with apple")
                    noOther = false
                    props.navigation.goBack()
                } 
              });
            
            if (methods.length > 0 && noOther) {
                console.log("analysitcs --- enter password")
                await analytics().logEvent('enter_password', {})
                props.navigation.navigate('EnterPassword', { email: email })
            } 
            else if (noOther) {
                console.log("analysitcs --- create account email")
                await analytics().logEvent('create_email_account', {})
                props.navigation.navigate('CreateAccount', { email: email })
            }
        } catch (error) {
            console.log("analysitcs --- error create account email")
            await analytics().logEvent('email_signin_error', {error:error})
            if (error.message === 'auth/invalid-email') {
                setEmailError('Oops! That email is invalid.')
            } else {
                setEmailError('An error ocurred. Please try again.')
            }
        }
    }

    return (
        <FormScreenBase>
            
            <View style={{ flex: 1, justifyContent: 'center' }}>
            <BackButton />
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
                        <Text style={[TextStyles.p, { color: Colors.Red }]}></Text> : 
                        null
                }
            </View>
            <View style={{ marginBottom: 0 }}>
                <BigButton 
                    label='Next'
                    onPress={createAccountOrSignIn}
                    disabled={ ! isValidEmail}
                    isInColumn
                />
            </View>
        </FormScreenBase>
    )
}