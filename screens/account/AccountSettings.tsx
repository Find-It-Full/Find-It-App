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
import { useAppDispatch } from '../../store/hooks'
import { signOut } from '../../reducers/userData'
import { TextStyles } from '../../ui-base/text'
import Icon from 'react-native-vector-icons/Ionicons'
export default function AccountSettings(props: AccountSettingsProps) {

    const [isPresentingModal, setIsPresentingModal] = React.useState(false)
    const dispatch = useAppDispatch()

    return (
        <ScreenBase style={{ alignItems: 'stretch' }}>
            <Spacer size={Spacing.BigGap} />
            <UserProfile />
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon={<Icon name = 'ios-log-out' style = {TextStyles.b1}/>} label='Log Out' onPress={() => dispatch(signOut())} />
                <ActionButtonListItem icon={<Icon name = 'ios-trash' style = {TextStyles.b1}/>} label='Delete Account' onPress={() => setIsPresentingModal(true)} />
            </ActionButtonList>
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon={<Icon name = 'ios-book' style = {TextStyles.b1}/>} label='Terms of Service' onPress={() => Linking.openURL("https://docs.google.com/document/d/1ADa4cqyyv6kZRBu4bHC1CvfNxGd8KaTdHQaCYVlZWfg/edit?usp=sharing")} />
                <ActionButtonListItem icon={<Icon name = 'ios-lock-closed' style = {TextStyles.b1}/>} label='Privacy Policy' onPress={() => Linking.openURL("https://docs.google.com/document/d/1qciVUlpEBy3Pzk7LQfCNo_VKVw1xymsOAGgz71yoF14/edit?usp=sharing")} />
            </ActionButtonList>
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon={<Icon name = 'ios-cog' style = {TextStyles.b1}/>} label='Manage Permissions' onPress={() => Linking.openSettings()} />
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