import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import auth from "@react-native-firebase/auth"
import { FirestoreBackend } from "../backend/firestoreBackend"
import { userInfo } from "../backend/databaseTypes"

interface SessionState {
    // signInStrikes: number
    phoneNumber: string
    hasProfile: boolean
    isProperlyAuthenticated: boolean
}

const initialState: SessionState = {
    // signInStrikes: 0,
    phoneNumber: "",
    hasProfile: false,
    isProperlyAuthenticated: false,
}

async function hasValidToken() {
    try {
        await auth().currentUser?.getIdToken(true)
        return true
    } catch (error) {
        return false
    }
}

export const signInWithPhoneNumber = createAsyncThunk(
    "session/signInWithPhoneNumber",
    async (phoneNumber: string) => {
        const confirm = await auth().signInWithPhoneNumber(phoneNumber)
        return { confirm, phoneNumber }
    }
)

export const checkForProfile = createAsyncThunk(
    "session/checkForProfile",
    async (_, thunkAPI): Promise<boolean> => {
        console.log("Checking for profile...")

        if (!auth().currentUser?.uid) {
            console.log(`\tThere is no authenticated user.`)
            thunkAPI.dispatch(setIsProperlyAuthenticated(false))
            return false
        }

        if (!(await hasValidToken())) {
            console.log(`\tUser did not have a valid token.`)
            thunkAPI.dispatch(setIsProperlyAuthenticated(false))
            return false
        }

        console.log(
            `\tThere is an authenticated user, attempting to retrieve profile...`
        )
        thunkAPI.dispatch(setIsProperlyAuthenticated(true))

        const snapshot = await FirestoreBackend.getUserInfo()

        console.log(`\tGot snapshot: ${JSON.stringify(snapshot)}`)

        return isCompleteUserProfile(snapshot)
    }
)

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setPhoneNumber(state, action: PayloadAction<string>) {
            state.phoneNumber = action.payload
        },
        setHasProfile(state, action: PayloadAction<boolean>) {
            state.hasProfile = action.payload
        },
        setIsProperlyAuthenticated(state, action: PayloadAction<boolean>) {
            state.isProperlyAuthenticated = action.payload
        },
    },
})

export const { setPhoneNumber, setHasProfile, setIsProperlyAuthenticated } =
    sessionSlice.actions
export default sessionSlice.reducer

function isCompleteUserProfile(snapshot: userInfo): boolean {
    return snapshot.name != null
}
