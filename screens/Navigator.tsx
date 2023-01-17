import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import SignIn from './account/SignIn'
import AddItemFlowContainer from './adding-items/AddItemFlowContainer'
import Home from './tabs/Home'
import { Item } from '../backend/databaseTypes'
import ItemDetails from './item-details/ItemDetails'

export type RootStackParamList = {
    Home: undefined
    ItemDetails: { item: Item }
    SignIn: undefined
    AddItemFlow: undefined
}

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
export type AddItemFlowProps = NativeStackScreenProps<RootStackParamList, 'AddItemFlow'>
export type ItemDetailsProps = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>

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
                                <RootStack.Screen name='ItemDetails' component={ItemDetails} options={{ animation: 'slide_from_right' }} />
                            </RootStack.Group>
                            <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
                                <RootStack.Screen name="AddItemFlow" component={AddItemFlowContainer} />
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