import React from 'react'
import { useState } from "react"
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Keyboard
} from "react-native"
import { FormScreenBase, ScreenBaseNoInsets } from "../../ui-base/containers"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { Colors } from "../../ui-base/colors"
import { Radii } from "../../ui-base/radii"
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts"
import { useNavigation } from "@react-navigation/native"
import CancelButton from "../CancelButton"
import BigButton from "../BigButton"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import TextField from "../TextField"
import EmojiPickerManager from '../../screens/EmojiPicker'

export default function AccountDetailsForm(props: {onboarding:boolean, onSubmit: (firstName: string, lastName: string, secondaryEmail:string) => Promise<void>, currentValues?: { firstName: string, lastName: string, secondaryEmail:string }, onCancel?: () => void }) {

    const [firstName, setFirstName] = useState(props.currentValues?.firstName ?? '')
    const [lastName, setLastName] = useState(props.currentValues?.lastName ?? '')
    const [secondaryEmail, setSecondaryEmail] = useState(props.currentValues?.secondaryEmail ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const firstNameValid = firstName.length > 0
    const lastNameValid = lastName.length > 0
    const secondaryEmailValid = secondaryEmail.length ==  0 ||( secondaryEmail.indexOf("@") != -1 && secondaryEmail.indexOf(".") != -1)

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
            <View style={{ flex: props.currentValues ? 0 : 1 }}>
                <>
                    <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap, marginTop: props.currentValues ? 0 : Spacing.BigGap }]}>{ props.currentValues ? 'Edit Account Info' : 'Account Info'}</Text>
                    <TextField
                        placeholder='First Name'
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text)
                        }}
                    />
                    <TextField
                        placeholder='Last Name'
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text)
                        }}
                    />
                    {!props.onboarding?
                    <>
                    <TextField
                        placeholder='Secondary Email'
                        value={secondaryEmail}
                        onChangeText={(text) => {
                            setSecondaryEmail(text)
                        }}
                    />
                    <Spacer size={Spacing.QuarterGap}/>
                    <Text style={TextStyles.p}>A secondary email is optional and is someone else who will be emailed when your item is found. This can be a parent, child, caregiver, ect... </Text>
                    </>
                    : null}
                    <Spacer size={Spacing.QuarterGap}/>        
                </>
            </View>
            <VerticallyCenteringRow>
                {
                    props.currentValues ? 
                        <>
                            <CancelButton label='Cancel' onPress={cancel} disabled={isSubmitting}/>
                            <Spacer size={Spacing.BigGap} />
                        </> :
                        null
                }
                <BigButton 
                    label={props.currentValues ? `Save Changes` : `Next`} 
                    disabled={ ! firstNameValid || ! lastNameValid || !secondaryEmailValid || (props.currentValues && (props.currentValues.firstName === firstName && props.currentValues.lastName === lastName && props.currentValues.secondaryEmail === secondaryEmail))} 
                    isLoading={isSubmitting}
                    onPress={ async () => {
                        setIsSubmitting(true)
                        await props.onSubmit(firstName, lastName, secondaryEmail)
                        setIsSubmitting(false)
                    }}
                />
            </VerticallyCenteringRow>
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
