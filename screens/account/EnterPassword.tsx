import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native';
import BackButton from '../../components/BackButton';
import BigButton, { SmallButton } from '../../components/BigButton';
import TextField from '../../components/TextField';
import { FormScreenBase } from '../../ui-base/containers';
import { Spacer } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import { EnterPasswordProps } from '../Navigator';
import auth from "@react-native-firebase/auth"
import { Colors } from '../../ui-base/colors';

export default function EnterPassword(props: EnterPasswordProps) {

    const [password, setPassword] = useState('')
    const [wrongPassword, setWrongPassword] = useState(false)

    const isValidPassword = password.length > 5

    return (
        <FormScreenBase>
            
            <View style={{ flex: 1, justifyContent: 'center' }}>
            <BackButton />
                <Text style={TextStyles.h2}>{"Enter Password"}</Text>
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
                 {wrongPassword?<Text style={[TextStyles.p, { color: Colors.Red }]} >{"Wrong Password"}</Text>:<></>}

                 <Text
                        style = {[TextStyles.p, { color: Colors.Blue }]}
                        onPress={ async () => {
                            try{
                                auth().sendPasswordResetEmail(props.route.params.email)
                            Alert.alert("Email Reset Sent")
                        props.navigation.navigate("SignIn")}
                                catch(err){
                                    console.error(err)
                                }
                        }}
                    >Forgot Password</Text>
                 
            </View>
            <BigButton label='Next' onPress={() => {
                try{
                auth().signInWithEmailAndPassword(props.route.params.email,password).then(() => {
                    console.log('User account created & signed in!');
                  })
                  .catch(error => {
                    if (error.code === 'auth/wrong-password') {
                        setWrongPassword(true)
                    }
                
                    
                    console.error(error);
                  });
            
            
            
            }
                catch(err){
                
                    console.error(err.error)
                }
                
                
                }}  isInColumn />
        </FormScreenBase>
    )
}