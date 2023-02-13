import * as React from 'react'
import ActionButtonList from '../../components/ActionButtonList'
import ActionButtonListItem from '../../components/ActionButtonListItem'
import BackButton from '../../components/BackButton'
import UserProfile from '../../components/UserProfile'
import { ScreenBase } from '../../ui-base/containers'
import { Spacer } from '../../ui-base/layouts'
import { Spacing } from '../../ui-base/spacing'
import { AccountSettingsProps } from '../Navigator'

export default function AccountSettings(props: AccountSettingsProps) {
    return (
        <ScreenBase style={{ alignItems: 'stretch' }}>
            <BackButton />
            <Spacer size={Spacing.BigGap} />
            <UserProfile />
            <Spacer size={Spacing.BigGap} />
            <ActionButtonList>
                <ActionButtonListItem icon='􀉪' label='Edit Profile' onPress={() => { }} />
                <ActionButtonListItem icon='􀈒' label='Delete Account' onPress={() => { }} />
            </ActionButtonList>
        </ScreenBase>
    )
}