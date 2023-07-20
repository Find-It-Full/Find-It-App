import React from 'react'
import { FormScreenBase, ScreenBase } from "../../ui-base/containers"
import AccountDetailsForm from '../../components/account/AccountDetailsForm'
import { EditAccountDetailsProps } from '../Navigator'
import { FirestoreBackend } from '../../backend/firestoreBackend'

export default function EditAccountDetails( props: EditAccountDetailsProps) {

    const onSubmit = async (firstName: string, lastName: string) => {
        await FirestoreBackend.editAccount({ firstName, lastName })
        props.navigation.goBack()
    }

    const onCancel = () => props.navigation.goBack()

    return (
        <ScreenBase>
            <AccountDetailsForm onSubmit={onSubmit} currentValues={props.route.params} onCancel={onCancel} onboarding={false}/>
        </ScreenBase>
    )
}
