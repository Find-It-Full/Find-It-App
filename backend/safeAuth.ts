import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { Alert } from "react-native"

const EMAIL_IN_USE = 'auth/email-already-in-use'
const EMAIL_IN_USE_HEADER = 'Email Already in Use'
const EMAIL_IN_USE_MESSAGE = 'A company account with that email has already been set up. Please continue with company.'
const EMAIL_IN_USE_MESSAGE_FALLBACK = 'An Apple or Google account with that email has already been set up. Please continue to use that account.'

const INVALID_EMAIL = 'auth/invalid-email'
const INVALID_EMAIL_HEADER = 'Invalid Email'
const INVALID_EMAIL_MESSAGE = 'Looks like there was an error in email you entered.'

const WEAK_PASSWORD = 'auth/weak-password'
const WEAK_PASSWORD_HEADER = `Oops!`
const WEAK_PASSWORD_MESSAGE = `That password isn't strong enough. Use at least six characters.`

const NETWORK_REQUEST_FAILED = 'auth/network-request-failed'
const NETWORK_REQUEST_FAILED_HEADER = 'Connection Failed'
const NETWORK_REQUEST_FAILED_MESSAGE = 'Please try again.'

const USER_NOT_FOUND = 'auth/user-not-found'
const USER_NOT_FOUND_HEADER = 'User Not Found'
const USER_NOT_FOUND_MESSAGE = `We can't find a user with the email you entered.`

const DEFAULT_HEADER = 'Oops!'
const DEFAULT_MESSAGE = 'Something went wrong. Please try again.'

const WRONG_PASSWORD = 'auth/wrong-password'
const WRONG_PASSWORD_HEADER = 'Oops!'
const WRONG_PASSWORD_MESSAGE = 'Looks like you have the wrong email or password.'

export namespace SafeAuth {
    export async function createUserWithEmailAndPassword(email: string, password: string, onEmailError: () => void) {
        try {
            await auth().createUserWithEmailAndPassword(email, password)
            return true
        }
        catch (e) {
            handleError(e, onEmailError)
            return false
        }
    }

    export async function fetchSignInMethodsForEmail(email: string): Promise<string[] | null> {
        try {
            return await auth().fetchSignInMethodsForEmail(email)
        }
        catch (e) {
            handleError(e, () => {})
            return null
        }
    }

    export async function sendPasswordResetEmail(email: string, onEmailError: () => void): Promise<boolean> {
        try {
            await auth().sendPasswordResetEmail(email)
            return true
        }
        catch (e) {
            handleError(e, onEmailError)
            return false
        }
    }

    export async function signInWithEmailAndPassword(email: string, password: string, onEmailError: () => void): Promise<boolean> {
        try {
            await auth().signInWithEmailAndPassword(email, password)
            return true
        }
        catch (e) {
            handleError(e, onEmailError)
            return false
        }
    }
}

function handleError(e: FirebaseAuthTypes.PhoneAuthError, onEmailError: () => void) {
    switch (e.code) {
        case EMAIL_IN_USE:
            Alert.alert(EMAIL_IN_USE_HEADER, EMAIL_IN_USE_MESSAGE_FALLBACK)
            onEmailError()
            break
        case INVALID_EMAIL:
            Alert.alert(INVALID_EMAIL_HEADER, INVALID_EMAIL_MESSAGE)
            onEmailError()
            break
        case WEAK_PASSWORD:
            Alert.alert(WEAK_PASSWORD_HEADER, WEAK_PASSWORD_MESSAGE)
            break
        case NETWORK_REQUEST_FAILED:
            Alert.alert(NETWORK_REQUEST_FAILED_HEADER, NETWORK_REQUEST_FAILED_MESSAGE)
            break
        case USER_NOT_FOUND:
            Alert.alert(USER_NOT_FOUND_HEADER, USER_NOT_FOUND_MESSAGE)
            onEmailError()
            break
        case WRONG_PASSWORD:
            Alert.alert(WRONG_PASSWORD_HEADER, WRONG_PASSWORD_MESSAGE)
            break
        default:
            Alert.alert(DEFAULT_HEADER, DEFAULT_MESSAGE)
            break
    }
}