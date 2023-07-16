import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import SignIn from './account/SignIn'
import AddItemFlowContainer from './adding-items/AddItemFlowContainer'
import Home from './tabs/Home'
import { Item, ItemID, TagID, UserData } from '../backend/databaseTypes'
import ItemDetails from './item-details/ItemDetails'
import EditItemFlowContainer from './editing-items/EditItemDetails'
import AccountSettings from './account/AccountSettings'
import MarkAsLost from './MarkAsLost'
import EmailSignIn from './account/EmailSignIn'
import CreateAccount from './account/CreateAccount'
import InAppNotificationManager from '../components/InAppNotificationManager'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { resetMiscErrorNotification, resetNoInternetNotification } from '../reducers/items'
import EnterPassword from './account/EnterPassword'
import SetAccountDetails from './onboarding/SetAccountDetails'
import auth from "@react-native-firebase/auth"
import { FirestoreBackend } from '../backend/firestoreBackend'
import userData, { editAccountDetails, fetchAccountDetails, setAccountDetails } from '../reducers/userData'
export type RootStackParamList = {
    Home: {itemGoTo:string}
    ItemDetails: { itemID: ItemID }
    SignIn: undefined
    EmailSignIn: undefined
    EnterPassword: { email: string }
    CreateAccount: { email: string }
    AddItemFlow: undefined
    EditItemFlow: { item: Item }
    AccountSettings: undefined,
    SetAccountDetails:{firstName:string, lastName:string, secondaryEmail:string}
}

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
export type AddItemFlowProps = NativeStackScreenProps<RootStackParamList, 'AddItemFlow'>
export type ItemDetailsProps = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>
export type EditItemFlowProps = NativeStackScreenProps<RootStackParamList, 'EditItemFlow'>
export type AccountSettingsProps = NativeStackScreenProps<RootStackParamList, 'AccountSettings'>
export type EnterAccountDetailsProps = NativeStackScreenProps<RootStackParamList, 'SetAccountDetails'>
export type SignInProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>
export type EmailSignInProps = NativeStackScreenProps<RootStackParamList, 'EmailSignIn'>
export type CreateAccountProps = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>
export type EnterPasswordProps = NativeStackScreenProps<RootStackParamList, 'EnterPassword'>

const RootStack = createNativeStackNavigator<RootStackParamList>()


export default function Navigator(props: { isAuthenticated: boolean }) {

    const dispatch = useAppDispatch()
    const shouldShowMiscError = useAppSelector(state => state.items.notifyOfMiscError)
    const shouldShowNoInternetError = useAppSelector(state => state.items.notifyOfNoInternet)
    const userData = useAppSelector((state) => state.userData)
    
    

    useEffect(() => {

        dispatch(fetchAccountDetails())
        

    }, [])
    useEffect(() => {
        setHasUserData(userData.firstName.length >0 && userData.lastName.length > 0)
        console.warn(userData)

    }, [userData])
    const resetNoInternetError = () => {
        dispatch(resetNoInternetNotification())
    }

    const resetMiscError = () => {
        dispatch(resetMiscErrorNotification())
    }

    const [hasUserData,setHasUserData]  = React.useState(userData.firstName.length >0 && userData.lastName.length > 0)
    
    const initialScreen = props.isAuthenticated ? (hasUserData? "Home" : "SetAccountDetails"  ) : "SignIn"

    return (
        <NavigationContainer>
            <RootStack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
                {
                    props.isAuthenticated ? hasUserData? (
                        <>
                            <RootStack.Group>
                                <RootStack.Screen name='Home' component={Home} />
                                <RootStack.Screen name='ItemDetails' component={ItemDetails} options={{ animation: 'slide_from_right', gestureEnabled: true }} />
                                <RootStack.Screen name='AccountSettings' component={AccountSettings} options={{ animation: 'slide_from_right', gestureEnabled: true }} />
                                
                            </RootStack.Group>
                            <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
                                <RootStack.Screen name="AddItemFlow" component={AddItemFlowContainer} />
                            </RootStack.Group>
                            <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
                                <RootStack.Screen name="EditItemFlow" component={EditItemFlowContainer} />
                            </RootStack.Group>
                        </>
                    ) : <RootStack.Screen name="SetAccountDetails" component={SetAccountDetails} /> :
                    (
                        <>
                            <RootStack.Screen name="SignIn" component={SignIn} />
                            <RootStack.Screen name="EmailSignIn" component={EmailSignIn} />
                            <RootStack.Screen name="EnterPassword" component={EnterPassword} />
                            <RootStack.Screen name="CreateAccount" component={CreateAccount} />
                            
                            
                        </>
                    )
                }
            </RootStack.Navigator>
            <InAppNotificationManager shouldShowMiscError={shouldShowMiscError} shouldShowNoInternetError={shouldShowNoInternetError} resetMiscError={resetMiscError} resetNoInternetError={resetNoInternetError} />
        </NavigationContainer>
    )
}