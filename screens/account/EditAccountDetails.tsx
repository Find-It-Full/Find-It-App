import React from 'react'
import {
    Alert} from "react-native"
import { useAppDispatch } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"
import ItemDetailsForm from "../../components/items/ItemDetailsForm"
import { FormScreenBase } from "../../ui-base/containers"
import analytics from '@react-native-firebase/analytics';
import AccountDetailsForm from '../../components/account/AccountDetailsForm'
import { EnterAccountDetailsProps } from '../Navigator'
import { editAccountDetails } from '../../reducers/userData'
export default function EditAccountDetails( props: { onSubmit: (firstName: string, lastName: string, secondaryEmail:string) => Promise<void>, currentValues?: { firstName: string, lastName: string, secondaryEmail:string }, onCancel?: () => void }) {

    

    return (
        <FormScreenBase>
            <AccountDetailsForm onSubmit={props.onSubmit} currentValues={props.currentValues} onCancel={props.onCancel}/>
        </FormScreenBase>
    )
}
