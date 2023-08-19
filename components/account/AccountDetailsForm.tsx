import React from 'react'
import { useState } from "react"
import {
    Text,
    View} from "react-native"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts"
import { useNavigation } from "@react-navigation/native"
import CancelButton from "../CancelButton"
import BigButton from "../BigButton"
import TextField from "../TextField"
import BackButton from '../BackButton'
import { Icons } from '../PlatformIcon'

export default function AccountDetailsForm(props: { onboarding:boolean, onSubmit: (firstName: string, lastName: string) => Promise<void>, currentValues?: { firstName: string, lastName: string }, onCancel?: () => void }) {

    const [firstName, setFirstName] = useState(props.currentValues?.firstName ?? '')
    const [lastName, setLastName] = useState(props.currentValues?.lastName ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const firstNameValid = firstName.length > 0
    const lastNameValid = lastName.length > 0

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
            <View style={{ flex: 1, marginTop: Spacing.BigGap * 2 }}>
                <>
                    <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap, marginTop: props.currentValues ? 0 : Spacing.BigGap }]}>{ props.currentValues ? 'Edit Account Information' : 'Account Information'}</Text>
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
                    label={props.currentValues ? `Save Changes` : Icons.NEXT} 
                    disabled={ ! firstNameValid || ! lastNameValid || (props.currentValues && (props.currentValues.firstName === firstName && props.currentValues.lastName === lastName))} 
                    isLoading={isSubmitting}
                    onPress={ async () => {
                        setIsSubmitting(true)
                        await props.onSubmit(firstName, lastName)
                        setIsSubmitting(false)
                    }}
                />
            </VerticallyCenteringRow>
        </>
    )
}
