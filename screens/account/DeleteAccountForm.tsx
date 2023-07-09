import React from 'react'
import { ModalFormScreenBase } from '../../ui-base/containers'
import { Text } from 'react-native'
import BigButton from '../../components/BigButton'
import CancelButton from '../../components/CancelButton'
import { Spacer, VerticallyCenteringRow } from '../../ui-base/layouts'
import { Spacing } from '../../ui-base/spacing'
import { TextStyles } from '../../ui-base/text'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import TextField from '../../components/TextField'
import { FirestoreBackend } from '../../backend/firestoreBackend'
import auth from '@react-native-firebase/auth'
import { useAppDispatch } from '../../store/hooks'
import { handleExternalError } from '../../reducers/items'
import { deleteUser } from '../../reducers/userData'
import analytics from '@react-native-firebase/analytics';

export default function DeleteAccountForm(props: { onClose: () => void }) {

    const dispatch = useAppDispatch()
    const [isDeletingAccount, setIsDeletingAccount] = React.useState(false)
    const [confirmationText, setConfirmationText] = React.useState('')

    const [canDelete, setCanDelete] = React.useState(false)

    React.useEffect(() => {
        setCanDelete(confirmationText.trim().toLowerCase() === 'delete')
    }, [confirmationText])

    const onDelete = async () => {
        console.log("analytics --- delete account")
        await analytics().logEvent('account_deleted', {})
        setIsDeletingAccount(true)

        await dispatch(deleteUser())

        setIsDeletingAccount(false)
        props.onClose()
    }

    return (
        <ModalFormScreenBase closeModal={props.onClose}>
            <Text style={TextStyles.h2}>Are You Sure?</Text>
            <Spacer size={Spacing.BigGap} />
            <Text style={TextStyles.p}>
                All of your items and their location history will be deleted, and your purchases will be reset. Contact support to restore your purchases.
            </Text>
            <Spacer size={Spacing.Gap} />
            <Text style={TextStyles.p}>
                To confirm this action, type 'delete' below.
            </Text>
            <Spacer size={Spacing.HalfGap} />
            <TextField
                placeholder='Delete'
                value={confirmationText}
                onChangeText={setConfirmationText}
            />
            <Spacer size={Spacing.Gap} />
            <VerticallyCenteringRow>
                <CancelButton label='Cancel' onPress={props.onClose} disabled={isDeletingAccount} />
                <Spacer size={Spacing.BigGap} />
                <BigButton label='Delete Account' onPress={onDelete} isLoading={isDeletingAccount} disabled={ ! canDelete} />
            </VerticallyCenteringRow>
        </ModalFormScreenBase>
    )
}