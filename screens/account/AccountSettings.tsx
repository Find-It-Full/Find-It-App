import React from 'react'
import { Linking, Modal } from 'react-native'
import ActionButtonList from '../../components/ActionButtonList'
import ActionButtonListItem from '../../components/ActionButtonListItem'
import BackButton from '../../components/BackButton'
import UserProfile from '../../components/UserProfile'
import { ScreenBase } from '../../ui-base/containers'
import { Spacer } from '../../ui-base/layouts'
import { Spacing } from '../../ui-base/spacing'
import { AccountSettingsProps } from '../Navigator'
import DeleteAccountForm from './DeleteAccountForm'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { signOut } from '../../reducers/userData'
import PlatformIcon, { Icons } from '../../components/PlatformIcon'
import { Links } from '../../backend/links'
export default function AccountSettings(props: AccountSettingsProps) {

    const [isPresentingModal, setIsPresentingModal] = React.useState(false)
    const [logoutLoading, setLogoutLoading] = React.useState(false)
    const dispatch = useAppDispatch()
    const userData = useAppSelector((state) => state.userData)

    function editAccountDetails() {
        props.navigation.navigate('EditAccountDetails', { firstName: userData.firstName, lastName: userData.lastName })
    }

    return (
        <ScreenBase style={{ alignItems: 'stretch' }}>
            <BackButton />
            <Spacer size={Spacing.BigGap} />
            <UserProfile />
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
            <ActionButtonListItem icon={<PlatformIcon icon={Icons.ACCOUNT_DETAILS} />} label='Edit Account Information' onPress={editAccountDetails} />
                <ActionButtonListItem icon={<PlatformIcon icon={Icons.LOG_OUT} />} label='Log Out' onPress={async () => {
                    setLogoutLoading(true)
                    await dispatch(signOut())
                    setLogoutLoading(false)
                    }} isLoading={logoutLoading} />
                <ActionButtonListItem icon={<PlatformIcon icon={Icons.TRASH} />} label='Delete Account' onPress={() => setIsPresentingModal(true)} />
            </ActionButtonList>
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon={<PlatformIcon icon={Icons.TOS} />} label='Terms of Service' onPress={() => Linking.openURL(Links.TERMS_OF_SERVICE)} />
                <ActionButtonListItem icon={<PlatformIcon icon={Icons.LOCK} />} label='Privacy Policy' onPress={() => Linking.openURL(Links.PRIVACY_POLICY)} />
                <ActionButtonListItem icon={<PlatformIcon icon={Icons.LIFE_PRESERVER} />} label='Contact Support' onPress={() => Linking.openURL(`mailto:support@beacontags.com`)} />
            </ActionButtonList>
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon={<PlatformIcon icon={Icons.COG} />} label='Manage Permissions' onPress={() => Linking.openSettings()} />
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
        </ScreenBase>
    )
}