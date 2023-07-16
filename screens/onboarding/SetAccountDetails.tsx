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
import { editAccountDetails } from '../../reducers/userData'
import { FirestoreBackend } from '../../backend/firestoreBackend'
export default function SetAccountDetails({ navigation, route }: EnterAccountDetailsProps) {


    const dispatch = useAppDispatch()
    const userData = useAppSelector((state) => state.userData)
    const onSubmit = async (firstName: string, lastName: string, secondaryEmail:string) => {
        await dispatch(editAccountDetails({firstName:firstName, lastName:lastName, secondaryEmail:secondaryEmail}))
    }

    return (
        <FormScreenBase>
            <AccountDetailsForm onSubmit={onSubmit} />
        </FormScreenBase>
    )
}


