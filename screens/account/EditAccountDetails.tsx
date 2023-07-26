import React, { useState } from 'react'
import { FormScreenBase, ScreenBase } from "../../ui-base/containers"
import AccountDetailsForm from '../../components/account/AccountDetailsForm'
import { EditAccountDetailsProps } from '../Navigator'
import { FirestoreBackend } from '../../backend/firestoreBackend'
import BackButton from '../../components/BackButton'
import { Spacer, VerticallyCenteringRow } from '../../ui-base/layouts'
import BigButton from '../../components/BigButton'
import CancelButton from '../../components/CancelButton'
import { Spacing } from '../../ui-base/spacing'
import TextField from '../../components/TextField'
import { useNavigation } from '@react-navigation/native'
import { View, Text } from 'react-native'
import { TextStyles } from '../../ui-base/text'

export default function EditAccountDetails( props: EditAccountDetailsProps) {
    const currentValues = props.route.params
    const [untrimmedFirstName, setFirstName] = useState(currentValues.firstName ?? '')
    const [untrimmedLastName, setLastName] = useState(currentValues.lastName ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const firstName = untrimmedFirstName.trim()
    const lastName = untrimmedLastName.trim()

    const firstNameValid = firstName.length > 0
    const lastNameValid = lastName.length > 0

    const onSubmit = async () => {
        setIsSubmitting(true)
        await FirestoreBackend.editAccount({ firstName, lastName })
        props.navigation.goBack()
        setIsSubmitting(false)
    }

    const onCancel = () => props.navigation.goBack()

    const buttons = (
        <VerticallyCenteringRow>
            <CancelButton label='Cancel' onPress={onCancel} disabled={isSubmitting}/>
            <Spacer size={Spacing.BigGap} />
            <BigButton 
                label={`Save Changes`} 
                isLoading={isSubmitting}
                disabled={(firstName === currentValues.firstName && lastName === currentValues.lastName) || (!firstNameValid || !lastNameValid)} 
                onPress={onSubmit}
            />
        </VerticallyCenteringRow>
    )

    return (
        <FormScreenBase externalChildren={<BackButton />} buttons={buttons}>
            <View style={{ flex: 1, marginTop: Spacing.BigGap * 2 }}>
                <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap, marginTop: 0 }]}>Edit Account Info</Text>
                <TextField
                    placeholder='First Name'
                    value={untrimmedFirstName}
                    onChangeText={(text) => {
                        setFirstName(text)
                    }}
                />
                <TextField
                    placeholder='Last Name'
                    value={untrimmedLastName}
                    onChangeText={(text) => {
                        setLastName(text)
                    }}
                />
                <Spacer size={Spacing.QuarterGap}/>        
            </View>
        </FormScreenBase>
    )
}
