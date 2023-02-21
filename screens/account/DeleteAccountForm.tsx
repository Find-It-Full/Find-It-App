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
export default function DeleteAccountForm(props: { onClose: () => void }) {

    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)
    const [isDeletingAccount, setIsDeletingAccount] = React.useState(false)
    const [confirmationText, setConfirmationText] = React.useState('')

    const [canDelete, setCanDelete] = React.useState(false)

    React.useEffect(() => {
        setCanDelete(confirmationText.trim().toLowerCase() === 'delete')
    }, [confirmationText])

    const deleteAccount = async () => {
        setIsDeletingAccount(true)
        //ADDED
        await FirestoreBackend.deleteUser()
        auth().signOut()
        setTimeout(() => { setIsDeletingAccount(false); props.onClose() }, 1000)
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
                placeholder='Confirmation'
                value={confirmationText}
                onChangeText={setConfirmationText}
            />
            <Spacer size={Spacing.Gap} />
            <VerticallyCenteringRow style={{ marginBottom: safeAreaInsets?.bottom }}>
                <CancelButton label='Cancel' onPress={props.onClose} disabled={isDeletingAccount} />
                <Spacer size={Spacing.BigGap} />
                <BigButton label='Delete Account' onPress={deleteAccount} isLoading={isDeletingAccount} disabled={ ! canDelete} />
            </VerticallyCenteringRow>
        </ModalFormScreenBase>
    )
}