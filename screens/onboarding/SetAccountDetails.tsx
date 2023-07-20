import React from 'react'
import {
    Alert} from "react-native"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"
import ItemDetailsForm from "../../components/items/ItemDetailsForm"
import { FormScreenBase } from "../../ui-base/containers"
import analytics from '@react-native-firebase/analytics';
import AccountDetailsForm from '../../components/account/AccountDetailsForm'
import { EnterAccountDetailsProps } from '../Navigator'
import { FirestoreBackend } from '../../backend/firestoreBackend'

export default function SetAccountDetails({ navigation, route }: EnterAccountDetailsProps) {

    const onSubmit = async (firstName: string, lastName: string) => {
        await FirestoreBackend.editAccount({firstName:firstName, lastName:lastName })
    }

    return (
        <FormScreenBase>
            <AccountDetailsForm onSubmit={onSubmit} onboarding={true} />
        </FormScreenBase>
    )
}


