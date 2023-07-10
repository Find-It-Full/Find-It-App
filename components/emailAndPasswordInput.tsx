import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { View } from "react-native"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { VerticallyCenteringRow, Spacer } from "../ui-base/layouts"
import { Spacing } from "../ui-base/spacing"
import { TextStyles } from "../ui-base/text"
import BigButton from "./BigButton"
import CancelButton from "./CancelButton"
import TextField, { SignInField } from "./TextField"
import { TextInput, Text, StyleSheet } from 'react-native'
import { Radii } from '../ui-base/radii'


export default function EmailAndPasswordInput(props: { forgotPassword: (email: string) => Promise<void>, onSubmit: (email: string, password: string) => Promise<void>, sent?:boolean, currentValues?: { email: string, password: string },error?:boolean, onCancel?: () => void }) {

        const [email, setEmail] = useState(props.currentValues?.email ?? '')
        const [password, setPassword] = useState(props.currentValues?.password ?? '')
        const [isSubmitting, setIsSubmitting] = useState(false)
        const safeAreaInsets = React.useContext(SafeAreaInsetsContext)
    
        const nameValid = email.length > 0
        const iconValid = password.length > 6 && /\d/.test(password);
    
        const navigation = useNavigation()
    
        const cancel = () => {
            if (props.onCancel) {
                props.onCancel()
            } else {
                navigation.goBack()
            }
        }
    
        return (
            <>
                <View style={{ justifyContent: "flex-start", flex: props.currentValues ? 0 : 1 }}>
                    <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap }]}>{ props.sent?"Reset Email was Sent":props.error?"There Was an Error Retry":'Enter Email and Password'}</Text>
                    {/* <Text style={[TextStyles.p2, { marginVertical: Spacing.Gap }]}>{`ID: ${tagID}`}</Text> */}
                    <SignInField
                        inputType="email"
                        placeholder='Email'
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text)
                        }}
                    />
                    <SignInField
                        inputType="password"
                        placeholder='Password'
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text)
                        }}
                    />
                
                
                    <View style={{height:"40%"}}>
                    <BigButton 
                        label={"Sign In"} 
                        disabled={ ! nameValid || ! iconValid || (props.currentValues && (props.currentValues.email === email && props.currentValues.password === password))} 
                        isLoading={isSubmitting}
                        onPress={ async () => {
                            setIsSubmitting(true)
                            await props.onSubmit(email, password)
                            setIsSubmitting(false)
                        }}
                    />
                    <Text
                        style = {[TextStyles.p, { color: Colors.Blue }]}
                        onPress={ async () => {
                            setIsSubmitting(true)
                            await props.forgotPassword(email)
                            setIsSubmitting(false)
                        }}
                    >Forgot Password</Text>
                    </View>
                    </View>
            </>
        )
    }
    


    const styles = StyleSheet.create({
        addItemButton: {
            paddingVertical: Spacing.Gap - 4,
            paddingHorizontal: Spacing.Gap + 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.White,
            borderRadius: 100,
            flexShrink: 1, 
            borderColor: Colors.White, 
            borderWidth: 4
        }
    })
    