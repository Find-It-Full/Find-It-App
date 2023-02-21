import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import SignIn from './account/SignIn'
import AddItemFlowContainer from './adding-items/AddItemFlowContainer'
import Home from './tabs/Home'
import { Item, TagID } from '../backend/databaseTypes'
import ItemDetails from './item-details/ItemDetails'
import EditItemFlowContainer from './editing-items/EditItemDetails'
import AccountSettings from './account/AccountSettings'
import MarkAsLost from './MarkAsLost'

export type RootStackParamList = {
    Home: undefined
    ItemDetails: { item: Item }
    SignIn: undefined
    AddItemFlow: undefined
    EditItemFlow: { item: Item }
    AccountSettings: undefined
    MarkAsLost: { item: Item }
}

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
export type AddItemFlowProps = NativeStackScreenProps<RootStackParamList, 'AddItemFlow'>
export type ItemDetailsProps = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>
export type EditItemFlowProps = NativeStackScreenProps<RootStackParamList, 'EditItemFlow'>
export type AccountSettingsProps = NativeStackScreenProps<RootStackParamList, 'AccountSettings'>
export type MarkAsLostProps = NativeStackScreenProps<RootStackParamList, 'MarkAsLost'>

const RootStack = createNativeStackNavigator<RootStackParamList>()

export default function Navigator(props: { isAuthenticated: boolean }) {

    const initialScreen = props.isAuthenticated ? "Home" : "SignIn"

    return (
        <NavigationContainer>
            <RootStack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
                {
                    props.isAuthenticated ? (
                        <>
                            <RootStack.Group>
                                <RootStack.Screen name='Home' component={Home} />
                                <RootStack.Screen name='ItemDetails' component={ItemDetails} options={{ animation: 'slide_from_right', gestureEnabled: true }} />
                                <RootStack.Screen name='AccountSettings' component={AccountSettings} options={{ animation: 'slide_from_right', gestureEnabled: true }} />
                            </RootStack.Group>
                            <RootStack.Screen name='MarkAsLost' component={MarkAsLost} options={{ presentation: 'formSheet' }}/>
                            <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
                                <RootStack.Screen name="AddItemFlow" component={AddItemFlowContainer} />
                            </RootStack.Group>
                            <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
                                <RootStack.Screen name="EditItemFlow" component={EditItemFlowContainer} />
                            </RootStack.Group>
                        </>
                    ) :
                    (
                        <>
                            <RootStack.Screen name="SignIn" component={SignIn} />
                        </>
                    )
                }
            </RootStack.Navigator>
        </NavigationContainer>
    )
}