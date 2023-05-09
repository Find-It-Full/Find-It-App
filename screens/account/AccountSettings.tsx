import React from 'react'
import { Alert, Linking, Modal } from 'react-native'
import ActionButtonList from '../../components/ActionButtonList'
import ActionButtonListItem from '../../components/ActionButtonListItem'
import BackButton from '../../components/BackButton'
import UserProfile from '../../components/UserProfile'
import { ScreenBase } from '../../ui-base/containers'
import { Spacer } from '../../ui-base/layouts'
import { Spacing } from '../../ui-base/spacing'
import { AccountSettingsProps } from '../Navigator'
import DeleteAccountForm from './DeleteAccountForm'
import auth from '@react-native-firebase/auth'

export default function AccountSettings(props: AccountSettingsProps) {

    const [isPresentingModal, setIsPresentingModal] = React.useState(false)

    return (
        <ScreenBase style={{ alignItems: 'stretch' }}>
            <Spacer size={Spacing.BigGap} />
            <UserProfile />
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon='􀱍' label='Log Out' onPress={() => auth().signOut()} />
                <ActionButtonListItem icon='􀈒' label='Delete Account' onPress={() => setIsPresentingModal(true)} />
            </ActionButtonList>
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon='􀙤' label='Terms of Service' onPress={() => Alert.alert('Coming soon! lol')} />
                <ActionButtonListItem icon='􀎡' label='Privacy Policy' onPress={() => Alert.alert('Coming soon! lol')} />
            </ActionButtonList>
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon='􀣌' label='Manage Permissions' onPress={() => Linking.openSettings()} />
            </ActionButtonList>
            <Modal
                animationType='fade'
                presentationStyle='overFullScreen'
                transparent={true}
                visible={isPresentingModal}
                onRequestClose={() => {
                    setIsPresentingModal(false)
                }}>
                <DeleteAccountForm onClose={() => setIsPresentingModal(false)}/>
            </Modal>
            <BackButton />
        </ScreenBase>
    )
}